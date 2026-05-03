/**
 * Authentication API Endpoints
 */

import { api, retry } from './client';
import { AuthResponse, User } from '../types/auth.d';
import { ApiResponse } from '../types/api.d';

/**
 * Register a new user
 */
export async function registerUser(data: {
  email: string;
  password: string;
  fullName: string;
}): Promise<AuthResponse> {
  return retry(() =>
    api.post('/users/register', data).then((res) => {
      console.log('[API] Register response:', JSON.stringify(res.data, null, 2));
      return res.data;
    })
  );
}

/**
 * Login user with credentials
 */
export async function loginUser(data: { email: string; password: string }): Promise<AuthResponse> {
  return retry(() =>
    api.post('/users/login', data).then((res) => {
      console.log('[API] Login response:', JSON.stringify(res.data, null, 2));
      return res.data;
    })
  );
}

/**
 * Get current authenticated user
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  return retry(() => api.get('/users/current-user').then((res) => res.data));
}

/**
 * Logout user
 */
export async function logoutUser(): Promise<ApiResponse<null>> {
  return retry(() => api.post('/users/logout').then((res) => res.data));
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
