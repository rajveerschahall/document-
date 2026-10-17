import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import {
  FileCheck2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  GraduationCap,
  Copy,
  Check
} from 'lucide-react';

export default function DashboardLayout({
  title,
  subtitle,
  items,
  activeItem,
  onSelect,
  children
}) {
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const copyAppId = () => {
    if (user?.applicationId) {
      navigator.clipboard.writeText(user.applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const roleTitle = user?.role === 'admin' ? 'Admin Officer' : 'Student Applicant';
  const roleBadgeColor = user?.role === 'admin'
    ? 'bg-purple-100 text-purple-800 border-purple-200'
    : 'bg-blue-100 text-blue-800 border-blue-200';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* LEFT SIDEBAR */}
      <aside
        className={`fixed md:sticky top-0 h-screen z-50 bg-slate-900 text-slate-100 flex flex-col transition-all duration-300 ease-in-out border-r border-slate-800 shadow-xl md:shadow-none ${
          mobileOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0'
        } ${collapsed ? 'md:w-20' : 'md:w-72'}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <span className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-md">
              <FileCheck2 size={22} />
            </span>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="font-bold text-base tracking-tight leading-tight text-white">
                  Admission<span className="text-blue-400">Verify</span>
                </span>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {user?.role === 'admin' ? 'Administrative Desk' : 'Student Workspace'}
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden md:flex w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white items-center justify-center transition"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate m-0">
                  {user?.name || 'Authorized User'}
                </p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`text-[10.5px] px-2 py-0.5 rounded-full font-bold border ${roleBadgeColor}`}>
                    {user?.role === 'admin' ? (
                      <span className="flex items-center gap-1">
                        <ShieldCheck size={11} /> Admin
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <GraduationCap size={11} /> Student
                      </span>
                    )}
                  </span>
                  {user?.stream && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
                      {user.stream}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Application ID pill for Student */}
          {!collapsed && user?.role === 'student' && user?.applicationId && (
            <div className="mt-2.5 px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[9.5px] font-bold text-slate-400 uppercase tracking-wider">
                  Application ID
                </span>
                <span className="text-xs font-mono font-bold text-blue-400">
                  {user.applicationId}
                </span>
              </div>
              <button
                onClick={copyAppId}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition"
                title="Copy Application ID"
              >
                {copied ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 p-3 space-y-1.5 overflow-y-auto">
          {!collapsed && (
            <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              {user?.role === 'admin' ? 'Administration Views' : 'Application Steps & Views'}
            </div>
          )}

          {items.map(item => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelect(item.id);
                  setMobileOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-medium text-sm transition-all duration-150 text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/30'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                } ${collapsed ? 'justify-center px-0' : ''}`}
                title={collapsed ? item.label : undefined}
              >
                <Icon size={19} className={`shrink-0 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {!collapsed && (
                  <span className="flex-1 truncate">{item.label}</span>
                )}
                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      isActive
                        ? 'bg-blue-800 text-blue-100'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {/* Public Home link (for student only, NOT admin!) */}
          {!collapsed && user?.role === 'student' && (
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
            >
              ← Back to Public Website
            </Link>
          )}

          <button
            onClick={logout}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-semibold text-rose-300 hover:text-rose-100 hover:bg-rose-950/40 border border-transparent hover:border-rose-900/40 transition ${
              collapsed ? 'justify-center px-0' : ''
            }`}
            title="Sign Out"
          >
            <LogOut size={18} className="shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu size={22} />
            </button>
            <div>
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight leading-none m-0">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-slate-500 mt-1 m-0 hidden sm:block">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user?.role === 'student' && user?.applicationId && (
              <div className="hidden sm:flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1 rounded-full text-xs font-bold font-mono">
                <span>App ID:</span>
                <span>{user.applicationId}</span>
              </div>
            )}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                {user?.name?.charAt(0) || 'U'}
              </span>
              <span className="text-sm font-semibold text-slate-800 hidden lg:inline">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* Workspace Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
