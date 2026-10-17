import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { api, FILE_BASE } from './api';
import { useAuth } from './auth.jsx';

export { default as StudentWorkspace } from './pages/StudentWorkspace.jsx';
export { default as AdminWorkspace } from './pages/AdminWorkspace.jsx';
export { default as UnifiedPortal } from './pages/UnifiedPortal.jsx';

const Badge = ({ s }) => (
  <span className={'badge ' + s}>
    {{ pending: 'Pending Review', verified: 'Verified REAL', flagged: 'Flagged FAKE', reupload: 'Re-upload Requested' }[s] || s}
  </span>
);

const DOC_TYPES = ['Class 10th Marksheet', 'Class 12th Marksheet', 'Aadhaar / ID Proof', 'Transfer Certificate', 'Bonafide Certificate', 'Income Certificate'];

export function Login() {
  const location = useLocation();
  const [f, setF] = useState({
    id: location.state?.id || location.state?.email || '',
    password: ''
  });
  const [msg, setMsg] = useState(location.state?.msg || '');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const d = await api('/auth/login', {
        method: 'POST',
        body: { id: f.id, password: f.password }
      });
      login(d);
      // If Admin logs in -> Admin page opens; If Student logs in -> Student page opens!
      if (d.user.role === 'admin') {
        nav('/admin');
      } else {
        nav('/student');
      }
    } catch (x) {
      setErr(x.message);
    } finally {
      setLoading(false);
    }
  };

  const setDemo = (id, pw) => {
    setF({ id, password: pw });
    setErr('');
  };

  return (
    <div className="w pad">
      <form className="card narrow" onSubmit={submit}>
        <h2 style={{ textAlign: 'center', marginBottom: '6px' }}>Admission Portal Login</h2>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: 0 }}>
          Universal Login for Students and Administration Officers.
        </p>

        {msg && (
          <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', padding: '10px 14px', borderRadius: '10px', color: '#065f46', fontSize: '13px', fontWeight: '600', marginBottom: '10px' }}>
            {msg}
          </div>
        )}

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Login ID / Email / Roll No</label>
        <input
          placeholder="Enter Email, Application ID, or Roll No"
          value={f.id}
          onChange={e => setF({ ...f, id: e.target.value })}
          required
        />

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginTop: '6px', display: 'block' }}>Password</label>
        <input
          placeholder="Enter your password"
          type="password"
          value={f.password}
          onChange={e => setF({ ...f, password: e.target.value })}
          required
        />

        {err && <p className="err" style={{ margin: '8px 0' }}>{err}</p>}

        <button className="btn" style={{ width: '100%', marginTop: '12px', padding: '11px' }} disabled={loading}>
          {loading ? 'Verifying Credentials...' : 'Sign In'}
        </button>

        {/* Quick autofill helper chips for convenience */}
        <div style={{ marginTop: '18px', paddingTop: '14px', borderTop: '1px solid var(--bd)' }}>
          <small style={{ fontSize: '11px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
            Quick Demo Login:
          </small>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn sm light"
              onClick={() => setDemo('admin@campusverify.edu', 'Admin@123')}
            >
              🛡️ Fill Admin (`admin@campusverify.edu`)
            </button>
            <button
              type="button"
              className="btn sm light"
              onClick={() => setDemo('rahul@example.com', 'Student@123')}
            >
              🎓 Fill Student (`rahul@example.com`)
            </button>
          </div>
        </div>

        <div style={{ marginTop: '16px', fontSize: '13px', textAlign: 'center' }}>
          <span>New applicant? </span>
          <Link to="/register" style={{ fontWeight: 600, color: '#0d6efd' }}>Register for Admission</Link>
        </div>
      </form>
    </div>
  );
}

