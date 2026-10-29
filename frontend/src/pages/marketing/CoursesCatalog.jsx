import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, Clock, BookOpen, Sparkles, ArrowRight, Star, 
  Layers, Users, CheckCircle2, Play
} from 'lucide-react';
import { COURSES } from '../../data/coursesData';
import { coursesApi } from '../../api/client';
import { useEnrollment } from '../../hooks/useEnrollment';
import Button from '../../components/ui/Button';

export default function CoursesCatalog() {
  const { isEnrolled } = useEnrollment();
  const [coursesList, setCoursesList] = useState(COURSES);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Fetch live courses from API
  const fetchLiveCourses = async () => {
    try {
      const data = await coursesApi.getAll();
      if (data && Array.isArray(data)) {
        const formatted = data.map((c) => ({
          id: c.id,
          slug: c.slug,
          title: c.title,
          subtitle: c.description,
          description: c.description,
          category: c.category || 'Full-Stack',
          polar_product_id: c.polar_product_id,
          can_buy_single: Boolean(c.polar_product_id && c.polar_product_id.trim()),
          tags: Array.isArray(c.tags)
            ? c.tags
            : (c.tags ? c.tags.split(',').map((t) => t.trim()).filter(Boolean) : [c.category || 'Full-Stack']),
          level: c.level || 'Intermediate',
          price: c.price !== undefined && c.price > 0 ? `₹${c.price.toLocaleString('en-IN')}` : '₹2,000',
          priceNumber: c.price || 2000,
          duration: c.duration || '12h',
          lessonsCount: c.lessons_count || (c.sections ? c.sections.reduce((acc, s) => acc + (s.lessons?.length || 0), 0) : 0),
          rating: c.rating || 4.9,
          studentsCount: c.students_count || 120,
          thumbnail: c.thumbnail_url || 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&auto=format&fit=crop&q=80',
        }));
        setCoursesList(formatted);
      }
    } catch (err) {
      console.warn('Fallback to local courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCourses();
  }, []);

  // Compute categories dynamically from current courses list
  const categories = useMemo(() => {
    const rawCategories = coursesList.map((c) => c.category).filter(Boolean);
    const unique = Array.from(new Set(rawCategories));
    return ['All', ...unique];
  }, [coursesList]);

  const filteredCourses = coursesList.filter((course) => {
    const matchesSearch = 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (course.description && course.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (course.tags && course.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())));
    
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
              <span>Industry-Grade Curricula • {coursesList.length} Tracks Available</span>
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

        {/* Category Filter Pills (Dynamically populated from database courses) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileTap={{ scale: 0.96 }}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-indigo-600 dark:bg-indigo-600 text-white shadow-md shadow-indigo-500/25 border border-indigo-500/40'
                  : 'bg-white dark:bg-[#080d1a] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-white/[0.08] hover:border-slate-300 dark:hover:border-white/[0.18]'
              }`}
            >
              {cat}
            </motion.button>
          ))}
          <span className="text-xs text-slate-400 dark:text-slate-500 ml-auto hidden sm:inline font-mono">
            Showing {filteredCourses.length} of {coursesList.length} courses
          </span>
        </div>

        {/* Courses Grid */}
        {loading && coursesList.length === 0 ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading courses...</p>
          </div>
        ) : filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course, idx) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className="group flex flex-col rounded-2xl bg-white dark:bg-[#080d1a]/95 border border-slate-200 dark:border-white/[0.08] overflow-hidden hover:border-indigo-500/40 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 shadow-sm"
              >
                {/* Thumbnail / Header */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-transparent to-black/30" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-[11px] font-bold bg-indigo-600/90 text-white backdrop-blur-md shadow-sm">
                    {course.category}
                  </div>

                  {/* Price or Membership Tag */}
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md border border-white/10 shadow-sm bg-slate-950/80 text-white">
                    {course.can_buy_single ? (
                      <span>{course.price}</span>
                    ) : (
                      <span className="text-indigo-300 flex items-center gap-1 text-[11px] font-semibold">
                        <Sparkles className="w-3 h-3 text-indigo-400" />
                        <span>Membership</span>
                      </span>
                    )}
                  </div>

                  {/* Play Simulation Icon on Hover */}
                  <Link
                    to={`/courses/${course.slug}`}
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[2px]"
                  >
                    <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/50 transform group-hover:scale-110 transition-transform">
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
                          className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 dark:bg-white/[0.04] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/[0.08]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <Link to={`/courses/${course.slug}`}>
                      <h3 className="font-extrabold text-lg text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
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
                      <div className="flex items-center gap-1 font-mono">
                        <Users className="w-3.5 h-3.5" />
                        <span>{Number(course.studentsCount || 1240).toLocaleString()} enrolled</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Info */}
                  <div className="pt-4 border-t border-slate-100 dark:border-white/[0.08] flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-3 font-mono">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                        {course.lessonsCount} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-indigo-500" />
                        {course.duration}
                      </span>
                    </div>

                    <Button
                      to={`/courses/${course.slug}`}
                      variant="secondary"
                      size="sm"
                      className="font-bold text-xs"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      View Course
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-white dark:bg-[#080d1a] border border-slate-200 dark:border-white/[0.08] space-y-4">
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              No courses found matching "{searchTerm}" {selectedCategory !== 'All' ? `in ${selectedCategory}` : ''}.
            </p>
            <Button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('All');
              }}
              variant="primary"
              size="sm"
            >
              Reset Filters
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
