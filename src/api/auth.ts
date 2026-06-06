/**
 * Authentication API Endpoints
 * Uses mock authentication for development
 * TODO: Replace with real backend endpoints when available
 */

import { api, retry } from './client';
import { mockRegisterUser, mockLoginUser, mockGetCurrentUser } from './mockAuth';
import { AuthResponse, User } from '../types/auth.d';
import { ApiResponse } from '../types/api.d';
import { storage } from '../services/storage';

// Development mode - use mock auth
const USE_MOCK_AUTH = true; // Set to false when using real backend

/**
 * Register a new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  username: string;
  role?: string;
}): Promise<AuthResponse> {
  const payload = {
    ...data,
    role: data.role || 'USER', // Default role if not provided
  };
  
  console.log('[API] Register request:', {
    endpoint: '/api/v1/users/register',
    payload: payload,
    useMockAuth: USE_MOCK_AUTH,
  });
  
  if (USE_MOCK_AUTH) {
    return mockRegisterUser(data);
  }
  
  return retry(() =>
    api.post('/api/v1/users/register', payload)
      .then((res) => {
        console.log('[API] Register success response:', {
          status: res.status,
          data: JSON.stringify(res.data, null, 2),
        });
        return res.data;
      })
      .catch((error) => {
        console.error('[API] Register error response:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message,
          config: {
            url: error?.config?.url,
            method: error?.config?.method,
            data: error?.config?.data,
          },
        });
        throw error;
      })
  );
}

/**
 * Login user with credentials
 */
export async function loginUser(data: { email: string; password: string }): Promise<AuthResponse> {
  console.log('[API] Login request:', {
    endpoint: '/api/v1/users/login',
    payload: data,
    useMockAuth: USE_MOCK_AUTH,
  });
  
  if (USE_MOCK_AUTH) {
    return mockLoginUser(data);
  }
  
  return retry(() =>
    api.post('/api/v1/users/login', data)
      .then((res) => {
        console.log('[API] Login success response:', {
          status: res.status,
          data: JSON.stringify(res.data, null, 2),
        });
        return res.data;
      })
      .catch((error) => {
        console.error('[API] Login error response:', {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message,
          config: {
            url: error?.config?.url,
            method: error?.config?.method,
            data: error?.config?.data,
          },
        });
        throw error;
      })
  );
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  console.log('[API] GetCurrentUser request:', {
    useMockAuth: USE_MOCK_AUTH,
  });
  
  if (USE_MOCK_AUTH) {
    return mockGetCurrentUser();
  }
  
  // Only retry once during startup to prevent blocking
  return retry(() => api.get('/api/v1/users/current-user').then((res) => res.data), 1, 500);
}

/**
 * Logout user - No retries to prevent hanging
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  console.log('[API] Logout request starting...');
  
  // Logout should NOT retry - just try once with a 3 second timeout
  try {
    const logoutPromise = api.post('/api/v1/users/logout').then((res) => {
      console.log('[API] Logout success:', res.data);
      return res.data;
    });
    
    const timeoutPromise = new Promise<ApiResponse<null>>((resolve) => {
      setTimeout(() => {
        console.warn('[API] Logout timeout - continuing logout anyway');
        resolve({ success: true, data: null, message: 'Logout timeout' });
      }, 2000);
    });
    
    // Race between the actual request and timeout
    return await Promise.race([logoutPromise, timeoutPromise]);
  } catch (error) {
    console.error('[API] Logout error:', error);
    // Return success anyway so the user gets logged out
    return { success: true, data: null, message: 'Logout completed' };
  }
}

/**
 * Refresh authentication token
 */
export async function refreshAuthToken(refreshToken: string): Promise<
  ApiResponse<{
    accessToken: string;
    refreshToken?: string;
  }>
> {
  return api.post('/api/v1/users/refresh-token', { refreshToken }).then((res) => res.data);
}
