/**
 * Tests for useAuth Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useAuth } from '@/src/hooks/useAuth';
import { useAuthStore } from '@/src/store/authStore';

describe('useAuth', () => {
  beforeEach(() => {
    // Clear store before each test
    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should return login function', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.register).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('should handle login with valid credentials', async () => {
    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password123');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('should handle logout', async () => {
    // Setup: login first
    useAuthStore.setState({
      user: { id: '1', username: 'testuser', email: 'test@example.com', fullName: 'Test User' },
      isAuthenticated: true,
    });

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuthenticated).toBe(true);

    await act(async () => {
      await result.current.logout();
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });

  it('should have clearError function', () => {
    const { result } = renderHook(() => useAuth());

    expect(typeof result.current.clearError).toBe('function');
  });
});
