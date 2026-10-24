import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Sun, Moon, Star, CheckCircle, Quote } from 'lucide-react';

// --- Comprehensive Developer & Founder Testimonials ---
export const testimonials = [
  {
    text: "NxtLearnn completely redefined how I master engineering systems. The async FastAPI & React curriculum took our startup's video processing pipeline from a laggy prototype to sub-30ms production latency.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Briana Patton",
    handle: "@brianapatton_dev",
    role: "Senior Full-Stack Engineer",
    company: "Series A FinTech",
    rating: 5,
    tag: "React + FastAPI",
  },
  {
    text: "The adaptive HLS streaming architecture and zero-fluff code walk-throughs make this the highest-signal learning platform I've encountered. No toy 'to-do apps' — actual concurrent systems.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    name: "Bilal Ahmed",
    handle: "@bahmed_py",
    role: "Backend Architect",
    company: "Distributed Systems Lab",
    rating: 5,
    tag: "PostgreSQL & Async",
  },
  {
    text: "The database connection pooling chapter alone saved our engineering team weeks of trial and error with asyncpg on Neon. The return on investment for the Lifetime Pass was immediate.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    name: "Saman Malik",
    handle: "@saman_cloud",
    role: "DevOps & Cloud Lead",
    company: "CloudScale Infra",
    rating: 5,
    tag: "Neon Serverless",
  },
  {
    text: "Getting the Lifetime Pass was the easiest decision our team made this quarter. The depth of instruction, real production patterns, and continuous curriculum updates are unmatched.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    name: "Omar Raza",
    handle: "@omar_builds",
    role: "Founder & CTO",
    company: "ScaleFlow Labs",
    rating: 5,
    tag: "Lifetime Member",
  },
  {
    text: "No fluff, no beginner syntax filler. Just straight-to-the-point production architecture, HMAC webhook security, and clean decoupled services that you can drop directly into production.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    name: "Zainab Hussain",
    handle: "@zhussain_eng",
    role: "Engineering Director",
    company: "Enterprise SaaS",
    rating: 5,
    tag: "Architecture",
  },
  {
    text: "The video player UX with automatic timestamp resume, variable playback speed, and instant HLS resolution switching makes learning after work hours a genuine joy.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    name: "Aliza Khan",
    handle: "@alizak_ui",
    role: "Staff Frontend Engineer",
    company: "Modern Web Studio",
    rating: 5,
    tag: "Frontend UX",
  },
  {
    text: "I built and deployed our company's video transcoding pipeline in 3 days using the exact patterns taught here. Worth 10x the price of admission.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    name: "Farhan Siddiqui",
    handle: "@farhansid_tech",
    role: "Principal Systems Architect",
    company: "StreamMedia Corp",
    rating: 5,
    tag: "HLS Video",
  },
  {
    text: "Transparent pricing with no dark patterns or subscription traps. I bought a single course first, was blown away by the clarity, and upgraded to Lifetime the following weekend.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    name: "Sana Sheikh",
    handle: "@sana_cloudarch",
    role: "Solutions Architect",
    company: "Cloud Vanguard",
    rating: 5,
    tag: "Single Course",
  },
  {
    text: "The focus on modern tooling (FastAPI, React, Neon PostgreSQL, Polar) directly mirrors what top-tier engineering organizations are actively deploying in 2026.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    name: "Hassan Ali",
    handle: "@hassan_fastapi",
    role: "Tech Lead",
    company: "NextGen AI",
    rating: 5,
    tag: "Production Stack",
  },
  {
    text: "The code repositories provided with each module are clean, modular, and ready for containerization. Saved me at least 40 hours of boilerplate setup.",
    image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    name: "Marcus Vance",
    handle: "@marcus_dev",
    role: "Full-Stack Consultant",
    company: "Vance Tech Labs",
    rating: 5,
    tag: "Docker & CI/CD",
  },
  {
    text: "Finally, a course platform designed by engineers for engineers. The dark celestial aesthetic and distraction-free classroom player are in a league of their own.",
    image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&auto=format&fit=crop&q=80",
    name: "Elena Rostova",
    handle: "@elena_platform",
    role: "Senior Platform Engineer",
    company: "EuroTech Global",
    rating: 5,
    tag: "Platform Eng",
  },
  {
    text: "The instructor's explanations of async database transactions and race conditions in payments saved us from a critical billing bug before launch.",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    name: "Priya Sharma",
    handle: "@priya_systems",
    role: "Microservices Specialist",
    company: "ScaleWave",
    rating: 5,
    tag: "Polar Webhooks",
  },
];

