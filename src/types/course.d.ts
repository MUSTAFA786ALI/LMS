/**
 * Course and Related Types
 */

export interface Instructor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  university?: string;
  fullName?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price?: number;
  rating?: number;
  duration?: number; // in hours
  enrolledCount?: number;
  instructor: Instructor;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  createdAt?: string;
  updatedAt?: string;
}

export interface CourseDetail extends Course {
  content?: string;
  lessons?: Lesson[];
  prerequisite?: string;
}

export interface Lesson {
  id: string;
  title: string;
  description?: string;
  duration: number; // in minutes
  videoUrl?: string;
  order: number;
}

export interface EnrollmentData {
  courseId: string;
  userId: string;
  enrolledAt: string;
  completedAt?: string;
  progress: number; // 0-100
}

export interface CourseState {
  courses: Course[];
  searchResults: Course[];
  selectedCourse: CourseDetail | null;
  bookmarkedCourseIds: Set<string>;
  enrolledCourseIds: Set<string>;
  isLoading: boolean;
  error: string | null;
}
