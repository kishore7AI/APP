import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/10 bg-white dark:bg-[#030712] py-14 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-50 dark:bg-white/10 border border-sky-200 dark:border-white/20 flex items-center justify-center text-sky-600 dark:text-sky-300 shadow-sm dark:shadow-[0_0_15px_rgba(56,189,248,0.3)]">
                <Sparkles className="w-4 h-4 fill-sky-500 text-sky-500 dark:fill-sky-400 dark:text-sky-400" />
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-wider">NxtLearnn</span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering self-paced engineers with premium, high-impact video courses. Built for deep mastery with zero distractions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/courses" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  All Courses
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  Pricing & Plans
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-sky-500 dark:hover:text-sky-400 transition-colors cursor-pointer">
                  Student Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform Rules & Legal */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-900 dark:text-slate-300 mb-4">
              Platform
            </h4>
            <ul className="space-y-2.5 text-sm text-slate-500 dark:text-slate-400">
              <li><span className="text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-400 cursor-pointer">Terms of Service</span></li>
              <li><span className="text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-400 cursor-pointer">Privacy Policy</span></li>
              <li><span className="text-slate-600 hover:text-slate-900 dark:text-slate-500 dark:hover:text-slate-400 cursor-pointer">7-Day Refund Policy</span></li>
            </ul>
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} NxtLearnn. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for world-class builders
          </p>
        </div>
      </div>
    </footer>
  );
}
