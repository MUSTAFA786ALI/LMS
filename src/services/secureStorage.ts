/**
 * Secure Storage Service Wrapper
 * Wraps expo-secure-store for easy token management
 */

import * as SecureStore from 'expo-secure-store';

export const secureStorage = {
  /**
   * Set a secure value
   */
  set: async (key: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[SecureStorage] Error setting key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Get a secure value
   */
  get: async (key: string): Promise<string | null> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value || null;
    } catch (error) {
      console.error(`[SecureStorage] Error getting key ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove a secure value
   */
  remove: async (key: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[SecureStorage] Error removing key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Check if a key exists
   */
  exists: async (key: string): Promise<boolean> => {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value !== null;
    } catch {
      return false;
    }
  },

  /**
   * Clear all secure storage (careful!)
   */
  clear: async (): Promise<void> => {
    try {
      // Note: SecureStore doesn't have a built-in clear all method
      // We'll need to manually remove known keys
      const keys = ['auth_token', 'refresh_token'];
      for (const key of keys) {
        try {
          await SecureStore.deleteItemAsync(key);
        } catch {
          // Ignore if key doesn't exist
        }
      }
    } catch (error) {
      console.error('[SecureStorage] Error clearing storage:', error);
      throw error;
    }
  },
};

export default secureStorage;