const firstColumn = testimonials.slice(0, 4);
const secondColumn = testimonials.slice(4, 8);
const thirdColumn = testimonials.slice(8, 12);

// --- Sub-Components ---
export const TestimonialsColumn = ({ className = '', testimonials: columnTestimonials, duration = 12 }) => {
  return (
    <div className={className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: duration || 12,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {columnTestimonials.map(({ text, image, name, handle, role, company, rating, tag }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{ 
                    scale: 1.02,
                    y: -6,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.6), 0 0 30px rgba(56, 189, 248, 0.15)",
                    transition: { type: "spring", stiffness: 400, damping: 20 }
                  }}
                  className="p-7 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl shadow-slate-200/50 dark:shadow-black/20 max-w-sm w-full bg-white dark:bg-[#080e1c]/80 backdrop-blur-xl transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-sky-500/40 relative overflow-hidden" 
                >
                  {/* Subtle top card glow on hover */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-sky-400/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Rating Stars & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-amber-400">
                      {[...Array(rating)].map((_, r) => (
                        <Star key={r} className="w-3.5 h-3.5 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-sky-50 dark:bg-white/5 border border-sky-200 dark:border-white/10 text-sky-700 dark:text-sky-300 font-medium">
                      {tag}
                    </span>
                  </div>

                  <blockquote className="m-0 p-0">
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed font-normal m-0 transition-colors duration-300">
                      "{text}"
                    </p>

                    <footer className="flex items-center gap-3.5 mt-6 pt-4 border-t border-slate-100 dark:border-white/5">
                      <img
                        width={44}
                        height={44}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-11 w-11 rounded-full object-cover ring-2 ring-slate-200 dark:ring-white/15 group-hover:ring-sky-400/50 transition-all duration-300 ease-in-out shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <cite className="font-semibold not-italic tracking-tight leading-5 text-slate-900 dark:text-white text-sm truncate flex items-center gap-1.5">
                          {name}
                          <CheckCircle className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
                        </cite>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                          {role} • <span className="text-slate-400 dark:text-slate-500">{company}</span>
                        </span>
                      </div>
                    </footer>
                  </blockquote>
                </motion.li>
              ))}
            </React.Fragment>
          )),
        ]}
      </motion.ul>
    </div>
  );
};

export const TestimonialsSection = () => {
  return (
    <section 
      aria-labelledby="testimonials-heading"
      className="bg-transparent py-28 relative overflow-hidden"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-sky-500/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      <div className="container px-4 z-10 mx-auto">
        <div className="flex flex-col items-center justify-center max-w-[640px] mx-auto mb-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 border border-sky-300 dark:border-sky-400/30 py-1.5 px-4 rounded-full text-xs font-semibold tracking-wide uppercase text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-500/10 backdrop-blur-md shadow-sm dark:shadow-[0_0_20px_rgba(56,189,248,0.2)]">
            <span>✦ Peer Reviews</span>
          </div>

          <h2 id="testimonials-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight">
            Trusted by engineers shipping real systems
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-lg">
            See how senior developers, founders, and architects build production-ready software with NxtLearnn.
          </p>

          {/* Social Proof Metric Counters */}
          <div className="pt-2 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
            <div className="flex items-center gap-1.5">
              <span className="text-sky-600 dark:text-sky-400 font-bold text-sm">4.9 / 5.0</span>
              <span className="text-slate-500 dark:text-slate-400">Average Student Rating</span>
            </div>
            <span className="text-slate-400 dark:text-slate-600">•</span>
            <div className="flex items-center gap-1.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-bold text-sm">98.2%</span>
              <span className="text-slate-500 dark:text-slate-400">Course Completion Satisfaction</span>
            </div>
          </div>
        </div>

        {/* 3-Column Smooth Infinite Loop Marquee */}
        <div 
          className="flex justify-center gap-6 mt-8 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[760px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={18} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={24} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={20} />
        </div>
      </div>
    </section>
  );
};

export default function TestimonialV2() {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <div className="w-full min-h-screen bg-[#02050e] text-slate-100 transition-colors duration-300 flex flex-col justify-center relative selection:bg-sky-500 selection:text-white">
      <button 
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-[#121824] text-neutral-100 border border-neutral-800 shadow-xl hover:scale-110 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-sky-500/50 cursor-pointer"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <TestimonialsSection />
    </div>
  );
}
