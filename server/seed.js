require('dotenv').config();
const bcrypt = require('bcryptjs'), crypto = require('crypto');
const { connectDB, getStore, saveStore } = require('./db');
const User = require('./models/User'), Doc = require('./models/Document'), Audit = require('./models/Audit');

(async () => {
  await connectDB();
  await Promise.all([User.deleteMany({}), Doc.deleteMany({}), Audit.deleteMany({})]);

  const mk = async (o, pw) => User.create({ ...o, password: await bcrypt.hash(pw, 10) });

  const admin = await mk({ name: 'Admin Officer', email: 'admin@campusverify.edu', role: 'admin' }, 'Admin@123');
  const rahul = await mk({ name: 'Rahul Sharma', email: 'rahul@example.com', mobile: '9876543210', rollNo: '2433580', stream: 'BCA', applicationId: 'APP-2026-1001' }, 'Student@123');
  const simran = await mk({ name: 'Simran Kaur', email: 'simran@example.com', mobile: '9812345678', rollNo: '2433585', stream: 'BCA', applicationId: 'APP-2026-1002' }, 'Student@123');
  const amit = await mk({ name: 'Amit Patel', email: 'amit@example.com', mobile: '9823456789', rollNo: '2433590', stream: 'BSc', applicationId: 'APP-2026-1003' }, 'Student@123');
  const priya = await mk({ name: 'Priya Verma', email: 'priya@example.com', mobile: '9834567890', rollNo: '2433595', stream: 'BBA', applicationId: 'APP-2026-1004' }, 'Student@123');
  const rohit = await mk({ name: 'Rohit Kumar', email: 'rohit@example.com', mobile: '9845678901', rollNo: '2433600', stream: 'BCA', applicationId: 'APP-2026-1005' }, 'Student@123');

  const rahulStamp = crypto.createHash('sha256').update(`rahul-12th-${Date.now()}`).digest('hex');
  const priyaStamp = crypto.createHash('sha256').update(`priya-income-${Date.now()}`).digest('hex');

  const d1 = await Doc.create({
    user: rahul._id, studentName: rahul.name, rollNo: rahul.rollNo, applicationId: rahul.applicationId,
    docType: 'Class 12th Marksheet', fileType: 'PDF', status: 'verified', stampHash: rahulStamp,
    reviewedBy: 'Admin Officer', reviewedAt: new Date(Date.now() - 1000 * 3600 * 5)
  });

  const d2 = await Doc.create({
    user: rahul._id, studentName: rahul.name, rollNo: rahul.rollNo, applicationId: rahul.applicationId,
    docType: 'Transfer Certificate', fileType: 'PDF', status: 'pending'
  });

  const d3 = await Doc.create({
    user: simran._id, studentName: simran.name, rollNo: simran.rollNo, applicationId: simran.applicationId,
    docType: 'Aadhaar / ID Proof', fileType: 'Image', status: 'flagged', reason: 'Name mismatch and altered serial number',
    reviewedBy: 'Admin Officer', reviewedAt: new Date(Date.now() - 1000 * 3600 * 4)
  });

  const d4 = await Doc.create({
    user: simran._id, studentName: simran.name, rollNo: simran.rollNo, applicationId: simran.applicationId,
    docType: 'Class 10th Marksheet', fileType: 'PDF', status: 'reupload', reason: 'Blurry Image - Roll number and grades not readable',
    reviewedBy: 'Admin Officer', reviewedAt: new Date(Date.now() - 1000 * 3600 * 3)
  });

  const d5 = await Doc.create({
    user: amit._id, studentName: amit.name, rollNo: amit.rollNo, applicationId: amit.applicationId,
    docType: 'Class 12th Marksheet', fileType: 'PDF', status: 'pending'
  });

  const d6 = await Doc.create({
    user: amit._id, studentName: amit.name, rollNo: amit.rollNo, applicationId: amit.applicationId,
    docType: 'Bonafide Certificate', fileType: 'PDF', status: 'pending'
  });

  const d7 = await Doc.create({
    user: priya._id, studentName: priya.name, rollNo: priya.rollNo, applicationId: priya.applicationId,
    docType: 'Income Certificate', fileType: 'PDF', status: 'verified', stampHash: priyaStamp,
    reviewedBy: 'Admin Officer', reviewedAt: new Date(Date.now() - 1000 * 3600 * 2)
  });

  const d8 = await Doc.create({
    user: rohit._id, studentName: rohit.name, rollNo: rohit.rollNo, applicationId: rohit.applicationId,
    docType: 'Class 10th Marksheet', fileType: 'PDF', status: 'pending'
  });

  await Audit.create({ doc: d1._id, adminId: 'Admin Officer', verdict: 'verified', summary: 'Rahul Sharma - Class 12th Marksheet: Marked REAL' });
  await Audit.create({ doc: d3._id, adminId: 'Admin Officer', verdict: 'flagged', summary: 'Simran Kaur - Aadhaar / ID Proof: Flagged FAKE (Name mismatch and altered serial number)' });
  await Audit.create({ doc: d4._id, adminId: 'Admin Officer', verdict: 'reupload', summary: 'Simran Kaur - Class 10th Marksheet: Re-upload requested (Blurry Image)' });
  await Audit.create({ doc: d7._id, adminId: 'Admin Officer', verdict: 'verified', summary: 'Priya Verma - Income Certificate: Marked REAL' });

  console.log('✅ Seed completed successfully with demo users, documents, and audit logs.');
  process.exit(0);
})();
