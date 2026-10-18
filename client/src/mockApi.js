// Standalone In-Browser Mock Database & Engine
// Provides full interactive demo capabilities when hosted on static platforms like GitHub Pages

const sampleDocSvg = (title, name, roll) => `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="600" height="850" viewBox="0 0 600 850" style="background:#ffffff;font-family:sans-serif;">
  <rect width="580" height="830" x="10" y="10" rx="12" fill="none" stroke="#2563eb" stroke-width="4"/>
  <rect width="560" height="810" x="20" y="20" rx="8" fill="none" stroke="#93c5fd" stroke-width="1.5"/>
  <text x="300" y="80" text-anchor="middle" font-size="20" font-weight="bold" fill="#1e3a8a">STATE BOARD OF TECHNICAL EDUCATION</text>
  <text x="300" y="110" text-anchor="middle" font-size="14" fill="#64748b">OFFICIAL INSTITUTIONAL RECORD</text>
  <line x1="60" y1="130" x2="540" y2="130" stroke="#cbd5e1" stroke-width="2"/>
  <text x="300" y="170" text-anchor="middle" font-size="18" font-weight="bold" fill="#0f172a">${title}</text>
  <text x="70" y="220" font-size="14" fill="#334155"><tspan font-weight="bold">Candidate Name:</tspan> ${name}</text>
  <text x="70" y="255" font-size="14" fill="#334155"><tspan font-weight="bold">Roll Number:</tspan> ${roll}</text>
  <text x="70" y="290" font-size="14" fill="#334155"><tspan font-weight="bold">Academic Year:</tspan> 2023 - 2024</text>
  <rect x="60" y="330" width="480" height="240" fill="#f8fafc" stroke="#e2e8f0" rx="6"/>
  <text x="80" y="365" font-size="13" font-weight="bold" fill="#1e293b">Subject</text>
  <text x="380" y="365" font-size="13" font-weight="bold" fill="#1e293b">Marks Obtained</text>
  <line x1="60" y1="380" x2="540" y2="380" stroke="#e2e8f0"/>
  <text x="80" y="415" font-size="13" fill="#475569">Computer Fundamentals &amp; C</text>
  <text x="420" y="415" font-size="13" font-weight="bold" fill="#059669">92 / 100</text>
  <text x="80" y="450" font-size="13" fill="#475569">Data Structures &amp; Algorithms</text>
  <text x="420" y="450" font-size="13" font-weight="bold" fill="#059669">88 / 100</text>
  <text x="80" y="485" font-size="13" fill="#475569">Database Management Systems</text>
  <text x="420" y="485" font-size="13" font-weight="bold" fill="#059669">95 / 100</text>
  <text x="80" y="520" font-size="13" fill="#475569">Web Development Technologies</text>
  <text x="420" y="520" font-size="13" font-weight="bold" fill="#059669">94 / 100</text>
  <line x1="60" y1="540" x2="540" y2="540" stroke="#e2e8f0"/>
  <text x="300" y="620" text-anchor="middle" font-size="15" font-weight="bold" fill="#059669">RESULT: FIRST DIVISION WITH DISTINCTION</text>
  <text x="300" y="740" text-anchor="middle" font-size="11" fill="#94a3b8">Cryptographically issued &amp; verified by AdmissionVerify System</text>
</svg>
`)}`;

const INITIAL_USERS = [
  {
    id: 'user_admin_1',
    _id: 'user_admin_1',
    name: 'Admin Officer',
    email: 'admin@campusverify.edu',
    role: 'admin',
    password: 'Admin@123'
  },
  {
    id: 'user_student_1',
    _id: 'user_student_1',
    name: 'Rahul Sharma',
    email: 'rahul@example.com',
    mobile: '9876543210',
    rollNo: '2433580',
    stream: 'BCA',
    role: 'student',
    applicationId: 'APP-2026-1001',
    address: 'Sector 14, Chandigarh',
    emergencyContact: '9876543211',
    passingYear: '2024',
    password: 'Student@123'
  },
  {
    id: 'user_student_2',
    _id: 'user_student_2',
    name: 'Simran Kaur',
    email: 'simran@example.com',
    mobile: '9812345678',
    rollNo: '2433585',
    stream: 'BCA',
    role: 'student',
    applicationId: 'APP-2026-1002',
    address: 'Model Town, Ludhiana',
    emergencyContact: '9812345679',
    passingYear: '2024',
    password: 'Student@123'
  },
  {
    id: 'user_student_3',
    _id: 'user_student_3',
    name: 'Amit Patel',
    email: 'amit@example.com',
    mobile: '9823456789',
    rollNo: '2433590',
    stream: 'BSc',
    role: 'student',
    applicationId: 'APP-2026-1003',
    address: 'Navrangpura, Ahmedabad',
    emergencyContact: '9823456780',
    passingYear: '2024',
    password: 'Student@123'
  },
  {
    id: 'user_student_4',
    _id: 'user_student_4',
    name: 'Priya Verma',
    email: 'priya@example.com',
    mobile: '9834567890',
    rollNo: '2433595',
    stream: 'BBA',
    role: 'student',
    applicationId: 'APP-2026-1004',
    address: 'Gomti Nagar, Lucknow',
    emergencyContact: '9834567891',
    passingYear: '2024',
    password: 'Student@123'
  },
  {
    id: 'user_student_5',
    _id: 'user_student_5',
    name: 'Rohit Kumar',
    email: 'rohit@example.com',
    mobile: '9845678901',
    rollNo: '2433600',
    stream: 'BCA',
    role: 'student',
    applicationId: 'APP-2026-1005',
    address: 'Civil Lines, Delhi',
    emergencyContact: '9845678902',
    passingYear: '2024',
    password: 'Student@123'
  }
];

const INITIAL_DOCS = [
  {
    _id: 'doc_1',
    user: 'user_student_1',
    studentName: 'Rahul Sharma',
    rollNo: '2433580',
    applicationId: 'APP-2026-1001',
    docType: 'Class 12th Marksheet',
    fileType: 'PDF',
    filePath: sampleDocSvg('Class 12th Marksheet', 'Rahul Sharma', '2433580'),
    status: 'verified',
    stampHash: '8f4a1c5d9b2e7a3f01c4e8b2d6a9f3e1c7b5a8d4e2f6a9b1c3d5e7f8a2b4c6d8',
    reviewedBy: 'Admin Officer',
    reviewedAt: new Date(Date.now() - 1000 * 3600 * 5).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 3600 * 24).toISOString()
  },
  {
    _id: 'doc_2',
    user: 'user_student_1',
    studentName: 'Rahul Sharma',
    rollNo: '2433580',
    applicationId: 'APP-2026-1001',
    docType: 'Transfer Certificate',
    fileType: 'PDF',
    filePath: sampleDocSvg('Transfer Certificate', 'Rahul Sharma', '2433580'),
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 3600 * 12).toISOString()
  },
  {
    _id: 'doc_3',
    user: 'user_student_2',
    studentName: 'Simran Kaur',
    rollNo: '2433585',
    applicationId: 'APP-2026-1002',
    docType: 'Aadhaar / ID Proof',
    fileType: 'Image',
    filePath: sampleDocSvg('Aadhaar / ID Proof', 'Simran Kaur', '2433585'),
    status: 'flagged',
    reason: 'Name mismatch and altered serial number',
    reviewedBy: 'Admin Officer',
    reviewedAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 3600 * 20).toISOString()
  },
  {
    _id: 'doc_4',
    user: 'user_student_2',
    studentName: 'Simran Kaur',
    rollNo: '2433585',
    applicationId: 'APP-2026-1002',
    docType: 'Class 10th Marksheet',
    fileType: 'PDF',
    filePath: sampleDocSvg('Class 10th Marksheet', 'Simran Kaur', '2433585'),
    status: 'reupload',
    reason: 'Blurry Image - Roll number and grades not readable',
    reviewedBy: 'Admin Officer',
    reviewedAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 3600 * 18).toISOString()
  },
  {
    _id: 'doc_5',
    user: 'user_student_3',
    studentName: 'Amit Patel',
    rollNo: '2433590',
    applicationId: 'APP-2026-1003',
    docType: 'Class 12th Marksheet',
    fileType: 'PDF',
    filePath: sampleDocSvg('Class 12th Marksheet', 'Amit Patel', '2433590'),
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 3600 * 10).toISOString()
  },
  {
    _id: 'doc_6',
    user: 'user_student_3',
    studentName: 'Amit Patel',
    rollNo: '2433590',
    applicationId: 'APP-2026-1003',
    docType: 'Bonafide Certificate',
    fileType: 'PDF',
    filePath: sampleDocSvg('Bonafide Certificate', 'Amit Patel', '2433590'),
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 3600 * 8).toISOString()
  },
  {
    _id: 'doc_7',
    user: 'user_student_4',
    studentName: 'Priya Verma',
    rollNo: '2433595',
    applicationId: 'APP-2026-1004',
    docType: 'Income Certificate',
    fileType: 'PDF',
    filePath: sampleDocSvg('Income Certificate', 'Priya Verma', '2433595'),
    status: 'verified',
    stampHash: '3e7a9b1c5d8f2a4e6b0c2d4f8a1e3b5c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a',
    reviewedBy: 'Admin Officer',
    reviewedAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString(),
    createdAt: new Date(Date.now() - 1000 * 3600 * 15).toISOString()
  },
  {
    _id: 'doc_8',
    user: 'user_student_5',
    studentName: 'Rohit Kumar',
    rollNo: '2433600',
    applicationId: 'APP-2026-1005',
    docType: 'Class 10th Marksheet',
    fileType: 'PDF',
    filePath: sampleDocSvg('Class 10th Marksheet', 'Rohit Kumar', '2433600'),
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 3600 * 6).toISOString()
  }
];

const INITIAL_AUDITS = [
  { _id: 'aud_1', doc: 'doc_1', adminId: 'Admin Officer', verdict: 'verified', summary: 'Rahul Sharma - Class 12th Marksheet: Marked REAL', createdAt: new Date(Date.now() - 1000 * 3600 * 5).toISOString() },
  { _id: 'aud_2', doc: 'doc_3', adminId: 'Admin Officer', verdict: 'flagged', summary: 'Simran Kaur - Aadhaar / ID Proof: Flagged FAKE (Name mismatch and altered serial number)', createdAt: new Date(Date.now() - 1000 * 3600 * 4).toISOString() },
  { _id: 'aud_3', doc: 'doc_4', adminId: 'Admin Officer', verdict: 'reupload', summary: 'Simran Kaur - Class 10th Marksheet: Re-upload requested (Blurry Image)', createdAt: new Date(Date.now() - 1000 * 3600 * 3).toISOString() },
  { _id: 'aud_4', doc: 'doc_7', adminId: 'Admin Officer', verdict: 'verified', summary: 'Priya Verma - Income Certificate: Marked REAL', createdAt: new Date(Date.now() - 1000 * 3600 * 2).toISOString() },
];

function getStored(key, def) {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : def;
  } catch {
    return def;
  }
}

function setStored(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage error:', e);
  }
}

function initDb() {
  if (!localStorage.getItem('cv_users')) setStored('cv_users', INITIAL_USERS);
  if (!localStorage.getItem('cv_docs')) setStored('cv_docs', INITIAL_DOCS);
  if (!localStorage.getItem('cv_audits')) setStored('cv_audits', INITIAL_AUDITS);
}

async function sha256Hex(str) {
  try {
    const enc = new TextEncoder();
    const buf = enc.encode(str);
    const hash = await crypto.subtle.digest('SHA-256', buf);
    return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'mock_' + Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}

function getCurrentUser() {
  const token = localStorage.getItem('token');
  if (!token) return null;
  const users = getStored('cv_users', INITIAL_USERS);
  // Token stores user ID or email encoded
  const match = users.find(u => token.includes(u.id) || token.includes(u.email));
  return match || users[0];
}

export async function mockApi(path, { method = 'GET', body, form } = {}) {
  initDb();
  const cleanPath = path.split('?')[0];
  const queryStr = path.includes('?') ? path.split('?')[1] : '';
  const searchParams = new URLSearchParams(queryStr);

  const users = getStored('cv_users', INITIAL_USERS);
  const docs = getStored('cv_docs', INITIAL_DOCS);
  const audits = getStored('cv_audits', INITIAL_AUDITS);

  // 1. POST /auth/login
  if (cleanPath === '/auth/login' && method === 'POST') {
    const id = (body?.id || body?.email || body?.loginId || '').trim().toLowerCase();
    const pw = body?.password || '';
    const user = users.find(u =>
      (u.email || '').toLowerCase() === id ||
      (u.applicationId || '').toLowerCase() === id ||
      (u.rollNo || '').toLowerCase() === id
    );

    if (!user || user.password !== pw) {
      throw new Error('Invalid Login ID or Password');
    }

    const token = 'mock_jwt_' + user.id + '_' + Date.now();
    const safeUser = { ...user };
    delete safeUser.password;
    return { token, user: safeUser };
  }

  // 2. POST /auth/register
  if (cleanPath === '/auth/register' && method === 'POST') {
    const { name, email, mobile, rollNo, stream, password, address, emergencyContact, passingYear } = body || {};
    if (!name || !email || !password) {
      throw new Error('Name, email and password required');
    }
    const cleanEmail = email.trim().toLowerCase();
    if (users.find(u => u.email.toLowerCase() === cleanEmail)) {
      throw new Error('Email already registered. Please login.');
    }
    const applicationId = `APP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newId = 'user_student_' + (users.length + 1);
    const newUser = {
      id: newId,
      _id: newId,
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
      password: password
    };
    users.push(newUser);
    setStored('cv_users', users);

    const token = 'mock_jwt_' + newId + '_' + Date.now();
    const safeUser = { ...newUser };
    delete safeUser.password;
    return {
      success: true,
      token,
      user: safeUser,
      applicationId,
      message: `Registration successful! Your Application ID is ${applicationId}.`
    };
  }

  // 3. GET /auth/me
  if (cleanPath === '/auth/me') {
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    const safeUser = { ...user };
    delete safeUser.password;
    return { user: safeUser };
  }

  // 4. PUT /auth/profile
  if (cleanPath === '/auth/profile') {
    const user = getCurrentUser();
    if (!user) throw new Error('Unauthorized');
    const idx = users.findIndex(u => u.id === user.id);
    if (idx !== -1) {
      const u = users[idx];
      if (body?.name) u.name = body.name.trim();
      if (body?.mobile !== undefined) u.mobile = body.mobile.trim();
      if (body?.rollNo !== undefined) u.rollNo = body.rollNo.trim();
      if (body?.stream) u.stream = body.stream;
      if (body?.address !== undefined) u.address = body.address.trim();
      if (body?.emergencyContact !== undefined) u.emergencyContact = body.emergencyContact.trim();
      if (body?.passingYear !== undefined) u.passingYear = body.passingYear.trim();
      users[idx] = u;
      setStored('cv_users', users);
      const safeUser = { ...u };
      delete safeUser.password;
      return { success: true, user: safeUser, message: 'Profile updated successfully' };
    }
    throw new Error('User not found');
  }

  // 5. GET /docs/mine (Student docs)
  if (cleanPath === '/docs/mine') {
    const user = getCurrentUser();
    if (!user) return [];
    return docs.filter(d => d.user === user.id || d.applicationId === user.applicationId)
               .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // 6. POST /docs (Upload document)
  if (cleanPath === '/docs' && method === 'POST') {
    const user = getCurrentUser() || users[1];
    let docType = 'Marksheet';
    let fileObj = null;
    if (form instanceof FormData) {
      docType = form.get('docType') || docType;
      fileObj = form.get('file');
    } else if (body) {
      docType = body.docType || docType;
    }

    const docId = 'doc_' + (docs.length + 1) + '_' + Date.now();
    const newDoc = {
      _id: docId,
      user: user.id || user._id,
      studentName: user.name,
      rollNo: user.rollNo,
      applicationId: user.applicationId,
      docType,
      fileType: fileObj?.type?.includes('image') ? 'Image' : 'PDF',
      filePath: sampleDocSvg(docType, user.name, user.rollNo),
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    docs.unshift(newDoc);
    setStored('cv_docs', docs);
    return newDoc;
  }

  // 7. GET /docs (Admin list)
  if (cleanPath === '/docs' && method === 'GET') {
    const statusFilter = searchParams.get('status');
    let filtered = statusFilter ? docs.filter(d => d.status === statusFilter) : [...docs];
    const userMap = new Map(users.map(u => [u.id || u._id, u]));
    const enriched = filtered.map(d => {
      const u = userMap.get(d.user) || users.find(x => x.applicationId === d.applicationId);
      return {
        ...d,
        stream: d.stream || u?.stream || 'BCA',
        email: d.email || u?.email || '',
        mobile: d.mobile || u?.mobile || '',
      };
    });
    return enriched.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // 8. GET /docs/students/all
  if (cleanPath === '/docs/students/all') {
    const studentUsers = users.filter(u => u.role === 'student');
    return studentUsers.map(s => {
      const sDocs = docs.filter(d => d.user === s.id || d.applicationId === s.applicationId);
      const safe = { ...s };
      delete safe.password;
      return {
        ...safe,
        docsCount: sDocs.length,
        verifiedCount: sDocs.filter(d => d.status === 'verified').length,
        pendingCount: sDocs.filter(d => d.status === 'pending').length,
        flaggedCount: sDocs.filter(d => d.status === 'flagged').length,
        reuploadCount: sDocs.filter(d => d.status === 'reupload').length,
      };
    });
  }

  // 9. GET /docs/stats/summary
  if (cleanPath === '/docs/stats/summary') {
    const studentUsers = users.filter(u => u.role === 'student');
    return {
      totalDocs: docs.length,
      pending: docs.filter(d => d.status === 'pending').length,
      verified: docs.filter(d => d.status === 'verified').length,
      flagged: docs.filter(d => d.status === 'flagged').length,
      reupload: docs.filter(d => d.status === 'reupload').length,
      totalStudents: studentUsers.length,
    };
  }

  // 10. GET /docs/audit/all
  if (cleanPath === '/docs/audit/all') {
    return audits.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  // 11. PATCH /docs/:id/verify
  if (cleanPath.startsWith('/docs/') && cleanPath.endsWith('/verify') && method === 'PATCH') {
    const id = cleanPath.split('/')[2];
    const doc = docs.find(d => d._id === id);
    if (!doc) throw new Error('Document not found');

    const stampHash = await sha256Hex(`${id}|${Date.now()}|tamper_proof_secret_salt_2026`);
    doc.status = 'verified';
    doc.reviewedBy = 'Admin Officer';
    doc.reviewedAt = new Date().toISOString();
    doc.stampHash = stampHash;
    delete doc.reason;
    setStored('cv_docs', docs);

    audits.unshift({
      _id: 'aud_' + Date.now(),
      doc: id,
      adminId: 'Admin Officer',
      verdict: 'verified',
      summary: `${doc.studentName} - ${doc.docType}: Marked REAL`,
      createdAt: new Date().toISOString()
    });
    setStored('cv_audits', audits);
    return doc;
  }

  // 12. PATCH /docs/:id/flag
  if (cleanPath.startsWith('/docs/') && cleanPath.endsWith('/flag') && method === 'PATCH') {
    const id = cleanPath.split('/')[2];
    const doc = docs.find(d => d._id === id);
    if (!doc) throw new Error('Document not found');
    const reason = body?.reason || 'Document flagged for tampering or inconsistency';

    doc.status = 'flagged';
    doc.reviewedBy = 'Admin Officer';
    doc.reviewedAt = new Date().toISOString();
    doc.reason = reason;
    delete doc.stampHash;
    setStored('cv_docs', docs);

    audits.unshift({
      _id: 'aud_' + Date.now(),
      doc: id,
      adminId: 'Admin Officer',
      verdict: 'flagged',
      summary: `${doc.studentName} - ${doc.docType}: Flagged FAKE (${reason})`,
      createdAt: new Date().toISOString()
    });
    setStored('cv_audits', audits);
    return doc;
  }

  // 13. PATCH /docs/:id/reupload
  if (cleanPath.startsWith('/docs/') && cleanPath.endsWith('/reupload') && method === 'PATCH') {
    const id = cleanPath.split('/')[2];
    const doc = docs.find(d => d._id === id);
    if (!doc) throw new Error('Document not found');
    const reason = body?.reason || 'Please upload a clearer and legible copy';

    doc.status = 'reupload';
    doc.reviewedBy = 'Admin Officer';
    doc.reviewedAt = new Date().toISOString();
    doc.reason = reason;
    delete doc.stampHash;
    setStored('cv_docs', docs);

    audits.unshift({
      _id: 'aud_' + Date.now(),
      doc: id,
      adminId: 'Admin Officer',
      verdict: 'reupload',
      summary: `${doc.studentName} - ${doc.docType}: Re-upload requested (${reason})`,
      createdAt: new Date().toISOString()
    });
    setStored('cv_audits', audits);
    return doc;
  }

  // 14. GET /docs/track/:appId
  if (cleanPath.startsWith('/docs/track/')) {
    const appId = decodeURIComponent(cleanPath.replace('/docs/track/', '')).trim().toUpperCase();
    const matched = docs.filter(d => (d.applicationId || '').toUpperCase() === appId);
    if (!matched.length) throw new Error('Application ID not found');
    return matched.map(d => ({
      studentName: d.studentName,
      applicationId: d.applicationId,
      docType: d.docType,
      status: d.status,
      reason: d.reason,
      reviewedBy: d.reviewedBy,
      reviewedAt: d.reviewedAt,
      stampHash: d.stampHash,
      updatedAt: d.reviewedAt || d.createdAt,
      createdAt: d.createdAt
    }));
  }

  // 15. GET /docs/stamp/:hash
  if (cleanPath.startsWith('/docs/stamp/')) {
    const hash = cleanPath.replace('/docs/stamp/', '').trim();
    const doc = docs.find(d => d.stampHash === hash && d.status === 'verified');
    if (!doc) throw new Error('Invalid or tampered stamp');
    return {
      valid: true,
      doc: {
        studentName: doc.studentName,
        rollNo: doc.rollNo,
        docType: doc.docType,
        reviewedAt: doc.reviewedAt
      }
    };
  }

  throw new Error(`Endpoint not found: ${path}`);
}
