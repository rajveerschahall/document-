import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import PublicNav from '../components/PublicNav.jsx';
import { api } from '../api.js';
import { QRCodeSVG } from 'qrcode.react';
import {
  FileCheck2,
  ShieldCheck,
  Search,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Clock,
  Sparkles,
  Lock,
  Workflow,
  GraduationCap,
  Building2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react';

export function PublicLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-800">
      <div className="top-announcement">
        🎓 BCA Final Year Project • Digital Admission Document Verification &amp; Tamper Detection System
      </div>
      <PublicNav />
      <main className="flex-1">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs">
        <div className="w flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="p-1.5 bg-blue-600 rounded-lg text-white">
              <FileCheck2 size={16} />
            </span>
            AdmissionVerify
          </div>
          <div>
            © 2026 AdmissionVerify System • Aarti Kumari • <a href="tel:+919872104110" className="text-slate-300 hover:text-white">+91 98721 04110</a> • <a href="mailto:support@campusverify.edu" className="text-slate-300 hover:text-white">support@campusverify.edu</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function Home() {
  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white py-16 md:py-24 relative overflow-hidden">
        <div className="w relative z-10 flex flex-col items-center text-center">
          <span className="px-3.5 py-1.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-bold uppercase tracking-wider mb-5 flex items-center gap-2">
            <Sparkles size={14} /> Institutional Admission Security Protocol
          </span>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold max-w-4xl tracking-tight leading-tight">
            Digital Admission Document Verification &amp; Cryptographic Auditing
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl">
            Eliminate long queues and prevent fraudulent certificates with real-time SHA-256 digital stamps, automated tampering detection, and instant status tracking.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/register" className="btn px-6 py-3 text-sm shadow-lg shadow-blue-600/30">
              Student Registration <ArrowRight size={16} />
            </Link>
            <Link to="/login" className="btn light px-6 py-3 text-sm">
              Universal Portal Login
            </Link>
            <Link to="/track" className="btn ghost px-5 py-3 text-sm">
              <Search size={15} /> Track Application
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 w">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Core Verification Infrastructure
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Built following strict academic institutional compliance standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <GraduationCap size={22} />
            </span>
            <h3 className="text-base font-bold text-slate-900">Student Profile &amp; Application</h3>
            <p className="text-xs text-slate-500">
              Auto-generates unique Application IDs with multi-step academic, address, and document capture.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </span>
            <h3 className="text-base font-bold text-slate-900">Real vs Fake Detection</h3>
            <p className="text-xs text-slate-500">
              Institutional review desk with high-resolution inspection, roll alteration detection, and reason logging.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <span className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Lock size={22} />
            </span>
            <h3 className="text-base font-bold text-slate-900">Cryptographic QR Stamps</h3>
            <p className="text-xs text-slate-500">
              Verified certificates receive tamper-proof SHA-256 digital stamps verifiable by employers and universities.
            </p>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

export function About() {
  return (
    <PublicLayout>
      <div className="w py-14 max-w-4xl space-y-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Institutional Mission</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">About AdmissionVerify</h1>
          <p className="text-slate-600 mt-2 text-sm leading-relaxed">
            AdmissionVerify is a modern educational compliance platform built for collegiate institutions to streamline admission document scrutiny, detect falsified academic records, and issue verifiable digital credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-3">
            <span className="p-2 bg-blue-100 text-blue-800 rounded-xl inline-flex font-bold text-sm">
              <GraduationCap size={20} />
            </span>
            <h3 className="text-base font-bold text-slate-900">Paperless Student Experience</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Students register online, receive a persistent Application ID, upload marksheets from anywhere, and track verification decisions in real time.
            </p>
          </div>

          <div className="card space-y-3">
            <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl inline-flex font-bold text-sm">
              <ShieldCheck size={20} />
            </span>
            <h3 className="text-base font-bold text-slate-900">Institutional Security &amp; Audit</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admission authorities maintain an immutable audit log of every document inspected, marked REAL or FAKE, with timestamps and officer credentials.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export function Features() {
  return (
    <PublicLayout>
      <div className="w py-14 space-y-8">
        <div className="max-w-2xl">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Full Capability Suite</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Platform Features &amp; Modules</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Everything educational institutions and candidates need for seamless admissions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card space-y-2">
            <h3 className="text-base font-bold text-slate-900">1. Left Sidebar Workspace</h3>
            <p className="text-xs text-slate-500">
              Clean, collapsible multi-page layout separating public views, student workspace, and administrative review desks.
            </p>
          </div>
          <div className="card space-y-2">
            <h3 className="text-base font-bold text-slate-900">2. Tamper Detection Desk</h3>
            <p className="text-xs text-slate-500">
              Mark documents REAL or FAKE with granular fraud reasoning (Altered Roll No, Fake Stamp, Name Mismatch).
            </p>
          </div>
          <div className="card space-y-2">
            <h3 className="text-base font-bold text-slate-900">3. Universal Login Engine</h3>
            <p className="text-xs text-slate-500">
              Single entry login with auto-detection for Administrators and Students via Email, Application ID, or Roll No.
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export function HowItWorks() {
  return (
    <PublicLayout>
      <div className="w py-14 max-w-4xl space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Workflow</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">How AdmissionVerify Works</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            A transparent 4-step pipeline from candidate registration to cryptographically verified credentials.
          </p>
        </div>

        <div className="space-y-4">
          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0">
              1
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Student Registers &amp; Receives ID</h3>
              <p className="text-xs text-slate-500 mt-1">
                Student registers on the portal and immediately receives an institutional Application ID (e.g. APP-2026-8942).
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0">
              2
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Complete Application &amp; Upload Files</h3>
              <p className="text-xs text-slate-500 mt-1">
                In their Left Sidebar workspace, the student fills personal/academic details and uploads marksheets, ID proof, and address certificates.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white font-extrabold flex items-center justify-center shrink-0">
              3
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Officer Verification &amp; Tamper Detection</h3>
              <p className="text-xs text-slate-500 mt-1">
                Verification officers inspect the documents, rotate and zoom, and issue verdicts: Mark as REAL, Flag as FAKE, or Request Re-upload.
              </p>
            </div>
          </div>

          <div className="card flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-extrabold flex items-center justify-center shrink-0">
              4
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Digital Stamp &amp; Public Verification</h3>
              <p className="text-xs text-slate-500 mt-1">
                Approved documents receive a cryptographic QR code that anyone can scan to verify institutional authenticity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export function Contact() {
  return (
    <PublicLayout>
      <div className="w py-14 max-w-4xl space-y-8">
        <div>
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Inquiries</span>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-1">Contact Verification Office</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-2">
            Reach out to our campus admission desk for administrative assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Office Details
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <p className="flex items-center gap-2">
                <Building2 size={16} className="text-blue-600 shrink-0" />
                <b>Institutional Office:</b> Academic Block A, Room 102
              </p>
              <p className="flex items-center gap-2">
                <Phone size={16} className="text-blue-600 shrink-0" />
                <b>Helpline:</b> <a href="tel:+919872104110" className="text-blue-600 hover:underline">+91 98721 04110</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail size={16} className="text-blue-600 shrink-0" />
                <b>Email:</b> <a href="mailto:support@campusverify.edu" className="text-blue-600 hover:underline">support@campusverify.edu</a>
              </p>
            </div>
          </div>

          <div className="card space-y-3">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Student Project Lead
            </h3>
            <p className="text-xs text-slate-600">
              <b>Candidate Name:</b> Aarti Kumari<br />
              <b>Program:</b> BCA Final Year Project<br />
              <b>Institution:</b> Campus Verification Authority
            </p>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}

export function Track() {
  const [appId, setAppId] = useState('');
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!appId.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      const data = await api('/docs/track/' + appId.trim().toUpperCase());
      setResults(data);
    } catch (err) {
      setError(err.message || 'Application ID not found in database.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="w py-14 max-w-xl mx-auto space-y-6">
        <div className="text-center">
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Public Inquiry</span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">Track Application Status</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Enter your assigned Application ID to check live document review progress.
          </p>
        </div>

        <form onSubmit={handleTrack} className="card p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Application ID
            </label>
            <input
              type="text"
              placeholder="e.g. APP-2026-1001"
              value={appId}
              onChange={e => setAppId(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:border-blue-600 outline-none uppercase"
              required
            />
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold rounded-xl">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} className="btn w-full py-2.5">
            {loading ? 'Searching Registry...' : 'Track Application Status'}
          </button>
        </form>

        {results && (
          <div className="card p-6 space-y-4">
            <div className="border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-400 font-bold uppercase">Candidate Record</span>
              <h3 className="text-base font-bold text-slate-900">{results[0]?.studentName}</h3>
            </div>

            <div className="space-y-2.5">
              {results.map((d, i) => (
                <div key={i} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-xs text-slate-900 block">{d.docType}</span>
                    {d.reason && <span className="text-[11px] text-rose-700 block mt-0.5">Remark: {d.reason}</span>}
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    d.status === 'verified' ? 'bg-emerald-100 text-emerald-800' :
                    d.status === 'flagged' ? 'bg-rose-100 text-rose-800' :
                    d.status === 'reupload' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-200 text-slate-800'
                  }`}>
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </PublicLayout>
  );
}

export function VerifyStamp() {
  const { hash } = useParams();
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/docs/stamp/' + hash)
      .then(res => setRecord(res))
      .catch(() => setRecord({ valid: false }))
      .finally(() => setLoading(false));
  }, [hash]);

  return (
    <PublicLayout>
      <div className="w py-14 max-w-lg mx-auto text-center space-y-6">
        <div className="card p-8 space-y-4">
          {loading ? (
            <p className="text-slate-500 text-sm">Querying cryptographic verification registry...</p>
          ) : record?.valid ? (
            <>
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-emerald-700">Cryptographically Verified</h2>
              <div className="text-left bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs space-y-2">
                <p><b>Candidate:</b> {record.doc.studentName}</p>
                <p><b>Roll Number:</b> <span className="font-mono">{record.doc.rollNo}</span></p>
                <p><b>Certificate:</b> {record.doc.docType}</p>
                <p><b>Verified At:</b> {new Date(record.doc.reviewedAt).toLocaleString()}</p>
                <p className="text-[10px] font-mono text-slate-500 break-all"><b>Stamp Hash:</b> {hash}</p>
              </div>
              <p className="text-xs text-emerald-800 font-semibold">
                This document is certified authentic by the Institutional Admission Office.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full mx-auto flex items-center justify-center">
                <AlertTriangle size={36} />
              </div>
              <h2 className="text-2xl font-extrabold text-rose-700">Invalid or Tampered Stamp</h2>
              <p className="text-xs text-slate-500">
                This certificate signature could not be verified in the institutional database. It may be revoked, altered, or fraudulent.
              </p>
            </>
          )}
        </div>
      </div>
    </PublicLayout>
  );
}
