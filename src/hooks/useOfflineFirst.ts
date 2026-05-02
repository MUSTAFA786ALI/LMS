/**
 * Custom Hook: useOfflineFirst
 * Manages offline-first data strategy with cache validation
 */

import { useCallback, useEffect, useState } from 'react';
import { useNetworkStatus } from './useNetworkStatus';
import { useCourseStore } from '../store/courseStore';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/theme';

interface OfflineFirstState {
  isOnline: boolean;
  isCacheValid: boolean;
  cacheAge: number | null; // in milliseconds
  lastSyncTime: number | null;
}

export function useOfflineFirst() {
  const { isOnline } = useNetworkStatus();
  const [state, setState] = useState<OfflineFirstState>({
    isOnline: true,
    isCacheValid: false,
    cacheAge: null,
    lastSyncTime: null,
  });

  const courseStore = useCourseStore();
  const CACHE_TTL = 30 * 60 * 1000; // 30 minutes

  // Check cache validity
  const validateCache = useCallback(async () => {
    try {
      const lastSync = courseStore.lastSyncTime;
      const hasCache = await storage.getObject(STORAGE_KEYS.COURSES_CACHE);

      if (!hasCache || !lastSync) {
        setState((prev) => ({
          ...prev,
          isCacheValid: false,
          cacheAge: null,
          lastSyncTime: null,
        }));
        return false;
      }

      const cacheAge = Date.now() - lastSync;
      const isValid = cacheAge < CACHE_TTL;

      setState((prev) => ({
        ...prev,
        isCacheValid: isValid,
        cacheAge,
        lastSyncTime: lastSync,
      }));

      return isValid;
    } catch (error) {
      console.error('[useOfflineFirst] Cache validation error:', error);
      return false;
    }
  }, [courseStore.lastSyncTime]);

  // Auto-sync when coming online
  const autoSync = useCallback(async () => {
    if (isOnline) {
      try {
        const isCacheValid = await validateCache();
        if (!isCacheValid) {
          await courseStore.fetchCourses(true);
        }
      } catch (error) {
        console.error('[useOfflineFirst] Auto-sync error:', error);
      }
    }
  }, [isOnline, validateCache, courseStore]);

  // Manual refresh
  const refresh = useCallback(async () => {
    if (!isOnline) {
      throw new Error('Device is offline');
    }

    try {
      await courseStore.fetchCourses(true);
      await validateCache();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Failed to refresh data',
      };
    }
  }, [isOnline, courseStore, validateCache]);

  // Check cache on mount and when online status changes
  useEffect(() => {
    validateCache();
  }, [validateCache]);

  // Auto-sync when coming online
  useEffect(() => {
    autoSync();
  }, [isOnline, autoSync]);

  return {
    ...state,
    isOnline,
    validateCache,
    refresh,
    shouldUseCache: !isOnline || (isOnline && state.isCacheValid),
    getCacheAge: () => {
      if (state.cacheAge === null) return null;
      const seconds = Math.floor(state.cacheAge / 1000);
      if (seconds < 60) return `${seconds}s ago`;
      if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
      return `${Math.floor(seconds / 3600)}h ago`;
    },
  };
}

export default useOfflineFirst;