export function Register() {
  const [f, setF] = useState({ name: '', email: '', mobile: '', rollNo: '', stream: 'BCA', password: '' });
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async e => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api('/auth/register', { method: 'POST', body: f });
      // Upon registration, redirect to unified Login and ask for ID & password
      nav('/login', {
        state: {
          msg: `🎉 Registration successful! Your Application ID is ${res.applicationId}. Please enter your password to log in.`,
          id: f.email,
        }
      });
    } catch (x) {
      setErr(x.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w pad">
      <form className="card narrow" onSubmit={submit}>
        <h2 style={{ textAlign: 'center', marginBottom: '4px' }}>Student Registration</h2>
        <p style={{ textAlign: 'center', fontSize: '13px', color: '#64748b', marginTop: 0 }}>
          Create your applicant account to submit and verify admission documents.
        </p>

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Full Name</label>
        <input placeholder="Student Full Name (e.g. Aarti Kumari)" value={f.name} onChange={set('name')} required />

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Email Address (will be your Login ID)</label>
        <input placeholder="student@example.com" type="email" value={f.email} onChange={set('email')} required />

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Mobile Number</label>
        <input placeholder="10-digit Mobile Number" value={f.mobile} onChange={set('mobile')} required />

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>College / Board Roll No</label>
        <input placeholder="e.g. 2433580" value={f.rollNo} onChange={set('rollNo')} required />

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Course / Stream</label>
        <select value={f.stream} onChange={set('stream')}>
          <option value="BCA">BCA (Bachelor of Computer Applications)</option>
          <option value="BSc">BSc (Bachelor of Science)</option>
          <option value="BBA">BBA (Bachelor of Business Administration)</option>
        </select>

        <label style={{ fontSize: '13px', fontWeight: 600, color: '#334155' }}>Password (Minimum 6 characters)</label>
        <input placeholder="Choose a secure password" type="password" value={f.password} onChange={set('password')} required />

        {err && <p className="err" style={{ margin: '8px 0' }}>{err}</p>}

        <button className="btn" style={{ width: '100%', marginTop: '12px', padding: '11px' }} disabled={loading}>
          {loading ? 'Creating Account...' : 'Register Account'}
        </button>

        <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px' }}>
          Already registered? <Link to="/login" style={{ fontWeight: 600, color: '#0d6efd' }}>Sign in with your ID</Link>
        </p>
      </form>
    </div>
  );
}

