/**
 * Custom Hook: useInactivityReminder
 * Sends reminder notification if user hasn't opened app for 24 hours
 */

import { useEffect, useRef } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import { usePreferencesStore } from '../store/prefsStore';
import { useNotifications } from './useNotifications';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/theme';

const INACTIVITY_PERIOD = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export function useInactivityReminder() {
  const inactivityReminderEnabled = usePreferencesStore((state) => state.inactivityReminderEnabled);
  const { sendNotification } = useNotifications();
  const appState = useRef(AppState.currentState);
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    if (!inactivityReminderEnabled) {
      return;
    }

    const subscription = AppState.addEventListener('change', handleAppStateChange);

    // Check on mount
    checkInactivity();

    return () => {
      subscription.remove();
    };
  }, [inactivityReminderEnabled]);

  const handleAppStateChange = async (nextAppState: AppStateStatus) => {
    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      // App has come to foreground
      if (!hasCheckedRef.current) {
        await checkInactivity();
        hasCheckedRef.current = true;
      }
    } else if (nextAppState.match(/inactive|background/)) {
      // App is going to background
      hasCheckedRef.current = false;
      // Save current time as last app open
      await storage.setString(STORAGE_KEYS.LAST_APP_OPEN, Date.now().toString());
    }

    appState.current = nextAppState;
  };

  const checkInactivity = async () => {
    try {
      if (!inactivityReminderEnabled) {
        return;
      }

      const lastOpenStr = await storage.getString(STORAGE_KEYS.LAST_APP_OPEN);
      if (!lastOpenStr) {
        // First time opening, set the time
        await storage.setString(STORAGE_KEYS.LAST_APP_OPEN, Date.now().toString());
        return;
      }

      const lastOpenTime = parseInt(lastOpenStr, 10);
      const timeSinceLastOpen = Date.now() - lastOpenTime;

      // If more than 24 hours have passed
      if (timeSinceLastOpen > INACTIVITY_PERIOD) {
        await sendNotification({
          title: '📚 Time to Learn!',
          body: `It's been a while! Check out your bookmarked courses and continue learning.`,
          data: { type: 'inactivity_reminder' },
          delayMs: 1000,
        });
      }

      // Update last open time
      await storage.setString(STORAGE_KEYS.LAST_APP_OPEN, Date.now().toString());
    } catch (error) {
      console.error('[useInactivityReminder] Error checking inactivity:', error);
    }
  };

  return {
    isEnabled: inactivityReminderEnabled,
  };
}

export default useInactivityReminder;
