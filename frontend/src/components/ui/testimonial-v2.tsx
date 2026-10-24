import React, { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { Sun, Moon } from 'lucide-react';

// --- Types ---
export interface Testimonial {
  text: string;
  image: string;
  name: string;
  role: string;
}

// --- Data with Verified Unsplash Stock Images ---
export const testimonials: Testimonial[] = [
  {
    text: "NxtLearnn completely redefined how I master engineering systems. The async FastAPI & React curriculum took our startup from prototype to production.",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    name: "Briana Patton",
    role: "Senior Full-Stack Engineer",
  },
  {
    text: "The adaptive HLS streaming and zero-fluff code walk-throughs make this the highest-signal learning platform I've encountered in years.",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    name: "Bilal Ahmed",
    role: "Backend Architect",
  },
  {
    text: "The direct instructor access and comprehensive architecture diagrams saved our team weeks of trial and error on database connection pooling.",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    name: "Saman Malik",
    role: "DevOps & Cloud Lead",
  },
  {
    text: "Getting the Lifetime Pass was the easiest investment decision. The quality of depth and real production patterns are simply unmatched.",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    name: "Omar Raza",
    role: "Founder & CTO",
  },
  {
    text: "No fluff, no beginner syntax tutorials. Just straight-to-the-point production architecture and scalable patterns that work immediately.",
    image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
    name: "Zainab Hussain",
    role: "Software Engineering Manager",
  },
  {
    text: "Watching the lessons with automatic timestamp resume and seamless speed controls makes learning after work hours a genuine joy.",
    image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    name: "Aliza Khan",
    role: "Frontend Specialist",
  },
  {
    text: "I built and deployed our company's video pipeline in 3 days using the patterns taught here. Worth 10x the price of admission.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    name: "Farhan Siddiqui",
    role: "Staff Engineer",
  },
  {
    text: "Transparent pricing with no subscription traps. I purchased a single course, loved the depth, and immediately upgraded to Lifetime.",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    name: "Sana Sheikh",
    role: "Solutions Architect",
  },
  {
    text: "The focus on modern tooling (FastAPI, React, Neon PostgreSQL) directly mirrors what top tech companies are actually hiring for.",
    image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    name: "Hassan Ali",
    role: "Tech Lead",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

// --- Sub-Components ---
export const TestimonialsColumn = (props: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) => {
  return (
    <div className={props.className}>
      <motion.ul
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration || 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-6 pb-6 bg-transparent transition-colors duration-300 list-none m-0 p-0"
      >
        {[
          ...new Array(2).fill(0).map((_, index) => (
            <React.Fragment key={index}>
              {props.testimonials.map(({ text, image, name, role }, i) => (
                <motion.li 
                  key={`${index}-${i}`}
                  aria-hidden={index === 1 ? "true" : "false"}
                  tabIndex={index === 1 ? -1 : 0}
                  whileHover={{ 
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(99, 102, 241, 0.15)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  whileFocus={{ 
                    scale: 1.03,
                    y: -8,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), 0 0 25px rgba(99, 102, 241, 0.15)",
                    transition: { type: "spring", stiffness: 400, damping: 17 }
                  }}
                  className="p-8 rounded-3xl border border-neutral-200 dark:border-white/10 shadow-lg shadow-black/10 max-w-xs w-full bg-white dark:bg-[#0c1220]/80 backdrop-blur-xl transition-all duration-300 cursor-default select-none group focus:outline-none focus:ring-2 focus:ring-brand-500/30" 
                >
                  <blockquote className="m-0 p-0">
                    <p className="text-neutral-600 dark:text-slate-300 text-sm leading-relaxed font-normal m-0 transition-colors duration-300">
                      "{text}"
                    </p>
                    <footer className="flex items-center gap-3 mt-6">
                      <img
                        width={40}
                        height={40}
                        src={image}
                        alt={`Avatar of ${name}`}
                        className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-white/15 group-hover:ring-brand-500/50 transition-all duration-300 ease-in-out"
                      />
                      <div className="flex flex-col">
                        <cite className="font-semibold not-italic tracking-tight leading-5 text-neutral-900 dark:text-white transition-colors duration-300 text-sm">
                          {name}
                        </cite>
                        <span className="text-xs leading-5 tracking-tight text-neutral-500 dark:text-slate-400 mt-0.5 transition-colors duration-300">
                          {role}
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
      className="bg-transparent py-24 relative overflow-hidden"
    >
      <motion.div 
        initial={{ opacity: 0, y: 50, rotate: -1 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, amount: 0.15 }}
        transition={{ 
          duration: 1.2, 
          ease: [0.16, 1, 0.3, 1],
          opacity: { duration: 0.8 }
        }}
        className="container px-4 z-10 mx-auto"
      >
        <div className="flex flex-col items-center justify-center max-w-[560px] mx-auto mb-16 text-center">
          <div className="flex justify-center">
            <div className="border border-brand-500/30 dark:border-white/15 py-1 px-4 rounded-full text-xs font-semibold tracking-wide uppercase text-brand-600 dark:text-brand-300 bg-brand-500/10 dark:bg-white/5 backdrop-blur-md transition-colors">
              ✦ Student Experiences
            </div>
          </div>

          <h2 id="testimonials-heading" className="text-3xl sm:text-5xl font-extrabold tracking-tight mt-6 text-center text-neutral-900 dark:text-white transition-colors">
            Loved by ambitious engineers
          </h2>
          <p className="text-center mt-4 text-neutral-500 dark:text-slate-400 text-base sm:text-lg leading-relaxed max-w-md transition-colors">
            Discover how developers and founders level up their production engineering skills with NxtLearnn.
          </p>
        </div>

        <div 
          className="flex justify-center gap-6 mt-10 [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] max-h-[720px] overflow-hidden"
          role="region"
          aria-label="Scrolling Testimonials"
        >
          <TestimonialsColumn testimonials={firstColumn} duration={16} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={20} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={18} />
        </div>
      </motion.div>
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
    <div className="w-full min-h-screen bg-white dark:bg-[#030712] transition-colors duration-300 flex flex-col justify-center relative selection:bg-brand-500 selection:text-white">
      <button 
        onClick={() => setIsDark(!isDark)}
        className="fixed top-6 right-6 z-50 p-3 rounded-full bg-white dark:bg-[#121824] text-neutral-800 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-800 shadow-xl hover:scale-110 transition-all active:scale-95 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
        aria-label="Toggle Dark Mode"
      >
        {isDark ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <TestimonialsSection />
    </div>
  );
}
