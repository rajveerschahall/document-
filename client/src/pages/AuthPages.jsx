import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { api } from '../api.js';
import PublicNav from '../components/PublicNav.jsx';
import {
  FileCheck2,
  LogIn,
  UserPlus,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

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

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const d = await api('/auth/login', {
        method: 'POST',
        body: { id: f.id, password: f.password }
      });
      login(d);
      // Automatic role redirection:
      if (d.user.role === 'admin') {
        nav('/admin');
      } else {
        nav('/student');
      }
    } catch (x) {
      setErr(x.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  const autofillDemo = (id, pw) => {
    setF({ id, password: pw });
    setErr('');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <div className="top-announcement">
        🎓 BCA Final Year Project • Digital Admission Document Verification &amp; Tamper Detection System
      </div>
      <PublicNav />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-md w-full p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-3">
              <LogIn size={24} />
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Institutional Portal Login
            </h2>
            <p className="text-xs text-slate-500">
              Universal single-entry authentication for Students and Administration Officers.
            </p>
          </div>

          {msg && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-2xl flex items-start gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
              <span>{msg}</span>
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Login ID / Email / Roll No
              </label>
              <input
                type="text"
                placeholder="Enter Email, Application ID, or Roll No"
                value={f.id}
                onChange={e => setF({ ...f, id: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter account password"
                value={f.password}
                onChange={e => setF({ ...f, password: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 focus:ring-2 focus:ring-blue-100 outline-none"
                required
              />
            </div>

            {err && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-full py-3 shadow-md shadow-blue-500/20 text-sm"
            >
              {loading ? 'Authenticating...' : 'Sign In to Workspace'}
            </button>
          </form>

          {/* Quick Demo Autofill Helper */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
              Quick Test Demo Credentials:
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => autofillDemo('admin@campusverify.edu', 'Admin@123')}
                className="p-2 text-left rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-900 text-xs font-medium transition"
              >
                <span className="font-bold flex items-center gap-1">
                  <ShieldCheck size={12} className="text-purple-600" /> Admin
                </span>
                <span className="text-[10px] text-purple-700 block truncate">admin@campusverify.edu</span>
              </button>

              <button
                type="button"
                onClick={() => autofillDemo('rahul@example.com', 'Student@123')}
                className="p-2 text-left rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 text-xs font-medium transition"
              >
                <span className="font-bold flex items-center gap-1">
                  <GraduationCap size={12} className="text-blue-600" /> Student
                </span>
                <span className="text-[10px] text-blue-700 block truncate">rahul@example.com</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-slate-500">
            <span>New student applicant? </span>
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

export function Register() {
  const [f, setF] = useState({
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
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();
  const set = k => e => setF({ ...f, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      const res = await api('/auth/register', { method: 'POST', body: f });
      // Redirect to unified login asking for credentials
      nav('/login', {
        state: {
          msg: `🎉 Registration successful! Your Application ID is ${res.applicationId}. Please enter your password to sign in.`,
          id: f.email,
        }
      });
    } catch (x) {
      setErr(x.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <div className="top-announcement">
        🎓 BCA Final Year Project • Digital Admission Document Verification &amp; Tamper Detection System
      </div>
      <PublicNav />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-xl w-full p-8 space-y-6">
          <div className="text-center space-y-1">
            <span className="w-12 h-12 bg-blue-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-md mb-3">
              <UserPlus size={24} />
            </span>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Student Registration
            </h2>
            <p className="text-xs text-slate-500">
              Register for institutional admission to receive your official Application ID.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Student Full Name (e.g. Aarti Kumari)"
                  value={f.name}
                  onChange={set('name')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Email Address (Login ID)
                </label>
                <input
                  type="email"
                  placeholder="student@example.com"
                  value={f.email}
                  onChange={set('email')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Mobile Number
                </label>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  value={f.mobile}
                  onChange={set('mobile')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Board / College Roll No
                </label>
                <input
                  type="text"
                  placeholder="e.g. 2433580"
                  value={f.rollNo}
                  onChange={set('rollNo')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Course / Branch
                </label>
                <select
                  value={f.stream}
                  onChange={set('stream')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none bg-white"
                >
                  <option value="BCA">BCA (Bachelor of Computer Applications)</option>
                  <option value="BSc">BSc (Bachelor of Science)</option>
                  <option value="BBA">BBA (Bachelor of Business Admin)</option>
                  <option value="BTech">BTech (Engineering)</option>
                  <option value="MCA">MCA (Master of Computer Apps)</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Account Password (min 6 characters)
                </label>
                <input
                  type="password"
                  placeholder="Choose a strong password"
                  value={f.password}
                  onChange={set('password')}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                  required
                />
              </div>
            </div>

            {err && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
                {err}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn w-full py-3 shadow-md shadow-blue-500/20 text-sm"
            >
              {loading ? 'Registering Account...' : 'Register for Admission'}
            </button>
          </form>

          <div className="text-center text-xs text-slate-500">
            <span>Already have an account? </span>
            <Link to="/login" className="font-bold text-blue-600 hover:underline">
              Sign In with ID
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
