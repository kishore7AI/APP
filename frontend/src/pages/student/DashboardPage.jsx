import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlayCircle, Clock, BookOpen, ArrowRight, Award } from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const enrolledCourse = {
    title: 'Full-Stack Fast & Furious: React + FastAPI Production Mastery',
    slug: 'react-fastapi-production-mastery',
    lastLesson: 'Lesson 04: Setting up ImageKit HLS Adaptive Streaming',
    progress: 45,
    totalLessons: 42,
    completedLessons: 19,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Welcome header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-gray-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome back, {user?.name || user?.fullName || 'Student'}! 👋
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Pick up right where you paused your last lesson.
          </p>
        </div>

        <Link
          to="/courses"
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors self-start"
        >
          <BookOpen className="w-4 h-4" />
          Browse More Courses
        </Link>
      </div>

      {/* Continue Learning Hero Card */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-brand-900/40 via-[#121824] to-[#121824] border border-brand-500/30 shadow-xl flex flex-col md:flex-row items-center gap-6">
        <div className="relative w-full md:w-72 aspect-video rounded-2xl overflow-hidden shrink-0 bg-gray-800">
          <img
            src={enrolledCourse.thumbnail}
            alt={enrolledCourse.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <PlayCircle className="w-12 h-12 text-white/90 drop-shadow-md hover:scale-110 transition-transform cursor-pointer" />
          </div>
        </div>

        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brand-400">
              Continue Watching
            </span>
            <h2 className="text-xl font-bold text-white line-clamp-1">{enrolledCourse.title}</h2>
            <p className="text-sm text-gray-300 font-medium line-clamp-1">{enrolledCourse.lastLesson}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{enrolledCourse.completedLessons} of {enrolledCourse.totalLessons} lessons completed</span>
              <span className="font-semibold text-brand-400">{enrolledCourse.progress}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-brand-600 to-violet-500"
                style={{ width: `${enrolledCourse.progress}%` }}
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => alert('FastAPI video playback pipeline is being wired in Phase 5!')}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-sm text-white bg-brand-600 hover:bg-brand-500 shadow-lg shadow-brand-500/25 transition-all"
            >
              Resume Lesson
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Enrolled Courses Section */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-500" />
          My Enrolled Courses (1)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#121824] border border-gray-200 dark:border-gray-800 space-y-4">
            <img
              src={enrolledCourse.thumbnail}
              alt="course"
              className="w-full aspect-video rounded-xl object-cover"
            />
            <h4 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-1">{enrolledCourse.title}</h4>
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span>Status: Active</span>
              <span className="text-emerald-400 font-semibold">Lifetime Access</span>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
