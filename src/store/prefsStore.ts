/**
 * Zustand Preferences Store
 * Manages user preferences and app settings
 */

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { storage } from '../services/storage';
import { STORAGE_KEYS } from '../constants/theme';

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  notificationsEnabled: boolean;
  inactivityReminderEnabled: boolean;
  language: 'en' | 'es' | 'fr';
  fontSize: 'small' | 'normal' | 'large';
}

interface PreferencesStore extends UserPreferences {
  // Actions
  hydrate: () => Promise<void>;
  setTheme: (theme: 'light' | 'dark' | 'auto') => Promise<void>;
  setNotificationsEnabled: (enabled: boolean) => Promise<void>;
  setInactivityReminderEnabled: (enabled: boolean) => Promise<void>;
  setLanguage: (language: 'en' | 'es' | 'fr') => Promise<void>;
  setFontSize: (fontSize: 'small' | 'normal' | 'large') => Promise<void>;
}

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'auto',
  notificationsEnabled: true,
  inactivityReminderEnabled: true,
  language: 'en',
  fontSize: 'normal',
};

export const usePreferencesStore = create<PreferencesStore>()(
  immer((set) => ({
    // Default state
    ...DEFAULT_PREFERENCES,

    // Actions
    hydrate: async () => {
      try {
        const cached = await storage.getObject<UserPreferences>(STORAGE_KEYS.USER_PREFS);

        if (cached) {
          set((state) => {
            Object.assign(state, cached);
          });
        }
      } catch (error) {
        console.error('[PreferencesStore] Hydration error:', error);
      }
    },

    setTheme: async (theme: 'light' | 'dark' | 'auto') => {
      set((state) => {
        state.theme = theme;
      });

      try {
        const prefs = {
          theme,
          notificationsEnabled: (
            usePreferencesStore.getState() as PreferencesStore
          ).notificationsEnabled,
          inactivityReminderEnabled: (
            usePreferencesStore.getState() as PreferencesStore
          ).inactivityReminderEnabled,
          language: (usePreferencesStore.getState() as PreferencesStore).language,
          fontSize: (usePreferencesStore.getState() as PreferencesStore).fontSize,
        };
        await storage.setObject(STORAGE_KEYS.USER_PREFS, prefs);
      } catch (error) {
        console.error('[PreferencesStore] Error setting theme:', error);
      }
    },

    setNotificationsEnabled: async (enabled: boolean) => {
      set((state) => {
        state.notificationsEnabled = enabled;
      });

      try {
        const prefs = {
          theme: (usePreferencesStore.getState() as PreferencesStore).theme,
          notificationsEnabled: enabled,
          inactivityReminderEnabled: (
            usePreferencesStore.getState() as PreferencesStore
          ).inactivityReminderEnabled,
          language: (usePreferencesStore.getState() as PreferencesStore).language,
          fontSize: (usePreferencesStore.getState() as PreferencesStore).fontSize,
        };
        await storage.setObject(STORAGE_KEYS.USER_PREFS, prefs);
      } catch (error) {
        console.error('[PreferencesStore] Error setting notifications:', error);
      }
    },

    setInactivityReminderEnabled: async (enabled: boolean) => {
      set((state) => {
        state.inactivityReminderEnabled = enabled;
      });

      try {
        const prefs = {
          theme: (usePreferencesStore.getState() as PreferencesStore).theme,
          notificationsEnabled: (usePreferencesStore.getState() as PreferencesStore)
            .notificationsEnabled,
          inactivityReminderEnabled: enabled,
          language: (usePreferencesStore.getState() as PreferencesStore).language,
          fontSize: (usePreferencesStore.getState() as PreferencesStore).fontSize,
        };
        await storage.setObject(STORAGE_KEYS.USER_PREFS, prefs);
      } catch (error) {
        console.error('[PreferencesStore] Error setting inactivity reminder:', error);
      }
    },

    setLanguage: async (language: 'en' | 'es' | 'fr') => {
      set((state) => {
        state.language = language;
      });

      try {
        const prefs = {
          theme: (usePreferencesStore.getState() as PreferencesStore).theme,
          notificationsEnabled: (usePreferencesStore.getState() as PreferencesStore)
            .notificationsEnabled,
          inactivityReminderEnabled: (
            usePreferencesStore.getState() as PreferencesStore
          ).inactivityReminderEnabled,
          language,
          fontSize: (usePreferencesStore.getState() as PreferencesStore).fontSize,
        };
        await storage.setObject(STORAGE_KEYS.USER_PREFS, prefs);
      } catch (error) {
        console.error('[PreferencesStore] Error setting language:', error);
      }
    },

    setFontSize: async (fontSize: 'small' | 'normal' | 'large') => {
      set((state) => {
        state.fontSize = fontSize;
      });

      try {
        const prefs = {
          theme: (usePreferencesStore.getState() as PreferencesStore).theme,
          notificationsEnabled: (usePreferencesStore.getState() as PreferencesStore)
            .notificationsEnabled,
          inactivityReminderEnabled: (
            usePreferencesStore.getState() as PreferencesStore
          ).inactivityReminderEnabled,
          language: (usePreferencesStore.getState() as PreferencesStore).language,
          fontSize,
        };
        await storage.setObject(STORAGE_KEYS.USER_PREFS, prefs);
      } catch (error) {
        console.error('[PreferencesStore] Error setting font size:', error);
      }
    },
  }))
);

export default usePreferencesStore;
