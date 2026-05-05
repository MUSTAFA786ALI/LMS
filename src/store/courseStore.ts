/**
 * Zustand Course Store
 * Manages courses, bookmarks, and course-related state
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { Course, CourseDetail } from '../types/course.d';
import { getCourses, searchCourses as searchCoursesApi } from '../api/courses';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/theme';
import { debounce } from '../utils/helpers';

interface CourseStore {
  // State
  courses: Course[];
  filteredCourses: Course[];
  selectedCourse: CourseDetail | null;
  bookmarkedCourseIds: Set<string>;
  enrolledCourseIds: Set<string>;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  lastSyncTime: number | null;

  // Actions
  hydrate: () => Promise<void>;
  fetchCourses: (forceRefresh?: boolean) => Promise<void>;
  searchCourses: (query: string) => void;
  setSelectedCourse: (course: CourseDetail | null) => void;
  addBookmark: (courseId: string) => Promise<void>;
  removeBookmark: (courseId: string) => Promise<void>;
  toggleBookmark: (courseId: string) => Promise<void>;
  isBookmarked: (courseId: string) => boolean;
  addEnrollment: (courseId: string) => Promise<void>;
  isEnrolled: (courseId: string) => boolean;
  getBookmarkedCourses: () => Course[];
  getEnrolledCourses: () => Course[];
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useCourseStore = create<CourseStore>()(
  immer((set, get) => ({
    // State
    courses: [],
    filteredCourses: [],
    selectedCourse: null,
    bookmarkedCourseIds: new Set(),
    enrolledCourseIds: new Set(),
    searchQuery: '',
    isLoading: false,
    error: null,
    lastSyncTime: null,

    // Actions
    hydrate: async () => {
      console.log('[CourseStore] Starting hydration');
      set((state) => {
        state.isLoading = true;
      });

      try {
        // Try to load from cache (non-blocking)
        const cachedCourses = await Promise.race([
          storage.getObject<Course[]>(STORAGE_KEYS.COURSES_CACHE),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 2000))
        ]);
        
        const cachedBookmarks = await Promise.race([
          storage.getObject<string[]>(STORAGE_KEYS.BOOKMARKS),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
        ]);
        
        const cachedEnrollments = await Promise.race([
          storage.getObject<string[]>(STORAGE_KEYS.ENROLLMENTS),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
        ]);
        
        const cachedLastSync = await Promise.race([
          storage.getString(STORAGE_KEYS.LAST_SYNC),
          new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
        ]);

        const lastSync = cachedLastSync ? parseInt(cachedLastSync, 10) : 0;
        const cacheExpiry = 30 * 60 * 1000; // 30 minutes

        set((state) => {
          if (cachedCourses && Array.isArray(cachedCourses)) {
            state.courses = cachedCourses;
            state.filteredCourses = cachedCourses;
            console.log('[CourseStore] Loaded cached courses:', cachedCourses.length);
          }
          if (cachedBookmarks && Array.isArray(cachedBookmarks)) {
            state.bookmarkedCourseIds = new Set(cachedBookmarks);
          }
          if (cachedEnrollments && Array.isArray(cachedEnrollments)) {
            state.enrolledCourseIds = new Set(cachedEnrollments);
          }
          state.lastSyncTime = lastSync;
          state.isLoading = false; // Mark as loaded even if cache is empty
        });

        // Refresh in background if cache is old (don't wait for this)
        if (Date.now() - lastSync > cacheExpiry) {
          console.log('[CourseStore] Cache expired, refreshing in background');
          get().fetchCourses(true).catch((error) => {
            console.warn('[CourseStore] Background refresh failed:', error.message);
          });
        }
      } catch (error) {
        console.error('[CourseStore] Hydration error:', error);
        set((state) => {
          state.isLoading = false; // Don't block on errors
        });
      }
    },

    fetchCourses: async (forceRefresh = false) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        console.log('[CourseStore.fetchCourses] Starting fetch, forceRefresh:', forceRefresh);
        const response = await getCourses(50);

        console.log('[CourseStore.fetchCourses] Response received:', {
          success: response.success,
          hasData: !!response.data,
          dataLength: Array.isArray(response.data) ? response.data.length : 0,
          message: response.message,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Failed to fetch courses');
        }

        const courses = response.data;

        // Cache courses
        await Promise.all([
          storage.setObject(STORAGE_KEYS.COURSES_CACHE, courses),
          storage.setString(STORAGE_KEYS.LAST_SYNC, Date.now().toString())
        ]);

        console.log('[CourseStore.fetchCourses] Courses cached:', courses.length);

        set((state) => {
          state.courses = courses;
          state.filteredCourses = courses;
          state.isLoading = false;
          state.error = null;
          state.lastSyncTime = Date.now();
        });

        console.log('[CourseStore.fetchCourses] State updated successfully');
      } catch (error: any) {
        const errorMessage = error.message || 'Failed to fetch courses. Using cached data.';
        console.error('[CourseStore.fetchCourses] Error:', errorMessage, error);

        // Fallback: try to use cached data even if fetch failed
        try {
          const cachedCourses = await storage.getObject<Course[]>(STORAGE_KEYS.COURSES_CACHE);
          if (cachedCourses && cachedCourses.length > 0) {
            console.log('[CourseStore.fetchCourses] Using cached fallback courses:', cachedCourses.length);
            set((state) => {
              state.courses = cachedCourses;
              state.filteredCourses = cachedCourses;
              state.isLoading = false;
              state.error = `${errorMessage} (using cached data)`;
              state.lastSyncTime = Date.now();
            });
            return; // Success with fallback, don't throw
          }
        } catch (fallbackError) {
          console.error('[CourseStore.fetchCourses] Fallback cache load failed:', fallbackError);
        }

        // If no cache available, still mark as not loading but with error
        set((state) => {
          state.isLoading = false;
          state.error = errorMessage;
          // Keep existing courses if any
        });

        throw error;
      }
    },

    searchCourses: debounce((query: string) => {
      const { courses } = get();
      let filtered = courses;

      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        filtered = courses.filter(
          (course) =>
            course.title.toLowerCase().includes(lowerQuery) ||
            course.description.toLowerCase().includes(lowerQuery) ||
            `${course.instructor.firstName} ${course.instructor.lastName}`
              .toLowerCase()
              .includes(lowerQuery)
        );
      }

      set((state) => {
        state.searchQuery = query;
        state.filteredCourses = filtered;
      });
    }, 300),

    setSelectedCourse: (course: CourseDetail | null) => {
      set((state) => {
        state.selectedCourse = course;
      });
    },

    addBookmark: async (courseId: string) => {
      const { bookmarkedCourseIds } = get();

      // Update state immediately
      const newBookmarks = new Set(bookmarkedCourseIds);
      newBookmarks.add(courseId);

      set((state) => {
        state.bookmarkedCourseIds = newBookmarks;
      });

      try {
        // Persist to storage
        await storage.setObject(STORAGE_KEYS.BOOKMARKS, Array.from(newBookmarks));
      } catch (error) {
        console.error('[CourseStore] Error saving bookmark:', error);
        // Revert on error
        set((state) => {
          state.bookmarkedCourseIds = bookmarkedCourseIds;
        });
      }
    },

    removeBookmark: async (courseId: string) => {
      const { bookmarkedCourseIds } = get();

      // Update state immediately
      const newBookmarks = new Set(bookmarkedCourseIds);
      newBookmarks.delete(courseId);

      set((state) => {
        state.bookmarkedCourseIds = newBookmarks;
      });

      try {
        // Persist to storage
        await storage.setObject(STORAGE_KEYS.BOOKMARKS, Array.from(newBookmarks));
      } catch (error) {
        console.error('[CourseStore] Error removing bookmark:', error);
        // Revert on error
        set((state) => {
          state.bookmarkedCourseIds = bookmarkedCourseIds;
        });
      }
    },

    toggleBookmark: async (courseId: string) => {
      const { isBookmarked } = get();

      if (isBookmarked(courseId)) {
        await get().removeBookmark(courseId);
      } else {
        await get().addBookmark(courseId);
      }
    },

    isBookmarked: (courseId: string) => {
      return get().bookmarkedCourseIds.has(courseId);
    },

    addEnrollment: async (courseId: string) => {
      const { enrolledCourseIds } = get();

      // Update state immediately
      const newEnrollments = new Set(enrolledCourseIds);
      newEnrollments.add(courseId);

      set((state) => {
        state.enrolledCourseIds = newEnrollments;
      });

      try {
        // Persist to storage
        await storage.setObject(STORAGE_KEYS.ENROLLMENTS, Array.from(newEnrollments));
      } catch (error) {
        console.error('[CourseStore] Error saving enrollment:', error);
        // Revert on error
        set((state) => {
          state.enrolledCourseIds = enrolledCourseIds;
        });
      }
    },

    isEnrolled: (courseId: string) => {
      return get().enrolledCourseIds.has(courseId);
    },

    getBookmarkedCourses: () => {
      const { courses, bookmarkedCourseIds } = get();
      return courses.filter((course) => bookmarkedCourseIds.has(course.id));
    },

    getEnrolledCourses: () => {
      const { courses, enrolledCourseIds } = get();
      return courses.filter((course) => enrolledCourseIds.has(course.id));
    },

    setError: (error: string | null) => {
      set((state) => {
        state.error = error;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);

export default useCourseStore;
