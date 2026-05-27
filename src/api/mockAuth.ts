/**
 * Mock Authentication API for Development
 * Simulates a real auth backend for local testing
 * Remove this file when using a real backend
 */

import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/theme';
import { AuthResponse, User } from '../types/auth.d';

// Mock users database (in production this would be on the backend)
const MOCK_USERS_STORAGE_KEY = 'mock_registered_users';

/**
 * Mock register user
 */
export async function mockRegisterUser(data: {
  email: string;
  password: string;
  username: string;
  role?: string;
}): Promise<AuthResponse> {
  console.log('[MockAuth] Register request:', data);
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate input
    if (!data.email || !data.password || !data.username) {
      return {
        statusCode: 400,
        success: false,
        message: 'Missing required fields: email, password, username',
        data: {
          user: { id: '', email: '', username: '', fullName: '' },
          accessToken: '',
        },
      };
    }

    // Get existing users
    let users: any[] = [];
    try {
      const stored = await storage.getObject<any[]>(MOCK_USERS_STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        users = stored;
      }
    } catch (e) {
      console.warn('[MockAuth] Failed to retrieve users:', e);
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === data.email);
    if (existingUser) {
      return {
        statusCode: 409,
        success: false,
        message: 'Email already registered',
        data: {
          user: { id: '', email: '', username: '', fullName: '' },
          accessToken: '',
        },
      };
    }

    // Create new user
    const newUser: User = {
      id: `user_${Date.now()}`,
      email: data.email,
      username: data.username,
      fullName: data.username,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Save user with password hash (in production use proper hashing)
    const userWithPassword = {
      ...newUser,
      passwordHash: btoa(data.password), // Simple base64 for mock (NOT secure)
      role: data.role || 'USER', // Store role separately, not in User interface
    };

    users.push(userWithPassword);
    await storage.setObject(MOCK_USERS_STORAGE_KEY, users);

    console.log('[MockAuth] Register success:', newUser);

    return {
      statusCode: 200,
      success: true,
      message: 'User registered successfully',
      data: {
        user: newUser,
        accessToken: '', // Registration doesn't return tokens
      },
    };
  } catch (error: any) {
    console.error('[MockAuth] Register error:', error);
    return {
      statusCode: 500,
      success: false,
      message: error.message || 'Registration failed',
      data: {
        user: { id: '', email: '', username: '', fullName: '' },
        accessToken: '',
      },
    };
  }
}

/**
 * Mock login user
 */
export async function mockLoginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  console.log('[MockAuth] Login request:', { email: data.email, passwordLength: data.password?.length });
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Validate input
    if (!data.email || !data.password) {
      return {
        statusCode: 400,
        success: false,
        message: 'Missing required fields: email, password',
        data: {
          user: { id: '', email: '', username: '', fullName: '' },
          accessToken: '',
        },
      };
    }

    // Get users
    let users: any[] = [];
    try {
      const stored = await storage.getObject<any[]>(MOCK_USERS_STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        users = stored;
      }
    } catch (e) {
      console.warn('[MockAuth] Failed to retrieve users:', e);
    }

    // Find user
    const user = users.find(u => u.email === data.email);
    if (!user) {
      return {
        statusCode: 404,
        success: false,
        message: 'User not found',
        data: {
          user: { id: '', email: '', username: '', fullName: '' },
          accessToken: '',
        },
      };
    }

    // Verify password (mock verification)
    const isPasswordValid = user.passwordHash === btoa(data.password);
    if (!isPasswordValid) {
      return {
        statusCode: 401,
        success: false,
        message: 'Invalid password',
        data: {
          user: { id: '', email: '', username: '', fullName: '' },
          accessToken: '',
        },
      };
    }

    // Generate mock tokens
    const mockAccessToken = `mock_access_${Date.now()}_${Math.random()}`;
    const mockRefreshToken = `mock_refresh_${Date.now()}_${Math.random()}`;

    const userData: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    console.log('[MockAuth] Login success:', userData);

    return {
      statusCode: 200,
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        accessToken: mockAccessToken,
        refreshToken: mockRefreshToken,
      },
    };
  } catch (error: any) {
    console.error('[MockAuth] Login error:', error);
    return {
      statusCode: 500,
      success: false,
      message: error.message || 'Login failed',
      data: {
        user: { id: '', email: '', username: '', fullName: '' },
        accessToken: '',
      },
    };
  }
}

/**
 * Mock get current user
 */
export async function mockGetCurrentUser(): Promise<{ statusCode: number; data: User | null; message: string; success: boolean }> {
  try {
    const userId = await storage.getString('current_user_id');
    
    if (!userId) {
      return {
        statusCode: 401,
        success: false,
        data: null,
        message: 'No user logged in',
      };
    }

    // Get users
    let users: any[] = [];
    try {
      const stored = await storage.getObject<any[]>(MOCK_USERS_STORAGE_KEY);
      if (stored && Array.isArray(stored)) {
        users = stored;
      }
    } catch (e) {
      console.warn('[MockAuth] Failed to retrieve users:', e);
    }

    const user = users.find(u => u.id === userId);
    if (!user) {
      return {
        statusCode: 404,
        success: false,
        data: null,
        message: 'User not found',
      };
    }

    const userData: User = {
      id: user.id,
      email: user.email,
      username: user.username,
      fullName: user.fullName,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      statusCode: 200,
      success: true,
      data: userData,
      message: 'User fetched',
    };
  } catch (error: any) {
    return {
      statusCode: 500,
      success: false,
      data: null,
      message: error.message || 'Failed to get current user',
    };
  }
}
