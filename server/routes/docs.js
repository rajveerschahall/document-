const router = require('express').Router();
const multer = require('multer'), path = require('path'), crypto = require('crypto');
const Doc = require('../models/Document'), Audit = require('../models/Audit'), User = require('../models/User');
const { auth, adminOnly } = require('../middleware/auth');

const upload = multer({
  storage: multer.diskStorage({
    destination: path.join(__dirname, '..', 'uploads'),
    filename: (req, f, cb) => cb(null, Date.now() + '-' + Math.round(Math.random() * 1e6) + path.extname(f.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, f, cb) =>
    ['.pdf', '.png', '.jpg', '.jpeg'].includes(path.extname(f.originalname).toLowerCase()) ? cb(null, true) : cb(new Error('Only PDF, PNG, JPEG allowed')),
});

// Student: upload
router.post('/', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'File required (max 5MB)' });
  const d = await Doc.create({
    user: req.user._id, studentName: req.user.name, rollNo: req.user.rollNo, applicationId: req.user.applicationId,
    docType: req.body.docType, filePath: '/uploads/' + req.file.filename, mimeType: req.file.mimetype,
    fileType: req.file.mimetype === 'application/pdf' ? 'PDF' : 'Image',
  });
  res.json(d);
});

router.get('/mine', auth, async (req, res) => res.json(await Doc.find({ user: req.user._id }).sort('-createdAt')));

// Public: track by application ID
router.get('/track/:appId', async (req, res) => {
  const docs = await Doc.find({ applicationId: req.params.appId }).select('studentName docType status reason updatedAt createdAt');
  docs.length ? res.json(docs) : res.status(404).json({ message: 'Application not found' });
});

// Public: verify QR stamp
router.get('/stamp/:hash', async (req, res) => {
  const d = await Doc.findOne({ stampHash: req.params.hash, status: 'verified' }).select('studentName rollNo docType reviewedAt');
  d ? res.json({ valid: true, doc: d }) : res.status(404).json({ valid: false, message: 'Invalid or tampered stamp' });
});

// Admin: get all documents with full enriched data
router.get('/', auth, adminOnly, async (req, res) => {
  const query = req.query.status ? { status: req.query.status } : {};
  const docs = await Doc.find(query).sort('-createdAt');
  const users = await User.find({ role: 'student' });
  const userMap = new Map((users || []).map(u => [u._id ? u._id.toString() : '', u]));
  const enriched = (docs || []).map(d => {
    const raw = typeof d.toJSON === 'function' ? d.toJSON() : { ...d };
    const u = raw.user ? userMap.get(raw.user.toString()) : null;
    return {
      ...raw,
      stream: raw.stream || u?.stream || 'BCA',
      email: raw.email || u?.email || '',
      mobile: raw.mobile || u?.mobile || '',
    };
  });
  res.json(enriched);
});

// Admin: get all registered students and their verification status
router.get('/students/all', auth, adminOnly, async (req, res) => {
  const students = await User.find({ role: 'student' }).select('-password').sort('-createdAt');
  const allDocs = await Doc.find({});
  const result = (students || []).map(s => {
    const raw = typeof s.toJSON === 'function' ? s.toJSON() : { ...s };
    const sId = raw._id ? raw._id.toString() : '';
    const studentDocs = (allDocs || []).filter(d => (d.user && d.user.toString() === sId) || d.applicationId === raw.applicationId);
    return {
      ...raw,
      docsCount: studentDocs.length,
      verifiedCount: studentDocs.filter(d => d.status === 'verified').length,
      pendingCount: studentDocs.filter(d => d.status === 'pending').length,
      flaggedCount: studentDocs.filter(d => d.status === 'flagged').length,
      reuploadCount: studentDocs.filter(d => d.status === 'reupload').length,
    };
  });
  res.json(result);
});

// Admin: summary statistics
router.get('/stats/summary', auth, adminOnly, async (req, res) => {
  const allDocs = await Doc.find({});
  const allStudents = await User.find({ role: 'student' });
  res.json({
    totalDocs: allDocs.length,
    pending: allDocs.filter(d => d.status === 'pending').length,
    verified: allDocs.filter(d => d.status === 'verified').length,
    flagged: allDocs.filter(d => d.status === 'flagged').length,
    reupload: allDocs.filter(d => d.status === 'reupload').length,
    totalStudents: allStudents.length,
  });
});

router.get('/audit/all', auth, adminOnly, async (req, res) => res.json(await Audit.find().sort('-createdAt').limit(100)));

async function review(req, res, status, extra = {}) {
  const d = await Doc.findById(req.params.id);
  if (!d) return res.status(404).json({ message: 'Document not found' });
  d.status = status; d.reviewedBy = req.user.name; d.reviewedAt = new Date();
  d.reason = extra.reason; d.stampHash = extra.stampHash;
  await d.save();
  const verdict = { verified: 'Marked REAL', flagged: 'Flagged FAKE', reupload: 'Re-upload requested' }[status];
  await Audit.create({ doc: d._id, adminId: req.user.name, verdict: status, summary: `${d.studentName} - ${d.docType}: ${verdict}${extra.reason ? ' (' + extra.reason + ')' : ''}` });
  res.json(d);
}

router.patch('/:id/verify', auth, adminOnly, (req, res) => {
  const stampHash = crypto.createHash('sha256').update(`${req.params.id}|${Date.now()}|${process.env.JWT_SECRET || 'secret'}`).digest('hex');
  review(req, res, 'verified', { stampHash });
});
router.patch('/:id/flag', auth, adminOnly, (req, res) =>
  req.body.reason ? review(req, res, 'flagged', { reason: req.body.reason }) : res.status(400).json({ message: 'Reason required' }));
router.patch('/:id/reupload', auth, adminOnly, (req, res) => review(req, res, 'reupload', { reason: req.body.reason || 'Please upload a clearer copy' }));

module.exports = router;
