import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import { QRCodeSVG } from 'qrcode.react';
import {
  FileCheck2,
  LogIn,
  UserPlus,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Search,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  Building2,
  Lock,
  Layers,
  ChevronRight
} from 'lucide-react';

const Badge = ({ s }) => {
  const map = {
    pending: { label: 'Pending Review', cls: 'badge pending' },
    verified: { label: 'Verified REAL', cls: 'badge verified' },
    flagged: { label: 'Flagged FAKE', cls: 'badge flagged' },
    reupload: { label: 'Re-upload Requested', cls: 'badge reupload' },
  };
  const item = map[s] || { label: s, cls: 'badge' };
  return <span className={item.cls}>{item.label}</span>;
};

export default function UnifiedPortal({ defaultTab = 'login' }) {
  const [tab, setTab] = useState(defaultTab);
  const location = useLocation();
  const { login } = useAuth();
  const nav = useNavigate();

  // Login State
  const [loginForm, setLoginForm] = useState({
    id: location.state?.id || location.state?.email || '',
    password: ''
  });
  const [loginMsg, setLoginMsg] = useState(location.state?.msg || '');
  const [loginErr, setLoginErr] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Register State
  const [regForm, setRegForm] = useState({
    name: '',
    email: '',
    mobile: '',
    rollNo: '',
    stream: 'BCA',
    password: '',
    address: '',
    emergencyContact: '',
    passingYear: '2024'
  });
  const [regErr, setRegErr] = useState('');
  const [regLoading, setRegLoading] = useState(false);

  // Track State
  const [trackId, setTrackId] = useState('');
  const [trackRes, setTrackRes] = useState(null);
  const [trackErr, setTrackErr] = useState('');
  const [trackLoading, setTrackLoading] = useState(false);

  // Quick autofill demo credentials
  const autofill = (id, pw) => {
    setLoginForm({ id, password: pw });
    setLoginErr('');
    setTab('login');
  };

  // Instant login helper for demo
  const quickSignIn = async (id, pw) => {
    setLoginForm({ id, password: pw });
    setLoginErr('');
    setLoginLoading(true);
    try {
      const d = await api('/auth/login', {
        method: 'POST',
        body: { id, password: pw }
      });
      login(d);
      // Navigation is handled automatically by the single-link RootGate!
    } catch (e) {
      setLoginErr(e.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  // Submit Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginErr('');
    setLoginLoading(true);
    try {
      const d = await api('/auth/login', {
        method: 'POST',
        body: { id: loginForm.id, password: loginForm.password }
      });
      login(d);
    } catch (x) {
      setLoginErr(x.message || 'Invalid credentials. Please verify your Login ID and password.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Submit Registration
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegErr('');
    setRegLoading(true);
    try {
      const res = await api('/auth/register', { method: 'POST', body: regForm });
      setLoginMsg(`🎉 Registration successful! Your assigned Application ID is ${res.applicationId}. Please enter your password to sign in.`);
      setLoginForm({ id: regForm.email, password: '' });
      setTab('login');
    } catch (x) {
      setRegErr(x.message || 'Registration failed. Please check your details.');
    } finally {
      setRegLoading(false);
    }
  };

  // Track Application Submit
  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    setTrackLoading(true);
    setTrackErr('');
    setTrackRes(null);
    try {
      const d = await api('/docs/track/' + trackId.trim());
      setTrackRes(d);
    } catch (x) {
      setTrackErr(x.message || 'No application records found for this ID.');
    } finally {
      setTrackLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      {/* Top Banner */}
      <div className="top-banner">
        🎓 BCA Final Year Project • Centralized Admission Document Verification &amp; Tamper Detection System
      </div>

      {/* Main Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="w flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md">
              <FileCheck2 size={22} />
            </span>
            <div>
              <span className="font-extrabold text-lg text-slate-900 tracking-tight leading-none block">
                Admission<span className="text-blue-600">Verify</span>
              </span>
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Institutional Security Portal
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-xs text-slate-500 font-medium">Quick Demo Access:</span>
            <button
              type="button"
              onClick={() => quickSignIn('admin@campusverify.edu', 'Admin@123')}
              className="px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-bold transition flex items-center gap-1"
              title="1-Click Login as Admin"
            >
              <ShieldCheck size={14} className="text-purple-600" />
              <span>Admin</span>
            </button>
            <button
              type="button"
              onClick={() => quickSignIn('rahul@example.com', 'Student@123')}
              className="px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-bold transition flex items-center gap-1"
              title="1-Click Login as Student"
            >
              <GraduationCap size={14} className="text-blue-600" />
              <span>Student</span>
            </button>
          </div>
        </div>
      </header>

      {/* Portal Container */}
      <main className="flex-1 flex items-center justify-center p-3 sm:p-6 py-8 md:py-12">
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl max-w-xl w-full p-4 sm:p-8">
          
          {/* Header Title */}
          <div className="text-center space-y-1 mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Institutional Admission Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Please sign in to access your Student Application or Administrative Desk.
            </p>
          </div>

          {/* Unified Tabs Bar (Fully Responsive) */}
          <div className="grid grid-cols-3 gap-1 p-1 bg-slate-100 rounded-xl mb-6 text-xs sm:text-sm font-semibold">
            <button
              type="button"
              onClick={() => { setTab('login'); setLoginErr(''); }}
              className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                tab === 'login'
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn size={15} />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('register'); setRegErr(''); }}
              className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                tab === 'register'
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus size={15} />
              <span>Register</span>
            </button>

            <button
              type="button"
              onClick={() => { setTab('track'); setTrackErr(''); }}
              className={`py-2 px-3 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 ${
                tab === 'track'
                  ? 'bg-white text-blue-600 shadow-sm font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Search size={15} />
              <span>Track</span>
            </button>
          </div>

          {/* TAB 1: UNIVERSAL SIGN IN */}
          {tab === 'login' && (
            <div className="space-y-5">
              {loginMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl flex items-start gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                  <span>{loginMsg}</span>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Login ID / Email / Roll No / App ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. admin@campusverify.edu or rahul@example.com"
                    value={loginForm.id}
                    onChange={e => setLoginForm({ ...loginForm, id: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter account password"
                    value={loginForm.password}
                    onChange={e => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                  />
                </div>

                {loginErr && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl flex items-start gap-2">
                    <AlertTriangle size={15} className="text-rose-600 shrink-0 mt-0.5" />
                    <span>{loginErr}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loginLoading}
                  className="btn w-full py-3 shadow-md shadow-blue-500/20 text-sm"
                >
                  {loginLoading ? 'Authenticating Session...' : 'Sign In to Workspace'}
                </button>
              </form>

              {/* 1-Click Demo Fill Box */}
              <div className="pt-4 border-t border-slate-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center mb-2">
                  Test With 1-Click Credentials:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => autofill('admin@campusverify.edu', 'Admin@123')}
                    className="p-2.5 text-left rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 transition flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs flex items-center gap-1">
                        <ShieldCheck size={14} className="text-purple-600" /> Admin Officer
                      </span>
                      <span className="text-[11px] text-purple-700 block font-mono">admin@campusverify.edu</span>
                    </div>
                    <span className="text-[11px] text-purple-600 font-semibold">Fill ↗</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => autofill('rahul@example.com', 'Student@123')}
                    className="p-2.5 text-left rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 transition flex items-center justify-between"
                  >
                    <div>
                      <span className="font-bold text-xs flex items-center gap-1">
                        <GraduationCap size={14} className="text-blue-600" /> Student Applicant
                      </span>
                      <span className="text-[11px] text-blue-700 block font-mono">rahul@example.com</span>
                    </div>
                    <span className="text-[11px] text-blue-600 font-semibold">Fill ↗</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENT REGISTRATION */}
          {tab === 'register' && (
            <div className="space-y-4">
              <form onSubmit={handleRegister} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      placeholder="Student Full Name (e.g. Aarti Kumari)"
                      value={regForm.name}
                      onChange={e => setRegForm({ ...regForm, name: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Email Address (Login ID)
                    </label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={regForm.email}
                      onChange={e => setRegForm({ ...regForm, email: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="10-digit mobile"
                      value={regForm.mobile}
                      onChange={e => setRegForm({ ...regForm, mobile: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Board / College Roll No
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 2433580"
                      value={regForm.rollNo}
                      onChange={e => setRegForm({ ...regForm, rollNo: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Branch / Stream
                    </label>
                    <select
                      value={regForm.stream}
                      onChange={e => setRegForm({ ...regForm, stream: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none bg-white"
                    >
                      <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                      <option value="BSc">BSc (Bachelor of Science)</option>
                      <option value="BBA">BBA (Bachelor of Business Admin)</option>
                      <option value="BTech">BTech (Engineering)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password (min 6 chars)
                    </label>
                    <input
                      type="password"
                      placeholder="Choose a strong password"
                      value={regForm.password}
                      onChange={e => setRegForm({ ...regForm, password: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                    />
                  </div>
                </div>

                {regErr && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                    {regErr}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={regLoading}
                  className="btn w-full py-3 shadow-md shadow-blue-500/20 text-sm mt-2"
                >
                  {regLoading ? 'Creating Account & Generating ID...' : 'Register for Admission'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 3: TRACK APPLICATION */}
          {tab === 'track' && (
            <div className="space-y-4">
              <form onSubmit={handleTrack} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Application ID
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. APP-2026-1001"
                      value={trackId}
                      onChange={e => setTrackId(e.target.value)}
                      required
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                    />
                    <button
                      type="submit"
                      disabled={trackLoading}
                      className="btn px-5 text-sm shrink-0"
                    >
                      {trackLoading ? 'Searching...' : 'Check Status'}
                    </button>
                  </div>
                </div>

                {/* Quick chip to test Rahul's App ID */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Quick lookup:</span>
                  <button
                    type="button"
                    onClick={() => { setTrackId('APP-2026-1001'); }}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    APP-2026-1001 (Rahul)
                  </button>
                </div>
              </form>

              {trackErr && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                  {trackErr}
                </div>
              )}

              {trackRes && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 m-0">
                        {trackRes[0]?.studentName || 'Student Records'}
                      </h4>
                      <span className="text-xs text-slate-500 font-mono">
                        {trackRes[0]?.applicationId || trackId} • {trackRes[0]?.stream || 'BCA'}
                      </span>
                    </div>
                    <span className="text-xs bg-slate-100 px-2.5 py-1 rounded-full font-bold text-slate-700">
                      {trackRes.length} Documents
                    </span>
                  </div>

                  <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                    {trackRes.map((doc, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-slate-800">{doc.docType}</span>
                          <Badge s={doc.status} />
                        </div>
                        {doc.reason && (
                          <p className="text-xs text-rose-600 font-semibold m-0">
                            Remark: {doc.reason}
                          </p>
                        )}
                        {doc.reviewedBy && (
                          <p className="text-[11px] text-emerald-600 font-medium m-0">
                            Reviewed by: {doc.reviewedBy} on {new Date(doc.reviewedAt || doc.updatedAt).toLocaleDateString()}
                          </p>
                        )}
                        {doc.stampHash && (
                          <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center gap-3">
                            <QRCodeSVG value={`${window.location.origin}/verify/${doc.stampHash}`} size={46} />
                            <div className="flex flex-col">
                              <span className="text-[10px] font-bold text-emerald-700">✔ Digital Stamp Issued</span>
                              <span className="text-[9px] font-mono text-slate-400 truncate max-w-[180px]">{doc.stampHash}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-6 border-t border-slate-800 text-xs">
        <div className="w flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="p-1 bg-blue-600 rounded-lg text-white">
              <FileCheck2 size={14} />
            </span>
            AdmissionVerify
          </div>
          <div>
            © 2026 BCA Final Year Project • Aarti Kumari • <a href="tel:+919872104110" className="text-slate-300 hover:text-white">+91 98721 04110</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
