/**
 * Course API Endpoints
 */

import { api, retry } from './client';
import { Course, Instructor } from '../types/course.d';
import { ApiResponse } from '../types/api.d';

/**
 * Fetch instructors (using randomusers endpoint)
 */
export async function getInstructors(limit: number = 20): Promise<ApiResponse<Instructor[]>> {
  return retry(() =>
    api
      .get(`/public/randomusers?limit=${limit}`)
      .then((res) => {
        // Transform API response to instructor format
        const users = Array.isArray(res.data.data) ? res.data.data : [];
        return {
          statusCode: 200,
          data: users.map((user: any) => ({
            id: user._id || user.id,
            firstName: user.firstName || user.name?.split(' ')[0] || 'John',
            lastName: user.lastName || user.name?.split(' ')[1] || 'Doe',
            email: user.email || `user${Math.random()}@example.com`,
            avatar: user.image || user.avatar,
            university: user.university || 'University',
          })),
          message: 'Success',
          success: true,
        };
      })
      .catch((error) => {
        console.error('Error fetching instructors:', error);
        throw error;
      })
  );
}

/**
 * Fetch courses (using randomproducts endpoint)
 */
export async function getCourses(limit: number = 50): Promise<ApiResponse<Course[]>> {
  return retry(async () => {
    try {
      // Fetch products and instructors in parallel
      const [productsRes, instructorsRes] = await Promise.all([
        api.get(`/public/randomproducts?limit=${limit}`),
        api.get(`/public/randomusers?limit=${Math.ceil(limit / 3)}`),
      ]);

      const products = Array.isArray(productsRes.data.data) ? productsRes.data.data : [];
      const instructors = Array.isArray(instructorsRes.data.data) ? instructorsRes.data.data : [];

      // Map products to courses
      const courses: Course[] = products.map((product: any, index: number) => ({
        id: product._id || product.id || `course-${index}`,
        title: product.title || product.name || 'Untitled Course',
        description: product.description || 'No description available',
        thumbnail: product.image || product.thumbnail,
        price: product.price || Math.random() * 100,
        rating: product.rating || Math.random() * 5,
        duration: Math.floor(Math.random() * 40) + 10,
        enrolledCount: Math.floor(Math.random() * 1000) + 10,
        instructor: instructors[index % instructors.length]
          ? {
              id: instructors[index % instructors.length]._id,
              firstName:
                instructors[index % instructors.length].firstName ||
                instructors[index % instructors.length].name?.split(' ')[0] ||
                'John',
              lastName:
                instructors[index % instructors.length].lastName ||
                instructors[index % instructors.length].name?.split(' ')[1] ||
                'Doe',
              email:
                instructors[index % instructors.length].email ||
                `user${index}@example.com`,
              avatar: instructors[index % instructors.length].image,
              university: 'University',
            }
          : {
              id: `instructor-${index}`,
              firstName: 'John',
              lastName: 'Doe',
              email: `instructor${index}@example.com`,
              avatar: undefined,
              university: 'University',
            },
        category: product.category || 'General',
        level: (['beginner', 'intermediate', 'advanced'] as const)[
          Math.floor(Math.random() * 3)
        ],
        createdAt: new Date().toISOString(),
      }));

      return {
        statusCode: 200,
        data: courses,
        message: 'Success',
        success: true,
      };
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  });
}

/**
 * Search courses (client-side filter)
 */
export function searchCourses(courses: Course[], query: string): Course[] {
  if (!query.trim()) {
    return courses;
  }

  const lowerQuery = query.toLowerCase();
  return courses.filter(
    (course) =>
      course.title.toLowerCase().includes(lowerQuery) ||
      course.description.toLowerCase().includes(lowerQuery) ||
      `${course.instructor.firstName} ${course.instructor.lastName}`
        .toLowerCase()
        .includes(lowerQuery)
  );
}
