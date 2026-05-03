/**
 * Image Storage Service
 * Handles profile picture storage and retrieval
 */

import { storage } from './storage';
import { STORAGE_KEYS } from '../constants/theme';

export const imageStorage = {
  /**
   * Save profile image URI to storage (simplified - just stores the URI)
   */
  async saveProfileImage(imageUri: string): Promise<string | null> {
    try {
      // Save image URI to AsyncStorage
      await storage.setString(STORAGE_KEYS.PROFILE_IMAGE, imageUri);
      console.log('[ImageStorage] Profile image URI saved:', imageUri);
      return imageUri;
    } catch (error) {
      console.error('[ImageStorage] Error saving profile image:', error);
      return null;
    }
  },

  /**
   * Get profile image URI
   */
  async getProfileImage(): Promise<string | null> {
    try {
      const imageUri = await storage.getString(STORAGE_KEYS.PROFILE_IMAGE);
      if (imageUri) {
        return imageUri;
      }
      return null;
    } catch (error) {
      console.error('[ImageStorage] Error getting profile image:', error);
      return null;
    }
  },

  /**
   * Delete profile image
   */
  async deleteProfileImage(): Promise<boolean> {
    try {
      await storage.remove(STORAGE_KEYS.PROFILE_IMAGE);
      console.log('[ImageStorage] Profile image deleted');
      return true;
    } catch (error) {
      console.error('[ImageStorage] Error deleting profile image:', error);
      return false;
    }
  },

  /**
   * Clear all profile images
   */
  async clearAll(): Promise<boolean> {
    try {
      await storage.remove(STORAGE_KEYS.PROFILE_IMAGE);
      console.log('[ImageStorage] All profile images cleared');
      return true;
    } catch (error) {
      console.error('[ImageStorage] Error clearing profile images:', error);
      return false;
    }
  },
};

export default imageStorage;
