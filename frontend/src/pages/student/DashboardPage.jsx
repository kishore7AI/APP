import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useEnrollment } from '../../hooks/useEnrollment';
import { coursesApi } from '../../api/client';
import { 
  PlayCircle, Clock, BookOpen, ArrowRight, Award, 
  Sparkles, CheckCircle2, ChevronRight, Compass, ShieldCheck 
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { hasCourseAccess, isMember, membership, getCompletedLessons } = useEnrollment();

  const [allCourses, setAllCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const data = await coursesApi.getAll();
        if (isMounted) {
          setAllCourses(data || []);
        }
      } catch (err) {
        console.error('Failed to load courses on dashboard:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchCourses();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter only courses the student has actual access to
  const enrolledCourses = allCourses.filter((course) => hasCourseAccess(course.slug));

  // Find the primary course to continue watching
  // Prioritize courses where the student has started lessons, or default to the first enrolled course
  const inProgressCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  // Calculate progress details for the active course
  let completedCount = 0;
  let totalLessons = 0;
  let progressPercent = 0;
  let lastLessonTitle = 'Getting Started';

  if (inProgressCourse) {
    const completedSet = getCompletedLessons(inProgressCourse.slug);
    completedCount = completedSet.size;

    // Calculate total lessons from sections
    if (inProgressCourse.sections && inProgressCourse.sections.length > 0) {
      const allLessons = inProgressCourse.sections.flatMap((s) => s.lessons || []);
      totalLessons = allLessons.length;

      // Find first uncompleted lesson, or the last one completed
      const uncompletedLesson = allLessons.find((l) => !completedSet.has(l.id));
      if (uncompletedLesson) {
        lastLessonTitle = uncompletedLesson.title;
      } else if (allLessons.length > 0) {
        lastLessonTitle = allLessons[allLessons.length - 1].title;
      }
    } else {
      totalLessons = inProgressCourse.lessons_count || 1;
    }

    progressPercent = totalLessons > 0 ? Math.min(100, Math.round((completedCount / totalLessons) * 100)) : 0;
  }

  // Display user name cleanly
  const userName = user?.name || user?.fullName || (user?.email ? user.email.split('@')[0] : 'Student');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
              Welcome back, {userName}! 👋
            </h1>
            {isMember && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                {membership === 'lifetime' ? 'Lifetime VIP' : 'Monthly Member'}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {enrolledCourses.length > 0 
              ? 'Pick up right where you paused your last lesson.'
              : 'Browse our curriculum and start your modern full-stack journey.'}
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors self-start shadow-sm"
        >
          <BookOpen className="w-4 h-4 text-brand-400" />
          Browse More Courses
        </Link>
      </div>

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {/* Continue Learning Hero Card - ONLY shown if student has at least one enrolled course */}
          {inProgressCourse ? (
            <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-950/70 via-[#0c1220] to-[#0c1220] border border-brand-500/30 shadow-2xl flex flex-col md:flex-row items-center gap-6">
              <Link 
                to={`/courses/${inProgressCourse.slug}/learn`}
                className="group relative w-full md:w-80 aspect-video rounded-2xl overflow-hidden shrink-0 bg-gray-900 border border-slate-800 shadow-md block"
              >
                <img
                  src={inProgressCourse.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80'}
                  alt={inProgressCourse.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/45 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                  <PlayCircle className="w-14 h-14 text-white/90 drop-shadow-lg group-hover:scale-110 group-hover:text-brand-400 transition-all cursor-pointer" />
                </div>
              </Link>

              <div className="flex-1 space-y-4 w-full">
                <div className="space-y-1">
                  <span className="text-[11px] font-bold tracking-wider uppercase text-brand-400">
                    Continue Watching
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold text-white line-clamp-1">
                    {inProgressCourse.title}
                  </h2>
                  <p className="text-sm text-gray-300 font-medium line-clamp-1">
                    {lastLessonTitle}
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-gray-400 font-medium">
                    <span>
                      {completedCount} of {totalLessons} lessons completed
                    </span>
                    <span className="font-semibold text-brand-400">{progressPercent}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-800/80 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-brand-500 to-indigo-500 transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <Link
                    to={`/courses/${inProgressCourse.slug}/learn`}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 transition-all cursor-pointer active:scale-95"
                  >
                    Resume Lesson
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/courses/${inProgressCourse.slug}`}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-gray-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 transition-colors"
                  >
                    Course Overview
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            /* Empty State when student has no active enrollments yet */
            <div className="rounded-3xl p-8 sm:p-10 bg-gradient-to-br from-slate-900/60 via-[#0b101e] to-slate-900/60 border border-slate-800 shadow-xl text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400">
                <Compass className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <h2 className="text-xl font-bold text-white">No Enrolled Courses Yet</h2>
                <p className="text-sm text-gray-400">
                  You haven't enrolled in any courses yet. Browse our library below to discover hands-on courses and start building production-ready apps!
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 transition-all"
                >
                  <Sparkles className="w-4 h-4" />
                  Explore Course Catalog
                </Link>
              </div>
            </div>
          )}

          {/* Enrolled Courses Section */}
          {enrolledCourses.length > 0 ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-5 h-5 text-brand-400" />
                My Enrolled Courses ({enrolledCourses.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => {
                  const compSet = getCompletedLessons(course.slug);
                  const courseLessons = course.sections?.flatMap((s) => s.lessons || []) || [];
                  const totLessons = courseLessons.length || course.lessons_count || 1;
                  const pct = Math.min(100, Math.round((compSet.size / totLessons) * 100));

                  return (
                    <div
                      key={course.id || course.slug}
                      className="p-5 rounded-2xl bg-white dark:bg-[#0c1220] border border-gray-200 dark:border-slate-800/80 hover:border-brand-500/40 transition-all shadow-md flex flex-col justify-between space-y-4 group"
                    >
                      <div className="space-y-3">
                        <Link 
                          to={`/courses/${course.slug}/learn`}
                          className="relative aspect-video rounded-xl overflow-hidden block bg-slate-900"
                        >
                          <img
                            src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80'}
                            alt={course.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                            <PlayCircle className="w-10 h-10 text-white/90 drop-shadow group-hover:scale-110 transition-transform" />
                          </div>
                        </Link>

                        <div>
                          <Link 
                            to={`/courses/${course.slug}`}
                            className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 hover:text-brand-400 transition-colors"
                          >
                            {course.title}
                          </Link>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                            {course.description || 'Comprehensive step-by-step masterclass.'}
                          </p>
                        </div>
                      </div>

                      <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800/60">
                        <div className="flex items-center justify-between text-xs text-gray-400">
                          <span>Status: Active</span>
                          <span className="text-emerald-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {membership === 'lifetime' ? 'Lifetime Access' : 'Enrolled'}
                          </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-[11px] text-gray-500 dark:text-gray-400">
                            <span>{compSet.size} of {totLessons} lessons</span>
                            <span className="font-semibold text-brand-400">{pct}%</span>
                          </div>
                          <div className="w-full h-1.5 rounded-full bg-gray-100 dark:bg-gray-800 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-brand-500"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                        </div>

                        <Link
                          to={`/courses/${course.slug}/learn`}
                          className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-brand-500/10 hover:bg-brand-500/20 text-brand-400 border border-brand-500/20 transition-all text-center"
                        >
                          Continue Learning
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            /* Catalog Display when no enrolled courses */
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Compass className="w-5 h-5 text-brand-400" />
                  All Available Courses ({allCourses.length})
                </h3>
                <Link
                  to="/courses"
                  className="text-xs text-brand-400 hover:text-brand-300 font-semibold"
                >
                  View full catalog →
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCourses.map((course) => (
                  <div
                    key={course.id || course.slug}
                    className="p-5 rounded-2xl bg-white dark:bg-[#0c1220] border border-gray-200 dark:border-slate-800/80 hover:border-brand-500/40 transition-all shadow-md flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      <Link 
                        to={`/courses/${course.slug}`}
                        className="relative aspect-video rounded-xl overflow-hidden block bg-slate-900"
                      >
                        <img
                          src={course.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80'}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-2.5 right-2.5 bg-slate-900/80 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-semibold text-slate-300 border border-slate-700">
                          {course.level || 'Intermediate'}
                        </div>
                      </Link>

                      <div>
                        <Link 
                          to={`/courses/${course.slug}`}
                          className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1 hover:text-brand-400 transition-colors"
                        >
                          {course.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                          {course.description || 'Step-by-step masterclass with real-world architecture.'}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2 border-t border-gray-100 dark:border-slate-800/60">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-400">{course.lessons_count || 10}+ Lessons</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ₹{course.price ? course.price.toLocaleString('en-IN') : '2,000'}
                        </span>
                      </div>

                      <Link
                        to={`/courses/${course.slug}`}
                        className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-brand-600 hover:bg-brand-500 text-white transition-all text-center shadow-md shadow-brand-500/20"
                      >
                        View Course Details
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

    </div>
  );
}
