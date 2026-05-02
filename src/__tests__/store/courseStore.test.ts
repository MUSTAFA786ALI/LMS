/**
 * Tests for courseStore
 */

import { useCourseStore } from '@/src/store/courseStore';
import * as courseAPI from '@/src/api/courses';

jest.mock('@/src/api/courses');
jest.mock('@/src/services/storage');

describe('courseStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useCourseStore.setState({
      courses: [],
      filteredCourses: [],
      bookmarkedCourseIds: new Set(),
      enrolledCourseIds: new Set(),
      isLoading: false,
      error: null,
    });
  });

  it('should have initial state', () => {
    const state = useCourseStore.getState();

    expect(state.courses).toEqual([]);
    expect(state.filteredCourses).toEqual([]);
    expect(state.bookmarkedCourseIds).toEqual(new Set());
    expect(state.enrolledCourseIds).toEqual(new Set());
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
  });

  it('should add bookmark', () => {
    const state = useCourseStore.getState();

    state.addBookmark('course-1');

    expect(useCourseStore.getState().bookmarkedCourseIds.has('course-1')).toBe(true);
  });

  it('should remove bookmark', () => {
    useCourseStore.setState({
      bookmarkedCourseIds: new Set(['course-1']),
    });

    const state = useCourseStore.getState();
    state.removeBookmark('course-1');

    expect(useCourseStore.getState().bookmarkedCourseIds.has('course-1')).toBe(false);
  });

  it('should toggle bookmark', () => {
    const state = useCourseStore.getState();

    // Add bookmark
    state.toggleBookmark('course-1');
    expect(useCourseStore.getState().bookmarkedCourseIds.has('course-1')).toBe(true);

    // Remove bookmark
    state.toggleBookmark('course-1');
    expect(useCourseStore.getState().bookmarkedCourseIds.has('course-1')).toBe(false);
  });

  it('should check if course is bookmarked', () => {
    useCourseStore.setState({
      bookmarkedCourseIds: new Set(['course-1']),
    });

    const state = useCourseStore.getState();

    expect(state.isBookmarked('course-1')).toBe(true);
    expect(state.isBookmarked('course-2')).toBe(false);
  });

  it('should add enrollment', () => {
    const state = useCourseStore.getState();

    state.addEnrollment('course-1');

    expect(useCourseStore.getState().enrolledCourseIds.has('course-1')).toBe(true);
  });

  it('should check if course is enrolled', () => {
    useCourseStore.setState({
      enrolledCourseIds: new Set(['course-1']),
    });

    const state = useCourseStore.getState();

    expect(state.isEnrolled('course-1')).toBe(true);
    expect(state.isEnrolled('course-2')).toBe(false);
  });

  it('should get bookmarked courses', () => {
    const mockCourses = [
      { id: 'course-1', title: 'Course 1' },
      { id: 'course-2', title: 'Course 2' },
      { id: 'course-3', title: 'Course 3' },
    ] as any;

    useCourseStore.setState({
      courses: mockCourses,
      bookmarkedCourseIds: new Set(['course-1', 'course-3']),
    });

    const state = useCourseStore.getState();
    const bookmarked = state.getBookmarkedCourses();

    expect(bookmarked).toHaveLength(2);
    expect(bookmarked.map((c) => c.id)).toEqual(['course-1', 'course-3']);
  });

  it('should get enrolled courses', () => {
    const mockCourses = [
      { id: 'course-1', title: 'Course 1' },
      { id: 'course-2', title: 'Course 2' },
      { id: 'course-3', title: 'Course 3' },
    ] as any;

    useCourseStore.setState({
      courses: mockCourses,
      enrolledCourseIds: new Set(['course-2']),
    });

    const state = useCourseStore.getState();
    const enrolled = state.getEnrolledCourses();

    expect(enrolled).toHaveLength(1);
    expect(enrolled[0].id).toBe('course-2');
  });

  it('should set error', () => {
    const state = useCourseStore.getState();

    state.setError('Test error');

    expect(useCourseStore.getState().error).toBe('Test error');
  });

  it('should clear error', () => {
    useCourseStore.setState({ error: 'Test error' });

    const state = useCourseStore.getState();
    state.clearError();

    expect(useCourseStore.getState().error).toBeNull();
  });
});
