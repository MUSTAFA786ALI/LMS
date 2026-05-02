/**
 * Custom Hook: useCourses
 * Provides easy access to courses state and actions
 */

import { useCallback, useEffect } from 'react';
import { useCourseStore } from '../store/courseStore';
import { Course, CourseDetail } from '../types/course.d';

export function useCourses() {
  const courses = useCourseStore((state) => state.courses);
  const filteredCourses = useCourseStore((state) => state.filteredCourses);
  const selectedCourse = useCourseStore((state) => state.selectedCourse);
  const bookmarkedCourseIds = useCourseStore((state) => state.bookmarkedCourseIds);
  const enrolledCourseIds = useCourseStore((state) => state.enrolledCourseIds);
  const searchQuery = useCourseStore((state) => state.searchQuery);
  const isLoading = useCourseStore((state) => state.isLoading);
  const error = useCourseStore((state) => state.error);

  const fetchCourses = useCallback(async (forceRefresh = false) => {
    try {
      await useCourseStore.getState().fetchCourses(forceRefresh);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const searchCourses = useCallback((query: string) => {
    useCourseStore.getState().searchCourses(query);
  }, []);

  const setSelectedCourse = useCallback((course: CourseDetail | null) => {
    useCourseStore.getState().setSelectedCourse(course);
  }, []);

  const addBookmark = useCallback(async (courseId: string) => {
    try {
      await useCourseStore.getState().addBookmark(courseId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const removeBookmark = useCallback(async (courseId: string) => {
    try {
      await useCourseStore.getState().removeBookmark(courseId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const toggleBookmark = useCallback(async (courseId: string) => {
    try {
      await useCourseStore.getState().toggleBookmark(courseId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const isBookmarked = useCallback((courseId: string) => {
    return useCourseStore.getState().isBookmarked(courseId);
  }, []);

  const addEnrollment = useCallback(async (courseId: string) => {
    try {
      await useCourseStore.getState().addEnrollment(courseId);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const isEnrolled = useCallback((courseId: string) => {
    return useCourseStore.getState().isEnrolled(courseId);
  }, []);

  const getBookmarkedCourses = useCallback(() => {
    return useCourseStore.getState().getBookmarkedCourses();
  }, []);

  const getEnrolledCourses = useCallback(() => {
    return useCourseStore.getState().getEnrolledCourses();
  }, []);

  const clearError = useCallback(() => {
    useCourseStore.getState().clearError();
  }, []);

  // Hydrate on mount
  useEffect(() => {
    useCourseStore.getState().hydrate();
  }, []);

  return {
    courses,
    filteredCourses,
    selectedCourse,
    bookmarkedCourseIds: Array.from(bookmarkedCourseIds),
    enrolledCourseIds: Array.from(enrolledCourseIds),
    searchQuery,
    isLoading,
    error,
    fetchCourses,
    searchCourses,
    setSelectedCourse,
    addBookmark,
    removeBookmark,
    toggleBookmark,
    isBookmarked,
    addEnrollment,
    isEnrolled,
    getBookmarkedCourses,
    getEnrolledCourses,
    clearError,
  };
}

export default useCourses;
