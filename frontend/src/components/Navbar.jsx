import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEnrollment } from '../hooks/useEnrollment';
import { 
  Sun, Moon, Menu, X, BookOpen, ShieldCheck, 
  CreditCard, LogOut, ChevronDown, Sparkles 
} from 'lucide-react';

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { membership } = useEnrollment();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setUserDropdownOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#030712]/75 border-b border-slate-200 dark:border-white/10 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo (Inspired by NEONE / NxtLearnn with 4-point sparkle) */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer">
            <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-white/10 border border-sky-200 dark:border-white/20 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-sm dark:shadow-[0_0_15px_rgba(56,189,248,0.3)] group-hover:scale-105 transition-transform">
              <Sparkles className="w-4 h-4 fill-sky-500 text-sky-500 dark:fill-sky-400 dark:text-sky-400" />
            </div>
            <span className="font-extrabold text-lg tracking-wider text-slate-900 dark:text-white">
              NxtLearnn
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              to="/courses"
              className={`text-base font-bold transition-colors cursor-pointer tracking-tight ${
                isActive('/courses')
                  ? 'text-sky-500 font-extrabold'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white'
              }`}
            >
              Courses
            </Link>

            <Link
              to="/pricing"
              className={`text-base font-bold transition-colors cursor-pointer tracking-tight ${
                isActive('/pricing')
                  ? 'text-sky-500 font-extrabold'
                  : 'text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white'
              }`}
            >
              Pricing
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`text-base font-bold transition-colors cursor-pointer tracking-tight ${
                  isActive('/dashboard')
                    ? 'text-sky-500 font-extrabold'
                    : 'text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100 dark:bg-sky-500/10 dark:text-sky-300 dark:border-sky-500/30 dark:hover:bg-sky-500/20 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Admin Studio
              </Link>
            )}
          </div>

          {/* Right Actions: Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors focus:outline-none cursor-pointer"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-500/30"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-sky-500/20">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#0b101e]/95 border border-slate-200 dark:border-white/10 shadow-2xl py-2 text-sm z-50 backdrop-blur-xl">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-white/10 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name || user?.fullName || 'Student'}</p>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          membership === 'lifetime'
                            ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                            : membership === 'monthly'
                            ? 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                            : 'bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10'
                        }`}>
                          {membership === 'lifetime' ? 'Lifetime' : membership === 'monthly' ? 'Monthly' : 'Free'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.email}</p>
                    </div>

                    <Link
                      to="/dashboard"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-sky-500 dark:text-sky-400" />
                      My Learning
                    </Link>

                    <Link
                      to="/pricing"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/5 cursor-pointer"
                    >
                      <CreditCard className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                      Billing & Plans
                    </Link>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sky-700 hover:bg-sky-50 dark:text-sky-300 dark:hover:bg-sky-500/10 cursor-pointer"
                      >
                        <ShieldCheck className="w-4 h-4" />
                        Admin Studio
                      </Link>
                    )}

                    <div className="border-t border-slate-100 dark:border-white/10 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-base font-bold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white transition-colors cursor-pointer"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="px-6 py-2.5 text-sm font-extrabold text-white bg-slate-950 hover:bg-slate-800 dark:text-[#030712] dark:bg-white dark:hover:bg-slate-100 rounded-full shadow-sm dark:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all cursor-pointer"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-white/10 bg-white/95 dark:bg-[#030712] px-4 pt-2 pb-6 space-y-3 backdrop-blur-xl">
          <Link
            to="/courses"
            className="block px-3 py-2.5 rounded-lg text-base font-bold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            Courses
          </Link>
          <Link
            to="/pricing"
            className="block px-3 py-2.5 rounded-lg text-base font-bold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
          >
            Pricing
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                className="block px-3 py-2.5 rounded-lg text-base font-bold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
              >
                Dashboard
              </Link>
              {isAdmin && (
                <Link
                  to="/admin"
                  className="block px-3 py-2.5 rounded-lg text-base font-bold text-sky-600 hover:bg-sky-50 dark:text-sky-400 dark:hover:bg-sky-500/10 cursor-pointer"
                >
                  Admin Studio
                </Link>
              )}
              <div className="border-t border-slate-200 dark:border-white/10 pt-2" />
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2.5 rounded-lg text-base font-bold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 cursor-pointer"
              >
                Log Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2.5">
              <Link
                to="/login"
                className="w-full text-center py-2.5 text-base font-bold text-slate-800 border border-slate-300 rounded-full hover:bg-slate-50 dark:text-slate-200 dark:border-white/20 dark:hover:bg-white/5 cursor-pointer"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="w-full text-center py-2.5 text-base font-extrabold text-white bg-slate-950 rounded-full shadow-sm dark:text-[#030712] dark:bg-white cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