export function Student() {
  const { user } = useAuth(), [docs, setDocs] = useState([]), [type, setType] = useState(DOC_TYPES[0]), [file, setFile] = useState(null), [msg, setMsg] = useState('');
  const load = () => api('/docs/mine').then(setDocs);
  useEffect(() => { load(); }, []);
  const upload = async e => {
    e.preventDefault();
    if (!file) return setMsg('Please select a file to upload');
    if (file.size > 5 * 1024 * 1024) return setMsg('File too large (max 5MB)');
    const form = new FormData();
    form.append('docType', type);
    form.append('file', file);
    try {
      await api('/docs', { method: 'POST', form });
      setMsg('Uploaded successfully - Pending Review');
      setFile(null);
      e.target.reset();
      load();
    } catch (x) {
      setMsg(x.message);
    }
  };
  return (
    <div className="w pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div>
          <h2>Welcome, {user.name}</h2>
          <p style={{ margin: '4px 0' }}>Course: <b className="pill-stream">{user.stream || 'BCA'}</b> | Roll No: <b className="pill-code">{user.rollNo}</b></p>
          <p style={{ margin: '4px 0' }}>Application ID: <b className="pill-code" style={{ fontSize: '14px', color: '#0d6efd' }}>{user.applicationId}</b></p>
        </div>
      </div>
      <div className="grid">
        <form className="card" onSubmit={upload}>
          <h3>Upload Document for Verification</h3>
          <p>Select document type and upload a clear PDF or scanned image copy (max 5MB).</p>
          <select value={type} onChange={e => setType(e.target.value)}>
            {DOC_TYPES.map(t => <option key={t}>{t}</option>)}
          </select>
          <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={e => setFile(e.target.files[0])} />
          <button className="btn" style={{ marginTop: '10px' }}>Upload Document</button>
          {msg && <p style={{ marginTop: '10px', fontWeight: 600, color: msg.includes('success') ? '#16a34a' : '#dc2626' }}>{msg}</p>}
        </form>
        <div className="card">
          <h3>My Submitted Documents ({docs.length})</h3>
          {docs.length === 0 && <p>No documents uploaded yet. Submit your certificates above.</p>}
          {docs.map(d => (
            <div key={d._id} className="item">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <b>{d.docType}</b>
                <Badge s={d.status} />
              </div>
              <small>Format: <b>{d.fileType}</b> • Submitted: {new Date(d.createdAt).toLocaleString()}</small>
              {d.reason && <small className="err">Remark: {d.reason}</small>}
              {d.reviewedBy && <small style={{ color: '#059669' }}>Reviewed by: {d.reviewedBy}</small>}
              {d.stampHash && (
                <div className="qr">
                  <QRCodeSVG value={`${location.origin}/verify/${d.stampHash}`} size={90} />
                  <small style={{ marginTop: '4px', color: '#16a34a', fontWeight: 'bold' }}>✔ Digital Stamp Active</small>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Admin() {
  const [docs, setDocs] = useState([]);
  const [students, setStudents] = useState([]);
  const [audit, setAudit] = useState([]);
  const [stats, setStats] = useState({ totalDocs: 0, pending: 0, verified: 0, flagged: 0, reupload: 0, totalStudents: 0 });
  const [tab, setTab] = useState('docs');
  const [filter, setFilter] = useState('');
  const [streamFilter, setStreamFilter] = useState('');
  const [search, setSearch] = useState('');
  const [sel, setSel] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [rot, setRot] = useState(0);
  const [flag, setFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const REASONS = [
    'Blurry Image - Details not legible',
    'Altered Roll No or marks tampering',
    'Fake Stamp or invalid college watermark',
    'Name Mismatch with application form',
    'Altered Serial Number / Certificate ID',
    'Incomplete document / missing backside'
  ];

  const loadData = () => {
    api('/docs' + (filter ? '?status=' + filter : '')).then(setDocs).catch(console.error);
    api('/docs/students/all').then(setStudents).catch(console.error);
    api('/docs/audit/all').then(setAudit).catch(console.error);
    api('/docs/stats/summary').then(setStats).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, [filter]);

  const act = async (path, body) => {
    if (!sel) return;
    try {
      const d = await api(`/docs/${sel._id}/${path}`, { method: 'PATCH', body: body || {} });
      setSel(d);
      setFlag(false);
      loadData();
    } catch (e) {
      alert(e.message);
    }
  };

  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchStream = !streamFilter || (d.stream || 'BCA') === streamFilter;
      const q = search.toLowerCase().trim();
      const matchSearch = !q || (
        (d.studentName && d.studentName.toLowerCase().includes(q)) ||
        (d.rollNo && d.rollNo.toLowerCase().includes(q)) ||
        (d.applicationId && d.applicationId.toLowerCase().includes(q)) ||
        (d.docType && d.docType.toLowerCase().includes(q)) ||
        (d.email && d.email.toLowerCase().includes(q))
      );
      return matchStream && matchSearch;
    });
  }, [docs, streamFilter, search]);

  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchStream = !streamFilter || (s.stream || 'BCA') === streamFilter;
      const q = search.toLowerCase().trim();
      const matchSearch = !q || (
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
        (s.applicationId && s.applicationId.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
      return matchStream && matchSearch;
    });
  }, [students, streamFilter, search]);

  const url = sel?.filePath ? FILE_BASE + sel.filePath : null;

  return (
    <div className="w pad">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '14px' }}>
        <div>
          <h2 style={{ margin: 0 }}>Admin Verification Panel</h2>
          <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
            Central Document Verification, Student Applications &amp; Tamper Detection Desk
          </p>
        </div>
        <button className="btn light" onClick={loadData}>↻ Refresh Data</button>
      </div>

      {/* Summary Stat Cards */}
      <div className="stat-cards">
        <div className="stat-card c-blue">
          <span className="lbl">Total Documents</span>
          <span className="val">{stats.totalDocs || docs.length}</span>
          <small style={{ color: '#64748b' }}>Submitted across all streams</small>
        </div>
        <div className="stat-card c-amber">
          <span className="lbl">Pending Review</span>
          <span className="val">{stats.pending || docs.filter(d => d.status === 'pending').length}</span>
          <small style={{ color: '#d97706' }}>Awaiting verification</small>
        </div>
        <div className="stat-card c-green">
          <span className="lbl">Verified (REAL)</span>
          <span className="val">{stats.verified || docs.filter(d => d.status === 'verified').length}</span>
          <small style={{ color: '#16a34a' }}>With QR digital stamp</small>
        </div>
        <div className="stat-card c-red">
          <span className="lbl">Flagged (FAKE)</span>
          <span className="val">{stats.flagged || docs.filter(d => d.status === 'flagged').length}</span>
          <small style={{ color: '#dc2626' }}>Tampered / Fraud</small>
        </div>
        <div className="stat-card c-purple">
          <span className="lbl">Total Students</span>
          <span className="val">{stats.totalStudents || students.length}</span>
          <small style={{ color: '#7c3aed' }}>Registered Applicants</small>
        </div>
      </div>

      {/* Tabs */}
      <div className="tab-nav">
        <button className={`tab-btn ${tab === 'docs' ? 'active' : ''}`} onClick={() => setTab('docs')}>
          📑 All Documents Table ({docs.length})
        </button>
        <button className={`tab-btn ${tab === 'students' ? 'active' : ''}`} onClick={() => setTab('students')}>
          👥 Registered Students ({students.length})
        </button>
        <button className={`tab-btn ${tab === 'audit' ? 'active' : ''}`} onClick={() => setTab('audit')}>
          📜 Audit Trail History ({audit.length})
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="search-box">
          <input
            placeholder="🔍 Search by Student Name, Roll No, Application ID, or Document..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        {tab === 'docs' && (
          <select value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="pending">Pending Review</option>
            <option value="verified">Verified</option>
            <option value="flagged">Flagged</option>
            <option value="reupload">Re-upload</option>
          </select>
        )}
        <select value={streamFilter} onChange={e => setStreamFilter(e.target.value)}>
          <option value="">All Streams</option>
          <option value="BCA">BCA</option>
          <option value="BSc">BSc</option>
          <option value="BBA">BBA</option>
        </select>
      </div>

      {/* TAB 1: ALL DOCUMENTS TABLE */}
      {tab === 'docs' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Backend Documents Data ({filteredDocs.length} records)</h3>
            <span style={{ fontSize: '13px', color: '#64748b' }}>Click any row to inspect &amp; review</span>
          </div>

          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Student Name</th>
                  <th>Roll No</th>
                  <th>Stream</th>
                  <th>Document Type</th>
                  <th>Format</th>
                  <th>Submitted At</th>
                  <th>Status</th>
                  <th>Remarks / Reviewer</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan="10" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No documents found matching the criteria.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map(d => (
                    <tr
                      key={d._id}
                      className={sel?._id === d._id ? 'sel' : ''}
                      onClick={() => {
                        setSel(d);
                        setZoom(1);
                        setRot(0);
                        setIsModalOpen(true);
                      }}
                    >
                      <td><span className="pill-code">{d.applicationId || '—'}</span></td>
                      <td>
                        <strong>{d.studentName}</strong>
                        {d.email && <span className="sub-meta">{d.email}</span>}
                      </td>
                      <td><span className="pill-code">{d.rollNo}</span></td>
                      <td><span className="pill-stream">{d.stream || 'BCA'}</span></td>
                      <td><b>{d.docType}</b></td>
                      <td><span className="pill-code">{d.fileType || 'PDF'}</span></td>
                      <td>
                        <span style={{ fontSize: '12.5px' }}>{new Date(d.createdAt).toLocaleDateString()}</span>
                        <span className="sub-meta">{new Date(d.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </td>
                      <td><Badge s={d.status} /></td>
                      <td>
                        {d.reason ? (
                          <span className="err" title={d.reason}>⚠ {d.reason}</span>
                        ) : d.reviewedBy ? (
                          <span style={{ color: '#059669', fontSize: '12px' }}>✔ {d.reviewedBy}</span>
                        ) : (
                          <span style={{ color: '#94a3b8', fontSize: '12px' }}>Needs Review</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn sm light"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSel(d);
                            setZoom(1);
                            setRot(0);
                            setIsModalOpen(true);
                          }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: REGISTERED STUDENTS TABLE */}
      {tab === 'students' && (
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h3 style={{ margin: 0 }}>Registered Students in Database ({filteredStudents.length} records)</h3>
          </div>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Full Name</th>
                  <th>Roll No</th>
                  <th>Stream</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Total Documents</th>
                  <th>Verified</th>
                  <th>Pending</th>
                  <th>Flagged</th>
                  <th>Registered On</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length === 0 ? (
                  <tr>
                    <td colSpan="11" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No students found.
                    </td>
                  </tr>
                ) : (
                  filteredStudents.map(s => (
                    <tr key={s._id}>
                      <td><span className="pill-code" style={{ color: '#0d6efd', fontWeight: 'bold' }}>{s.applicationId}</span></td>
                      <td><strong>{s.name}</strong></td>
                      <td><span className="pill-code">{s.rollNo}</span></td>
                      <td><span className="pill-stream">{s.stream}</span></td>
                      <td>{s.email}</td>
                      <td>{s.mobile || '—'}</td>
                      <td><b>{s.docsCount}</b></td>
                      <td><span className="badge verified">{s.verifiedCount}</span></td>
                      <td><span className="badge pending">{s.pendingCount}</span></td>
                      <td>{s.flaggedCount > 0 ? <span className="badge flagged">{s.flaggedCount}</span> : <span style={{ color: '#94a3b8' }}>0</span>}</td>
                      <td>{new Date(s.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: AUDIT LOG TABLE */}
      {tab === 'audit' && (
        <div className="card">
          <h3 style={{ margin: '0 0 12px' }}>Officer Verification Audit Trail</h3>
          <div className="scroll">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>Officer</th>
                  <th>Action / Verdict</th>
                  <th>Summary</th>
                </tr>
              </thead>
              <tbody>
                {audit.length === 0 ? (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', padding: '30px', color: '#64748b' }}>
                      No audit history yet.
                    </td>
                  </tr>
                ) : (
                  audit.map(a => (
                    <tr key={a._id}>
                      <td>
                        <span>{new Date(a.createdAt).toLocaleDateString()}</span>
                        <span className="sub-meta">{new Date(a.createdAt).toLocaleTimeString()}</span>
                      </td>
                      <td><span className="pill-code">{a.adminId}</span></td>
                      <td><Badge s={a.verdict} /></td>
                      <td>{a.summary}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* INSPECTION MODAL */}
      {isModalOpen && sel && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsModalOpen(false)}>✕</button>
            <h3 style={{ marginTop: 0 }}>Document Inspection Desk</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px', background: '#f8fafc', padding: '14px', borderRadius: '12px', border: '1px solid var(--bd)', marginBottom: '14px' }}>
              <div><small className="sub-meta">STUDENT NAME</small><b>{sel.studentName}</b></div>
              <div><small className="sub-meta">ROLL NO</small><span className="pill-code">{sel.rollNo}</span></div>
              <div><small className="sub-meta">APPLICATION ID</small><span className="pill-code" style={{ color: '#0d6efd' }}>{sel.applicationId}</span></div>
              <div><small className="sub-meta">STREAM</small><span className="pill-stream">{sel.stream || 'BCA'}</span></div>
              <div><small className="sub-meta">DOCUMENT</small><b>{sel.docType}</b></div>
              <div><small className="sub-meta">STATUS</small><Badge s={sel.status} /></div>
            </div>

            {sel.reason && (
              <div style={{ padding: '10px 14px', background: '#fee2e2', borderRadius: '8px', color: '#991b1b', fontSize: '13px', fontWeight: 600, marginBottom: '12px' }}>
                Reason: {sel.reason}
              </div>
            )}

            <div className="row" style={{ marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#64748b' }}>Preview Controls:</span>
              <button className="btn sm dark" onClick={() => setZoom(z => z + .25)}>Zoom In (＋)</button>
              <button className="btn sm dark" onClick={() => setZoom(z => Math.max(.5, z - .25))}>Zoom Out (－)</button>
              <button className="btn sm dark" onClick={() => setRot(r => r + 90)}>Rotate 90° (⟳)</button>
              <button className="btn sm light" onClick={() => { setZoom(1); setRot(0); }}>Reset</button>
            </div>

            <div className="preview">
              {!url ? (
                <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                  <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄</div>
                  <b>Sample / Pre-seeded Document Record</b>
                  <p style={{ fontSize: '12px', margin: '4px 0 0' }}>Actual uploaded documents will display real PDF or scanned images here.</p>
                </div>
              ) : sel.fileType === 'PDF' ? (
                <iframe title="pdf" src={url} style={{ width: '100%', height: '100%', border: 0 }} />
              ) : (
                <img alt="doc" src={url} style={{ transform: `scale(${zoom}) rotate(${rot}deg)`, maxWidth: '100%', maxHeight: '100%' }} />
              )}
            </div>

            {sel.stampHash && (
              <div className="qr" style={{ margin: '14px 0' }}>
                <QRCodeSVG value={`${location.origin}/verify/${sel.stampHash}`} size={110} />
                <span style={{ color: '#16a34a', fontWeight: 'bold', marginTop: '6px', fontSize: '13px' }}>
                  ✔ Cryptographically Verified Document
                </span>
                <span className="pill-code" style={{ fontSize: '11px', marginTop: '4px', maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  Stamp Hash: {sel.stampHash}
                </span>
                <Link to={`/verify/${sel.stampHash}`} target="_blank" style={{ fontSize: '12px', marginTop: '4px', color: '#0d6efd' }}>
                  Open Public Verification Certificate ↗
                </Link>
              </div>
            )}

            <div style={{ marginTop: '16px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#334155', display: 'block', marginBottom: '8px' }}>
                Officer Decision Verdict:
              </span>
              <div className="row">
                <button className="btn ok" onClick={() => act('verify')}>
                  ✔ Mark as REAL (Issue Digital Stamp)
                </button>
                <button className="btn bad" onClick={() => setFlag(true)}>
                  ✖ Flag as FAKE
                </button>
                <button className="btn warn" onClick={() => act('reupload')}>
                  ⚠ Request Re-upload
                </button>
              </div>

              {flag && (
                <div className="modal" style={{ marginTop: '12px' }}>
                  <b>Select Tampering / Fraud Reason:</b>
                  {REASONS.map(r => (
                    <button key={r} className="btn light" style={{ textAlign: 'left', justifyContent: 'flex-start' }} onClick={() => act('flag', { reason: r })}>
                      {r}
                    </button>
                  ))}
                  <button className="btn dark" style={{ marginTop: '6px' }} onClick={() => setFlag(false)}>
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function Track() {
  const [id, setId] = useState(''), [res, setRes] = useState(null), [err, setErr] = useState('');
  const go = async () => {
    try {
      setRes(await api('/docs/track/' + id.trim()));
      setErr('');
    } catch (x) {
      setRes(null);
      setErr(x.message);
    }
  };
  return (
    <div className="w pad">
      <div className="card narrow">
        <h2>Track Application Status</h2>
        <p style={{ color: '#64748b', fontSize: '13px', marginTop: '-4px' }}>
          Enter your Application ID to view verification status and remarks in real-time.
        </p>
        <input
          placeholder="Application ID (e.g. APP-2026-1001)"
          value={id}
          onChange={e => setId(e.target.value)}
        />
        <button className="btn" style={{ width: '100%', marginTop: '6px' }} onClick={go}>
          Track Status
        </button>
        {err && <p className="err" style={{ marginTop: '10px' }}>{err}</p>}
        {res && (
          <div style={{ marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 8px' }}>Submitted Documents for {res[0]?.studentName}:</h4>
            {res.map((d, i) => (
              <div className="item" key={i}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <b>{d.docType}</b>
                  <Badge s={d.status} />
                </div>
                {d.reason && <small className="err">Remark: {d.reason}</small>}
                <small style={{ color: '#64748b' }}>Last Updated: {new Date(d.updatedAt || d.createdAt).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export function VerifyStamp() {
  const { hash } = useParams(), [r, setR] = useState(null);
  useEffect(() => {
    api('/docs/stamp/' + hash).then(setR).catch(() => setR({ valid: false }));
  }, [hash]);
  return (
    <div className="w pad">
      <div className="card narrow" style={{ textAlign: 'center' }}>
        {!r ? (
          <p>Verifying digital stamp against blockchain ledger / database...</p>
        ) : r.valid ? (
          <>
            <div style={{ fontSize: '48px', color: '#16a34a', marginBottom: '8px' }}>✔</div>
            <h2 style={{ color: '#16a34a', margin: '0 0 10px' }}>Document Verified Authentic</h2>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', textAlign: 'left', margin: '14px 0' }}>
              <p style={{ margin: '4px 0' }}>Student Name: <b>{r.doc.studentName}</b></p>
              <p style={{ margin: '4px 0' }}>Roll No: <b>{r.doc.rollNo}</b></p>
              <p style={{ margin: '4px 0' }}>Document Type: <b>{r.doc.docType}</b></p>
              <p style={{ margin: '4px 0' }}>Verified On: <b>{new Date(r.doc.reviewedAt).toLocaleString()}</b></p>
              <p style={{ margin: '4px 0', fontSize: '11px', color: '#64748b', wordBreak: 'break-all' }}>Stamp Hash: {hash}</p>
            </div>
            <p style={{ color: '#166534', fontSize: '13px', fontWeight: 600 }}>
              This document has been verified by the Admission Office and bears a tamper-proof digital signature.
            </p>
          </>
        ) : (
          <>
            <div style={{ fontSize: '48px', color: '#dc2626', marginBottom: '8px' }}>✖</div>
            <h2 className="err" style={{ margin: '0 0 10px' }}>Invalid or Tampered Stamp</h2>
            <p style={{ color: '#64748b', fontSize: '13px' }}>
              The digital signature could not be verified in the institutional database. This document may be fraudulent or revoked.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
