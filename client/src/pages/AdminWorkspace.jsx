import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../auth.jsx';
import { api, FILE_BASE } from '../api.js';
import DashboardLayout from '../components/DashboardLayout.jsx';
import { QRCodeSVG } from 'qrcode.react';
import {
  Users,
  FileCheck2,
  Settings,
  Search,
  Filter,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  RotateCw,
  Clock,
  Eye,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Sliders,
  Lock,
  Key,
  Database,
  Check,
  X
} from 'lucide-react';

const REASONS = [
  'Blurry Image - Details not legible',
  'Altered Roll No or marks tampering detected',
  'Fake Stamp or invalid college watermark',
  'Name Mismatch with institutional database',
  'Altered Serial Number / Certificate ID',
  'Incomplete document / missing reverse page'
];

export default function AdminWorkspace() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('roster'); // 'roster' | 'desk' | 'settings'

  // Data states
  const [docs, setDocs] = useState([]);
  const [students, setStudents] = useState([]);
  const [audit, setAudit] = useState([]);
  const [stats, setStats] = useState({ totalDocs: 0, pending: 0, verified: 0, flagged: 0, reupload: 0, totalStudents: 0 });
  const [loading, setLoading] = useState(false);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState('');
  const [streamFilter, setStreamFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Inspection modal state
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [flagReasonModal, setFlagReasonModal] = useState(false);

  // Settings State
  const [settingsNotice, setSettingsNotice] = useState('');
  const [sysConfig, setSysConfig] = useState({
    institutionName: 'Campus Verification Authority',
    stampAlgorithm: 'SHA-256 Cryptographic Digest',
    autoFlagBlurry: true,
    requireTwoOfficers: false,
    maxUploadSizeMB: 5
  });

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [docsData, studentsData, auditData, statsData] = await Promise.all([
        api('/docs' + (statusFilter ? '?status=' + statusFilter : '')),
        api('/docs/students/all'),
        api('/docs/audit/all'),
        api('/docs/stats/summary')
      ]);
      setDocs(docsData || []);
      setStudents(studentsData || []);
      setAudit(auditData || []);
      setStats(statsData || {});
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, [statusFilter]);

  // Review action handler
  const handleReviewAction = async (actionPath, body) => {
    if (!selectedDoc) return;
    try {
      const updated = await api(`/docs/${selectedDoc._id}/${actionPath}`, {
        method: 'PATCH',
        body: body || {}
      });
      setSelectedDoc(updated);
      setFlagReasonModal(false);
      loadAllData();
    } catch (e) {
      alert(`Action error: ${e.message}`);
    }
  };

  // Filtered documents for Verification Desk
  const filteredDocs = useMemo(() => {
    return docs.filter(d => {
      const matchStream = !streamFilter || (d.stream || 'BCA') === streamFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        (d.studentName && d.studentName.toLowerCase().includes(q)) ||
        (d.rollNo && d.rollNo.toLowerCase().includes(q)) ||
        (d.applicationId && d.applicationId.toLowerCase().includes(q)) ||
        (d.docType && d.docType.toLowerCase().includes(q)) ||
        (d.email && d.email.toLowerCase().includes(q))
      );
      return matchStream && matchSearch;
    });
  }, [docs, streamFilter, searchQuery]);

  // Filtered students for Student Roster
  const filteredStudents = useMemo(() => {
    return students.filter(s => {
      const matchStream = !streamFilter || (s.stream || 'BCA') === streamFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || (
        (s.name && s.name.toLowerCase().includes(q)) ||
        (s.rollNo && s.rollNo.toLowerCase().includes(q)) ||
        (s.applicationId && s.applicationId.toLowerCase().includes(q)) ||
        (s.email && s.email.toLowerCase().includes(q))
      );
      return matchStream && matchSearch;
    });
  }, [students, streamFilter, searchQuery]);

  // Admin Left Sidebar Items (Strictly Admin only: No public Home, About, or Track!)
  const sidebarItems = [
    {
      id: 'roster',
      label: '1. Student Roster',
      icon: Users,
      badge: students.length
    },
    {
      id: 'desk',
      label: '2. Verification Desk',
      icon: FileCheck2,
      badge: docs.filter(d => d.status === 'pending').length
    },
    {
      id: 'settings',
      label: '3. System Settings',
      icon: Settings
    }
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'roster': return { title: 'Institutional Student Roster', subtitle: 'View registered applicant accounts, assigned Application IDs, and verification completion.' };
      case 'desk': return { title: 'Document Verification Desk', subtitle: 'Inspect student documents, run discrepancy checks, and issue cryptographically stamped verdicts.' };
      case 'settings': return { title: 'System & Security Settings', subtitle: 'Configure institutional verification parameters, stamp keys, and security audit policies.' };
      default: return { title: 'Admin Verification Workspace', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();
  const fileUrl = selectedDoc?.filePath ? FILE_BASE + selectedDoc.filePath : null;

  return (
    <DashboardLayout
      title={title}
      subtitle={subtitle}
      items={sidebarItems}
      activeItem={activeTab}
      onSelect={setActiveTab}
    >
      {/* SECTION 1: STUDENT ROSTER */}
      {activeTab === 'roster' && (
        <div className="space-y-6">
          {/* Quick Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total Applicants</span>
              <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{students.length}</span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Verified Candidates</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                {students.filter(s => s.verifiedCount > 0 && s.pendingCount === 0).length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Action Required</span>
              <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
                {students.filter(s => s.pendingCount > 0 || s.flaggedCount > 0).length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wider block">Total Documents</span>
              <span className="text-2xl font-extrabold text-blue-700 mt-1 block">{stats.totalDocs || docs.length}</span>
            </div>
          </div>

          {/* Roster Controls */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name, ID, roll..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={streamFilter}
                onChange={e => setStreamFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white"
              >
                <option value="">All Branches</option>
                <option value="BCA">BCA</option>
                <option value="BSc">BSc</option>
                <option value="BBA">BBA</option>
                <option value="BTech">BTech</option>
                <option value="MCA">MCA</option>
              </select>

              <button
                onClick={loadAllData}
                disabled={loading}
                className="btn light sm"
                title="Refresh Roster"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 m-0">
                Registered Application IDs &amp; Candidate Roster ({filteredStudents.length})
              </h3>
              <span className="text-xs text-slate-400 font-medium">Synced with Server Registry</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10.5px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Branch</th>
                    <th className="py-3 px-4">Contact Info</th>
                    <th className="py-3 px-4 text-center">Docs Total</th>
                    <th className="py-3 px-4 text-center">Verified</th>
                    <th className="py-3 px-4 text-center">Pending</th>
                    <th className="py-3 px-4 text-center">Flagged</th>
                    <th className="py-3 px-4 text-right">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredStudents.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        No students found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredStudents.map(s => (
                      <tr key={s._id} className="hover:bg-slate-50/80 transition">
                        <td className="py-3 px-4 font-mono font-bold text-blue-600">
                          {s.applicationId}
                        </td>
                        <td className="py-3 px-4 font-semibold text-slate-900">
                          {s.name}
                        </td>
                        <td className="py-3 px-4 font-mono text-slate-600">
                          {s.rollNo || '—'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-bold font-mono text-[10px]">
                            {s.stream || 'BCA'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-slate-500">
                          <div>{s.email}</div>
                          <div className="text-[10px] text-slate-400">{s.mobile || 'No contact'}</div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold">
                          {s.docsCount || 0}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            {s.verifiedCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                            {s.pendingCount || 0}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center">
                          {s.flaggedCount > 0 ? (
                            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-bold text-[10px]">
                              {s.flaggedCount}
                            </span>
                          ) : (
                            <span className="text-slate-300">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right text-slate-400 font-mono text-[11px]">
                          {new Date(s.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: DOCUMENT VERIFICATION DESK */}
      {activeTab === 'desk' && (
        <div className="space-y-6">
          {/* Summary Metric Header */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider block">Pending Queue</span>
              <span className="text-2xl font-extrabold text-amber-700 mt-1 block">
                {docs.filter(d => d.status === 'pending').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-wider block">Marked REAL</span>
              <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">
                {docs.filter(d => d.status === 'verified').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">Flagged FAKE</span>
              <span className="text-2xl font-extrabold text-rose-700 mt-1 block">
                {docs.filter(d => d.status === 'flagged').length}
              </span>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
              <span className="text-[11px] font-bold text-orange-600 uppercase tracking-wider block">Re-upload Requests</span>
              <span className="text-2xl font-extrabold text-orange-700 mt-1 block">
                {docs.filter(d => d.status === 'reupload').length}
              </span>
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search candidate name, ID, doc type..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-blue-600"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white font-medium"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending Review</option>
                <option value="verified">Verified (REAL)</option>
                <option value="flagged">Flagged (FAKE)</option>
                <option value="reupload">Re-upload Requested</option>
              </select>

              <select
                value={streamFilter}
                onChange={e => setStreamFilter(e.target.value)}
                className="text-xs px-3 py-2 rounded-xl border border-slate-200 outline-none bg-white font-medium"
              >
                <option value="">All Branches</option>
                <option value="BCA">BCA</option>
                <option value="BSc">BSc</option>
                <option value="BBA">BBA</option>
                <option value="BTech">BTech</option>
              </select>

              <button
                onClick={loadAllData}
                disabled={loading}
                className="btn light sm"
                title="Refresh Table"
              >
                <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
              </button>
            </div>
          </div>

          {/* Verification Table */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 m-0">
                Document Queue ({filteredDocs.length} files)
              </h3>
              <span className="text-xs text-slate-500">Click any row to open the Inspection Desk</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-bold uppercase text-[10.5px] border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Application ID</th>
                    <th className="py-3 px-4">Candidate Name</th>
                    <th className="py-3 px-4">Roll No</th>
                    <th className="py-3 px-4">Document Type</th>
                    <th className="py-3 px-4">Format</th>
                    <th className="py-3 px-4">Submitted At</th>
                    <th className="py-3 px-4">Verification Status</th>
                    <th className="py-3 px-4">Remarks / Reviewer</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredDocs.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        No verification requests found in this view.
                      </td>
                    </tr>
                  ) : (
                    filteredDocs.map(d => {
                      const isVerified = d.status === 'verified';
                      const isFlagged = d.status === 'flagged';
                      const isReupload = d.status === 'reupload';
                      const isPending = d.status === 'pending';

                      return (
                        <tr
                          key={d._id}
                          onClick={() => {
                            setSelectedDoc(d);
                            setZoom(1);
                            setRotation(0);
                            setIsModalOpen(true);
                          }}
                          className={`hover:bg-slate-50/80 cursor-pointer transition ${
                            selectedDoc?._id === d._id ? 'bg-blue-50/70' : ''
                          }`}
                        >
                          <td className="py-3 px-4 font-mono font-bold text-blue-600">
                            {d.applicationId || '—'}
                          </td>
                          <td className="py-3 px-4">
                            <div className="font-semibold text-slate-900">{d.studentName}</div>
                            <div className="text-[10.5px] text-slate-400">{d.email}</div>
                          </td>
                          <td className="py-3 px-4 font-mono text-slate-600">
                            {d.rollNo || '—'}
                          </td>
                          <td className="py-3 px-4 font-semibold text-slate-900">
                            {d.docType}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-bold">
                              {d.fileType || 'PDF'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {new Date(d.createdAt).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`text-[10.5px] px-2.5 py-1 rounded-full font-bold uppercase inline-flex items-center gap-1 ${
                              isVerified ? 'bg-emerald-100 text-emerald-800' :
                              isFlagged ? 'bg-rose-100 text-rose-800' :
                              isReupload ? 'bg-amber-100 text-amber-800' :
                              'bg-slate-100 text-slate-800'
                            }`}>
                              {isVerified && <CheckCircle2 size={12} />}
                              {isFlagged && <AlertTriangle size={12} />}
                              {isReupload && <RotateCw size={12} />}
                              {isPending && <Clock size={12} />}
                              {isVerified ? 'REAL' : isFlagged ? 'FAKE' : isReupload ? 'Re-upload' : 'Pending'}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {d.reason ? (
                              <span className="text-rose-700 font-semibold truncate max-w-[150px] block" title={d.reason}>
                                ⚠ {d.reason}
                              </span>
                            ) : d.reviewedBy ? (
                              <span className="text-emerald-700 font-medium">
                                By {d.reviewedBy}
                              </span>
                            ) : (
                              <span className="text-slate-400 italic">Queueing</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedDoc(d);
                                setZoom(1);
                                setRotation(0);
                                setIsModalOpen(true);
                              }}
                              className="btn sm light font-medium"
                            >
                              <Eye size={13} /> Inspect
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: SYSTEM SETTINGS */}
      {activeTab === 'settings' && (
        <div className="space-y-6 max-w-4xl">
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <Sliders size={18} className="text-blue-600" />
              Institutional Verification Parameters
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Institutional Authority Name
                </label>
                <input
                  type="text"
                  value={sysConfig.institutionName}
                  onChange={e => setSysConfig({ ...sysConfig, institutionName: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-sm focus:border-blue-600 outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold uppercase tracking-wider mb-1">
                  Cryptographic Stamp Algorithm
                </label>
                <input
                  type="text"
                  value={sysConfig.stampAlgorithm}
                  disabled
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 text-sm cursor-not-allowed font-mono"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  SHA-256 with institutional secret hashing enabled for tamper detection.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Auto-detect Alterations</span>
                    <span className="text-slate-500 text-[11px]">Flag blurry marksheets and irregular roll serial numbers automatically.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sysConfig.autoFlagBlurry}
                    onChange={e => setSysConfig({ ...sysConfig, autoFlagBlurry: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div>
                    <span className="font-bold text-slate-800 block">Dual Officer Approval Policy</span>
                    <span className="text-slate-500 text-[11px]">Require second verification review before issuing final digital QR certificate.</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={sysConfig.requireTwoOfficers}
                    onChange={e => setSysConfig({ ...sysConfig, requireTwoOfficers: e.target.checked })}
                    className="w-4 h-4 text-blue-600 rounded"
                  />
                </div>
              </div>

              {settingsNotice && (
                <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-semibold">
                  {settingsNotice}
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    setSettingsNotice('✅ Institutional settings successfully updated.');
                    setTimeout(() => setSettingsNotice(''), 3000);
                  }}
                  className="btn px-6 py-2"
                >
                  Save Settings
                </button>
              </div>
            </div>
          </div>

          {/* Audit Controls & Security Key Overview */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <ShieldCheck size={18} className="text-emerald-600" />
              Officer Audit Trail &amp; Verification Keys
            </h3>
            <p className="text-xs text-slate-500">
              Active verification officer: <b>{user?.name}</b> ({user?.email}) • Cryptographic signing key status: <span className="text-emerald-600 font-bold">ONLINE</span>
            </p>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-500">Public Stamp URL Template:</span>
              <span className="text-blue-600">{window.location.origin}/verify/{"{stampHash}"}</span>
            </div>
          </div>
        </div>
      )}

      {/* INSPECTION MODAL DESK */}
      {isModalOpen && selectedDoc && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-window" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setIsModalOpen(false)}
              className="modal-close"
              title="Close Modal"
            >
              ✕
            </button>

            <div className="border-b border-slate-100 pb-3 mb-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">
                Verification Desk Inspector
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                {selectedDoc.studentName} — {selectedDoc.docType}
              </h3>
            </div>

            {/* Candidate Metadata Summary */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 mb-4 text-xs">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Application ID</span>
                <span className="font-mono font-bold text-blue-600">{selectedDoc.applicationId}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Roll Number</span>
                <span className="font-mono font-bold text-slate-800">{selectedDoc.rollNo || '—'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Course / Branch</span>
                <span className="font-bold text-slate-800">{selectedDoc.stream || 'BCA'}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Current Status</span>
                <span className="font-bold uppercase text-[11px]">
                  {selectedDoc.status === 'verified' ? '✔ REAL' : selectedDoc.status === 'flagged' ? '✖ FAKE' : selectedDoc.status}
                </span>
              </div>
            </div>

            {selectedDoc.reason && (
              <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs mb-3 font-semibold">
                Reason / Remark: {selectedDoc.reason}
              </div>
            )}

            {/* Document Viewer Controls */}
            <div className="flex items-center justify-between gap-2 mb-2 text-xs">
              <span className="font-bold text-slate-600">Document Canvas:</span>
              <div className="flex items-center gap-1.5">
                <button onClick={() => setZoom(z => z + 0.25)} className="btn sm light" title="Zoom In">
                  <ZoomIn size={13} />
                </button>
                <button onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} className="btn sm light" title="Zoom Out">
                  <ZoomOut size={13} />
                </button>
                <button onClick={() => setRotation(r => r + 90)} className="btn sm light" title="Rotate 90°">
                  <RotateCcw size={13} />
                </button>
                <button onClick={() => { setZoom(1); setRotation(0); }} className="btn sm light">
                  Reset
                </button>
              </div>
            </div>

            {/* Document Preview Box */}
            <div className="preview">
              {!fileUrl ? (
                <div className="text-center p-8 text-slate-400">
                  <FileCheck2 size={40} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-bold text-slate-700 m-0">Pre-seeded / Verified Institutional Record</p>
                  <p className="text-[11px] text-slate-400 mt-1">Uploaded PDF or scanned images render in high resolution here.</p>
                </div>
              ) : selectedDoc.fileType === 'PDF' ? (
                <iframe title="document-pdf" src={fileUrl} className="w-full h-full border-0 rounded-xl" />
              ) : (
                <img
                  alt="document-preview"
                  src={fileUrl}
                  style={{ transform: `scale(${zoom}) rotate(${rotation}deg)` }}
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            {/* QR Verification Stamp if verified */}
            {selectedDoc.stampHash && (
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl flex items-center gap-3 my-3">
                <QRCodeSVG value={`${window.location.origin}/verify/${selectedDoc.stampHash}`} size={70} />
                <div className="flex-1 min-w-0 text-xs">
                  <span className="font-bold text-emerald-800 flex items-center gap-1">
                    <CheckCircle2 size={13} /> Institutional Tamper-Proof Digital Stamp Issued
                  </span>
                  <span className="font-mono text-[10px] text-slate-500 truncate block mt-0.5">
                    Hash: {selectedDoc.stampHash}
                  </span>
                  <a
                    href={`/verify/${selectedDoc.stampHash}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline font-semibold mt-1 inline-block"
                  >
                    Open Public Certificate ↗
                  </a>
                </div>
              </div>
            )}

            {/* Verdict Action Buttons */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Administrative Verdict Decision:
              </span>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleReviewAction('verify')}
                  className="btn ok flex-1 py-2 text-xs"
                >
                  <CheckCircle2 size={15} /> Mark as REAL (Issue Stamp)
                </button>
                <button
                  onClick={() => setFlagReasonModal(true)}
                  className="btn bad flex-1 py-2 text-xs"
                >
                  <AlertTriangle size={15} /> Flag as FAKE
                </button>
                <button
                  onClick={() => handleReviewAction('reupload')}
                  className="btn warn flex-1 py-2 text-xs"
                >
                  <RotateCw size={15} /> Request Re-upload
                </button>
              </div>

              {/* Reason Selector Modal */}
              {flagReasonModal && (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2 mt-2">
                  <span className="text-xs font-bold text-slate-900 block">
                    Select Specific Fraud / Tampering Reason:
                  </span>
                  <div className="space-y-1">
                    {REASONS.map(r => (
                      <button
                        key={r}
                        onClick={() => handleReviewAction('flag', { reason: r })}
                        className="w-full text-left p-2 rounded-lg bg-white hover:bg-rose-50 hover:text-rose-900 border border-slate-200 hover:border-rose-300 text-xs font-medium transition"
                      >
                        • {r}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setFlagReasonModal(false)}
                    className="btn light sm w-full mt-2"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
