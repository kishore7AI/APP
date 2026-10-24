import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Lock,
  Mail,
  ArrowRight,
  Loader2,
  CheckCircle2,
  X,
  KeyRound,
  UserPlus,
  ArrowLeft,
  ChevronRight,
  Globe,
} from 'lucide-react';
import { COURSES } from '../../data/coursesData';

// Clean SVG Icons for Google and GitHub
function GoogleIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function GitHubIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get('course');
  const targetCourse = courseSlug ? COURSES.find((c) => c.slug === courseSlug) : null;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);
  const [savedAccounts, setSavedAccounts] = useState([]);

  // Account Chooser Popup Modal State
  const [showAccountModal, setShowAccountModal] = useState(false);
  const [modalView, setModalView] = useState('list'); // 'list' | 'add_account'
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [modalError, setModalError] = useState('');

  const {
    login,
    loginWithSavedAccount,
    signInWithSocial,
    getSavedAccounts: fetchSaved,
    removeAccountFromDevice,
  } = useAuth();
  const navigate = useNavigate();

  // Load remembered accounts on this device
  useEffect(() => {
    if (fetchSaved) {
      setSavedAccounts(fetchSaved());
    }
  }, [fetchSaved]);

  // Click on a saved email in the Google popup: Instantly logs in without password!
  const handleSavedAccountClick = async (account) => {
    setError('');
    setModalError('');
    setIsSubmitting(true);
    try {
      await loginWithSavedAccount(account);
      setShowAccountModal(false);
      navigate(courseSlug ? `/courses/${courseSlug}` : '/dashboard');
    } catch (err) {
      const msg = err.message || 'Failed to sign in with account.';
      setError(msg);
      setModalError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveAccount = (e, targetEmail) => {
    e.stopPropagation();
    const updated = removeAccountFromDevice(targetEmail);
    setSavedAccounts(updated);
  };

  // Standard email form on page
  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    const normalized = email.trim().toLowerCase();
    const isSaved = savedAccounts.some((a) => a.email.toLowerCase() === normalized);

    setError('');
    setIsSubmitting(true);

    try {
      if (isSaved) {
        const found = savedAccounts.find((a) => a.email.toLowerCase() === normalized);
        await loginWithSavedAccount(found);
      } else {
        if (!password) {
          setError('Password is required for new sign-in.');
          setIsSubmitting(false);
          return;
        }
        await login(email, password);
      }

      navigate(courseSlug ? `/courses/${courseSlug}` : '/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Click "Continue with Google": Opens the popup modal displaying device emails!
  const handleGoogleClick = () => {
    setError('');
    setModalError('');
    setModalView('list');
    setShowAccountModal(true);
  };

  // Direct OAuth via Google / GitHub
  const handleDirectOAuth = async (provider) => {
    setError('');
    setModalError('');
    setSocialLoading(provider);
    try {
      const callbackPath = courseSlug ? `/courses/${courseSlug}` : '/dashboard';
      await signInWithSocial(provider, callbackPath);
    } catch (err) {
      setError(err.message || `Failed to sign in with ${provider}.`);
      setSocialLoading(null);
    }
  };

  // Inside Modal: User clicks "Use another email" -> asks for password
  const handleModalAddNewAccount = async (e) => {
    e.preventDefault();
    if (!newEmail || !newPassword) {
      setModalError('Both email and password are required for a new account.');
      return;
    }

    setModalError('');
    setIsSubmitting(true);
    try {
      await login(newEmail, newPassword);
      setShowAccountModal(false);
      navigate(courseSlug ? `/courses/${courseSlug}` : '/dashboard');
    } catch (err) {
      setModalError(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 relative">
      <div className="w-full max-w-md space-y-6">
        
        {/* Main Clean Card (NO extra top boxes) */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-2 border border-sky-200 dark:border-sky-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Welcome Back</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Sign in to continue your learning journey
            </p>
          </div>

          {targetCourse && (
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 flex items-center gap-3 text-left">
              <img
                src={targetCourse.thumbnail}
                alt={targetCourse.title}
                className="w-12 h-12 rounded-xl object-cover shrink-0"
              />
              <div className="space-y-0.5 truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 dark:text-sky-400">
                  Target Course
                </span>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {targetCourse.title}
                </h4>
                <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  {targetCourse.price || '₹2,499'} • {targetCourse.lessonsCount} lessons
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Social OAuth Buttons */}
          <div className="space-y-2.5">
            {/* Continue with Google button: Pops up the Google Account Chooser Modal */}
            <button
              type="button"
              onClick={handleGoogleClick}
              disabled={isSubmitting || socialLoading !== null}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-white dark:bg-[#030612] text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              <GoogleIcon className="w-4 h-4" />
              <span>Continue with Google</span>
            </button>

            <button
              type="button"
              onClick={() => handleDirectOAuth('github')}
              disabled={isSubmitting || socialLoading !== null}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold bg-[#24292e] hover:bg-[#1b1f23] text-white border border-black/20 shadow-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
            >
              {socialLoading === 'github' ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <GitHubIcon className="w-4 h-4 text-white" />
              )}
              <span>Continue with GitHub</span>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10" />
            <span className="absolute px-3 bg-white dark:bg-[#060b19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Or email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <span className="text-[10px] text-slate-400">
                  Required for new sign-in
                </span>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            {/* Submit Action */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 shadow-lg shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
            Don't have an account?{' '}
            <Link 
              to={courseSlug ? `/signup?course=${courseSlug}` : '/signup'} 
              className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Sign up
            </Link>
          </div>

        </div>

      </div>

      {/* =========================================================================
          GOOGLE ACCOUNT CHOOSER POPUP MODAL (Appears on clicking Continue with Google)
          ========================================================================= */}
      {showAccountModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setShowAccountModal(false)}
        >
          <div 
            className="w-full max-w-sm rounded-3xl bg-white dark:bg-[#070d1e] border border-slate-200 dark:border-white/10 shadow-2xl overflow-hidden p-6 space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <GoogleIcon className="w-5 h-5" />
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {modalView === 'list' ? 'Choose an account' : 'Sign in with new account'}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  to continue to <span className="font-bold text-slate-700 dark:text-slate-200">NxtLearnn</span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowAccountModal(false)}
                className="p-1 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {modalError && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 text-xs text-red-600 dark:text-red-400">
                {modalError}
              </div>
            )}

            {/* View 1: List of Emails on this Device */}
            {modalView === 'list' && (
              <div className="space-y-4">
                <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
                  {savedAccounts.length > 0 ? (
                    savedAccounts.map((acc) => (
                      <button
                        key={acc.email}
                        type="button"
                        disabled={isSubmitting}
                        onClick={() => handleSavedAccountClick(acc)}
                        className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-200/80 dark:border-white/10 hover:border-sky-500/60 bg-slate-50/50 hover:bg-sky-50/30 dark:bg-white/[0.02] dark:hover:bg-sky-500/10 transition-all text-left group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {acc.image ? (
                            <img
                              src={acc.image}
                              alt={acc.name}
                              className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-200 dark:border-white/10"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 uppercase">
                              {acc.name ? acc.name.charAt(0) : acc.email.charAt(0)}
                            </div>
                          )}
                          <div className="truncate">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {acc.name}
                            </h4>
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                              {acc.email}
                            </p>
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Ready • Instant Login
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={(e) => handleRemoveAccount(e, acc.email)}
                            title="Remove from device"
                            className="p-1 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-sky-500 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200/60 dark:border-white/10 text-center space-y-2">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        No Google accounts remembered on this device yet.
                      </p>
                    </div>
                  )}
                </div>

                {/* Option to use another account or sign in with Google OAuth */}
                <div className="pt-2 border-t border-slate-100 dark:border-white/10 space-y-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewEmail('');
                      setNewPassword('');
                      setModalError('');
                      setModalView('add_account');
                    }}
                    className="w-full py-2.5 px-3 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 border border-dashed border-slate-300 dark:border-white/10 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                  >
                    <UserPlus className="w-4 h-4 text-sky-500" />
                    <span>Use another email (Requires password)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDirectOAuth('google')}
                    className="w-full py-2 px-3 rounded-xl text-[11px] font-semibold text-slate-500 dark:text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Or open Google.com account chooser →</span>
                  </button>
                </div>
              </div>
            )}

            {/* View 2: Use another account (requires password for verification) */}
            {modalView === 'add_account' && (
              <form onSubmit={handleModalAddNewAccount} className="space-y-3.5">
                <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 text-[11px] text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <KeyRound className="w-4 h-4 shrink-0 text-amber-500" />
                  <span>Entering a different email requires a password to verify this device.</span>
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    placeholder="student@example.com"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-sky-500/50 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-xs focus:ring-2 focus:ring-sky-500/50 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setModalError('');
                      setModalView('list');
                    }}
                    className="py-2.5 px-3 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 border border-slate-200 dark:border-white/10 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 py-2.5 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-300 hover:to-indigo-500 shadow-md shadow-sky-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In & Save Device</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
