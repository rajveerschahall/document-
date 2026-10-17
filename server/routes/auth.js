const router = require('express').Router();
const bcrypt = require('bcryptjs'), jwt = require('jsonwebtoken'), User = require('../models/User');
const { auth } = require('../middleware/auth');

const sign = u => jwt.sign({ id: u._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
const safe = u => ({
  id: u._id,
  name: u.name,
  email: u.email,
  role: u.role || 'student',
  rollNo: u.rollNo || '',
  stream: u.stream || 'BCA',
  applicationId: u.applicationId || '',
  mobile: u.mobile || '',
  address: u.address || '',
  emergencyContact: u.emergencyContact || '',
  passingYear: u.passingYear || '',
});

router.post('/register', async (req, res) => {
  try {
    const { name, email, mobile, rollNo, stream, password, address, emergencyContact, passingYear } = req.body;
    if (!name || !email || !password || password.length < 6) {
      return res.status(400).json({ message: 'Name, email and password (min 6 chars) required' });
    }
    const cleanEmail = email.trim().toLowerCase();
    const existing = await User.findOne({ email: cleanEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered. Please login.' });
    }
    const applicationId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const u = await User.create({
      name: name.trim(),
      email: cleanEmail,
      mobile: (mobile || '').trim(),
      rollNo: (rollNo || '').trim(),
      stream: stream || 'BCA',
      role: 'student',
      applicationId,
      address: (address || '').trim(),
      emergencyContact: (emergencyContact || '').trim(),
      passingYear: (passingYear || '').trim(),
      password: await bcrypt.hash(password, 10)
    });
    res.json({
      success: true,
      token: sign(u),
      user: safe(u),
      applicationId,
      message: `Registration successful! Your Application ID is ${applicationId}.`
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const identifier = (req.body.email || req.body.id || req.body.loginId || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email / ID and Password are required' });
    }

    const allUsers = await User.find({});
    const u = (allUsers || []).find(user => {
      const emailMatch = (user.email || '').toLowerCase() === identifier;
      const appMatch = (user.applicationId || '').toLowerCase() === identifier;
      const rollMatch = (user.rollNo || '').toLowerCase() === identifier;
      return emailMatch || appMatch || rollMatch;
    });

    if (!u || !(await bcrypt.compare(password, u.password))) {
      return res.status(400).json({ message: 'Invalid ID / Email or Password' });
    }

    res.json({ token: sign(u), user: safe(u) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.put('/profile', auth, async (req, res) => {
  try {
    const { name, mobile, rollNo, stream, address, emergencyContact, passingYear } = req.body;
    const u = await User.findById(req.user._id);
    if (!u) return res.status(404).json({ message: 'User not found' });
    if (name) u.name = name.trim();
    if (mobile !== undefined) u.mobile = mobile.trim();
    if (rollNo !== undefined) u.rollNo = rollNo.trim();
    if (stream) u.stream = stream;
    if (address !== undefined) u.address = address.trim();
    if (emergencyContact !== undefined) u.emergencyContact = emergencyContact.trim();
    if (passingYear !== undefined) u.passingYear = passingYear.trim();
    await u.save();
    res.json({ success: true, user: safe(u), message: 'Profile updated successfully' });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.get('/me', auth, (req, res) => res.json({ user: safe(req.user) }));

module.exports = router;
