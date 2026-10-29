import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Lock, Mail, User, ArrowRight, Loader2, BookOpen } from 'lucide-react';
import { COURSES } from '../../data/coursesData';
import Button from '../../components/ui/Button';

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

export default function SignupPage() {
  const [searchParams] = useSearchParams();
  const courseSlug = searchParams.get('course');
  const targetCourse = courseSlug ? COURSES.find(c => c.slug === courseSlug) : null;

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socialLoading, setSocialLoading] = useState(null);

  const { signup, signInWithSocial } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError('');
    setIsSubmitting(true);
    try {
      await signup(fullName, email, password);
      if (courseSlug) {
        navigate(`/courses/${courseSlug}`);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setError('');
    setSocialLoading(provider);
    try {
      const callbackPath = courseSlug ? `/courses/${courseSlug}` : '/dashboard';
      await signInWithSocial(provider, callbackPath);
    } catch (err) {
      setError(err.message || `Failed to sign up with ${provider}.`);
      setSocialLoading(null);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        
        {/* Card */}
        <div className="p-8 rounded-3xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-2 border border-sky-200 dark:border-sky-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">Create Account</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Join NxtLearnn with your Neon account
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
                  Enrolling in Course
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

          {/* Social OAuth Providers (Google & GitHub) */}
          <div className="space-y-2.5">
            <Button
              type="button"
              variant="secondary"
              size="md"
              className="w-full text-center"
              onClick={() => handleSocialAuth('google')}
              disabled={isSubmitting || socialLoading !== null}
              loading={socialLoading === 'google'}
              leftIcon={<GoogleIcon className="w-4 h-4" />}
            >
              Sign up with Google
            </Button>

            <Button
              type="button"
              variant="glass"
              size="md"
              className="w-full text-center"
              onClick={() => handleSocialAuth('github')}
              disabled={isSubmitting || socialLoading !== null}
              loading={socialLoading === 'github'}
              leftIcon={<GitHubIcon className="w-4 h-4" />}
            >
              Sign up with GitHub
            </Button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-slate-200 dark:border-white/10" />
            <span className="absolute px-3 bg-white dark:bg-[#060b19] text-[11px] font-semibold text-slate-400 uppercase tracking-wider font-mono">
              Or email
            </span>
          </div>

          {/* Email / Password Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Kishore Kumar"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

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
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  disabled={isSubmitting}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-slate-900 dark:text-white placeholder-slate-400 disabled:opacity-50 transition-colors"
                />
              </div>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={isSubmitting}
              className="w-full text-center"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Create Account
            </Button>
          </form>

          {/* Footer Link */}
          <div className="text-center text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-white/5">
            Already have an account?{' '}
            <Link 
              to={courseSlug ? `/login?course=${courseSlug}` : '/login'} 
              className="font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              Log in
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}
