import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Play, Pause, CheckCircle2, Circle, Lock, 
  Search, Volume2, Maximize2, Check, ChevronRight, ChevronLeft,
  FileCode, Folder, BookOpen, Clock, Award, ArrowLeft,
  Download, ExternalLink, Users, Star, Layers, ShieldCheck, X, ShoppingCart
} from 'lucide-react';
import { COURSES } from '../../data/coursesData';
import { useEnrollment } from '../../hooks/useEnrollment';

export default function CourseClassroomPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isEnrolled, enrollCourse, getCompletedLessons, saveCompletedLessons } = useEnrollment();

  // Find current course from mock data, fallback to first course
  const currentCourse = COURSES.find(c => c.slug === slug) || COURSES[0];
  const enrolled = isEnrolled(currentCourse.slug);

  // Flatten all lessons across sections for indexing
  const allLessons = currentCourse.sections.flatMap(s => s.lessons);
  const [activeLessonId, setActiveLessonId] = useState(allLessons[0]?.id || 1);

  // Initialize completed lessons starting at 0% from persistent state (empty Set by default)
  const [completedLessons, setCompletedLessons] = useState(() => {
    return getCompletedLessons(currentCourse.slug);
  });

  const [activeTab, setActiveTab] = useState('overview');
  const [isPlaying, setIsPlaying] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // When slug changes, reset active lesson to first lesson and load progress
  useEffect(() => {
    if (allLessons.length > 0) {
      setActiveLessonId(allLessons[0].id);
    }
    setCompletedLessons(getCompletedLessons(currentCourse.slug));
  }, [slug]);

  // Active lesson details
  const activeLesson = allLessons.find(l => l.id === activeLessonId) || allLessons[0];
  const activeLessonIndex = allLessons.findIndex(l => l.id === activeLessonId);
  const nextLesson = allLessons[activeLessonIndex + 1] || null;
  const prevLesson = activeLessonIndex > 0 ? allLessons[activeLessonIndex - 1] : null;

  // Progress math (starts at 0%)
  const totalCount = allLessons.length;
  const completedCount = completedLessons.size;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  // Toggle lesson completed
  const toggleComplete = (id) => {
    setCompletedLessons(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      saveCompletedLessons(currentCourse.slug, next);
      return next;
    });
  };

  // Lesson click handler: if not enrolled and locked, redirect to signup page
  const handleLessonClick = (lesson) => {
    const isFree = lesson.id === 1;
    if (!enrolled && !isFree) {
      navigate(`/signup?course=${currentCourse.slug}`);
      return;
    }
    setActiveLessonId(lesson.id);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Filter lessons if searching
  const isLessonMatch = (lesson) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return lesson.title.toLowerCase().includes(q) || lesson.description.toLowerCase().includes(q);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02050e] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      
      {/* =========================================================================
          PREVIEW BANNER (Visible if user is not yet enrolled)
         ========================================================================= */}
      {!enrolled && (
        <div className="bg-gradient-to-r from-sky-600 to-indigo-600 text-white text-xs py-2 px-4 shadow-sm">
          <div className="max-w-[1720px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-center sm:text-left">
              <Sparkles className="w-4 h-4 shrink-0 text-sky-200" />
              <span>
                You are currently previewing <strong>{currentCourse.title}</strong> (Free Lesson 1). Remaining lessons are locked.
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                to={`/courses/${currentCourse.slug}`}
                className="font-bold underline hover:text-sky-200"
              >
                Course Info
              </Link>
              <button
                onClick={() => navigate(`/signup?course=${currentCourse.slug}`)}
                className="px-3 py-1 rounded-md bg-white text-sky-700 hover:bg-sky-50 font-extrabold shadow-sm cursor-pointer transition-colors"
              >
                Buy Course ({currentCourse.price || '₹2,499'})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TOP CLASSROOM NAVBAR / BREADCRUMB HEADER
         ========================================================================= */}
      <div className="sticky top-16 z-30 bg-white/80 dark:bg-[#060b19]/90 border-b border-slate-200 dark:border-white/10 backdrop-blur-xl">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-4">
          
          {/* Left: Course Breadcrumbs & Back */}
          <div className="flex items-center gap-3 truncate">
            <Link
              to={`/courses/${currentCourse.slug}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 transition-colors cursor-pointer shrink-0"
              title="Return to Course Overview"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Course Overview</span>
            </Link>

            <div className="h-4 w-[1px] bg-slate-200 dark:bg-white/10 shrink-0" />

            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
              <Link to="/courses" className="hover:text-slate-900 dark:hover:text-white hidden sm:inline">
                Courses
              </Link>
              <span className="hidden sm:inline">/</span>
              <Link to={`/courses/${currentCourse.slug}`} className="font-semibold text-slate-800 dark:text-slate-200 hover:text-sky-500 truncate">
                {currentCourse.shortTitle}
              </Link>
              <span>/</span>
              <span className="text-slate-900 dark:text-white font-bold truncate">Lesson {activeLesson?.id}: {activeLesson?.title}</span>
            </div>
          </div>

          {/* Right: Search Lessons & Quick Course Switcher */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative hidden md:block">
              <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search lessons..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-56 lg:w-72 pl-8 pr-3 py-1.5 rounded-full bg-slate-100 dark:bg-[#030612] border border-slate-200 dark:border-white/10 text-xs text-slate-900 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-sky-500/50 transition-colors"
              />
            </div>

            {/* Course Switcher Dropdown */}
            <select
              value={currentCourse.slug}
              onChange={(e) => navigate(`/courses/${e.target.value}/learn`)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#080e22] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10 focus:outline-none cursor-pointer"
            >
              {COURSES.map(c => (
                <option key={c.id} value={c.slug}>
                  {c.shortTitle}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MAIN 3-COLUMN WORKSPACE (Inspired by user image)
         ========================================================================= */}
      <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* =====================================================================
              COLUMN 1: LEFT SIDEBAR (Curriculum & Sections)
             ===================================================================== */}
          <div className="lg:col-span-3 rounded-2xl bg-white dark:bg-[#060b19]/90 border border-slate-200 dark:border-white/10 p-4 space-y-5 shadow-sm dark:shadow-none backdrop-blur-xl lg:sticky lg:top-36 max-h-[calc(100vh-160px)] overflow-y-auto">
            
            {/* Course Overview Card */}
            <div className="border-b border-slate-200 dark:border-white/10 pb-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 uppercase tracking-wider">
                  {currentCourse.category}
                </span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  {currentCourse.duration}
                </span>
              </div>
              <h2 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                {currentCourse.title}
              </h2>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug">
                {currentCourse.subtitle}
              </p>
            </div>

            {/* Sections & Lessons */}
            <div className="space-y-4">
              {currentCourse.sections.map((section, sIdx) => {
                const sectionCompleted = section.lessons.filter(l => completedLessons.has(l.id)).length;
                const filteredLessons = section.lessons.filter(isLessonMatch);

                if (filteredLessons.length === 0 && searchQuery) return null;

                return (
                  <div key={section.id || sIdx} className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 px-1">
                      <span>{section.title}</span>
                      <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                        {sectionCompleted}/{section.lessons.length}
                      </span>
                    </div>

                    <div className="space-y-1">
                      {filteredLessons.map((lesson) => {
                        const isDone = completedLessons.has(lesson.id);
                        const isActive = activeLessonId === lesson.id;
                        const isLocked = !enrolled && lesson.id !== 1;

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => handleLessonClick(lesson)}
                            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
                              isActive
                                ? 'bg-sky-50 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-300 dark:border-sky-400/40 shadow-sm'
                                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.04]'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 truncate pr-2">
                              {isLocked ? (
                                <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              ) : isDone ? (
                                <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0" />
                              ) : (
                                <Circle className="w-4 h-4 text-slate-400 dark:text-slate-600 shrink-0" />
                              )}
                              <span className="truncate">{lesson.id}. {lesson.title}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {isLocked && (
                                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded">
                                  Locked
                                </span>
                              )}
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                {lesson.duration}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* =====================================================================
              COLUMN 2: CENTER AREA (Interactive Player & Lesson Details)
             ===================================================================== */}
          <div className="lg:col-span-6 space-y-6">
            
            {/* macOS IDE / Code Classroom Video Simulation Player */}
            <div className="rounded-2xl border border-slate-200 dark:border-sky-500/25 bg-slate-950 dark:bg-[#030612] overflow-hidden shadow-2xl dark:shadow-[0_0_80px_rgba(30,58,138,0.35)] group">
              
              {/* macOS Window Top Bar */}
              <div className="px-4 py-2.5 bg-slate-900 dark:bg-[#080d1e] border-b border-slate-800 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <div className="text-xs text-slate-400 font-mono flex items-center gap-1.5">
                  <FileCode className="w-3.5 h-3.5 text-sky-400" />
                  <span>{currentCourse.codeFile} — {currentCourse.codeFolder}</span>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  1080p HLS
                </span>
              </div>

              {/* Code Split View Layout */}
              <div className="grid grid-cols-12 min-h-[320px] text-xs font-mono select-none">
                
                {/* VS Code Mini Sidebar Explorer */}
                <div className="col-span-4 border-r border-slate-800 dark:border-white/10 bg-slate-900/90 dark:bg-[#040815] p-3 space-y-2 text-slate-400">
                  <div className="text-[10px] tracking-wider text-slate-500 font-semibold uppercase">
                    Explorer
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1 text-slate-300">
                      <Folder className="w-3.5 h-3.5 text-sky-400" />
                      <span>{currentCourse.slug}</span>
                    </div>
                    <div className="pl-3 space-y-1">
                      <div className="flex items-center gap-1 text-slate-400">
                        <Folder className="w-3 h-3 text-sky-400/80" />
                        <span>src</span>
                      </div>
                      <div className="pl-3 space-y-1">
                        <div className="flex items-center gap-1 text-slate-400">
                          <Folder className="w-3 h-3 text-sky-400/60" />
                          <span>modules</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sky-400 font-semibold bg-sky-500/10 px-1.5 py-0.5 rounded border border-sky-500/20">
                          <FileCode className="w-3.5 h-3.5" />
                          <span>{currentCourse.codeFile}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-slate-500">
                        <Folder className="w-3 h-3" />
                        <span>database</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <FileCode className="w-3.5 h-3.5" />
                        <span>config.json</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor Surface with Code & Play Overlay */}
                <div className="col-span-8 bg-slate-950 dark:bg-[#02050f] p-4 relative overflow-hidden flex flex-col justify-between">
                  
                  {/* File Tab */}
                  <div className="flex items-center gap-2 pb-3 border-b border-white/5 text-[11px] text-slate-400">
                    <span className="px-2 py-0.5 bg-white/5 rounded text-sky-300 font-mono">
                      {currentCourse.codeFile}
                    </span>
                    <span>lesson {activeLesson?.id} &gt; implementation</span>
                  </div>

                  {/* Code Snippet Highlight */}
                  <pre className="text-slate-300 py-3 overflow-x-auto leading-relaxed text-[11px] font-mono">
                    <code>{currentCourse.codeSnippet}</code>
                  </pre>

                  {/* Big Interactive Video Play Overlay */}
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] flex items-center justify-center">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-[0_0_35px_rgba(56,189,248,0.6)] transform hover:scale-110 active:scale-95 transition-all cursor-pointer group"
                      title={isPlaying ? 'Pause' : 'Play Video'}
                    >
                      {isPlaying ? (
                        <Pause className="w-7 h-7 fill-white" />
                      ) : (
                        <Play className="w-7 h-7 fill-white ml-1" />
                      )}
                    </button>
                  </div>

                </div>

              </div>

              {/* Video Player Scrubber & Controls */}
              <div className="px-4 py-3 bg-slate-900/90 dark:bg-[#050a1b] border-t border-slate-800 dark:border-white/10 flex items-center gap-4 text-xs text-slate-400 font-mono">
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>

                <span>14:32 / {activeLesson?.duration}</span>

                {/* Scrubber Progress Bar */}
                <div className="flex-1 h-1.5 rounded-full bg-slate-800 dark:bg-white/10 relative overflow-hidden cursor-pointer group/bar">
                  <div className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full w-[45%]" />
                </div>

                <div className="flex items-center gap-3">
                  <Volume2 className="w-4 h-4 hover:text-white cursor-pointer" />
                  <Maximize2 className="w-4 h-4 hover:text-white cursor-pointer" />
                </div>
              </div>

            </div>

            {/* Lesson Title, Action Buttons & Description */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 shadow-sm space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-100 dark:border-white/10">
                <div>
                  <span className="text-[11px] font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                    Lesson {activeLesson?.id}
                  </span>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    {activeLesson?.title}
                  </h1>
                </div>

                {/* Mark Complete & Next Lesson Buttons */}
                <div className="flex items-center gap-2.5">
                  <button
                    onClick={() => toggleComplete(activeLesson?.id)}
                    className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      completedLessons.has(activeLesson?.id)
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md shadow-emerald-500/25'
                        : 'bg-sky-500 hover:bg-sky-400 text-white shadow-md shadow-sky-500/25'
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>{completedLessons.has(activeLesson?.id) ? 'Completed' : 'Mark Complete'}</span>
                  </button>

                  {prevLesson && (
                    <button
                      onClick={() => handleLessonClick(prevLesson)}
                      className="p-2 rounded-xl text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                      title="Previous lesson"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  {nextLesson && (
                    <button
                      onClick={() => handleLessonClick(nextLesson)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-white/15 transition-all cursor-pointer"
                    >
                      <span>Next lesson</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                {activeLesson?.description}
              </p>

              {/* Tabs: Overview & Resources */}
              <div className="pt-2">
                <div className="flex items-center gap-6 border-b border-slate-200 dark:border-white/10 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('overview')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'overview'
                        ? 'border-b-2 border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Overview & Outcomes
                  </button>
                  <button
                    onClick={() => setActiveTab('resources')}
                    className={`pb-2.5 transition-colors cursor-pointer ${
                      activeTab === 'resources'
                        ? 'border-b-2 border-sky-500 text-sky-600 dark:border-sky-400 dark:text-sky-400'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    Resources & Downloads
                  </button>
                </div>

                {activeTab === 'overview' ? (
                  <div className="pt-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      What you'll learn in this module:
                    </h3>
                    <ul className="space-y-2">
                      {activeLesson?.learningGoals?.map((goal, gIdx) => (
                        <li key={gIdx} className="flex items-start gap-2.5 text-xs text-slate-600 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                          <span>{goal}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <div className="pt-4 space-y-3">
                    <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                      Downloadable Assets & Starter Code:
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileCode className="w-4 h-4 text-sky-500" />
                          <span className="font-mono text-slate-800 dark:text-slate-200">{currentCourse.codeFile}</span>
                        </div>
                        <button className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>

                      <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Folder className="w-4 h-4 text-indigo-500" />
                          <span className="font-mono text-slate-800 dark:text-slate-200">starter-repo.zip</span>
                        </div>
                        <button className="text-sky-600 dark:text-sky-400 hover:underline flex items-center gap-1 cursor-pointer">
                          <Download className="w-3.5 h-3.5" />
                          Download
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* =====================================================================
              COLUMN 3: RIGHT SIDEBAR (Progress, Up Next & Instructor)
             ===================================================================== */}
          <div className="lg:col-span-3 space-y-6 lg:sticky lg:top-36">
            
            {/* Box 1: Your Progress (Radial Ring starting clean from 0%) */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#060b19]/90 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-4">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Your Progress
              </div>

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

                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-900 dark:text-white">
                    {completedCount} of {totalCount} lessons
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    ({progressPercent >= 100 ? 'Course Complete!' : progressPercent === 0 ? 'Not started' : 'In progress'})
                  </div>
                </div>
              </div>

              {/* Linear Progress Bar */}
              <div className="w-full h-1.5 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-sky-500 to-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Box 2: Up Next Card */}
            {nextLesson ? (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#060b19]/90 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Up Next
                </div>

                <div 
                  onClick={() => handleLessonClick(nextLesson)}
                  className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#040816] border border-slate-200 dark:border-white/10 hover:border-sky-400/50 transition-all cursor-pointer space-y-2 group"
                >
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 dark:bg-sky-500/10 border border-sky-300 dark:border-sky-500/20 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                      {!enrolled && nextLesson.id !== 1 ? (
                        <Lock className="w-3.5 h-3.5 text-slate-400" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-sky-500 transition-colors">
                        {nextLesson.id}. {nextLesson.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {nextLesson.duration}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug line-clamp-2">
                    {nextLesson.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-5 rounded-2xl bg-white dark:bg-[#060b19]/90 border border-slate-200 dark:border-white/10 text-center space-y-2">
                <Award className="w-8 h-8 text-amber-400 mx-auto" />
                <h4 className="text-xs font-bold text-slate-900 dark:text-white">You reached the finish line!</h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  All lessons in this module completed. Claim your certificate.
                </p>
              </div>
            )}

            {/* Box 3: Instructor Card */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#060b19]/90 border border-slate-200 dark:border-white/10 shadow-sm dark:shadow-none space-y-3">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                Instructor
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={currentCourse.instructor.avatar}
                  alt={currentCourse.instructor.name}
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-sky-500/30"
                />
                <div className="space-y-0.5 truncate">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {currentCourse.instructor.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                    {currentCourse.instructor.role}
                  </p>
                </div>
              </div>

              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentCourse.instructor.bio}
              </p>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
