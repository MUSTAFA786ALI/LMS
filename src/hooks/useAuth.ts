/**
 * Custom Hook: useAuth
 * Provides easy access to authentication state and actions
 */

import { useCallback } from 'react';
import { useAuthStore } from '../store/authStore';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        await useAuthStore.getState().login(email, password);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  const register = useCallback(
    async (email: string, password: string, fullName: string) => {
      try {
        await useAuthStore.getState().register(email, password, fullName);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    try {
      await useAuthStore.getState().logout();
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    }
  }, []);

  const clearError = useCallback(() => {
    useAuthStore.getState().clearError();
  }, []);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };
}

export default useAuth;
