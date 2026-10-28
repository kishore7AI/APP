import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { 
  Sparkles, Layers, ExternalLink, GripVertical, 
  Video, Upload, Trash2, Plus, Film, Image as ImageIcon, 
  ArrowLeft, Check, AlertCircle, Eye
} from 'lucide-react';
import { adminApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user } = useAuth();
  const { id: routeCourseId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [activeCourseId, setActiveCourseId] = useState(routeCourseId ? parseInt(routeCourseId) : null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingChanges, setSavingChanges] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Form State for Active Course
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    status: 'published',
    category: 'Full-Stack',
    price: 2499,
    tags: '',
    level: 'Intermediate',
    polar_product_id: '',
    description: '',
    thumbnail_url: '',
    trailer_url: '',
  });

  // Curriculum State
  const [newSectionTitle, setNewSectionTitle] = useState('');
  const [addingSection, setAddingSection] = useState(false);
  const [newLessonTitleBySection, setNewLessonTitleBySection] = useState({});
  const [addingLessonSectionId, setAddingLessonSectionId] = useState(null);
  const [activeEditingLessonId, setActiveEditingLessonId] = useState(null);

  // Upload States
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false);
  const [uploadingTrailer, setUploadingTrailer] = useState(false);
  const [uploadingLessonVideoId, setUploadingLessonVideoId] = useState(null);

  // Initial load
  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getCourses();
      setCourses(data || []);
      
      let targetId = activeCourseId;
      if (routeCourseId) {
        targetId = parseInt(routeCourseId);
      } else if (!targetId && data && data.length > 0) {
        targetId = data[0].id;
      }
      
      setActiveCourseId(targetId);
      if (targetId) {
        const found = (data || []).find((c) => c.id === targetId);
        if (found) {
          hydrateCourseData(found);
          setIsCreatingNew(false);
        }
      } else if (!isCreatingNew) {
        setActiveCourse(null);
      }
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, [routeCourseId]);

  const hydrateCourseData = (course) => {
    setActiveCourse(course);
    setFormData({
      title: course.title || '',
      slug: course.slug || '',
      status: course.status || 'published',
      category: course.category || 'Full-Stack',
      price: course.price !== undefined ? course.price : 0,
      tags: course.tags || '',
      level: course.level || 'Intermediate',
      polar_product_id: course.polar_product_id || '',
      description: course.description || '',
      thumbnail_url: course.thumbnail_url || '',
      trailer_url: course.trailer_url || '',
    });
  };

  // Switch Active Course
  const handleSelectCourse = (courseId) => {
    setIsCreatingNew(false);
    setActiveCourseId(courseId);
    navigate(`/admin/courses/${courseId}`);
    const found = courses.find((c) => c.id === courseId);
    if (found) {
      hydrateCourseData(found);
    }
  };

  // Start Creating a New Course in UI only (does NOT insert dummy to DB)
  const handleStartCreateCourse = () => {
    setIsCreatingNew(true);
    setActiveCourseId(null);
    setActiveCourse({ id: null, sections: [] });
    setFormData({
      title: '',
      slug: '',
      status: 'published',
      category: 'Full-Stack',
      price: 2499,
      tags: 'Web Development',
      level: 'Intermediate',
      polar_product_id: '',
      description: '',
      thumbnail_url: '',
      trailer_url: '',
    });
  };

  // Save or Create Course Details
  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a course title.');
      return;
    }

    const slug = (formData.slug || formData.title)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    try {
      setSavingChanges(true);
      setSaveSuccess(false);

      if (isCreatingNew) {
        // Only save to DB when user actually submits
        const created = await adminApi.createCourse({
          title: formData.title.trim(),
          slug: slug,
          status: formData.status || 'published',
          category: formData.category || 'Full-Stack',
          price: parseInt(formData.price) || 0,
          tags: formData.tags || '',
          level: formData.level || 'Intermediate',
          polar_product_id: formData.polar_product_id || '',
          description: formData.description || '',
          thumbnail_url: formData.thumbnail_url || '',
          trailer_url: formData.trailer_url || '',
        });

        const updatedList = await adminApi.getCourses();
        setCourses(updatedList);
        setIsCreatingNew(false);
        handleSelectCourse(created.id);
      } else {
        if (!activeCourse) return;
        await adminApi.updateCourse(activeCourse.id, {
          title: formData.title,
          slug: slug,
          status: formData.status,
          category: formData.category,
          price: parseInt(formData.price) || 0,
          tags: formData.tags,
          level: formData.level,
          polar_product_id: formData.polar_product_id,
          description: formData.description,
          thumbnail_url: formData.thumbnail_url,
          trailer_url: formData.trailer_url,
        });

        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);

        // Refresh data
        const updatedList = await adminApi.getCourses();
        setCourses(updatedList);
        const refreshed = updatedList.find((c) => c.id === activeCourse.id);
        if (refreshed) {
          hydrateCourseData(refreshed);
        }
      }
    } catch (err) {
      alert(`Failed to save course: ${err.message}`);
    } finally {
      setSavingChanges(false);
    }
  };

  // Delete Course
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) return;
    try {
      await adminApi.deleteCourse(courseId);
      const updated = await adminApi.getCourses();
      setCourses(updated);
      if (updated.length > 0) {
        handleSelectCourse(updated[0].id);
      } else {
        setActiveCourseId(null);
        setActiveCourse(null);
        navigate('/admin');
      }
    } catch (err) {
      alert(`Failed to delete course: ${err.message}`);
    }
  };

  // Add Section
  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!newSectionTitle.trim() || !activeCourse) return;

    try {
      setAddingSection(true);
      await adminApi.addSection(activeCourse.id, {
        title: newSectionTitle.trim(),
        position: (activeCourse.sections?.length || 0) + 1,
      });
      setNewSectionTitle('');
      const updated = await adminApi.getCourse(activeCourse.id);
      hydrateCourseData(updated);
    } catch (err) {
      alert(`Failed to add section: ${err.message}`);
    } finally {
      setAddingSection(false);
    }
  };

  // Delete Section
  const handleDeleteSection = async (sectionId) => {
    if (!window.confirm('Delete this section and all associated lessons?')) return;
    try {
      await adminApi.deleteSection(sectionId);
      const updated = await adminApi.getCourse(activeCourse.id);
      hydrateCourseData(updated);
    } catch (err) {
      alert(`Failed to delete section: ${err.message}`);
    }
  };

  // Add Lesson
  const handleAddLesson = async (sectionId) => {
    const title = newLessonTitleBySection[sectionId];
    if (!title || !title.trim()) return;

    try {
      setAddingLessonSectionId(sectionId);
      await adminApi.addLesson(sectionId, {
        title: title.trim(),
        position: 1,
        video_duration_seconds: 0,
        is_free_preview: false,
        status: 'draft',
      });
      setNewLessonTitleBySection((prev) => ({ ...prev, [sectionId]: '' }));
      const updated = await adminApi.getCourse(activeCourse.id);
      hydrateCourseData(updated);
    } catch (err) {
      alert(`Failed to add lesson: ${err.message}`);
    } finally {
      setAddingLessonSectionId(null);
    }
  };

  // Delete Lesson
  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm('Delete this lesson?')) return;
    try {
      await adminApi.deleteLesson(lessonId);
      const updated = await adminApi.getCourse(activeCourse.id);
      hydrateCourseData(updated);
    } catch (err) {
      alert(`Failed to delete lesson: ${err.message}`);
    }
  };

  // Upload Thumbnail
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeCourse) return;

    try {
      setUploadingThumbnail(true);
      const res = await adminApi.uploadMedia(file, 'courses/thumbnails');
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail_url: res.url }));
        await adminApi.updateCourse(activeCourse.id, { thumbnail_url: res.url });
        const updated = await adminApi.getCourse(activeCourse.id);
        hydrateCourseData(updated);
      }
    } catch (err) {
      alert(`Thumbnail upload failed: ${err.message}`);
    } finally {
      setUploadingThumbnail(false);
    }
  };

  // Upload Trailer Video
  const handleTrailerUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !activeCourse) return;

    try {
      setUploadingTrailer(true);
      const res = await adminApi.uploadMedia(file, 'courses/trailers');
      if (res && res.url) {
        setFormData((prev) => ({ ...prev, trailer_url: res.url }));
        await adminApi.updateCourse(activeCourse.id, { trailer_url: res.url });
        const updated = await adminApi.getCourse(activeCourse.id);
        hydrateCourseData(updated);
      }
    } catch (err) {
      alert(`Trailer upload failed: ${err.message}`);
    } finally {
      setUploadingTrailer(false);
    }
  };

  // Upload Lesson Video
  const handleLessonVideoUpload = async (lessonId, file) => {
    if (!file || !activeCourse) return;
    try {
      setUploadingLessonVideoId(lessonId);
      const res = await adminApi.uploadMedia(file, 'courses/lessons');
      if (res && (res.file_id || res.url)) {
        // Refresh course curriculum
        const updated = await adminApi.getCourse(activeCourse.id);
        hydrateCourseData(updated);
      }
    } catch (err) {
      alert(`Lesson video upload failed: ${err.message}`);
    } finally {
      setUploadingLessonVideoId(null);
    }
  };

  // Stats calculation
  const totalSections = activeCourse?.sections?.length || 0;
  const totalLessons = (activeCourse?.sections || []).reduce(
    (acc, sec) => acc + (sec.lessons?.length || 0),
    0
  );
  const totalDurationSeconds = (activeCourse?.sections || []).reduce(
    (acc, sec) => acc + (sec.lessons || []).reduce((lAcc, l) => lAcc + (l.video_duration_seconds || 0), 0),
    0
  );

  const formatDuration = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      
      {/* ========================================================================= */}
      {/* LEFT SIDEBAR (Matching reference navigation: LUMEN Admin style) */}
      {/* ========================================================================= */}
      <aside className="w-full md:w-64 bg-[#050814] border-r border-slate-800/80 flex flex-col shrink-0">
        
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-3.5 h-3.5 fill-indigo-400" />
            </div>
            <span className="font-extrabold text-sm tracking-wider text-white uppercase">
              NxtLearnn
            </span>
          </div>
          <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border border-slate-700/80 bg-slate-800/40 text-slate-300">
            Admin
          </span>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1.5 flex-1">
          <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-indigo-950/40 border border-indigo-500/30 text-indigo-200 text-xs font-semibold shadow-sm">
            <div className="flex items-center gap-2.5">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>Courses</span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-indigo-500/20 text-indigo-300">
              {courses.length}
            </span>
          </div>

          <Link
            to="/"
            target="_blank"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/40 transition-colors text-xs font-medium cursor-pointer"
          >
            <ExternalLink className="w-4 h-4 text-slate-500" />
            <span>View site</span>
          </Link>

          {/* Courses Switcher List in Sidebar */}
          <div className="pt-6">
            <div className="flex items-center justify-between px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500">
              <span>Your Courses</span>
              <button
                onClick={handleStartCreateCourse}
                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>New</span>
              </button>
            </div>

            <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
              {isCreatingNew && (
                <div className="w-full text-left px-3 py-2 rounded-lg text-xs truncate bg-indigo-950/70 text-indigo-200 font-semibold border border-indigo-500/40 shadow-sm flex items-center justify-between">
                  <span className="truncate">{formData.title || 'New Course (Draft)'}</span>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-300 font-mono">DRAFT</span>
                </div>
              )}
              {courses.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelectCourse(c.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs truncate transition-all cursor-pointer flex items-center justify-between ${
                    c.id === activeCourseId && !isCreatingNew
                      ? 'bg-slate-800/80 text-white font-semibold border border-slate-700/60 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <span className="truncate">{c.title || 'Untitled Course'}</span>
                  <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${c.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Footer User Info */}
        <div className="p-4 border-t border-slate-800/80 text-xs text-slate-400 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="truncate font-mono text-[11px] text-slate-300">
            {user?.email || 'admin@nxtlearnn.com'}
          </span>
        </div>

      </aside>

      {/* ========================================================================= */}
      {/* MAIN CONTENT CANVAS (Two-Column Course Studio Matching Reference) */}
      {/* ========================================================================= */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 overflow-y-auto">
        
        {loading && !activeCourse && !isCreatingNew ? (
          <div className="py-24 text-center space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500">Loading course studio...</p>
          </div>
        ) : !activeCourse && !isCreatingNew ? (
          /* Empty State: Prompt to create first course */
          <div className="max-w-xl mx-auto py-24 text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(99,102,241,0.2)]">
              <Layers className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-xl font-bold text-white">No Course Selected</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Create a course to set up your title, URL slug, Polar product ID, curriculum modules, and video streaming.
              </p>
            </div>
            <button
              onClick={handleStartCreateCourse}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-indigo-500/40 bg-[#121936] text-indigo-100 hover:bg-[#182147] shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer inline-flex items-center gap-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Course
            </button>
          </div>
        ) : (
          /* Two-Column Studio Layout */
          <div className="max-w-6xl mx-auto space-y-6">
            
            {/* Top Toolbar / Breadcrumbs */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-500 font-mono">
                  {isCreatingNew ? '/admin/courses/new' : `/admin/courses/${activeCourse?.id}`}
                </span>
                <span className="text-slate-600">•</span>
                <Link
                  to={formData.slug ? `/courses/${formData.slug}` : '/courses'}
                  target="_blank"
                  className="text-xs text-slate-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  <span>Public View</span>
                </Link>
              </div>

              {saveSuccess && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                  <Check className="w-3.5 h-3.5" />
                  <span>Changes saved successfully</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* ========================================================================= */}
              {/* LEFT COLUMN: Details Card & Curriculum Card */}
              {/* ========================================================================= */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* 1. Details Card */}
                <div className="rounded-2xl bg-[#080d1a] border border-slate-800/80 p-6 space-y-5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      {isCreatingNew ? 'Create New Course' : 'Details'}
                    </h2>
                    {isCreatingNew && (
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium font-mono">
                        DRAFT
                      </span>
                    )}
                  </div>

                  <form onSubmit={handleSaveChanges} className="space-y-4">
                    {/* Row 1: Title and Slug */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                          <span>Title</span>
                          <span className="text-rose-400 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => {
                            const newTitle = e.target.value;
                            if (isCreatingNew) {
                              const autoSlug = newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                              setFormData({ ...formData, title: newTitle, slug: autoSlug });
                            } else {
                              setFormData({ ...formData, title: newTitle });
                            }
                          }}
                          placeholder="Claude Code Tutorial"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                          <span>Slug</span>
                          <span className="text-rose-400 font-bold">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.slug}
                          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                          placeholder="claude-code-tutorial"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                        />
                        <p className="text-[11px] text-slate-500 font-mono">
                          /courses/{formData.slug || 'slug'}
                        </p>
                      </div>
                    </div>

                    {/* Row 2: Category and Price */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          Category
                        </label>
                        <input
                          type="text"
                          list="category-suggestions"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                          placeholder="e.g. Full-Stack, Backend, AI"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                        />
                        <datalist id="category-suggestions">
                          <option value="Full-Stack" />
                          <option value="Backend & Systems" />
                          <option value="Frontend" />
                          <option value="DevOps & Cloud" />
                          <option value="AI & Data" />
                        </datalist>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Shows as a category filter tab on the courses page.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          Price (INR ₹)
                        </label>
                        <input
                          type="number"
                          min="0"
                          step="1"
                          value={formData.price}
                          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                          placeholder="2499"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors font-mono"
                        />
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Course price shown on the card (set 0 for Free).
                        </p>
                      </div>
                    </div>

                    {/* Row 3: Tags & Level */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          Tags (comma-separated)
                        </label>
                        <input
                          type="text"
                          value={formData.tags}
                          onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                          placeholder="Next.js 15, Prisma, PostgreSQL"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors text-xs font-mono"
                        />
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Tech stack pills displayed on the course card.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300">
                          Difficulty Level
                        </label>
                        <select
                          value={formData.level}
                          onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors cursor-pointer"
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Target audience difficulty level.
                        </p>
                      </div>
                    </div>

                    {/* Row 4: Status & Polar Product ID */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                          <span>Status</span>
                          <span className="text-rose-400 font-bold">*</span>
                        </label>
                        <select
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500/80 transition-colors cursor-pointer"
                        >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                        <p className="text-[11px] text-slate-500 leading-tight">
                          Draft: only you. Archived: only people who already have access.
                        </p>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-medium text-slate-300">
                            Polar product ID
                          </label>
                          <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                        </div>
                        <input
                          type="text"
                          value={formData.polar_product_id}
                          onChange={(e) => setFormData({ ...formData, polar_product_id: e.target.value })}
                          placeholder="Not linked yet"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm font-mono text-xs placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                        />
                        <p className="text-[11px] text-slate-400 leading-tight">
                          Leave blank if Polar product is not yet published. The course remains published and watchable by Monthly &amp; Lifetime members, with free preview lessons open to everyone. Add Polar Product ID when ready to allow single course purchase (~₹2,000).
                        </p>
                      </div>
                    </div>

                    {/* Row 3: Description */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-slate-300">
                          Description
                        </label>
                        <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                      </div>
                      <textarea
                        rows={4}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="The ultimate course tutorial that you need."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#0c1326] border border-slate-800 text-slate-100 text-sm placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors leading-relaxed"
                      />
                      <p className="text-[11px] text-slate-500">
                        Markdown. Shown on the course page.
                      </p>
                    </div>

                    {/* Save / Create course button */}
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={savingChanges}
                        className="px-5 py-2.5 rounded-xl text-xs font-semibold border border-indigo-500/40 bg-[#121936] text-indigo-100 hover:bg-[#182147] shadow-[0_0_20px_rgba(99,102,241,0.25)] transition-all cursor-pointer disabled:opacity-50"
                      >
                        {savingChanges 
                          ? (isCreatingNew ? 'Creating course...' : 'Saving changes...') 
                          : (isCreatingNew ? 'Create Course' : 'Save changes')}
                      </button>
                    </div>
                  </form>
                </div>

                {/* 2. Curriculum Card */}
                <div className="rounded-2xl bg-[#080d1a] border border-slate-800/80 p-6 space-y-4 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-bold text-white tracking-tight">
                      Curriculum
                    </h2>
                    <span className="text-xs text-slate-400 font-mono">
                      {totalSections} sections · {totalLessons} lessons · {formatDuration(totalDurationSeconds)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Drag the handles to reorder. Click a lesson to edit it and upload its video.
                  </p>

                  {/* Sections List */}
                  <div className="space-y-4 pt-2">
                    {isCreatingNew ? (
                      <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-800 rounded-xl space-y-1.5">
                        <p className="font-semibold text-slate-300">Curriculum setup is enabled once the course is created.</p>
                        <p className="text-[11px] text-slate-500">Fill in the details above and click "Create Course" to add sections and ImageKit videos.</p>
                      </div>
                    ) : (activeCourse?.sections || []).length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800/80 rounded-xl">
                        No modules created yet. Add a section title below to build your curriculum.
                      </div>
                    ) : (
                      activeCourse.sections.map((section) => {
                        const secDuration = (section.lessons || []).reduce(
                          (acc, l) => acc + (l.video_duration_seconds || 0),
                          0
                        );
                        return (
                          <div
                            key={section.id}
                            className="rounded-xl border border-slate-800/80 bg-[#090e1c] p-4 space-y-3"
                          >
                            {/* Section Header Row */}
                            <div className="flex items-center justify-between text-xs text-slate-200">
                              <div className="flex items-center gap-2">
                                <GripVertical className="w-4 h-4 text-slate-500 cursor-grab" />
                                <span className="font-semibold text-white text-sm">
                                  {section.title}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="text-slate-400 text-xs font-mono">
                                  {section.lessons?.length || 0} lessons · {formatDuration(secDuration)}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSection(section.id)}
                                  className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                  title="Delete Section"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>

                            {/* Lessons List Inside Section */}
                            <div className="space-y-2 pl-4">
                              {(section.lessons || []).map((lesson, lIdx) => (
                                <div
                                  key={lesson.id}
                                  className="p-2.5 rounded-lg bg-[#0c1326] hover:bg-[#0f1830] border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs group"
                                >
                                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                    <GripVertical className="w-3.5 h-3.5 text-slate-600 shrink-0 cursor-grab" />
                                    <Link
                                      to={`/admin/courses/${activeCourseId}/lessons/${lesson.id}`}
                                      className="flex items-center gap-2.5 min-w-0 flex-1 text-slate-200 hover:text-indigo-300 transition-colors"
                                      title="Click to edit lesson & upload video"
                                    >
                                      <Video className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 shrink-0" />
                                      <span className="font-medium truncate group-hover:text-indigo-300">
                                        {lIdx + 1}. {lesson.title}
                                      </span>
                                    </Link>
                                  </div>

                                  <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                                    {lesson.is_free_preview && (
                                      <span className="text-[10px] font-semibold text-indigo-300 bg-indigo-950/60 border border-indigo-800/40 px-1.5 py-0.5 rounded">
                                        Free
                                      </span>
                                    )}
                                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800/60 px-1.5 py-0.5 rounded capitalize">
                                      {lesson.status || 'Draft'}
                                    </span>
                                    <span className="text-slate-500 text-[11px] font-mono">
                                      {lesson.video_duration_seconds > 0
                                        ? `${Math.floor(lesson.video_duration_seconds / 60)}:${(lesson.video_duration_seconds % 60).toString().padStart(2, '0')}`
                                        : '--:--'}
                                    </span>

                                    {/* Video upload trigger */}
                                    <label className="text-[11px] text-slate-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer">
                                      <Upload className="w-3 h-3" />
                                      <span>
                                        {uploadingLessonVideoId === lesson.id ? 'Uploading...' : 'Video'}
                                      </span>
                                      <input
                                        type="file"
                                        accept="video/*"
                                        className="sr-only"
                                        onChange={(e) => {
                                          const file = e.target.files?.[0];
                                          if (file) handleLessonVideoUpload(lesson.id, file);
                                        }}
                                      />
                                    </label>

                                    <button
                                      type="button"
                                      onClick={() => handleDeleteLesson(lesson.id)}
                                      className="text-slate-500 hover:text-rose-400 transition-colors cursor-pointer"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>
                              ))}

                              {/* New Lesson Input for this section */}
                              <div className="flex items-center gap-2 pt-1">
                                <input
                                  type="text"
                                  placeholder="New lesson title"
                                  value={newLessonTitleBySection[section.id] || ''}
                                  onChange={(e) =>
                                    setNewLessonTitleBySection({
                                      ...newLessonTitleBySection,
                                      [section.id]: e.target.value,
                                    })
                                  }
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      e.preventDefault();
                                      handleAddLesson(section.id);
                                    }
                                  }}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-[#070b14] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                                />
                                <button
                                  type="button"
                                  disabled={addingLessonSectionId === section.id}
                                  onClick={() => handleAddLesson(section.id)}
                                  className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-700/80 bg-[#131b2e]/70 hover:bg-[#18233c] text-slate-200 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                                >
                                  {addingLessonSectionId === section.id ? '+ Adding...' : '+ Add lesson'}
                                </button>
                              </div>
                            </div>

                          </div>
                        );
                      })
                    )}

                    {/* New Section Input at bottom */}
                    <form onSubmit={handleAddSection} className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                      <input
                        type="text"
                        placeholder="New section title"
                        value={newSectionTitle}
                        onChange={(e) => setNewSectionTitle(e.target.value)}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-[#0c1326] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
                      />
                      <button
                        type="submit"
                        disabled={addingSection || !newSectionTitle.trim()}
                        className="px-3.5 py-2 rounded-xl text-xs font-medium border border-slate-700/80 bg-[#131b2e]/70 hover:bg-[#18233c] text-slate-200 transition-colors shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {addingSection ? '+ Adding...' : '+ Add section'}
                      </button>
                    </form>

                  </div>
                </div>

              </div>

              {/* ========================================================================= */}
              {/* RIGHT COLUMN: Thumbnail, Trailer & Delete Course Cards */}
              {/* ========================================================================= */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* 1. Thumbnail Card */}
                <div className="rounded-2xl bg-[#080d1a] border border-slate-800/80 p-5 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      Thumbnail
                    </h3>
                    <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                  </div>

                  {formData.thumbnail_url ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-[#0c1326]">
                      <img
                        src={formData.thumbnail_url}
                        alt="Course Thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-xl bg-[#0c1326] border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-2">
                      <ImageIcon className="w-8 h-8 opacity-40" />
                      <span className="text-[11px]">No thumbnail uploaded</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500">
                    16:9, at least 1280×720. Public.
                  </p>

                  <label className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-700/80 bg-[#131b2e]/60 hover:bg-[#18233c] text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{uploadingThumbnail ? 'Uploading to ImageKit...' : 'Replace thumbnail'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={handleThumbnailUpload}
                      disabled={uploadingThumbnail}
                    />
                  </label>
                </div>

                {/* 2. Trailer Card */}
                <div className="rounded-2xl bg-[#080d1a] border border-slate-800/80 p-5 space-y-3.5 shadow-xl">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white">
                      Trailer
                    </h3>
                    <span className="text-[10px] text-slate-500 font-normal">Optional</span>
                  </div>

                  {formData.trailer_url ? (
                    <div className="w-full aspect-video rounded-xl overflow-hidden border border-slate-800 bg-black">
                      <video
                        controls
                        src={formData.trailer_url}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full aspect-video rounded-xl bg-[#0c1326] border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 gap-2">
                      <Film className="w-8 h-8 opacity-40" />
                      <span className="text-[11px]">No trailer uploaded</span>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-500">
                    Plays on the course page. Public.
                  </p>

                  <label className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-700/80 bg-[#131b2e]/60 hover:bg-[#18233c] text-slate-200 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm">
                    <Upload className="w-3.5 h-3.5 text-slate-400" />
                    <span>{uploadingTrailer ? 'Uploading Trailer...' : 'Replace trailer'}</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="sr-only"
                      onChange={handleTrailerUpload}
                      disabled={uploadingTrailer}
                    />
                  </label>
                </div>

                {/* 3. Delete course / Cancel Draft Card */}
                <div className="rounded-2xl bg-[#080d1a] border border-slate-800/80 p-5 space-y-3.5 shadow-xl">
                  <h3 className="text-sm font-bold text-white">
                    {isCreatingNew ? 'Cancel Creation' : 'Delete course'}
                  </h3>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    {isCreatingNew 
                      ? 'Discard this course draft and return to existing courses.'
                      : 'Removes every section, lesson and uploaded file. To hide a course but keep it for its students, set it to Archived instead.'}
                  </p>

                  {isCreatingNew ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreatingNew(false);
                        if (courses.length > 0) handleSelectCourse(courses[0].id);
                      }}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300 transition-colors cursor-pointer"
                    >
                      Cancel Draft
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleDeleteCourse(activeCourse?.id)}
                      className="w-full py-2 px-3 rounded-xl text-xs font-semibold border border-rose-500/30 bg-rose-950/20 hover:bg-rose-950/40 text-rose-400 transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete course</span>
                    </button>
                  )}
                </div>

              </div>

            </div>

          </div>
        )}

      </main>

    </div>
  );
}
