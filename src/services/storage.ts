/**
 * AsyncStorage Service Wrapper
 * Wraps AsyncStorage for easy data persistence
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

export const storage = {
  /**
   * Set a string value
   */
  setString: async (key: string, value: string): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[Storage] Error setting key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Get a string value
   */
  getString: async (key: string): Promise<string | null> => {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`[Storage] Error getting key ${key}:`, error);
      return null;
    }
  },

  /**
   * Set a JSON value
   */
  setObject: async <T,>(key: string, value: T): Promise<void> => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[Storage] Error setting object ${key}:`, error);
      throw error;
    }
  },

  /**
   * Get a JSON value
   */
  getObject: async <T,>(key: string): Promise<T | null> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[Storage] Error getting object ${key}:`, error);
      return null;
    }
  },

  /**
   * Remove a value
   */
  remove: async (key: string): Promise<void> => {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Error removing key ${key}:`, error);
      throw error;
    }
  },

  /**
   * Check if a key exists
   */
  exists: async (key: string): Promise<boolean> => {
    try {
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch {
      return false;
    }
  },

  /**
   * Get all keys
   */
  getAllKeys: async (): Promise<string[]> => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return Array.from(keys);
    } catch (error) {
      console.error('[Storage] Error getting all keys:', error);
      return [];
    }
  },

  /**
   * Clear all storage
   */
  clear: async (): Promise<void> => {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[Storage] Error clearing storage:', error);
      throw error;
    }
  },
};

export default storage;
