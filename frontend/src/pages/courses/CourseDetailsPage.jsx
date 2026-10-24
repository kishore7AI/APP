import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Users, BookOpen, Clock, RefreshCw, CheckCircle2, 
  Lock, Play, Sparkles, ShieldCheck, ArrowRight, X, 
  CreditCard, Check, ChevronRight, Award, ExternalLink
} from 'lucide-react';
import { COURSES } from '../../data/coursesData';
import { useEnrollment } from '../../hooks/useEnrollment';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isEnrolled, enrollCourse } = useEnrollment();

  const course = COURSES.find((c) => c.slug === slug) || COURSES[0];
  const enrolled = isEnrolled(course.slug);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Flatten lessons for quick curriculum stats
  const allLessons = course.sections.flatMap((s) => s.lessons);
  const firstLesson = allLessons[0];

  const handleBuyClick = () => {
    if (enrolled) {
      navigate(`/courses/${course.slug}/learn`);
    } else {
      navigate(`/signup?course=${course.slug}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02050e] text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* =========================================================================
          HERO & HEADER
         ========================================================================= */}
      <div className="relative border-b border-slate-200 dark:border-white/10 bg-gradient-to-b from-white via-slate-50 to-white dark:from-[#050b1d] dark:via-[#02050e] dark:to-[#02050e] pt-8 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
            <Link to="/courses" className="hover:text-slate-900 dark:hover:text-white transition-colors">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-slate-800 dark:text-slate-200 font-semibold truncate">
              {course.title}
            </span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
              {course.level || 'Intermediate'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              {course.category}
            </span>
            {course.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Course Title & Subtitle */}
          <div className="space-y-3 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              {course.title}
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
              {course.subtitle || course.description}
            </p>
          </div>

          {/* Metadata Row */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-xs sm:text-sm text-slate-600 dark:text-slate-400 pt-2">
            <div className="flex items-center gap-1.5 text-amber-500 font-bold">
              <Star className="w-4 h-4 fill-amber-500" />
              <span>{course.rating || 4.9}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-500" />
              <span>{Number(course.studentsCount || 1240).toLocaleString()} students</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-sky-500" />
              <span>{course.lessonsCount} lessons</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-sky-500" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
              <span>Updated Oct 2026</span>
            </div>
          </div>

        </div>
      </div>

      {/* =========================================================================
          MAIN 2-COLUMN SECTION (Hero Preview + Sticky Purchase Card)
         ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* =====================================================================
              LEFT COLUMN: Video Hero, About, Curriculum & Instructor
             ===================================================================== */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Hero Video Preview Card */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl group">
              <div className="aspect-video relative overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

                {/* Big Center Glowing Play Button */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-110 hover:bg-sky-400 transition-all cursor-pointer group/btn"
                >
                  <Play className="w-8 h-8 fill-white ml-1 group-hover/btn:scale-110 transition-transform" />
                </button>

                {/* Bottom Left "Watch a free preview" Pill */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                >
                  <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                  <span>Watch a free preview</span>
                </button>
              </div>
            </div>

            {/* About this course */}
            <div className="space-y-4">
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                About this course
              </h2>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                {course.description}
              </p>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
                This course is structured to deliver immediate production capability. You will not only learn the underlying syntax and patterns, but also build, test, and deploy resilient architectures capable of handling real-world scale and complex edge-cases.
              </p>
            </div>

            {/* What you'll learn */}
            <div className="space-y-5 p-6 rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 shadow-sm">
              <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-sky-500" />
                <span>What you'll learn in this masterclass</span>
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  'Architect clean, modular code with industry-standard patterns',
                  'Implement robust authentication, JWT tokens, and OAuth2 workflows',
                  'Database indexing, relationship queries, and connection pooling',
                  'Design system principles with accessible components and responsive layouts',
                  'End-to-end telemetry, error handling, and structured logging',
                  'Full deployment automation with CI/CD and production monitoring'
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 dark:text-sky-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Curriculum & Locked Lessons */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                    Course Curriculum
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    {course.sections.length} modules • {allLessons.length} lessons • {course.duration} total duration
                  </p>
                </div>
                {enrolled && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    All Lessons Unlocked ✓
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {course.sections.map((section, sIdx) => (
                  <div
                    key={section.id}
                    className="rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 overflow-hidden shadow-sm"
                  >
                    {/* Section Header */}
                    <div className="px-5 py-4 bg-slate-50 dark:bg-white/[0.02] border-b border-slate-200 dark:border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 text-xs font-bold flex items-center justify-center">
                          {sIdx + 1}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                          {section.title}
                        </h3>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {section.lessons.length} lessons
                      </span>
                    </div>

                    {/* Section Lessons */}
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {section.lessons.map((lesson, lIdx) => {
                        const isFreePreview = sIdx === 0 && lIdx === 0;
                        const isUnlocked = enrolled || isFreePreview;

                        return (
                          <div
                            key={lesson.id}
                            className="px-5 py-3.5 flex items-center justify-between gap-4 hover:bg-slate-50/70 dark:hover:bg-white/[0.02] transition-colors"
                          >
                            <div className="flex items-center gap-3 truncate">
                              {isUnlocked ? (
                                <div className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center shrink-0">
                                  <Lock className="w-3 h-3" />
                                </div>
                              )}
                              
                              <div className="truncate">
                                <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                                  {lesson.id}. {lesson.title}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {isFreePreview && !enrolled && (
                                <button
                                  onClick={() => setShowPreviewModal(true)}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 hover:bg-sky-100 cursor-pointer"
                                >
                                  Free Preview
                                </button>
                              )}
                              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                {lesson.duration}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Meet Your Instructor */}
            <div className="p-6 rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Instructor
              </h3>
              
              <div className="flex items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/30 shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {course.instructor.name}
                  </h4>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {course.instructor.role}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {course.instructor.bio}
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* =====================================================================
              RIGHT COLUMN: Sticky Purchase Card (Matching User Reference Image)
             ===================================================================== */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
            <div className="rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 p-6 shadow-xl space-y-6">
              
              {/* Price & Plan */}
              <div className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                    {course.price || (course.priceNumber ? `₹${course.priceNumber.toLocaleString()}` : '₹2,499')}
                  </span>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    one-time
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full lifetime access • All future updates included
                </p>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {enrolled ? (
                  <button
                    onClick={() => navigate(`/courses/${course.slug}/learn`)}
                    className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span>Go to Classroom</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={handleBuyClick}
                    className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-300 hover:via-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                  >
                    <span>Buy course</span>
                  </button>
                )}

                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                >
                  Watch free preview
                </button>
              </div>

              {/* Bullet Features (Matches attached screenshot) */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>{course.lessonsCount} lessons ({course.duration})</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Source code for every lesson</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Progress tracking & zero initial state</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-sky-500 shrink-0" />
                  <span>Graduation Certificate</span>
                </div>
              </div>

              {/* All Access Upsell */}
              <div className="pt-4 border-t border-slate-100 dark:border-white/10 text-center">
                <Link
                  to="/pricing"
                  className="text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline inline-flex items-center gap-1"
                >
                  <span>Or get every course with All Access</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>

            {/* Safe Guarantee Box */}
            <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-white/[0.02] border border-slate-200 dark:border-white/10 flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0" />
              <span>14-day 100% money-back guarantee. Zero risk.</span>
            </div>

          </div>

        </div>
      </div>

      {/* =========================================================================
          FREE PREVIEW MODAL
         ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-3xl rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/15 overflow-hidden shadow-2xl space-y-4 p-6 relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 uppercase tracking-wider">
                Free Lesson Preview
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Lesson 1: {firstLesson?.title}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {firstLesson?.description}
              </p>
            </div>

            {/* Video Simulation Box */}
            <div className="rounded-xl overflow-hidden aspect-video bg-black relative border border-slate-200 dark:border-white/10 flex items-center justify-center">
              <div className="text-center space-y-3 p-6">
                <div className="w-16 h-16 rounded-full bg-sky-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/50">
                  <Play className="w-7 h-7 fill-white ml-0.5" />
                </div>
                <h4 className="font-bold text-sm text-white">Interactive Preview Stream Ready</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  Watch this lesson preview directly inside the classroom player or create an account to purchase the full course.
                </p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      navigate(`/courses/${course.slug}/learn`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-500 hover:bg-sky-400 text-white transition-colors cursor-pointer"
                  >
                    Open in Classroom Player
                  </button>
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      navigate(`/signup?course=${course.slug}`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors cursor-pointer"
                  >
                    Buy Full Course
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
