import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, Clock, BookOpen, Sparkles, ArrowRight, Star, 
  Layers, Users, CheckCircle2, Play
} from 'lucide-react';
import { COURSES } from '../../data/coursesData';
import { useEnrollment } from '../../hooks/useEnrollment';

const CATEGORIES = ['All', 'Full-Stack', 'Backend & Systems', 'Frontend', 'DevOps & Cloud', 'AI & Data'];

export default function CoursesCatalog() {
  const { isEnrolled } = useEnrollment();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredCourses = COURSES.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = 
      selectedCategory === 'All' || course.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#02050e] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        
        {/* Header & Tagline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200 dark:border-white/10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-500/20">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Industry-Grade Curricula • 6 Production Tracks</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Explore All Courses
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Step-by-step interactive courses inspired by real-world tech stacks. Explore full modules, view code setups, and track your progress live.
            </p>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-80 shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-500" />
            <input
              type="text"
              placeholder="Search courses, stacks or tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 shadow-sm"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-sky-600 dark:bg-sky-500 text-white shadow-md shadow-sky-500/25'
                  : 'bg-white dark:bg-[#060b19] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto hidden sm:inline">
            Showing {filteredCourses.length} of {COURSES.length} courses
          </span>
        </div>

        {/* Courses Grid (6 Courses) */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="group flex flex-col rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 overflow-hidden hover:border-sky-500/50 hover:shadow-2xl hover:shadow-sky-500/10 transition-all duration-300"
              >
                {/* Thumbnail / Header */}
                <div className="relative aspect-video overflow-hidden bg-slate-900">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-[11px] font-bold bg-sky-500/90 text-white backdrop-blur-md shadow-sm">
                    {course.category}
                  </div>

                  {/* Price Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md text-xs font-bold bg-slate-900/90 text-white border border-white/20 backdrop-blur-md">
                    {course.price || (course.priceNumber ? `₹${course.priceNumber.toLocaleString()}` : '₹2,499')}
                  </div>

                  {/* Play Simulation Icon on Hover */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/50 transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </Link>
                </div>

                {/* Course Meta & Details */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {course.tags?.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-white/5 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/10"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link to={`/courses/${course.slug}`}>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                    </Link>

                    {/* Subtitle / Description */}
                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                      {course.subtitle || course.description}
                    </p>

                    {/* Ratings & Students */}
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-500" />
                        <span className="font-bold text-slate-800 dark:text-slate-200">{course.rating || '4.9'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        <span>{Number(course.studentsCount || 1240).toLocaleString()} enrolled</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-sky-500" />
                        {course.lessonsCount} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-sky-500" />
                        {course.duration}
                      </span>
                    </div>

                    <Link
                      to={`/courses/${course.slug}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 hover:bg-sky-100 dark:hover:bg-sky-500/20 font-bold transition-colors cursor-pointer text-xs"
                    >
                      View Course
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-white dark:bg-[#060b19] border border-slate-200 dark:border-white/10 space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No courses found matching "{searchTerm}" {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-sky-600 text-white hover:bg-sky-500 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
