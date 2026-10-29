import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const variants = {
  primary:
    'bg-indigo-600 hover:bg-indigo-500 text-white font-semibold border border-indigo-500/40 shadow-[0_1px_2px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.18)] hover:shadow-[0_6px_20px_rgba(99,102,241,0.35),inset_0_1px_0_rgba(255,255,255,0.25)]',
  secondary:
    'bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white border border-white/[0.1] hover:border-white/[0.2] shadow-[0_1px_2px_rgba(0,0,0,0.2)]',
  glass:
    'bg-slate-900/60 hover:bg-slate-800/80 text-slate-200 hover:text-white border border-slate-700/60 hover:border-indigo-500/30 backdrop-blur-md shadow-sm',
  ghost:
    'text-slate-400 hover:text-white hover:bg-white/[0.06]',
  danger:
    'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 hover:border-rose-500/50 shadow-[0_1px_2px_rgba(0,0,0,0.3)]',
  outline:
    'bg-transparent hover:bg-white/[0.05] text-slate-300 hover:text-white border border-slate-700/80 hover:border-slate-600',
};

const sizes = {
  sm: 'text-xs px-3 py-1.5 rounded-lg gap-1.5',
  md: 'text-xs sm:text-sm px-4 py-2 rounded-xl gap-2',
  lg: 'text-sm sm:text-base px-6 py-3 rounded-xl gap-2.5',
  icon: 'p-2 rounded-xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  to,
  href,
  onClick,
  type = 'button',
  ...props
}) {
  const baseClasses = `inline-flex items-center justify-center font-medium transition-colors select-none cursor-pointer disabled:opacity-50 disabled:pointer-events-none ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`;

  const content = (
    <>
      {loading ? (
        <svg
          className="animate-spin -ml-0.5 mr-2 h-3.5 w-3.5 text-current shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      ) : leftIcon ? (
        <span className="shrink-0">{leftIcon}</span>
      ) : null}
      {children}
      {!loading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </>
  );

  const motionProps = {
    whileHover: disabled || loading ? {} : { y: -1 },
    whileTap: disabled || loading ? {} : { scale: 0.98, y: 0 },
    transition: { duration: 0.15, ease: 'easeOut' },
  };

  if (to) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <Link to={to} className={baseClasses} onClick={onClick} {...props}>
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.div {...motionProps} className="inline-block">
        <a href={href} className={baseClasses} onClick={onClick} {...props}>
          {content}
        </a>
      </motion.div>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={baseClasses}
      {...motionProps}
      {...props}
    >
      {content}
    </motion.button>
  );
}

