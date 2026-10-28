import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Star, Users, BookOpen, Clock, RefreshCw, CheckCircle2, 
  Lock, Play, Sparkles, ShieldCheck, ArrowRight, X, 
  CreditCard, Check, ChevronRight, Award, ExternalLink
} from 'lucide-react';
import { COURSES } from '../../data/coursesData';
import { coursesApi } from '../../api/client';
import { useEnrollment } from '../../hooks/useEnrollment';
import { useAuth } from '../../context/AuthContext';
import ImageKitPlayer from '../../components/video/ImageKitPlayer';

export default function CourseDetailsPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { 
    hasCourseAccess, 
    membership, 
    isMember, 
    isMonthlyMember, 
    isLifetimeMember, 
    canBuySingle,
    enrollCourse,
    getCompletedLessons
  } = useEnrollment();

  const [course, setCourse] = useState(() => {
    return COURSES.find((c) => c.slug === slug) || COURSES[0];
  });
  const [loading, setLoading] = useState(false);
  const [isPlayingInline, setIsPlayingInline] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [activePreviewLesson, setActivePreviewLesson] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const loadCourse = async () => {
      try {
        const live = await coursesApi.getBySlug(slug);
        if (live && isMounted) {
          const fallback = COURSES.find((c) => c.slug === slug) || {};
          const fallbackLearnings = fallback.whatYouWillLearn || [
            `Master production architecture with ${live.tags?.join(', ') || live.category || 'modern stacks'}`,
            'Architect scalable, clean, and maintainable services from ground up',
            'Handle authentication, security, and edge-case exception handling',
            'Deploy, monitor, and scale in production cloud environments'
          ];

          setCourse({
            ...fallback,
            ...live,
            subtitle: live.description || fallback.subtitle,
            thumbnail: live.thumbnail_url || fallback.thumbnail || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
            price: live.price ? `₹${live.price.toLocaleString('en-IN')}` : (fallback.price || 'Free'),
            priceNumber: live.price || fallback.priceNumber || 0,
            sections: (live.sections && live.sections.length > 0) ? live.sections : (fallback.sections || []),
            whatYouWillLearn: fallbackLearnings,
            requirements: fallback.requirements || [
              'Basic programming knowledge',
              'A computer with modern web browser and terminal access'
            ],
            instructor: fallback.instructor || {
              name: 'NxtLearnn Engineering Team',
              title: 'Principal Systems Architect',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
              bio: 'Industry veteran architecting distributed microservices and production apps.'
            }
          });
        }
      } catch (e) {
        console.warn('Using local fallback for course details:', e);
      }
    };
    loadCourse();
    return () => { isMounted = false; };
  }, [slug]);

  // Access checks
  const userHasAccess = (course && hasCourseAccess(course.slug)) || isAdmin;
  const enrolled = userHasAccess;
  const isSingleBuyable = course && canBuySingle(course);

  // Flatten lessons for curriculum stats & progress
  const allLessons = (course?.sections || []).flatMap((s) => s.lessons || []);
  const firstLesson = allLessons[0] || null;

  // Real user progress calculation
  const completedLessons = getCompletedLessons(course?.slug || slug);
  const completedCount = allLessons.filter((l) => completedLessons.has(l.id)).length;
  const totalCount = allLessons.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleBuyClick = () => {
    if (userHasAccess) {
      navigate(`/courses/${course.slug}/learn`);
    } else if (isSingleBuyable) {
      navigate(`/signup?course=${course.slug}`);
    } else {
      navigate('/pricing');
    }
  };

  const courseTags = Array.isArray(course?.tags)
    ? course.tags
    : typeof course?.tags === 'string'
    ? course.tags.split(',').map((t) => t.trim()).filter(Boolean)
    : [];

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
              {course?.title}
            </span>
          </nav>

          {/* Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20">
              {course?.level || 'Intermediate'}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10">
              {course?.category}
            </span>
            {courseTags.map((tag) => (
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
            
            {/* Hero Video Preview Card powered by ImageKit */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-white/10 shadow-2xl group">
              {isPlayingInline ? (
                <div className="relative aspect-video bg-black">
                  <ImageKitPlayer
                    src={activePreviewLesson?.video_file_id || course.trailer_url}
                    poster={course.thumbnail}
                    title={activePreviewLesson?.title || course.title}
                    autoplay={true}
                  />
                  <div className="absolute top-3 right-3 z-20 flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsPlayingInline(false);
                        setShowPreviewModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-sky-600/80 hover:bg-sky-600 text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5 border border-sky-400/30"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Expand</span>
                    </button>
                    <button
                      onClick={() => setIsPlayingInline(false)}
                      className="px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black text-white text-xs font-semibold backdrop-blur-md transition-colors cursor-pointer flex items-center gap-1.5 border border-white/20"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Close</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="aspect-video relative overflow-hidden">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/20" />

                  {/* Big Center Glowing Play Button */}
                  <button
                    onClick={() => {
                      setActivePreviewLesson(firstLesson);
                      setIsPlayingInline(true);
                    }}
                    className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-sky-500/90 text-white flex items-center justify-center shadow-[0_0_40px_rgba(56,189,248,0.6)] hover:scale-110 hover:bg-sky-400 transition-all cursor-pointer group/btn"
                    title="Play trailer with ImageKit Video Player"
                  >
                    <Play className="w-8 h-8 fill-white ml-1 group-hover/btn:scale-110 transition-transform" />
                  </button>

                  {/* Bottom Left "Watch a free preview" Pill */}
                  <button
                    onClick={() => {
                      setActivePreviewLesson(firstLesson);
                      setShowPreviewModal(true);
                    }}
                    className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-900/80 hover:bg-slate-900 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
                  >
                    <Play className="w-3.5 h-3.5 fill-current text-sky-400" />
                    <span>Watch a free preview</span>
                  </button>

                  {/* Bottom Right ImageKit ABS Badge */}
                  <div className="absolute bottom-5 right-5 hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-mono font-semibold bg-slate-900/85 text-emerald-400 backdrop-blur-md border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>ImageKit HLS • 1080p ABS</span>
                  </div>
                </div>
              )}
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
                    {(course?.sections || []).length} modules • {allLessons.length} lessons • {course?.duration || '12 hours'} total duration
                  </p>
                </div>
                {enrolled && (
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                    All Lessons Unlocked ✓
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {(course?.sections || []).map((section, sIdx) => (
                  <div
                    key={section.id || sIdx}
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
                      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-mono">
                        {completedCount > 0 && (
                          <span className="text-emerald-500 font-semibold">
                            {(section.lessons || []).filter((l) => completedLessons.has(l.id)).length}/{(section.lessons || []).length} done
                          </span>
                        )}
                        <span>
                          {(section.lessons || []).length} lessons
                        </span>
                      </div>
                    </div>

                    {/* Section Lessons */}
                    <div className="divide-y divide-slate-100 dark:divide-white/5">
                      {(section.lessons || []).map((lesson, lIdx) => {
                        const isFreePreview = (sIdx === 0 && lIdx === 0) || lesson.is_free_preview;
                        const isUnlocked = enrolled || isFreePreview;
                        const isDone = completedLessons.has(lesson.id);
                        const durationText = lesson.duration || (lesson.video_duration_seconds ? `${Math.floor(lesson.video_duration_seconds / 60)}:${String(lesson.video_duration_seconds % 60).padStart(2, '0')}` : '05:00');

                        return (
                          <div
                            key={lesson.id}
                            className={`px-5 py-3.5 flex items-center justify-between gap-4 transition-colors ${
                              isDone ? 'bg-emerald-500/[0.02]' : 'hover:bg-slate-50/70 dark:hover:bg-white/[0.02]'
                            }`}
                          >
                            <div className="flex items-center gap-3 truncate">
                              {isDone ? (
                                <div className="w-6 h-6 rounded-full bg-emerald-100 dark:bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                </div>
                              ) : isUnlocked ? (
                                <button
                                  onClick={() => {
                                    if (enrolled) {
                                      navigate(`/courses/${course.slug}/learn`);
                                    } else {
                                      setActivePreviewLesson(lesson);
                                      setShowPreviewModal(true);
                                    }
                                  }}
                                  className="w-6 h-6 rounded-full bg-sky-100 dark:bg-sky-500/10 hover:bg-sky-500 hover:text-white text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0 transition-colors cursor-pointer"
                                  title={enrolled ? "Go to Classroom" : "Play Free Preview"}
                                >
                                  <Play className="w-3 h-3 fill-current ml-0.5" />
                                </button>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-white/5 text-slate-400 flex items-center justify-center shrink-0">
                                  <Lock className="w-3 h-3" />
                                </div>
                              )}
                              
                              <div className="truncate">
                                <span className={`text-xs sm:text-sm font-semibold truncate ${
                                  isDone ? 'text-slate-900 dark:text-slate-100 line-through/opacity-90' : 'text-slate-800 dark:text-slate-200'
                                }`}>
                                  {lesson.position || lesson.id}. {lesson.title}
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 shrink-0">
                              {isDone ? (
                                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  Completed ✓
                                </span>
                              ) : isFreePreview && !enrolled ? (
                                <button
                                  onClick={() => {
                                    setActivePreviewLesson(lesson);
                                    setShowPreviewModal(true);
                                  }}
                                  className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 hover:bg-sky-100 dark:hover:bg-sky-500/20 cursor-pointer flex items-center gap-1 transition-colors"
                                >
                                  <Play className="w-2.5 h-2.5 fill-current" />
                                  <span>Free Preview</span>
                                </button>
                              ) : null}
                              <span className="text-xs font-mono text-slate-400 dark:text-slate-500">
                                {durationText}
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
                  src={course?.instructor?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
                  alt={course?.instructor?.name || 'Instructor'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-sky-500/30 shrink-0"
                />
                <div className="space-y-1">
                  <h4 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {course?.instructor?.name || 'NxtLearnn Engineering Team'}
                  </h4>
                  <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">
                    {course?.instructor?.role || course?.instructor?.title || 'Principal Systems Architect'}
                  </p>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {course?.instructor?.bio || 'Industry veteran architecting distributed microservices and production apps.'}
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
              
              {/* Scenario 1: User has Access (via Membership, Single Course, or Admin) */}
              {userHasAccess ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>
                        {isAdmin 
                          ? 'Admin Full Access' 
                          : isLifetimeMember 
                          ? 'Lifetime VIP Pass Active' 
                          : isMonthlyMember 
                          ? 'Monthly Pro Member Active' 
                          : 'Course Enrolled'}
                      </span>
                    </div>
                    <div className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Full Access Unlocked
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      You have complete access to all lessons, streaming videos, source code, and progress tracking.
                    </p>
                  </div>

                  {/* Real Course Progress Card */}
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-900 dark:text-white">
                      <span>Your Course Progress</span>
                      <span className="text-sky-500 font-mono">{progressPercent}%</span>
                    </div>

                    <div className="w-full h-2 rounded-full bg-slate-200 dark:bg-white/10 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-500 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                      <span>{completedCount} of {totalCount} lessons completed</span>
                      <span className="font-semibold text-emerald-500">
                        {progressPercent >= 100 ? 'Completed ✓' : progressPercent === 0 ? 'Not started' : 'In progress'}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 pt-1">
                    <button
                      onClick={() => navigate(`/courses/${course.slug}/learn`)}
                      className="w-full py-3.5 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <span>{progressPercent > 0 ? 'Continue to Classroom' : 'Go to Classroom'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => {
                        setActivePreviewLesson(firstLesson);
                        setShowPreviewModal(true);
                      }}
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                    >
                      Watch video preview
                    </button>
                  </div>
                </div>
              ) : !isSingleBuyable ? (
                /* Scenario 2: Polar Product ID is NOT yet published */
                <div className="space-y-5">
                  <div className="space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/20">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                      <span>Included in Pro & Lifetime Memberships</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                        Members Only
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      Single course purchase is not available yet for this track. Access this course and all others with an All-Access Membership.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => navigate('/pricing')}
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-sky-500 via-indigo-600 to-violet-600 hover:from-sky-400 hover:via-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <Sparkles className="w-4 h-4 text-sky-200" />
                      <span>Unlock with All-Access Membership</span>
                    </button>

                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="w-full py-3 px-4 rounded-xl font-bold text-xs text-slate-800 dark:text-white bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/15 border border-slate-200 dark:border-white/15 transition-colors cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current text-sky-500" />
                      <span>Watch Free Preview (Lesson 1)</span>
                    </button>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/[0.03] border border-slate-200/80 dark:border-white/10 text-[11px] text-slate-500 dark:text-slate-400 space-y-1">
                      <div className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Free preview works for everyone</span>
                      </div>
                      <p>
                        Individual purchase (~₹2,000) will be enabled as soon as the Polar product ID is published.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Scenario 3: Polar Product ID IS published - can be bought individually */
                <div className="space-y-5">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                        {course.price ? `₹${course.price.toLocaleString('en-IN')}` : '₹2,000'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        one-time
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Full lifetime access • All future updates included
                    </p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={handleBuyClick}
                      className="w-full py-3.5 px-4 rounded-xl font-extrabold text-sm bg-gradient-to-r from-sky-400 via-sky-500 to-indigo-600 hover:from-sky-300 hover:via-sky-400 hover:to-indigo-500 text-white shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-all cursor-pointer transform hover:-translate-y-0.5"
                    >
                      <span>Buy Course ({course.price ? `₹${course.price.toLocaleString('en-IN')}` : '₹2,000'})</span>
                    </button>

                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 border border-slate-200 dark:border-white/10 transition-colors cursor-pointer"
                    >
                      Watch free preview
                    </button>
                  </div>
                </div>
              )}

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
          FREE PREVIEW MODAL (Powered by ImageKit Video Player)
         ========================================================================= */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-4xl rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/15 overflow-hidden shadow-2xl space-y-4 p-5 sm:p-6 relative">
            <button
              onClick={() => setShowPreviewModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 transition-colors cursor-pointer z-10"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1 pr-10">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-300 border border-sky-200 dark:border-sky-500/20 uppercase tracking-wider">
                  ImageKit Video Player • Free Preview
                </span>
                <span className="text-[11px] font-mono text-emerald-500 font-semibold hidden sm:inline">
                  HLS Adaptive Bitrate (ABS)
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {activePreviewLesson?.title 
                  ? `Lesson ${activePreviewLesson.position || activePreviewLesson.id}: ${activePreviewLesson.title}` 
                  : (firstLesson?.title ? `Lesson 1: ${firstLesson.title}` : course.title)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {activePreviewLesson?.description || course.description}
              </p>
            </div>

            {/* Real ImageKit Player */}
            <div className="rounded-xl overflow-hidden aspect-video bg-black relative border border-slate-200 dark:border-white/10 shadow-inner">
              <ImageKitPlayer
                src={activePreviewLesson?.video_file_id || course.trailer_url}
                poster={course.thumbnail}
                title={activePreviewLesson?.title || course.title}
                autoplay={true}
              />
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-white/10 text-xs">
              <div className="text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Powered by ImageKit Video.js 8.20 streaming engine</span>
              </div>

              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    navigate(`/courses/${course.slug}/learn`);
                  }}
                  className="px-4 py-2 rounded-xl font-bold bg-sky-500 hover:bg-sky-400 text-white transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <span>Open Full Classroom</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                {!userHasAccess && isSingleBuyable && (
                  <button
                    onClick={() => {
                      setShowPreviewModal(false);
                      navigate(`/signup?course=${course.slug}`);
                    }}
                    className="px-4 py-2 rounded-xl font-bold bg-white/10 hover:bg-white/15 text-white border border-white/20 transition-colors cursor-pointer"
                  >
                    Buy Full Course
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
