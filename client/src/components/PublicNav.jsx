import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../auth.jsx';
import { FileCheck2, Home, Info, Sparkles, Workflow, Phone, Search, LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';

export default function PublicNav() {
  const { user, logout } = useAuth();

  return (
    <header className="public-nav">
      <div className="w">
        <div className="nav-row">
          <Link to="/" className="logo-brand">
            <span className="p-2 bg-blue-600 text-white rounded-xl shadow-sm flex items-center justify-center">
              <FileCheck2 size={22} />
            </span>
            <span>Admission<span className="text-blue-600">Verify</span></span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2 flex-wrap">
            <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Home size={16} /> Home
            </NavLink>
            <NavLink to="/about" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Info size={16} /> About Us
            </NavLink>
            <NavLink to="/features" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Sparkles size={16} /> Features
            </NavLink>
            <NavLink to="/how-it-works" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Workflow size={16} /> How It Works
            </NavLink>
            <NavLink to="/contact" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Phone size={16} /> Contact Us
            </NavLink>
            <NavLink to="/track" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Search size={16} /> Track Status
            </NavLink>
          </nav>

          <div className="ml-auto flex items-center gap-2">
            {!user ? (
              <>
                <Link to="/register" className="btn light sm">
                  <UserPlus size={15} /> Student Register
                </Link>
                <Link to="/login" className="btn sm">
                  <LogIn size={15} /> Login
                </Link>
              </>
            ) : (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/student'}
                  className="btn sm"
                >
                  <LayoutDashboard size={15} />
                  {user.role === 'admin' ? 'Admin Portal' : 'Student Workspace'}
                </Link>
                <button onClick={logout} className="btn dark sm">
                  <LogOut size={15} /> Logout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
