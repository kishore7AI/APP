import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, ArrowRight, Play, CheckCircle2, ShieldCheck, 
  Terminal, Layers, Code, Zap, Video, Star, Compass,
  Database, Server, Lock, Cpu, Clock, BookOpen, ChevronDown,
  ExternalLink, FileCode, Users, Award, HelpCircle, Volume2,
  Maximize2, Check, ChevronRight, Folder, Search
} from 'lucide-react';
import { TestimonialsSection } from '../../components/ui/testimonial-v2';
import Button from '../../components/ui/Button';

export default function LandingPage() {
  const [activeLessonId, setActiveLessonId] = useState(7);
  const [completedLessons, setCompletedLessons] = useState(new Set([1, 2, 3, 4, 5, 6]));
  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const curriculum = [
    {
      section: 'Getting Started',
      total: 4,
      lessons: [
        { id: 1, title: 'Course introduction', duration: '03:24' },
        { id: 2, title: 'Setting up your environment', duration: '08:12' },
        { id: 3, title: 'Next.js fundamentals', duration: '12:45' },
        { id: 4, title: 'Project structure', duration: '07:18' },
      ],
    },
    {
      section: 'Building the App',
      total: 10,
      lessons: [
        { id: 5, title: 'Database setup', duration: '11:02' },
        { id: 6, title: 'Creating the data models', duration: '11:23' },
        { id: 7, title: 'Setting up authentication', duration: '32:10' },
        { id: 8, title: 'Building the UI', duration: '18:45' },
        { id: 9, title: 'API routes', duration: '14:32' },
        { id: 10, title: 'Server actions', duration: '16:21' },
        { id: 11, title: 'Deploying to Vercel', duration: '09:15' },
        { id: 12, title: 'Final touches', duration: '17:16' },
      ],
    },
  ];

  const totalLessonsCount = 14;
  const completedCount = completedLessons.size;
  const progressPercent = Math.round((completedCount / totalLessonsCount) * 100);

  const toggleComplete = (id) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  let currentLesson = {
    title: 'Setting up authentication',
    duration: '32:10',
    desc: "In this lesson, we'll set up NextAuth.js to handle user authentication in our application. You'll learn how to configure providers, create auth options, and protect your routes.",
  };

  for (const group of curriculum) {
    const found = group.lessons.find(l => l.id === activeLessonId);
    if (found) {
      currentLesson = {
        ...found,
        desc: "In this lesson, we'll set up NextAuth.js to handle user authentication in our application. You'll learn how to configure providers, create auth options, and protect your routes.",
      };
      break;
    }
  }

  const nextLessonId = activeLessonId < 12 ? activeLessonId + 1 : 1;
  const nextLessonObj = curriculum[1].lessons.find(l => l.id === 8) || curriculum[1].lessons[3];

  const techStack = [
    { name: 'Python 3.11', icon: Terminal, color: 'text-amber-400' },
    { name: 'FastAPI', icon: Zap, color: 'text-emerald-400' },
    { name: 'React + Vite', icon: Code, color: 'text-sky-400' },
    { name: 'Neon Postgres', icon: Database, color: 'text-cyan-400' },
    { name: 'ImageKit HLS', icon: Video, color: 'text-rose-400' },
    { name: 'Polar Payments', icon: Lock, color: 'text-indigo-400' },
    { name: 'Docker Compose', icon: Server, color: 'text-blue-400' },
  ];

  const featuredCourses = [
    {
      id: 1,
      title: 'Full-Stack Fast & Furious: React + FastAPI Production Mastery',
      slug: 'react-fastapi-production-mastery',
      desc: 'Build enterprise-grade web applications with React, Vite, and Python FastAPI with async PostgreSQL.',
      lessons: 42,
      duration: '14.5 hours',
      price: '₹2,499',
      level: 'Intermediate - Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
      badge: 'Bestseller',
      tags: ['FastAPI', 'React', 'PostgreSQL'],
    },
    {
      id: 2,
      title: 'High-Concurrency Microservices & Event Architecture with Python',
      slug: 'system-design-microservices-python',
      desc: 'Architect distributed systems capable of handling 100k+ requests/sec using async Python, Redis & Kafka.',
      lessons: 36,
      duration: '12.0 hours',
      price: '₹2,999',
      level: 'Advanced',
      thumbnail: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
      badge: 'Architecture',
      tags: ['Microservices', 'Redis', 'Kafka'],
    },
    {
      id: 3,
      title: 'Modern Frontend Engineering: State Machines & Performance',
      slug: 'modern-frontend-engineering-react-tailwind',
      desc: 'Craft stunning, ultra-fast web user interfaces with React, modern state synchronization, and Tailwind.',
      lessons: 28,
      duration: '9.2 hours',
      price: '₹1,999',
      level: 'All Levels',
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop&q=80',
      badge: 'Frontend',
      tags: ['React 18', 'Tailwind', 'UX'],
    },
  ];

  const faqs = [
    {
      q: 'How does access to the courses work?',
      a: 'When you purchase a single course or the Lifetime Pass, access is instantly provisioned to your account forever. If you choose the Monthly Membership, you have full unlimited access to all courses as long as your subscription is active, and you can cancel anytime in one click.',
    },
    {
      q: 'Can I download the source code and production templates?',
      a: 'Yes! Every lesson includes downloadable starter repositories, finished production branches, docker-compose configurations, and deployment configs that you can freely use in your personal and commercial projects.',
    },
    {
      q: 'How does the ImageKit adaptive video streaming work?',
      a: 'All lessons are streamed using signed HLS (HTTP Live Streaming) tokens generated securely by our FastAPI backend. The video player automatically adapts resolution between 1080p, 720p, and 480p based on your internet connection.',
    },
    {
      q: 'What is your refund policy?',
      a: 'We offer an unconditional 7-day money-back guarantee. If you are not completely satisfied with the course depth, email us and we will issue a 100% refund with zero questions asked.',
    },
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#02050e] text-slate-900 dark:text-slate-100 overflow-x-hidden selection:bg-sky-500 selection:text-white transition-colors duration-200">
      
      {/* =========================================================================
          CELESTIAL ROTATING GLOBE BACKDROP (1080p video loop)
         ========================================================================= */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1920px] h-[980px] pointer-events-none select-none overflow-hidden z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="/videos/hero-globe-poster.webp"
          className="w-full h-full object-cover object-top opacity-75 dark:opacity-100 mix-blend-multiply dark:mix-blend-normal transition-opacity duration-1000"
        >
          <source src="/videos/hero-globe.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-gradient-to-b from-slate-50/90 via-slate-50/50 to-slate-50 dark:from-[#02050e]/40 dark:via-transparent dark:to-[#02050e] pointer-events-none" />
        <div className="absolute inset-0 bg-radial-[circle_at_center_top] from-transparent via-transparent to-slate-50 dark:to-[#02050e]/95 pointer-events-none" />
      </div>

      {/* =========================================================================
          HERO CONTENT SECTION
         ========================================================================= */}
      <section className="relative z-10 pt-20 md:pt-28 pb-16 px-4 max-w-7xl mx-auto text-center space-y-7">
        
        {/* Centered Celestial Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 dark:bg-[#070e20]/90 border border-sky-300 dark:border-sky-400/40 backdrop-blur-xl shadow-sm dark:shadow-[0_0_25px_rgba(56,189,248,0.3)] text-xs font-semibold text-sky-700 dark:text-sky-200">
          <Sparkles className="w-3.5 h-3.5 text-sky-500 fill-sky-500 dark:text-sky-400 dark:fill-sky-400" />
          <span>Early Access 2026 Cohort</span>
        </div>

        {/* Main Hero Title */}
        <div className="space-y-3">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.12]">
            Build Faster With <br />
            <span className="bg-gradient-to-r from-sky-600 via-indigo-600 to-violet-700 dark:from-[#e0f2fe] dark:via-[#93c5fd] dark:to-[#c7d2fe] bg-clip-text text-transparent dark:drop-shadow-[0_0_45px_rgba(147,197,253,0.45)]">
              Production Mastery
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-400 font-normal leading-relaxed pt-1">
            A high-signal, zero-fluff engineering platform that transforms complex distributed systems into clear, production-grade mastery — helping you ship real software faster.
          </p>
        </div>

        {/* Dual Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-1">
          <Button
            to="/courses"
            variant="primary"
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-bold shadow-xl"
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Browse Courses
          </Button>

          <Button
            to="/pricing"
            variant="secondary"
            size="lg"
            className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-semibold"
          >
            View Pricing
          </Button>
        </div>

        {/* Developer Avatars & 5-Star Social Proof (Added below the buttons) */}
        <div className="flex items-center justify-center gap-3 pt-1 pb-4 select-none">
          <div className="flex -space-x-2.5 overflow-hidden">
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#02050e] object-cover"
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
              alt="Developer avatar"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#02050e] object-cover"
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Developer avatar"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#02050e] object-cover"
              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
              alt="Developer avatar"
            />
            <img
              className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-[#02050e] object-cover"
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              alt="Developer avatar"
            />
          </div>

          <div className="flex flex-col items-start leading-tight">
            <div className="flex items-center gap-0.5 text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              Loved by developers who ship
            </span>
          </div>
        </div>

        {/* =========================================================================
            EXACT 3-COLUMN CLASSROOM MOCKUP CARD (Replaces previous preview box)
           ========================================================================= */}
        <div className="w-full max-w-[1180px] mx-auto rounded-2xl bg-white/90 dark:bg-[#060b19]/95 border border-slate-200 dark:border-sky-500/25 shadow-2xl dark:shadow-[0_0_90px_rgba(30,58,138,0.45)] backdrop-blur-2xl overflow-hidden text-left transition-all">
          
          {/* Card Top Header Bar */}
          <div className="px-5 py-3.5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between gap-4 bg-slate-100/70 dark:bg-[#080e22]/90">
            {/* Left: Sparkle & Breadcrumbs */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/15 border border-sky-300 dark:border-sky-400/30 flex items-center justify-center text-sky-600 dark:text-sky-400 shadow-sm">
                <Sparkles className="w-4 h-4 fill-sky-500 dark:fill-sky-400" />
              </div>
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
                <Link to="/courses" className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer">Courses</Link>
                <span>/</span>
                <span className="text-slate-700 dark:text-slate-300">Full-Stack Next.js</span>
                <span>/</span>
                <span className="text-slate-900 dark:text-white font-semibold">Lesson {activeLessonId}</span>
              </div>
            </div>

            {/* Right: Search & User Avatar */}
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search lessons, topics, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-64 lg:w-72 pl-8 pr-3 py-1.5 rounded-full bg-white dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
                />
              </div>
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-sky-400 to-indigo-600 text-white text-[11px] font-bold flex items-center justify-center ring-1 ring-white/20">
                JD
              </div>
            </div>
          </div>

          {/* Card 3-Column Body */}
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
            
            {/* -------------------------------------------------------------
                LEFT COLUMN: Module Curriculum Navigation
               ------------------------------------------------------------- */}
            <div className="lg:col-span-3 border-r border-slate-200 dark:border-white/10 p-4 space-y-5 bg-slate-50/50 dark:bg-[#040815]/80 overflow-y-auto max-h-[640px]">
              
              {/* Course Header */}
              <div className="border-b border-slate-200 dark:border-white/10 pb-4">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">Full-Stack Next.js</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 leading-snug">
                  Build a modern web app with Next.js, Prisma, and PostgreSQL
                </p>
              </div>

              {/* Course Groups */}
              {curriculum.map((group, gIdx) => {
                const groupCompleted = group.lessons.filter(l => completedLessons.has(l.id)).length;
                return (
                  <div key={gIdx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 px-1">
                      <span>{group.section}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {groupCompleted}/{group.total}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {group.lessons.map((lesson) => {
                        const isDone = completedLessons.has(lesson.id);
                        const isActive = activeLessonId === lesson.id;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => setActiveLessonId(lesson.id)}
                            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                              isActive
                                ? 'bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-400/40 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-2 truncate pr-2">
                              {isDone ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400 shrink-0" />
                              ) : (
                                <div className="w-3.5 h-3.5 rounded-full border border-slate-300 dark:border-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{lesson.id}. {lesson.title}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono shrink-0">
                              {lesson.duration}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* -------------------------------------------------------------
                CENTER COLUMN: Video Player & Lesson Content
               ------------------------------------------------------------- */}
            <div className="lg:col-span-6 p-4 sm:p-5 space-y-4 bg-white/40 dark:bg-[#060b1a]/40 overflow-y-auto max-h-[640px]">
              
              {/* VS Code Classroom Video Simulation Player */}
              <div className="relative rounded-xl border border-slate-300 dark:border-white/15 bg-slate-950 dark:bg-[#030612] overflow-hidden shadow-2xl group">
                
                {/* macOS Window Title Bar */}
                <div className="px-3.5 py-2 bg-slate-900 dark:bg-[#080d1e] border-b border-slate-800 dark:border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f56]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                    <FileCode className="w-3 h-3 text-sky-400" />
                    <span>auth.ts — fullstack-nextjs</span>
                  </div>
                  <div className="w-10" />
                </div>

                {/* Editor Split View Layout */}
                <div className="grid grid-cols-12 min-h-[260px] text-[11px] font-mono select-none">
                  
                  {/* Mini VS Code Explorer Sidebar */}
                  <div className="col-span-4 border-r border-slate-850 dark:border-white/10 bg-slate-900/90 dark:bg-[#040815] p-2.5 space-y-2 text-slate-400">
                    <div className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
                      Explorer
                    </div>
                    <div className="space-y-1 pl-1">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Folder className="w-3 h-3 text-sky-400" />
                        <span>fullstack-nextjs</span>
                      </div>
                      <div className="pl-3 space-y-1">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Folder className="w-3 h-3 text-indigo-400" />
                          <span>src</span>
                        </div>
                        <div className="pl-3 space-y-1">
                          <div className="flex items-center gap-1 text-slate-500">
                            <Folder className="w-3 h-3 text-slate-500" />
                            <span>components</span>
                          </div>
                          <div className="flex items-center gap-1 text-sky-300 bg-sky-500/15 px-1 py-0.5 rounded">
                            <FileCode className="w-3 h-3 text-sky-400" />
                            <span>auth.ts</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-slate-500">
                          <Folder className="w-3 h-3 text-slate-500" />
                          <span>prisma</span>
                        </div>
                        <div className="pl-3 text-slate-500">
                          <span>schema.prisma</span>
                        </div>
                        <div className="text-slate-500">package.json</div>
                      </div>
                    </div>
                  </div>

                  {/* Code Editor Window */}
                  <div className="col-span-8 p-3 bg-slate-950 dark:bg-[#02050e] relative overflow-hidden text-[10.5px] leading-relaxed">
                    <div className="flex items-center gap-2 border-b border-white/5 pb-1 mb-2 text-slate-500">
                      <span className="text-sky-300 bg-white/5 px-2 py-0.5 rounded">auth.ts</span>
                      <span>lib &gt; auth.ts &gt; getSession</span>
                    </div>

                    <div className="space-y-0.5 text-slate-300">
                      <div><span className="text-purple-400">import</span> &#123; getServerSession &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">"next-auth"</span>;</div>
                      <div><span className="text-purple-400">import</span> &#123; authOptions &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">"@/lib/auth/options"</span>;</div>
                      <div><span className="text-purple-400">import type</span> &#123; Session &#125; <span className="text-purple-400">from</span> <span className="text-emerald-400">"next-auth"</span>;</div>
                      <div className="h-1" />
                      <div><span className="text-sky-400 font-semibold">export async function</span> <span className="text-yellow-300">getSession</span>(): <span className="text-emerald-300">Promise</span>&lt;Session | null&gt; &#123;</div>
                      <div className="pl-3"><span className="text-purple-400">return await</span> <span className="text-yellow-300">getServerSession</span>(authOptions);</div>
                      <div>&#125;</div>
                      <div className="h-1" />
                      <div><span className="text-sky-400 font-semibold">export async function</span> <span className="text-yellow-300">requireAuth</span>() &#123;</div>
                      <div className="pl-3"><span className="text-sky-400">const</span> session = <span className="text-purple-400">await</span> <span className="text-yellow-300">getSession</span>();</div>
                      <div className="pl-3"><span className="text-purple-400">if</span> (!session) &#123;</div>
                      <div className="pl-6"><span className="text-purple-400">throw new</span> <span className="text-emerald-300">Error</span>(<span className="text-emerald-400">"Not authenticated"</span>);</div>
                      <div className="pl-3">&#125;</div>
                      <div className="pl-3"><span className="text-purple-400">return</span> session;</div>
                      <div>&#125;</div>
                    </div>

                    {/* Centered Large Play Button Overlay */}
                    <div 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] hover:bg-black/20 transition-all cursor-pointer"
                    >
                      <div className="w-12 h-12 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-lg shadow-sky-500/50 transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Video Controls Bar */}
                <div className="px-3.5 py-2 bg-slate-900 dark:bg-[#080d1e] border-t border-slate-800 dark:border-white/10 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="hover:text-white transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                    </button>
                    <span className="text-[11px] font-mono text-slate-400">14:32 / 32:10</span>
                  </div>

                  {/* Scrubber Bar */}
                  <div className="flex-1 mx-4 h-1.5 rounded-full bg-white/10 overflow-hidden relative cursor-pointer">
                    <div className="absolute top-0 left-0 bottom-0 w-[45%] bg-sky-400 rounded-full" />
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Volume2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                    <Maximize2 className="w-3.5 h-3.5 hover:text-white cursor-pointer" />
                  </div>
                </div>

              </div>

              {/* Lesson Metadata & Control Actions */}
              <div className="space-y-3">
                <div className="space-y-1">
                  <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
                    {currentLesson.title}
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {currentLesson.desc}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2.5 pt-1">
                  <Button
                    onClick={() => toggleComplete(activeLessonId)}
                    variant={completedLessons.has(activeLessonId) ? 'secondary' : 'primary'}
                    size="sm"
                    leftIcon={<Check className="w-3.5 h-3.5" />}
                  >
                    {completedLessons.has(activeLessonId) ? 'Completed' : 'Mark complete'}
                  </Button>

                  <Button
                    onClick={() => setActiveLessonId(nextLessonId)}
                    variant="glass"
                    size="sm"
                    rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
                  >
                    Next lesson
                  </Button>
                </div>

                {/* Tabs: Overview & Resources */}
                <div className="pt-2">
                  <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 text-xs">
                    <button
                      onClick={() => setActiveTab('overview')}
                      className={`pb-2 font-semibold transition-colors cursor-pointer ${
                        activeTab === 'overview'
                          ? 'border-b-2 border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Overview
                    </button>
                    <button
                      onClick={() => setActiveTab('resources')}
                      className={`pb-2 font-semibold transition-colors cursor-pointer ${
                        activeTab === 'resources'
                          ? 'border-b-2 border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                      }`}
                    >
                      Resources
                    </button>
                  </div>

                  {/* Tab Details */}
                  {activeTab === 'overview' ? (
                    <div className="pt-3 space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">What you'll learn</div>
                      <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                        <li>Configuring NextAuth.js with Google and GitHub OAuth providers</li>
                        <li>Protecting API routes and Server Actions with session validation</li>
                        <li>Creating custom sign-in and registration pages with Tailwind CSS</li>
                        <li>Managing JWT session tokens and user state synchronization</li>
                      </ul>
                    </div>
                  ) : (
                    <div className="pt-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      <div className="font-semibold text-slate-900 dark:text-slate-200">Lesson Assets</div>
                      <div className="text-[11px]">
                        Downloadable GitHub branch: <span className="text-sky-600 dark:text-sky-400 font-mono">feature/auth-nextauth</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* -------------------------------------------------------------
                RIGHT COLUMN: Progress & Up Next
               ------------------------------------------------------------- */}
            <div className="lg:col-span-3 border-l border-slate-200 dark:border-white/10 p-4 sm:p-5 space-y-6 bg-slate-50/50 dark:bg-[#040815]/80">
              
              {/* Box 1: Your Progress */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Your progress</div>

                {/* Radial Progress Ring */}
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-16 shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-200 dark:text-white/10"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-sky-500 dark:text-sky-400"
                        stroke="currentColor"
                        strokeWidth="3.2"
                        strokeDasharray={`${progressPercent}, 100`}
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center font-bold text-xs text-slate-900 dark:text-white">
                      {progressPercent}%
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {completedCount} of {totalLessonsCount} lessons
                    </div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400">
                      (Completed)
                    </div>
                  </div>
                </div>

                {/* Horizontal Progress Bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Box 2: Up Next */}
              <div className="space-y-3 pt-3 border-t border-slate-200 dark:border-white/10">
                <div className="text-xs font-semibold text-slate-900 dark:text-white">Up next</div>

                <div className="p-3 rounded-xl bg-white dark:bg-[#060b1b] border border-slate-200 dark:border-white/10 space-y-2 hover:border-sky-400/40 transition-colors shadow-sm dark:shadow-none">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-slate-400 shrink-0 mt-0.5">
                      <Lock className="w-3.5 h-3.5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                        {nextLessonObj.id}. {nextLessonObj.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        {nextLessonObj.duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                    Build the user interface with Tailwind CSS and React components.
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

      </section>

      {/* =========================================================================
          TECH STACK LOGOS STRIP
         ========================================================================= */}
      <section className="relative z-10 py-12 border-y border-slate-200 dark:border-white/5 bg-slate-100/30 dark:bg-white/[0.01]">
        <div className="max-w-6xl mx-auto px-4 text-center space-y-6">
          <p className="text-xs uppercase tracking-widest text-slate-500 dark:text-slate-400 font-medium">
            Engineered on battle-tested production technologies
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {techStack.map((tech) => {
              const Icon = tech.icon;
              return (
                <div 
                  key={tech.name}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none hover:border-slate-300 dark:hover:border-white/20 transition-colors"
                >
                  <Icon className={`w-4 h-4 ${tech.color}`} />
                  <span className="text-xs font-mono text-slate-700 dark:text-slate-300 font-medium">{tech.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* =========================================================================
          INTERACTIVE BENTO GRID
         ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center space-y-3 mb-16">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            ✦ Architectural Architecture
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
            Everything you need for production mastery
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Decoupled, high-performance learning with zero fluff and real enterprise code repositories.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Bento 1: Large Span */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-[#090f20]/80 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-sky-400/60 dark:hover:border-sky-400/40 backdrop-blur-xl transition-all duration-300 space-y-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-sky-500/10 blur-[90px] rounded-full pointer-events-none" />
            
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-400/30 flex items-center justify-center">
                <Video className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 font-medium">
                ImageKit Adaptive HLS
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Signed HLS Adaptive Video Streaming</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Stream seamlessly in 1080p, 720p, or 480p with time-limited signed URL security. Includes smart timestamp auto-save every 10 seconds, variable playback speeds, and theater mode.
              </p>
            </div>

            {/* Visual simulation bar */}
            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-black/30 border border-slate-800 dark:border-white/10 font-mono text-xs flex items-center justify-between text-slate-200 dark:text-slate-300">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>adaptive_resolution: dynamic (1080p → 720p fallback)</span>
              </div>
              <span className="text-slate-400 dark:text-slate-500">Buffer Health: 99.8%</span>
            </div>
          </div>

          {/* Bento 2: Progress Sync */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#090f20]/80 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-indigo-400/60 dark:hover:border-indigo-400/40 backdrop-blur-xl transition-all duration-300 space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-400/30 flex items-center justify-center">
              <Zap className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Instant Cross-Device Sync</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Resume right where you paused on laptop or phone. Video timestamps and lesson completions are saved directly to async Neon PostgreSQL.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-black/30 border border-slate-800 dark:border-white/10 font-mono text-xs text-indigo-300">
              <code>POST /api/student/progress → 200 OK</code>
            </div>
          </div>

          {/* Bento 3: Full Code Repositories */}
          <div className="p-8 rounded-3xl bg-white dark:bg-[#090f20]/80 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-emerald-400/60 dark:hover:border-emerald-400/40 backdrop-blur-xl transition-all duration-300 space-y-6 relative overflow-hidden group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-400/30 flex items-center justify-center">
              <FileCode className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Production Codebases</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Full GitHub repositories with modular directory structures, docker-compose setups, migrations, and CI/CD pipelines you can use in real projects.
              </p>
            </div>

            <div className="text-xs font-mono text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 p-3 rounded-xl border border-emerald-200 dark:border-emerald-500/20 font-semibold">
              git clone ready • zero boilerplate waste
            </div>
          </div>

          {/* Bento 4: Polar Webhook Security */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-white dark:bg-[#090f20]/80 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-sky-400/60 dark:hover:border-sky-400/40 backdrop-blur-xl transition-all duration-300 space-y-6 relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/15 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-400/30 flex items-center justify-center">
                <Lock className="w-6 h-6" />
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/20 font-semibold">
                Polar HMAC Webhooks
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Decoupled Entitlement Architecture</h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl leading-relaxed">
                Purchases and subscriptions are verified via cryptographic HMAC-SHA256 signatures. Cancelled subscriptions retain access until their paid period ends, and access rules are strictly enforced server-side.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-black/30 border border-slate-800 dark:border-white/10 font-mono text-xs flex items-center justify-between text-slate-200 dark:text-slate-300">
              <span>Security: Server-Verified HMAC • Idempotent Event Logs</span>
              <span className="text-emerald-400 font-semibold">100% Audit Tracked</span>
            </div>
          </div>

        </div>
      </section>

      {/* =========================================================================
          FEATURED COURSES SECTION
         ========================================================================= */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 border-b border-slate-200 dark:border-white/10 pb-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
              ✦ Course Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Curated Curriculum Built for Engineers
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
              Zero filler. Every course is focused on architecture, scalability, and production delivery.
            </p>
          </div>

          <Link
            to="/courses"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-300 dark:border-white/20 transition-all cursor-pointer self-start"
          >
            Browse All Courses
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuredCourses.map((c) => (
            <div
              key={c.id}
              className="group flex flex-col justify-between rounded-3xl bg-white dark:bg-[#090f20]/90 border border-slate-200 dark:border-white/10 shadow-lg shadow-slate-200/50 dark:shadow-none hover:border-sky-400/60 dark:hover:border-sky-400/40 overflow-hidden transition-all duration-300"
            >
              <div>
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={c.thumbnail}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-bold bg-sky-500 text-slate-950 shadow-md">
                    {c.badge}
                  </div>
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold bg-slate-900/90 text-white backdrop-blur-md border border-white/10">
                    {c.price}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex flex-wrap gap-1.5">
                    {c.tags.map(t => (
                      <span key={t} className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5">
                        {t}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-sky-500 dark:group-hover:text-sky-300 transition-colors line-clamp-2">
                    {c.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-mono">
                    <BookOpen className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                    {c.lessons} lessons
                  </span>
                  <span className="flex items-center gap-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
                    {c.duration}
                  </span>
                </div>

                <Link
                  to={`/courses/${c.slug}`}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:text-sky-500 dark:hover:text-sky-300 inline-flex items-center gap-1 cursor-pointer"
                >
                  Details
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          THE PRODUCTION DIFFERENCE (Comparison Table)
         ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 py-20">
        <div className="rounded-3xl p-8 sm:p-12 bg-white dark:bg-[#090f20]/90 border border-slate-200 dark:border-white/10 backdrop-blur-2xl shadow-xl dark:shadow-2xl space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              Why Engineers Choose NxtLearnn
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              The stark difference between generic syntax tutorials and production mastery.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="border-b border-slate-200 dark:border-white/10 text-slate-500 dark:text-slate-400">
                <tr>
                  <th className="py-4 px-4 font-semibold">Capability</th>
                  <th className="py-4 px-4 text-slate-500 dark:text-slate-400 font-semibold">Generic Video Courses</th>
                  <th className="py-4 px-4 text-sky-600 dark:text-sky-400 font-bold">NxtLearnn Platform</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/5 text-slate-700 dark:text-slate-300">
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">Project Scope</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">Basic To-Do apps, toy blogs</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    Full-Stack Distributed Systems with HLS Streaming
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">Database Design</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">SQLite with synchronous queries</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    Async SQLAlchemy 2.0 + asyncpg on Neon PostgreSQL
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">Payment Architecture</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">Client-side mock redirects</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    HMAC-SHA256 Idempotent Polar Webhooks
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">Video Player Experience</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">Standard iframe embed</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    ImageKit Signed HLS with 10s Timestamp Persistence
                  </td>
                </tr>
                <tr>
                  <td className="py-4 px-4 font-medium text-slate-900 dark:text-white">Subscription Lock-In</td>
                  <td className="py-4 px-4 text-slate-500 dark:text-slate-400">Recurring fees with dark patterns</td>
                  <td className="py-4 px-4 text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400 shrink-0" />
                    Single Course, Monthly, or Lifetime Pass Options
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* =========================================================================
          TESTIMONIALS SECTION (With developer & founder testimonials)
         ========================================================================= */}
      <div className="relative z-10">
        <TestimonialsSection />
      </div>

      {/* =========================================================================
          INTERACTIVE FAQ ACCORDION
         ========================================================================= */}
      <section className="relative z-10 max-w-4xl mx-auto px-4 py-20 space-y-10">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 uppercase tracking-widest">
            ✦ Got Questions?
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto">
            Everything you need to know about enrollments, curriculum, and policies.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <motion.div
              key={idx}
              whileHover={{ y: -1 }}
              onClick={() => toggleFaq(idx)}
              className="p-6 rounded-2xl bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-white/[0.08] hover:border-indigo-500/40 shadow-sm dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)] transition-all cursor-pointer overflow-hidden"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-semibold text-base text-slate-900 dark:text-white flex items-center gap-3">
                  <HelpCircle className="w-4 h-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
                  <span>{faq.q}</span>
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                    openFaq === idx ? 'rotate-180 text-indigo-400' : ''
                  }`}
                />
              </div>

              <AnimatePresence>
                {openFaq === idx && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pt-4 text-sm text-slate-600 dark:text-slate-400 leading-relaxed pl-7 border-t border-slate-100 dark:border-white/[0.06] mt-4">
                      {faq.a}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          GRAND CELESTIAL CALL-TO-ACTION BANNER
         ========================================================================= */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 pb-28">
        <div className="relative rounded-3xl p-10 sm:p-16 bg-gradient-to-b from-sky-50 via-white to-slate-100 border border-sky-300 shadow-2xl shadow-sky-100/50 dark:from-[#0c1428] dark:via-[#070c18] dark:to-[#030610] dark:border-sky-400/40 text-center space-y-8 overflow-hidden">
          
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-24 bg-sky-400/20 dark:bg-sky-400/25 blur-3xl rounded-full pointer-events-none" />

          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-400/30 text-sky-700 dark:text-sky-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-sky-500 dark:text-sky-400" />
              <span>Instant Lifetime & Single Access</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white">
              Ready to build production-grade software?
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
              Join 500+ ambitious developers mastering async FastAPI, React, and serverless PostgreSQL with NxtLearnn.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              to="/signup"
              variant="primary"
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-bold shadow-xl"
            >
              Get Started Now
            </Button>

            <Button
              to="/pricing"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto rounded-full px-8 py-3.5 text-sm font-semibold"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Compare All Access Plans
            </Button>
          </div>
        </div>
      </section>

    </div>
  );
}
