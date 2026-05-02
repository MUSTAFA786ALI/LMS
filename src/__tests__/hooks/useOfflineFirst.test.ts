/**
 * Tests for useOfflineFirst Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useOfflineFirst } from '@/src/hooks/useOfflineFirst';
import { useCourseStore } from '@/src/store/courseStore';
import * as NetInfo from '@react-native-community/netinfo';

jest.mock('@/src/hooks/useNetworkStatus', () => ({
  useNetworkStatus: jest.fn(() => ({
    isOnline: true,
    isOffline: false,
    isConnected: true,
    isWifi: true,
    networkType: 'wifi',
  })),
}));

describe('useOfflineFirst', () => {
  beforeEach(() => {
    useCourseStore.setState({
      courses: [{
        id: '1',
        title: 'Test Course',
        description: 'Test Description',
        instructor: { id: '1', firstName: 'John', lastName: 'Doe', fullName: 'John Doe', email: 'john@example.com' },
        rating: 4.5,
        enrolledCount: 100,
        duration: 10,
        level: 'beginner' as const,
        category: 'Programming',
      }],
      lastSyncTime: Date.now(),
    });
  });

  it('should return initial state', () => {
    const { result } = renderHook(() => useOfflineFirst());

    expect(result.current).toHaveProperty('isOnline');
    expect(result.current).toHaveProperty('isCacheValid');
    expect(result.current).toHaveProperty('cacheAge');
    expect(result.current).toHaveProperty('shouldUseCache');
  });

  it('should validate cache', async () => {
    const { result } = renderHook(() => useOfflineFirst());

    await act(async () => {
      await result.current.validateCache();
    });

    await waitFor(() => {
      expect(result.current.isCacheValid).toBeDefined();
    });
  });

  it('should return formatted cache age', async () => {
    // Set lastSyncTime to 45 seconds ago
    const now = Date.now();
    useCourseStore.setState({
      lastSyncTime: now - 45000,
    });

    const { result } = renderHook(() => useOfflineFirst());

    await act(async () => {
      await result.current.validateCache();
    });

    await waitFor(() => {
      const age = result.current.getCacheAge();
      expect(age).toBeDefined();
      expect(typeof age).toBe('string');
      expect(age).toMatch(/\d+(s|m|h) ago/);
    });
  });

  it('should return shouldUseCache when cache is valid and online', async () => {
    const { result } = renderHook(() => useOfflineFirst());

    await act(async () => {
      await result.current.validateCache();
    });

    await waitFor(() => {
      expect(result.current.shouldUseCache).toBeDefined();
    });
  });

  it('should have refresh function', () => {
    const { result } = renderHook(() => useOfflineFirst());

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should return error when trying to refresh offline', async () => {
    // Mock offline state
    jest.mocked(require('@/src/hooks/useNetworkStatus').useNetworkStatus).mockReturnValue({
      isOnline: false,
      isOffline: true,
      isConnected: false,
      isWifi: false,
      networkType: 'none',
    });

    const { result } = renderHook(() => useOfflineFirst());

    let error: string | undefined;
    await act(async () => {
      const refreshResult = await result.current.refresh();
      if (!refreshResult.success) {
        error = refreshResult.error;
      }
    });

    expect(error).toBeDefined();
  });
});
