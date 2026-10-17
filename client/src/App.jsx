import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { useAuth } from './auth.jsx';
import UnifiedPortal from './pages/UnifiedPortal.jsx';
import StudentWorkspace from './pages/StudentWorkspace.jsx';
import AdminWorkspace from './pages/AdminWorkspace.jsx';
import {
  About,
  Features,
  HowItWorks,
  Contact,
  VerifyStamp
} from './pages/PublicPages.jsx';

/**
 * Single Unified Link Entry Gate (/)
 * 1. Asks user to Log In first if not authenticated.
 * 2. If logged in as Admin -> Directly renders Admin Workspace.
 * 3. If logged in as Student -> Directly renders Student Workspace.
 * 4. Sign Out returns instantly to the Login screen on the same link.
 */
function RootGate({ defaultTab = 'login' }) {
  const { user, ready } = useAuth();

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium text-sm">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span>Verifying secure institutional session...</span>
        </div>
      </div>
    );
  }

  // Not logged in -> Prompt for Login first!
  if (!user) {
    return <UnifiedPortal defaultTab={defaultTab} />;
  }

  // Admin Officer -> Open Admin Panel
  if (user.role === 'admin') {
    return <AdminWorkspace />;
  }

  // Student Applicant -> Open Student Workspace
  return <StudentWorkspace />;
}

function Guard({ role, children }) {
  const { user, ready } = useAuth();
  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium text-sm">
        Verifying secure session...
      </div>
    );
  }
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* 1. Single Unified Link Entry: Everything happens on http://localhost:5173/ */}
      <Route path="/" element={<RootGate defaultTab="login" />} />
      <Route path="/login" element={<RootGate defaultTab="login" />} />
      <Route path="/register" element={<RootGate defaultTab="register" />} />
      <Route path="/track" element={<RootGate defaultTab="track" />} />

      {/* 2. Direct Guarded Dashboard URLs */}
      <Route
        path="/student/*"
        element={
          <Guard role="student">
            <StudentWorkspace />
          </Guard>
        }
      />
      <Route
        path="/admin/*"
        element={
          <Guard role="admin">
            <AdminWorkspace />
          </Guard>
        }
      />

      {/* 3. Tamper-Proof Cryptographic Verification Stamp */}
      <Route path="/verify/:hash" element={<VerifyStamp />} />

      {/* 4. Public Information Pages */}
      <Route path="/about" element={<About />} />
      <Route path="/features" element={<Features />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/contact" element={<Contact />} />

      {/* 5. Default Catch-all to Single Link Gate */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
