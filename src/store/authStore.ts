/**
 * Zustand Auth Store
 * Manages authentication state and operations
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { User, AuthTokens } from '../types/auth.d';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../api/auth';
import { secureStorage } from '../services/secureStorage';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/theme';

interface AuthStore {
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  // Actions
  hydrate: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>()(
  immer((set) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    hydrate: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        // Try to get token from secure storage
        const token = await secureStorage.get(STORAGE_KEYS.AUTH_TOKEN);

        if (!token) {
          set((state) => {
            state.isLoading = false;
          });
          return;
        }

        // Fetch current user with the token
        const response = await getCurrentUser();

        if (response.success && response.data) {
          set((state) => {
            state.user = response.data;
            state.isAuthenticated = true;
            state.isLoading = false;
            state.error = null;
          });

          // Cache user in AsyncStorage
          await storage.setObject(STORAGE_KEYS.USER, response.data);
        }
      } catch (error) {
        console.error('[AuthStore] Hydration error:', error);

        // Try to restore from cache if API fails
        try {
          const cachedUser = await storage.getObject<User>(STORAGE_KEYS.USER);
          if (cachedUser) {
            set((state) => {
              state.user = cachedUser;
              state.isAuthenticated = true;
              state.isLoading = false;
            });
          } else {
            set((state) => {
              state.isLoading = false;
            });
          }
        } catch {
          set((state) => {
            state.isLoading = false;
          });
        }
      }
    },

    login: async (email: string, password: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await loginUser({ email, password });

        console.log('[AuthStore] Login response received:', {
          success: response.success,
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : [],
          fullResponse: response,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Login failed');
        }

        const { user, accessToken, refreshToken } = response.data;

        // Store tokens in secure storage
        await secureStorage.set(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        if (refreshToken) {
          await secureStorage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        // Cache user in AsyncStorage
        await storage.setObject(STORAGE_KEYS.USER, user);

        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });
      } catch (error: any) {
        const errorMessage = error.message || 'Login failed. Please try again.';
        console.error('[AuthStore] Login error:', error);

        set((state) => {
          state.isLoading = false;
          state.error = errorMessage;
          state.isAuthenticated = false;
        });

        throw error;
      }
    },

    register: async (email: string, password: string, username: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await registerUser({ email, password, username, role: 'USER' });

        console.log('[AuthStore] Register response received:', {
          success: response.success,
          hasData: !!response.data,
          dataKeys: response.data ? Object.keys(response.data) : [],
          fullResponse: response,
        });

        if (!response.success || !response.data) {
          throw new Error(response.message || 'Registration failed');
        }

        const { user, accessToken, refreshToken } = response.data;

        // Store tokens in secure storage
        await secureStorage.set(STORAGE_KEYS.AUTH_TOKEN, accessToken);
        if (refreshToken) {
          await secureStorage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
        }

        // Cache user in AsyncStorage
        await storage.setObject(STORAGE_KEYS.USER, user);

        set((state) => {
          state.user = user;
          state.isAuthenticated = true;
          state.isLoading = false;
          state.error = null;
        });
      } catch (error: any) {
        const errorMessage = error.message || 'Registration failed. Please try again.';
        console.error('[AuthStore] Register error:', error);

        set((state) => {
          state.isLoading = false;
          state.error = errorMessage;
          state.isAuthenticated = false;
        });

        throw error;
      }
    },

    logout: async () => {
      set((state) => {
        state.isLoading = true;
      });

      try {
        // Call logout API
        await logoutUser().catch((error) => {
          // Continue logout even if API fails
          console.warn('[AuthStore] Logout API error:', error);
        });

        // Clear secure storage
        await secureStorage.remove(STORAGE_KEYS.AUTH_TOKEN);
        await secureStorage.remove(STORAGE_KEYS.REFRESH_TOKEN);

        // Clear app storage
        await storage.remove(STORAGE_KEYS.USER);

        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
          state.error = null;
        });
      } catch (error) {
        console.error('[AuthStore] Logout error:', error);

        // Clear state even on error
        set((state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.isLoading = false;
        });
      }
    },

    setUser: (user: User | null) => {
      set((state) => {
        state.user = user;
        state.isAuthenticated = user !== null;
      });
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

export default useAuthStore;
