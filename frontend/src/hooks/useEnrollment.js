import { useState, useEffect } from 'react';

const ENROLLED_STORAGE_KEY = 'nxtlearnn_enrolled_courses';
const MEMBERSHIP_STORAGE_KEY = 'nxtlearnn_membership_tier'; // 'none' | 'monthly' | 'lifetime'
const PROGRESS_STORAGE_KEY_PREFIX = 'nxtlearnn_progress_';

export function useEnrollment() {
  const [enrolledSlugs, setEnrolledSlugs] = useState(() => {
    try {
      const saved = localStorage.getItem(ENROLLED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [membership, setMembershipState] = useState(() => {
    try {
      return localStorage.getItem(MEMBERSHIP_STORAGE_KEY) || 'none';
    } catch (e) {
      return 'none';
    }
  });

  const setMembership = (tier) => {
    setMembershipState(tier);
    try {
      localStorage.setItem(MEMBERSHIP_STORAGE_KEY, tier);
    } catch (e) {
      console.error('Failed to save membership tier:', e);
    }
  };

  const isMonthlyMember = membership === 'monthly';
  const isLifetimeMember = membership === 'lifetime';
  const isMember = isMonthlyMember || isLifetimeMember;

  // Single course enrollment
  const isCourseEnrolled = (slug) => enrolledSlugs.includes(slug);

  // Overall course access check:
  // Monthly and Lifetime members have access to ALL courses!
  // Single course buyers have access to that specific course.
  const hasCourseAccess = (slug) => {
    if (isMember) return true;
    return isCourseEnrolled(slug);
  };

  // Backwards compatibility alias for isEnrolled
  const isEnrolled = (slug) => hasCourseAccess(slug);

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
      const updated = prev.filter((s) => s !== slug);
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
    setMembership('none');
    try {
      localStorage.removeItem(ENROLLED_STORAGE_KEY);
      localStorage.removeItem(MEMBERSHIP_STORAGE_KEY);
    } catch (e) {}
  };

  // Lesson access rule:
  // - Free preview lessons (id === 1 or is_free_preview) work for everyone.
  // - Other lessons require course access (Membership or single enrollment).
  const isLessonAccessible = (slug, lesson) => {
    if (!lesson) return false;
    if (lesson.id === 1 || lesson.is_free_preview) return true;
    return hasCourseAccess(slug);
  };

  // Check if course can be bought individually
  const canBuySingle = (course) => {
    if (!course) return false;
    return Boolean(course.polar_product_id && course.polar_product_id.trim());
  };

  // Progress helpers
  const getCompletedLessons = (slug) => {
    try {
      const saved = localStorage.getItem(`${PROGRESS_STORAGE_KEY_PREFIX}${slug}`);
      if (!saved) return new Set();
      return new Set(JSON.parse(saved));
    } catch {
      return new Set();
    }
  };

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
    membership,
    setMembership,
    isMonthlyMember,
    isLifetimeMember,
    isMember,
    hasCourseAccess,
    isCourseEnrolled,
    isEnrolled,
    enrollCourse,
    unenrollCourse,
    clearAllEnrollments,
    isLessonAccessible,
    canBuySingle,
    getCompletedLessons,
    saveCompletedLessons,
  };
}
