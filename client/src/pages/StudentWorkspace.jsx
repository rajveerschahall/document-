import React, { useState, useEffect } from 'react';
import { useAuth } from '../auth.jsx';
import { api, FILE_BASE } from '../api.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  FileText,
  User,
  FolderCheck,
  Headphones,
  Upload,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCw,
  Copy,
  Check,
  Send,
  Building2,
  Phone,
  Mail,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

const DOC_TYPES = [
  'Class 10th Marksheet',
  'Class 12th Marksheet',
  'Aadhaar / ID Proof',
  'Address Proof / Domicile',
  'Transfer Certificate',
  'Bonafide Certificate',
  'Income Certificate'
];

export default function StudentWorkspace() {
  const { user, login } = useAuth();
  const [activeTab, setActiveTab] = useState('application');
  const [docs, setDocs] = useState([]);
  const [loadingDocs, setLoadingDocs] = useState(false);

  // Application Form State
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
    rollNo: user?.rollNo || '',
    stream: user?.stream || 'BCA',
    address: user?.address || '',
    emergencyContact: user?.emergencyContact || '',
    passingYear: user?.passingYear || '2024',
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState('');

  // Upload Section State
  const [uploadType, setUploadType] = useState(DOC_TYPES[0]);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadMsg, setUploadMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  // Support Desk State
  const [supportQuery, setSupportQuery] = useState({ subject: '', message: '' });
  const [ticketMsg, setTicketMsg] = useState('');

  const [copied, setCopied] = useState(false);

  const loadDocs = async () => {
    setLoadingDocs(true);
    try {
      const data = await api('/docs/mine');
      setDocs(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingDocs(false);
    }
  };

  useEffect(() => {
    loadDocs();
  }, []);

  // Update profile handler
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileMsg('');
    try {
      const res = await api('/auth/profile', {
        method: 'PUT',
        body: formData
      });
      if (res.user) {
        // update local auth state
        const token = localStorage.getItem('token');
        login({ token, user: res.user });
      }
      setProfileMsg('✅ Application details successfully updated and saved to file.');
      setTimeout(() => setProfileMsg(''), 4000);
    } catch (err) {
      setProfileMsg(`❌ ${err.message}`);
    } finally {
      setSavingProfile(false);
    }
  };

  // Upload document handler
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!uploadFile) {
      setUploadMsg('Please select a file to upload (PDF, PNG, JPG).');
      return;
    }
    if (uploadFile.size > 5 * 1024 * 1024) {
      setUploadMsg('File size exceeds 5MB limit.');
      return;
    }
    setUploading(true);
    setUploadMsg('');
    const form = new FormData();
    form.append('docType', uploadType);
    form.append('file', uploadFile);
    try {
      await api('/docs', { method: 'POST', form });
      setUploadMsg('🎉 Document uploaded successfully and queued for review.');
      setUploadFile(null);
      e.target.reset();
      loadDocs();
      setTimeout(() => setUploadMsg(''), 5000);
    } catch (err) {
      setUploadMsg(`❌ ${err.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportQuery.subject || !supportQuery.message) return;
    const ticketId = `TKT-${Math.floor(100000 + Math.random() * 900000)}`;
    setTicketMsg(`Ticket #${ticketId} created successfully. An admission counselor will respond to ${user?.email} within 24 hours.`);
    setSupportQuery({ subject: '', message: '' });
  };

  const copyAppId = () => {
    if (user?.applicationId) {
      navigator.clipboard.writeText(user.applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Sidebar navigation configuration
  const sidebarItems = [
    {
      id: 'application',
      label: '1. Application Form',
      icon: FileText
    },
    {
      id: 'profile',
      label: '2. Profile Overview',
      icon: User
    },
    {
      id: 'documents',
      label: '3. My Documents & Status',
      icon: FolderCheck,
      badge: docs.length
    },
    {
      id: 'support',
      label: '4. Contact & Support Desk',
      icon: Headphones
    }
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'application': return { title: 'Student Profile & Detailed Application Form', subtitle: 'Step 1: Fill in personal, academic, and document credentials.' };
      case 'profile': return { title: 'Applicant Profile Overview', subtitle: 'Step 2: Review verified applicant record and unique ID.' };
      case 'documents': return { title: 'My Submitted Documents & Verification Status', subtitle: 'Step 3: Monitor verification status, stamps, and discrepancy flags.' };
      case 'support': return { title: 'Admission Office Support & Help Desk', subtitle: 'Step 4: Contact academic counselors or raise an inquiry ticket.' };
      default: return { title: 'Student Workspace', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      items={sidebarItems}
      activeItem={activeTab}
      onSelect={setActiveTab}
    >
      {/* TAB 1: DETAILED APPLICATION FORM */}
      {activeTab === 'application' && (
        <div className="space-y-6">
          {/* Header Card with Auto-Generated Application ID */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest font-bold text-blue-200">
                  Institutional Admission Portal • Academic Year 2026–27
                </span>
                <h2 className="text-2xl font-bold mt-1 text-white">
                  Welcome, {user?.name}
                </h2>
                <p className="text-sm text-blue-100 max-w-xl mt-1">
                  Complete your multi-step application form below. All changes are securely synchronized with the institutional registry.
                </p>
              </div>

              {/* Application ID Pill */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-3.5 flex items-center gap-3">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-blue-200">
                    Auto-Generated Application ID
                  </div>
                  <div className="text-xl font-mono font-extrabold text-white tracking-wider">
                    {user?.applicationId || 'APP-2026-PENDING'}
                  </div>
                </div>
                <button
                  onClick={copyAppId}
                  className="p-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition"
                  title="Copy Application ID"
                >
                  {copied ? <Check size={18} className="text-green-300" /> : <Copy size={18} />}
                </button>
              </div>
            </div>
          </div>

          {/* Detailed Form */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <form onSubmit={handleProfileSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
                {/* Personal Details Section */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <User size={18} className="text-blue-600" />
                    1. Personal Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Email Address (Locked)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        disabled
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Contact Number
                      </label>
                      <input
                        type="tel"
                        value={formData.mobile}
                        placeholder="10-digit mobile number"
                        onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Emergency Contact
                      </label>
                      <input
                        type="tel"
                        value={formData.emergencyContact}
                        placeholder="Parent / Guardian Contact"
                        onChange={e => setFormData({ ...formData, emergencyContact: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Residential Address
                      </label>
                      <textarea
                        rows={2}
                        value={formData.address}
                        placeholder="Permanent street address, city, state, pincode"
                        onChange={e => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Academic Details Section */}
                <div>
                  <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Building2 size={18} className="text-blue-600" />
                    2. Academic Details
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Course / Branch
                      </label>
                      <select
                        value={formData.stream}
                        onChange={e => setFormData({ ...formData, stream: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none bg-white"
                      >
                        <option value="BCA">BCA (Computer Applications)</option>
                        <option value="BSc">BSc (Science)</option>
                        <option value="BBA">BBA (Business Admin)</option>
                        <option value="BTech">BTech (Engineering)</option>
                        <option value="MCA">MCA (Master of Computer Apps)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Roll Number
                      </label>
                      <input
                        type="text"
                        value={formData.rollNo}
                        placeholder="e.g. 2433580"
                        onChange={e => setFormData({ ...formData, rollNo: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Passing Year
                      </label>
                      <input
                        type="text"
                        value={formData.passingYear}
                        placeholder="e.g. 2024"
                        onChange={e => setFormData({ ...formData, passingYear: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {profileMsg && (
                  <div className={`p-3 rounded-xl text-sm font-semibold ${profileMsg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'}`}>
                    {profileMsg}
                  </div>
                )}

                <div className="flex justify-end pt-2">
                  <button
                    type="submit"
                    disabled={savingProfile}
                    className="btn px-6 py-2.5 shadow-md shadow-blue-500/20"
                  >
                    {savingProfile ? 'Saving Details...' : 'Save & Update Profile'}
                  </button>
                </div>
              </form>
            </div>

            {/* Document Upload Quick Section */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Upload size={18} className="text-blue-600" />
                  3. Upload Required Documents
                </h3>
                <p className="text-xs text-slate-500 mt-2">
                  Upload Marksheet (10th/12th), Photo ID, Address Proof in PDF, JPG, or PNG format (max 5MB).
                </p>

                <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Document Category
                    </label>
                    <select
                      value={uploadType}
                      onChange={e => setUploadType(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none bg-white"
                    >
                      {DOC_TYPES.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Select File (PDF / Image)
                    </label>
                    <div className="border-2 border-dashed border-slate-200 hover:border-blue-400 rounded-xl p-4 text-center cursor-pointer transition">
                      <input
                        type="file"
                        accept=".pdf,.png,.jpg,.jpeg"
                        onChange={e => setUploadFile(e.target.files[0])}
                        className="w-full text-xs text-slate-600 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                    </div>
                  </div>

                  {uploadMsg && (
                    <div className={`p-3 rounded-xl text-xs font-semibold ${uploadMsg.includes('🎉') ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'}`}>
                      {uploadMsg}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full btn py-2.5 shadow-sm"
                  >
                    {uploading ? 'Uploading...' : 'Upload Document'}
                  </button>
                </form>

                {/* Uploaded documents summary */}
                <div className="mt-6 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs text-slate-500 font-semibold mb-2">
                    <span>Uploaded Files: {docs.length}</span>
                    <button
                      onClick={() => setActiveTab('documents')}
                      className="text-blue-600 hover:underline"
                    >
                      View All Status →
                    </button>
                  </div>
                  <div className="space-y-1.5">
                    {docs.slice(0, 3).map(d => (
                      <div key={d._id} className="text-xs p-2 rounded-lg bg-slate-50 flex items-center justify-between border border-slate-100">
                        <span className="font-medium text-slate-800 truncate max-w-[140px]">{d.docType}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' : d.status === 'flagged' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'}`}>
                          {d.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE OVERVIEW */}
      {activeTab === 'profile' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Identity Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white font-extrabold text-2xl flex items-center justify-center shadow-md">
                {user?.name?.charAt(0) || 'S'}
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-3">{user?.name}</h3>
              <p className="text-xs text-slate-500">{user?.email}</p>

              <div className="mt-4 w-full bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-500 font-bold uppercase">Application ID</span>
                <span className="font-mono text-sm font-bold text-blue-600">{user?.applicationId}</span>
              </div>

              <div className="w-full mt-3 grid grid-cols-2 gap-2 text-left">
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Course</span>
                  <span className="text-xs font-bold text-slate-800">{user?.stream || 'BCA'}</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Roll Number</span>
                  <span className="text-xs font-mono font-bold text-slate-800">{user?.rollNo || '—'}</span>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('application')}
                className="btn light sm w-full mt-4"
              >
                Edit Application Details
              </button>
            </div>

            {/* Profile Overview Details */}
            <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
                Registered Candidate Record
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Full Name</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.name}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Registered Email</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.email}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Contact Number</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.mobile || 'Not specified'}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Emergency Contact</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.emergencyContact || 'Not specified'}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 sm:col-span-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Residential Address</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.address || 'Not specified'}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Enrolled Stream</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.stream || 'BCA'}</span>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Passing Year</span>
                  <span className="text-sm font-semibold text-slate-900 mt-1 block">{user?.passingYear || '2024'}</span>
                </div>
              </div>

              {/* Document verification summary cards */}
              <div className="pt-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Verification Health Check</h4>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                    <span className="text-xl font-extrabold text-emerald-700 block">
                      {docs.filter(d => d.status === 'verified').length}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-800 uppercase">Verified</span>
                  </div>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <span className="text-xl font-extrabold text-amber-700 block">
                      {docs.filter(d => d.status === 'pending').length}
                    </span>
                    <span className="text-[11px] font-bold text-amber-800 uppercase">Pending</span>
                  </div>
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                    <span className="text-xl font-extrabold text-rose-700 block">
                      {docs.filter(d => d.status === 'flagged' || d.status === 'reupload').length}
                    </span>
                    <span className="text-[11px] font-bold text-rose-800 uppercase">Attention</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MY DOCUMENTS & UPLOAD STATUS */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div>
              <h3 className="text-base font-bold text-slate-900 m-0">
                Uploaded Verification Files ({docs.length})
              </h3>
              <p className="text-xs text-slate-500 mt-1 m-0">
                Status updates in real-time as officers verify authenticity.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('application')}
              className="btn sm"
            >
              <Upload size={14} /> Upload More Documents
            </button>
          </div>

          {loadingDocs ? (
            <div className="p-12 text-center text-slate-500">Loading documents...</div>
          ) : docs.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-sm">
              <FolderCheck size={48} className="mx-auto text-slate-300 mb-3" />
              <h4 className="text-base font-bold text-slate-800">No documents submitted yet</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                Upload your Class 10th/12th marksheets, photo ID, or domicile to begin admission verification.
              </p>
              <button
                onClick={() => setActiveTab('application')}
                className="btn mt-4 sm"
              >
                Go to Application &amp; Upload
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {docs.map(doc => {
                const isVerified = doc.status === 'verified';
                const isFlagged = doc.status === 'flagged';
                const isReupload = doc.status === 'reupload';
                const isPending = doc.status === 'pending';

                return (
                  <div
                    key={doc._id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 m-0">{doc.docType}</h4>
                        <span className="text-xs text-slate-500 font-mono mt-0.5 block">Format: {doc.fileType}</span>
                      </div>

                      <span className={`text-xs px-2.5 py-1 rounded-full font-bold uppercase flex items-center gap-1.5 ${
                        isVerified ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        isFlagged ? 'bg-rose-100 text-rose-800 border border-rose-200' :
                        isReupload ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-slate-100 text-slate-800 border border-slate-200'
                      }`}>
                        {isVerified && <CheckCircle2 size={13} />}
                        {isFlagged && <AlertTriangle size={13} />}
                        {isReupload && <RotateCw size={13} />}
                        {isPending && <Clock size={13} />}
                        {isVerified ? 'Verified REAL' : isFlagged ? 'Flagged FAKE' : isReupload ? 'Re-upload' : 'Pending'}
                      </span>
                    </div>

                    {/* Remarks/reasons */}
                    {doc.reason && (
                      <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs">
                        <b>Officer Discrepancy Note:</b> {doc.reason}
                      </div>
                    )}

                    {doc.reviewedBy && (
                      <div className="text-xs text-slate-500 flex items-center gap-1">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        Reviewed by <b>{doc.reviewedBy}</b> on {new Date(doc.reviewedAt || doc.updatedAt).toLocaleDateString()}
                      </div>
                    )}

                    {/* Digital Stamp QR */}
                    {doc.stampHash && (
                      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
                        <QRCodeSVG value={`${window.location.origin}/verify/${doc.stampHash}`} size={64} />
                        <div className="flex-1 min-w-0">
                          <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 size={13} /> Tamper-Proof Digital Stamp
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 truncate block mt-0.5">
                            Hash: {doc.stampHash.substring(0, 18)}...
                          </span>
                          <a
                            href={`/verify/${doc.stampHash}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[11px] text-blue-600 hover:underline font-semibold mt-1 inline-block"
                          >
                            View Public Certificate ↗
                          </a>
                        </div>
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-100 flex items-center justify-between">
                      <span>Submitted: {new Date(doc.createdAt).toLocaleString()}</span>
                      {doc.filePath && (
                        <a
                          href={FILE_BASE + doc.filePath}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-600 hover:underline font-semibold"
                        >
                          View File
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: CONTACT & SUPPORT DESK */}
      {activeTab === 'support' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Headphones size={18} className="text-blue-600" />
              Admission Helpdesk
            </h3>
            <p className="text-xs text-slate-500">
              For verification queries, corrections, or document clarification, contact the institutional verification officer.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-700">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Phone size={16} className="text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Helpline</span>
                  <a href="tel:+919872104110" className="font-semibold text-slate-900 hover:text-blue-600">+91 98721 04110</a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Mail size={16} className="text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Support Email</span>
                  <a href="mailto:support@campusverify.edu" className="font-semibold text-slate-900 hover:text-blue-600">support@campusverify.edu</a>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-3">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification Office</span>
                  <span className="font-semibold text-slate-900">Room 102, Academic Block A</span>
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-blue-50 border border-blue-200 rounded-xl text-blue-900 text-xs">
              <b>Office Hours:</b> Mon – Fri, 9:00 AM – 5:00 PM IST
            </div>
          </div>

          {/* Raise Support Ticket */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Send size={18} className="text-blue-600" />
              Raise an Inquiry / Clarification Ticket
            </h3>
            <p className="text-xs text-slate-500">
              Submit your query regarding flagged documents, re-upload requests, or application updates.
            </p>

            <form onSubmit={handleSupportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Subject / Query Topic
                </label>
                <input
                  type="text"
                  placeholder="e.g., Marksheet Re-upload Clarification"
                  value={supportQuery.subject}
                  onChange={e => setSupportQuery({ ...supportQuery, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Explanation
                </label>
                <textarea
                  rows={4}
                  placeholder="Describe your issue or provide context regarding your uploaded document..."
                  value={supportQuery.message}
                  onChange={e => setSupportQuery({ ...supportQuery, message: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  required
                />
              </div>

              {ticketMsg && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                  {ticketMsg}
                </div>
              )}

              <button type="submit" className="btn px-6 py-2.5">
                <Send size={15} /> Submit Support Ticket
              </button>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
