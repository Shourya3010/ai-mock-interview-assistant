import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Video, LogOut } from 'lucide-react';

export const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Interviews', path: '/interviews' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-[#E8DEC8]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#B87D4B] flex items-center justify-center text-white font-bold font-geist shadow-sm">
            AI
          </div>
          <span className="font-bold text-lg tracking-tight font-geist text-[#2B1E16]">
            InterviewAI
          </span>
        </Link>

        {/* Center Nav Links */}
        {isAuthenticated && (
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-xs font-semibold tracking-wide uppercase font-mono transition-colors ${
                    isActive ? 'text-[#B87D4B]' : 'text-[#7A6B5D] hover:text-[#2B1E16]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
        )}

        {/* User Action */}
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/interview/setup"
              className="btn-primary text-xs flex items-center gap-1.5"
            >
              <Video className="w-3.5 h-3.5" />
              <span>+ New Interview</span>
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-[#E8DEC8]">
              <div className="w-8 h-8 rounded-full bg-[#F7F3EB] border border-[#E8DEC8] flex items-center justify-center text-[#B87D4B] font-semibold text-xs">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="hidden sm:inline-block text-xs font-medium text-[#2B1E16]">
                {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 rounded-lg text-[#7A6B5D] hover:text-[#C95D56] hover:bg-[#F7F3EB] transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-medium text-[#7A6B5D] hover:text-[#2B1E16] px-3 py-2"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary text-xs"
            >
              Get Started
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};
