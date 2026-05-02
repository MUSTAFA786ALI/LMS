/**
 * Integration Tests: Authentication Flow
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '@/src/hooks/useAuth';
import { useCourses } from '@/src/hooks/useCourses';
import { useAuthStore } from '@/src/store/authStore';
import { useCourseStore } from '@/src/store/courseStore';

describe('Integration: Authentication & Course Loading Flow', () => {
  beforeEach(() => {
    // Reset stores
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });

    useCourseStore.setState({
      courses: [],
      filteredCourses: [],
      isLoading: false,
      error: null,
    });
  });

  it('should load courses after user login', async () => {
    const { result: authResult } = renderHook(() => useAuth());
    const { result: courseResult } = renderHook(() => useCourses());

    // Step 1: User logs in
    await act(async () => {
      await authResult.current.login('test@example.com', 'password123');
    });

    // Step 2: Verify user is authenticated
    await waitFor(() => {
      expect(authResult.current.isAuthenticated).toBe(true);
      expect(authResult.current.user).toBeDefined();
    });

    // Step 3: Fetch courses
    await act(async () => {
      await courseResult.current.fetchCourses();
    });

    // Step 4: Verify courses are loaded
    await waitFor(() => {
      expect(courseResult.current.courses).toBeDefined();
    });
  });

  it('should clear auth state after logout', async () => {
    const { result: authResult } = renderHook(() => useAuth());

    // Step 1: Login
    await act(async () => {
      await authResult.current.login('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(authResult.current.isAuthenticated).toBe(true);
    });

    // Step 2: Logout
    await act(async () => {
      await authResult.current.logout();
    });

    // Step 3: Verify auth state is cleared
    await waitFor(() => {
      expect(authResult.current.isAuthenticated).toBe(false);
      expect(authResult.current.user).toBeNull();
    });
  });

  it('should handle bookmark and enrollment flow', async () => {
    // Setup: Add test course to store
    useCourseStore.setState({
      courses: [
        {
          id: '1',
          title: 'Test Course',
          description: 'Test',
          instructor: { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john@example.com' },
          rating: 4.5,
          enrolledCount: 100,
          duration: 10,
          level: 'beginner' as const,
          category: 'Programming',
        },
      ],
    });

    const { result } = renderHook(() => useCourses());

    // Step 1: Bookmark course
    expect(result.current.isBookmarked('1')).toBe(false);

    await act(async () => {
      await result.current.toggleBookmark('1');
    });

    // Step 2: Verify bookmarked
    await waitFor(() => {
      expect(result.current.isBookmarked('1')).toBe(true);
    });

    // Step 3: Enroll in course
    expect(result.current.isEnrolled('1')).toBe(false);

    await act(async () => {
      await result.current.addEnrollment('1');
    });

    // Step 4: Verify enrolled
    await waitFor(() => {
      expect(result.current.isEnrolled('1')).toBe(true);
    });

    // Step 5: Get bookmarked and enrolled courses
    const bookmarked = result.current.getBookmarkedCourses();
    const enrolled = result.current.getEnrolledCourses();

    expect(bookmarked).toHaveLength(1);
    expect(enrolled).toHaveLength(1);
  });

  it('should handle search flow', async () => {
    // Setup: Add test courses
    const courses = [
      {
        id: '1',
        title: 'React Fundamentals',
        description: 'Learn React basics',
        instructor: { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john@example.com' },
        rating: 4.5,
        enrolledCount: 100,
        duration: 10,
        level: 'beginner' as const,
        category: 'Programming',
      },
      {
        id: '2',
        title: 'Advanced TypeScript',
        description: 'Advanced TypeScript patterns',
        instructor: { id: '2', firstName: 'Jane', lastName: 'Smith', fullName: 'Jane Smith', email: 'jane@example.com' },
        rating: 4.8,
        enrolledCount: 50,
        duration: 15,
        level: 'advanced' as const,
        category: 'Programming',
      },
    ];

    useCourseStore.setState({ courses, filteredCourses: courses });

    const { result } = renderHook(() => useCourses());

    // Step 1: Search for "React"
    act(() => {
      result.current.searchCourses('React');
    });

    // Step 2: Verify filtered results
    await waitFor(() => {
      expect(result.current.filteredCourses).toHaveLength(1);
      expect(result.current.filteredCourses[0].id).toBe('1');
    });

    // Step 3: Clear search
    act(() => {
      result.current.searchCourses('');
    });

    // Step 4: Verify all courses returned
    await waitFor(() => {
      expect(result.current.filteredCourses).toHaveLength(2);
    });
  });
});
