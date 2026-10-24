import { useState, useEffect } from 'react';

const ENROLLED_STORAGE_KEY = 'nxtlearnn_enrolled_courses';
const PROGRESS_STORAGE_KEY_PREFIX = 'nxtlearnn_progress_';

// Purge any previous test enrollments so all courses default to "Buy course" state
try {
  localStorage.removeItem(ENROLLED_STORAGE_KEY);
} catch (e) {
  // ignore
}

export function useEnrollment() {
  const [enrolledSlugs, setEnrolledSlugs] = useState(() => {
    try {
      localStorage.removeItem(ENROLLED_STORAGE_KEY);
    } catch (e) {}
    return [];
  });

  const isEnrolled = (slug) => enrolledSlugs.includes(slug);

  const enrollCourse = (slug) => {
    setEnrolledSlugs((prev) => {
      if (prev.includes(slug)) return prev;
      const updated = [...prev, slug];
      try {
        localStorage.setItem(ENROLLED_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save enrollment:', e);
      }
      return updated;
    });
  };

  const unenrollCourse = (slug) => {
    setEnrolledSlugs((prev) => {
      const updated = prev.filter(s => s !== slug);
      try {
        localStorage.setItem(ENROLLED_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update enrollment:', e);
      }
      return updated;
    });
  };

  const clearAllEnrollments = () => {
    setEnrolledSlugs([]);
    try {
      localStorage.removeItem(ENROLLED_STORAGE_KEY);
    } catch (e) {}
  };

  // Get completed lesson IDs for a specific course (starts clean at 0%)
  const getCompletedLessons = (slug) => {
    try {
      const saved = localStorage.getItem(`${PROGRESS_STORAGE_KEY_PREFIX}${slug}`);
      if (!saved) return new Set();
      return new Set(JSON.parse(saved));
    } catch {
      return new Set();
    }
  };

  // Save completed lesson IDs
  const saveCompletedLessons = (slug, lessonSet) => {
    try {
      localStorage.setItem(
        `${PROGRESS_STORAGE_KEY_PREFIX}${slug}`,
        JSON.stringify(Array.from(lessonSet))
      );
    } catch (e) {
      console.error('Failed to save progress:', e);
    }
  };

  return {
    enrolledSlugs,
    isEnrolled,
    enrollCourse,
    unenrollCourse,
    clearAllEnrollments,
    getCompletedLessons,
    saveCompletedLessons,
  };
}
