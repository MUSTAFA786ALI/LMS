/**
 * Tests for useCourses Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCourses } from '@/src/hooks/useCourses';
import { useCourseStore } from '@/src/store/courseStore';

const mockCourse = {
  id: '1',
  title: 'Test Course',
  description: 'Test Description',
  instructor: { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john@example.com' },
  rating: 4.5,
  enrolledCount: 100,
  duration: 10,
  level: 'beginner' as const,
  category: 'Programming',
};

describe('useCourses', () => {
  beforeEach(() => {
    // Clear store before each test
    useCourseStore.setState({
      courses: [],
      filteredCourses: [],
      bookmarkedCourseIds: new Set(),
      enrolledCourseIds: new Set(),
      isLoading: false,
      error: null,
    });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useCourses());

    expect(result.current.courses).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return action functions', () => {
    const { result } = renderHook(() => useCourses());

    expect(typeof result.current.fetchCourses).toBe('function');
    expect(typeof result.current.searchCourses).toBe('function');
    expect(typeof result.current.toggleBookmark).toBe('function');
    expect(typeof result.current.isBookmarked).toBe('function');
    expect(typeof result.current.addEnrollment).toBe('function');
    expect(typeof result.current.isEnrolled).toBe('function');
  });

  it('should check if course is bookmarked', async () => {
    useCourseStore.setState({
      bookmarkedCourseIds: new Set(['1']),
    });

    const { result } = renderHook(() => useCourses());

    expect(result.current.isBookmarked('1')).toBe(true);
    expect(result.current.isBookmarked('2')).toBe(false);
  });

  it('should check if course is enrolled', () => {
    useCourseStore.setState({
      enrolledCourseIds: new Set(['1']),
    });

    const { result } = renderHook(() => useCourses());

    expect(result.current.isEnrolled('1')).toBe(true);
    expect(result.current.isEnrolled('2')).toBe(false);
  });

  it('should get bookmarked courses', () => {
    useCourseStore.setState({
      courses: [mockCourse, { ...mockCourse, id: '2' }],
      bookmarkedCourseIds: new Set(['1']),
    });

    const { result } = renderHook(() => useCourses());

    const bookmarkedCourses = result.current.getBookmarkedCourses();
    expect(bookmarkedCourses).toHaveLength(1);
    expect(bookmarkedCourses[0].id).toBe('1');
  });

  it('should get enrolled courses', () => {
    useCourseStore.setState({
      courses: [mockCourse, { ...mockCourse, id: '2' }],
      enrolledCourseIds: new Set(['1', '2']),
    });

    const { result } = renderHook(() => useCourses());

    const enrolledCourses = result.current.getEnrolledCourses();
    expect(enrolledCourses).toHaveLength(2);
  });

  it('should handle toggle bookmark', async () => {
    useCourseStore.setState({
      courses: [mockCourse],
    });

    const { result } = renderHook(() => useCourses());

    // Initially not bookmarked
    expect(result.current.isBookmarked('1')).toBe(false);

    // Toggle bookmark
    await act(async () => {
      await result.current.toggleBookmark('1');
    });

    await waitFor(() => {
      expect(result.current.isBookmarked('1')).toBe(true);
    });
  });

  it('should handle add enrollment', async () => {
    useCourseStore.setState({
      courses: [mockCourse],
    });

    const { result } = renderHook(() => useCourses());

    // Initially not enrolled
    expect(result.current.isEnrolled('1')).toBe(false);

    // Add enrollment
    await act(async () => {
      await result.current.addEnrollment('1');
    });

    await waitFor(() => {
      expect(result.current.isEnrolled('1')).toBe(true);
    });
  });

  it('should clear errors', () => {
    useCourseStore.setState({
      error: 'Test error',
    });

    const { result } = renderHook(() => useCourses());

    expect(result.current.error).toBe('Test error');

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
