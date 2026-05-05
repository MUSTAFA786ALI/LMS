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
      .get(`/api/v1/public/randomusers?limit=${limit}`)
      .then((res) => {
        // Transform API response to instructor format
        const users = Array.isArray(res.data.data?.data) ? res.data.data.data : [];
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
      console.log('[getCourses] Fetching courses with limit:', limit);
      
      // Create a timeout promise for 8 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('API call timeout - course fetch took too long')), 8000)
      );

      // Fetch products and instructors in parallel with timeout
      const fetchPromise = Promise.all([
        api.get(`/api/v1/public/randomproducts?limit=${limit}`),
        api.get(`/api/v1/public/randomusers?limit=${Math.ceil(limit / 3)}`),
      ]);

      const [productsRes, instructorsRes] = await Promise.race([
        fetchPromise,
        timeoutPromise
      ]);

      console.log('[getCourses] Products response:', {
        statusCode: productsRes.status,
        hasData: !!productsRes.data,
        dataPath: !!productsRes.data?.data?.data,
        itemCount: Array.isArray(productsRes.data?.data?.data) ? productsRes.data.data.data.length : 0,
      });

      console.log('[getCourses] Instructors response:', {
        statusCode: instructorsRes.status,
        hasData: !!instructorsRes.data,
        dataPath: !!instructorsRes.data?.data?.data,
        itemCount: Array.isArray(instructorsRes.data?.data?.data) ? instructorsRes.data.data.data.length : 0,
      });

      const products = Array.isArray(productsRes.data?.data?.data) ? productsRes.data.data.data : [];
      const instructors = Array.isArray(instructorsRes.data?.data?.data) ? instructorsRes.data.data.data : [];

      console.log('[getCourses] Extracted products:', products.length, 'instructors:', instructors.length);

      // Map products to courses
      const courses: Course[] = products.map((product: any, index: number) => {
        const instructor = instructors[index % instructors.length];
        
        // Safe instructor name parsing
        let firstName = 'John';
        let lastName = 'Doe';
        
        if (instructor) {
          firstName = instructor.firstName || 'John';
          lastName = instructor.lastName || 'Doe';
          
          // Only attempt name.split if name exists and is a string
          if (!firstName && instructor.name && typeof instructor.name === 'string') {
            const nameParts = instructor.name.split(' ');
            firstName = nameParts[0] || 'John';
            lastName = nameParts[1] || 'Doe';
          }
        }
        
        return {
          id: product._id || product.id || `course-${index}`,
          title: product.title || product.name || 'Untitled Course',
          description: product.description || 'No description available',
          thumbnail: product.image || product.thumbnail,
          price: product.price || Math.random() * 100,
          rating: product.rating || Math.random() * 5,
          duration: Math.floor(Math.random() * 40) + 10,
          enrolledCount: Math.floor(Math.random() * 1000) + 10,
          instructor: instructor ? {
            id: instructor._id || instructor.id || `instructor-${index}`,
            firstName,
            lastName,
            email: instructor.email || `user${index}@example.com`,
            avatar: instructor.image || instructor.avatar,
            university: instructor.university || 'University',
          } : {
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
        };
      });

      console.log('[getCourses] Mapped courses:', courses.length);

      return {
        statusCode: 200,
        data: courses,
        message: 'Success',
        success: true,
      };
    } catch (error) {
      console.error('[getCourses] Error fetching courses:', error);
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
