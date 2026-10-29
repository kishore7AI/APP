import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Layers, ExternalLink, ArrowLeft, 
  Video, Upload, Trash2, Check, AlertCircle, Shield, 
  Eye, VideoOff, ChevronRight, Loader2
} from 'lucide-react';
import { adminApi, authApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import ImageKitPlayer from '../../components/video/ImageKitPlayer';
import Button from '../../components/ui/Button';

export default function AdminLessonEditPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Lesson State
  const [lessonData, setLessonData] = useState({
    title: '',
    slug: '',
    section_id: '',
    section_title: '',
    course_id: courseId,
    course_title: '',
    course_slug: '',
    course_sections: [],
    position: 1,
    video_file_id: '',
    video_duration_seconds: 0,
    content: '',
    is_free_preview: false,
    status: 'published',
  });

  // Video Upload State
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Load Lesson Data
  useEffect(() => {
    let isMounted = true;
    const fetchLesson = async () => {
      try {
        setLoading(true);
        setErrorMsg('');

        if (!localStorage.getItem('nxtlearnn_token') && user?.email) {
          try {
            const syncRes = await authApi.syncSession({
              email: user.email,
              full_name: user.name || user.full_name,
              avatar_url: user.image || user.avatar_url,
            });
            if (syncRes?.access_token) {
              localStorage.setItem('nxtlearnn_token', syncRes.access_token);
            }
          } catch (e) {}
        }

        let data;
        try {
          data = await adminApi.getLesson(lessonId);
        } catch (firstErr) {
          if (user?.email && (firstErr.message?.includes('credentials') || firstErr.message?.includes('token'))) {
            const syncRes = await authApi.syncSession({
              email: user.email,
              full_name: user.name || user.full_name,
              avatar_url: user.image || user.avatar_url,
            });
            if (syncRes?.access_token) {
              localStorage.setItem('nxtlearnn_token', syncRes.access_token);
              data = await adminApi.getLesson(lessonId);
            } else {
              throw firstErr;
            }
          } else {
            throw firstErr;
          }
        }

        if (data && isMounted) {
          setLessonData({
            title: data.title || '',
            slug: data.slug || (data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : ''),
            section_id: data.section_id || '',
            section_title: data.section_title || '',
            course_id: data.course_id || courseId,
            course_title: data.course_title || 'Course',
            course_slug: data.course_slug || '',
            course_sections: data.course_sections || [],
            position: data.position || 1,
            video_file_id: data.video_file_id || '',
            video_duration_seconds: data.video_duration_seconds || 0,
            content: data.content || '',
            is_free_preview: Boolean(data.is_free_preview),
            status: data.status || 'published',
          });
        }
      } catch (err) {
        console.error('Failed to load lesson details:', err);
        setErrorMsg('Failed to load lesson details. Please ensure the lesson exists.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchLesson();
    return () => { isMounted = false; };
  }, [lessonId, courseId, user?.email]);

  // Handle Title Change & Auto-slug generator
  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setLessonData((prev) => ({
      ...prev,
      title: newTitle,
      // If slug was untouched or matched previous title slug, update it
      slug: prev.slug === '' || prev.slug === prev.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        ? newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
        : prev.slug,
    }));
  };

  // Handle Save
  const handleSaveChanges = async (e) => {
    if (e) e.preventDefault();
    if (!lessonData.title.trim()) {
      setErrorMsg('Lesson title is required.');
      return;
    }

    try {
      setSaving(true);
      setErrorMsg('');
      await adminApi.updateLesson(lessonId, {
        title: lessonData.title,
        slug: lessonData.slug,
        section_id: parseInt(lessonData.section_id),
        content: lessonData.content,
        is_free_preview: lessonData.is_free_preview,
        status: lessonData.status,
        video_file_id: lessonData.video_file_id,
        video_duration_seconds: lessonData.video_duration_seconds,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save lesson:', err);
      setErrorMsg(err.message || 'Failed to save changes.');
    } finally {
      setSaving(false);
    }
  };

  // Handle Video Upload to ImageKit
  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingVideo(true);
      setUploadProgress('Uploading video to ImageKit...');

      // Upload via backend ImageKit service
      const res = await adminApi.uploadMedia(file, `courses/lessons/${lessonData.course_slug || 'course'}`);
      
      const uploadedFileId = res.url || res.fileId || res.filePath;
      
      setLessonData((prev) => ({
        ...prev,
        video_file_id: uploadedFileId,
      }));

      // Immediately persist video reference to database
      await adminApi.updateLesson(lessonId, {
        video_file_id: uploadedFileId,
        video_duration_seconds: prev => prev || 300,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Video upload failed:', err);
      alert(`Video upload failed: ${err.message || 'Unknown error'}`);
    } finally {
      setUploadingVideo(false);
      setUploadProgress(null);
    }
  };

  // Handle Delete Lesson
  const handleDeleteLesson = async () => {
    try {
      setDeleting(true);
      await adminApi.deleteLesson(lessonId);
      navigate(`/admin/courses/${courseId}`);
    } catch (err) {
      console.error('Failed to delete lesson:', err);
      alert(`Failed to delete lesson: ${err.message}`);
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#02050e] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isPublished = lessonData.status === 'published';

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col md:flex-row">
      
      {/* =========================================================================
          LEFT SIDEBAR (Matches Lumen / Admin Design)
         ========================================================================= */}
      <aside className="w-full md:w-64 border-r border-slate-800/80 bg-[#060a16] p-4 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          {/* Logo */}
          <div className="flex items-center gap-2 px-2 py-1">
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-extrabold tracking-tight text-white text-base">
              NxtLearnn
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/60 ml-1">
              Admin
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <Link
              to="/admin"
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 transition-colors"
            >
              <Layers className="w-4 h-4" />
              <span>Courses</span>
            </Link>
            <Link
              to="/"
              target="_blank"
              className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <ExternalLink className="w-4 h-4" />
                <span>View site</span>
              </span>
            </Link>
          </nav>
        </div>

        {/* User Card at Bottom */}
        <div className="pt-4 border-t border-slate-800/80 flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-xs">
            {user?.name?.[0] || 'A'}
          </div>
          <div className="truncate text-xs">
            <p className="font-semibold text-slate-200 truncate">{user?.name || 'Administrator'}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.email || 'admin@nxtlearnn.com'}</p>
          </div>
        </div>
      </aside>

      {/* =========================================================================
          MAIN EDIT AREA (Matches Exact UI in Image 1)
         ========================================================================= */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl mx-auto space-y-8 overflow-y-auto">
        
        {/* Top Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-medium text-slate-400">
          <Link to="/admin" className="hover:text-white transition-colors">
            Courses
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to={`/admin/courses/${courseId}`} className="hover:text-white transition-colors truncate max-w-xs">
            {lessonData.course_title || 'Course'}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-200 font-semibold truncate max-w-xs">
            {lessonData.title || 'Lesson Setup'}
          </span>
        </nav>

        {/* Lesson Title Header & Badges */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {lessonData.title || 'Untitled Lesson'}
            </h1>
            
            {/* Status Badge */}
            <span className={`px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider uppercase border ${
              isPublished 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}>
              {lessonData.status || 'Draft'}
            </span>

            {/* Free Preview Badge */}
            {lessonData.is_free_preview && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                Free preview
              </span>
            )}
          </div>

          <Link
            to={`/admin/courses/${courseId}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to course</span>
          </Link>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-red-950/40 border border-red-800/60 text-xs text-red-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Two-Column Layout (Matching User Image 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* ===================================================================
              LEFT COLUMN: Details Card
             =================================================================== */}
          <div className="lg:col-span-8 rounded-2xl bg-[#080d1a] border border-slate-800/90 p-6 sm:p-7 shadow-xl space-y-6">
            <h2 className="text-base font-bold text-white tracking-wide">
              Details
            </h2>

            <form onSubmit={handleSaveChanges} className="space-y-6">
              
              {/* Title & Slug Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonData.title}
                    onChange={handleTitleChange}
                    placeholder="e.g. VS Code Setup for Claude"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030612] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>

                {/* Slug Input */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={lessonData.slug}
                    onChange={(e) => setLessonData({ ...lessonData, slug: e.target.value })}
                    placeholder="vs-code-setup-for-claude"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#030612] border border-slate-800 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors font-mono"
                  />
                  <p className="text-[11px] text-slate-500">
                    Unique within this course.
                  </p>
                </div>
              </div>

              {/* Section Select Dropdown */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Section
                </label>
                <select
                  value={lessonData.section_id}
                  onChange={(e) => setLessonData({ ...lessonData, section_id: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#030612] border border-slate-800 text-xs sm:text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors cursor-pointer"
                >
                  {lessonData.course_sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.title}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500">
                  Moving it puts it at the end of that section.
                </p>
              </div>

              {/* Toggles: Published & Free Preview */}
              <div className="space-y-4 pt-2">
                
                {/* Published Toggle */}
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={isPublished}
                    onClick={() =>
                      setLessonData((prev) => ({
                        ...prev,
                        status: prev.status === 'published' ? 'draft' : 'published',
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      isPublished ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        isPublished ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-slate-200">
                    Published
                  </span>
                </div>

                {/* Free Preview Toggle */}
                <div className="flex items-center gap-3 cursor-pointer select-none">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={lessonData.is_free_preview}
                    onClick={() =>
                      setLessonData((prev) => ({
                        ...prev,
                        is_free_preview: !prev.is_free_preview,
                      }))
                    }
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                      lessonData.is_free_preview ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                        lessonData.is_free_preview ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <span className="text-xs font-medium text-slate-200">
                    Free preview <span className="text-slate-400 font-normal">(anyone can watch)</span>
                  </span>
                </div>

              </div>

              {/* Lesson notes (Markdown Textarea) */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-semibold text-slate-300">
                  Lesson notes
                </label>
                <textarea
                  rows={6}
                  value={lessonData.content}
                  onChange={(e) => setLessonData({ ...lessonData, content: e.target.value })}
                  placeholder="Let's go ahead and learn how to set up Claude Code in VS Code using their extension."
                  className="w-full px-3.5 py-3 rounded-xl bg-[#030612] border border-slate-800 text-xs sm:text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-indigo-500 transition-colors font-mono leading-relaxed"
                />
                <p className="text-[11px] text-slate-500">
                  Markdown. Shown under the video.
                </p>
              </div>

              {/* Save Button */}
              <div className="pt-2 flex items-center gap-3">
                <Button
                  type="submit"
                  loading={saving}
                  variant="primary"
                  size="md"
                  leftIcon={saveSuccess ? <Check className="w-4 h-4 text-emerald-300" /> : undefined}
                >
                  {saving ? 'Saving...' : saveSuccess ? 'Changes Saved!' : 'Save changes'}
                </Button>
              </div>

            </form>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Video Card & Delete Lesson Card
             =================================================================== */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card 1: Video Card */}
            <div className="rounded-2xl bg-[#080d1a] border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Video
              </h3>

              {/* Video Player Box or Placeholder */}
              <div className="aspect-video rounded-xl bg-[#02050f] border border-slate-800 overflow-hidden relative flex items-center justify-center">
                {lessonData.video_file_id ? (
                  <div className="w-full h-full relative">
                    <ImageKitPlayer
                      src={lessonData.video_file_id}
                      title={lessonData.title}
                      autoplay={false}
                    />
                  </div>
                ) : (
                  <div className="text-center space-y-2 p-4">
                    <div className="w-10 h-10 rounded-full bg-slate-800/60 flex items-center justify-center mx-auto text-slate-500">
                      <VideoOff className="w-5 h-5" />
                    </div>
                    <p className="text-[11px] text-slate-500">
                      No video uploaded yet
                    </p>
                  </div>
                )}
              </div>

              {/* Privacy Notice */}
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <Shield className="w-3.5 h-3.5 text-slate-500" />
                <span>Private. It only plays through signed URLs.</span>
              </div>

              {/* Upload Video Button with hidden file input */}
              <label className="w-full py-2.5 px-4 rounded-xl border border-slate-700/80 bg-[#11182c] hover:bg-[#16213c] text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm">
                <Upload className="w-3.5 h-3.5 text-indigo-400" />
                <span>{uploadingVideo ? (uploadProgress || 'Uploading...') : (lessonData.video_file_id ? 'Replace video' : 'Upload video')}</span>
                <input
                  type="file"
                  accept="video/*"
                  disabled={uploadingVideo}
                  onChange={handleVideoUpload}
                  className="sr-only"
                />
              </label>

              {uploadingVideo && (
                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full w-2/3 animate-pulse" />
                </div>
              )}
            </div>

            {/* Card 2: Delete Lesson Card */}
            <div className="rounded-2xl bg-[#080d1a] border border-slate-800/90 p-5 sm:p-6 shadow-xl space-y-3">
              <h3 className="text-sm font-bold text-white tracking-wide">
                Delete lesson
              </h3>
              
              <p className="text-xs text-slate-400 leading-relaxed">
                Removes the lesson and its video from ImageKit.
              </p>

              <Button
                variant="danger"
                size="sm"
                className="w-full text-center"
                onClick={() => setShowDeleteModal(true)}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Delete lesson
              </Button>
            </div>

          </div>

        </div>

      </main>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 8 }}
              className="max-w-md w-full rounded-2xl bg-[#080d1a] border border-rose-500/30 p-6 space-y-4 shadow-2xl"
            >
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400" />
                <span>Delete "{lessonData.title}"?</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete this lesson? This action will permanently remove the lesson and its video records.
              </p>
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-slate-800/80">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  loading={deleting}
                  onClick={handleDeleteLesson}
                >
                  {deleting ? 'Deleting...' : 'Yes, Delete'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
