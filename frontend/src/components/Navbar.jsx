import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useEnrollment } from '../hooks/useEnrollment';
import { 
  Sun, Moon, Menu, X, BookOpen, ShieldCheck, 
  CreditCard, LogOut, ChevronDown, Sparkles, ArrowRight 
} from 'lucide-react';
import Button from './ui/Button';

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
    <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-[#02050e]/80 border-b border-slate-200/80 dark:border-white/[0.08] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with micro-interaction */}
          <Link to="/" className="flex items-center gap-2.5 group cursor-pointer select-none">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200/80 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-[0_1px_3px_rgba(0,0,0,0.08)] dark:shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            >
              <Sparkles className="w-4 h-4 fill-indigo-500 text-indigo-500 dark:fill-indigo-400 dark:text-indigo-400" />
            </motion.div>
            <span className="font-extrabold text-lg tracking-wider text-slate-900 dark:text-white">
              NxtLearnn
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-100/70 dark:bg-white/[0.03] p-1 rounded-full border border-slate-200/60 dark:border-white/[0.06]">
            <Link
              to="/courses"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive('/courses')
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Courses
            </Link>

            <Link
              to="/pricing"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                isActive('/pricing')
                  ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Pricing
            </Link>

            {isAuthenticated && (
              <Link
                to="/dashboard"
                className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide transition-all cursor-pointer ${
                  isActive('/dashboard')
                    ? 'bg-white dark:bg-white/10 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Dashboard
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </Link>
            )}
          </div>

          {/* Right Actions: Theme Toggle + Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <motion.button
              whileTap={{ scale: 0.92, rotate: 15 }}
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-white/[0.08]"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </motion.button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer bg-white/50 dark:bg-white/[0.02]"
                >
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'User'}
                      className="w-7 h-7 rounded-full object-cover ring-2 ring-indigo-500/30"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.fullName ? user.fullName.charAt(0).toUpperCase() : user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user?.name || user?.fullName || 'Account'}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -4 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -4 }}
                      transition={{ duration: 0.15, ease: 'easeOut' }}
                      className="absolute right-0 mt-2 w-60 rounded-2xl bg-white/95 dark:bg-[#080d1a]/95 border border-slate-200 dark:border-white/[0.1] shadow-2xl py-2 text-sm z-50 backdrop-blur-2xl"
                    >
                      <div className="px-4 py-2.5 border-b border-slate-100 dark:border-white/[0.08] space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-bold text-slate-900 dark:text-white truncate text-xs">
                            {user?.name || user?.fullName || 'Student'}
                          </p>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            membership === 'lifetime'
                              ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                              : membership === 'monthly'
                              ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                              : 'bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/10'
                          }`}>
                            {membership === 'lifetime' ? 'Lifetime' : membership === 'monthly' ? 'Monthly' : 'Free'}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                      </div>

                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
                        <span>My Learning</span>
                      </Link>

                      <Link
                        to="/pricing"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400" />
                        <span>Billing & Plans</span>
                      </Link>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-50 dark:text-indigo-300 dark:hover:bg-indigo-500/10 transition-colors cursor-pointer"
                        >
                          <ShieldCheck className="w-3.5 h-3.5" />
                          <span>Admin Studio</span>
                        </Link>
                      )}

                      <div className="border-t border-slate-100 dark:border-white/[0.08] my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left transition-colors cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Log Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Button
                  to="/login"
                  variant="ghost"
                  size="sm"
                  className="font-semibold text-xs"
                >
                  Sign in
                </Button>
                <Button
                  to="/signup"
                  variant="primary"
                  size="sm"
                  className="font-semibold text-xs rounded-full px-4"
                  rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Get Started
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/5 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu with Framer Motion */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="md:hidden border-b border-slate-200 dark:border-white/[0.08] bg-white/95 dark:bg-[#030712]/95 px-4 pt-3 pb-6 space-y-2.5 backdrop-blur-2xl overflow-hidden"
          >
            <Link
              to="/courses"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
            >
              Courses
            </Link>
            <Link
              to="/pricing"
              className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
            >
              Pricing
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-800 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5 cursor-pointer"
                >
                  Dashboard
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="block px-3 py-2 rounded-xl text-sm font-semibold text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-indigo-500/10 cursor-pointer"
                  >
                    Admin Studio
                  </Link>
                )}
                <div className="border-t border-slate-200 dark:border-white/[0.08] pt-2" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-sm font-semibold text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 cursor-pointer"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="pt-2 flex flex-col gap-2">
                <Button to="/login" variant="secondary" size="md" className="w-full text-center">
                  Sign in
                </Button>
                <Button to="/signup" variant="primary" size="md" className="w-full text-center">
                  Get Started
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
