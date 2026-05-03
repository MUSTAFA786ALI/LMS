/**
 * Custom Hook: useProfileImage
 * Manages profile image selection and storage
 */

import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { imageStorage } from '../services/imageStorage';

export function useProfileImage() {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load profile image on mount
  useEffect(() => {
    loadProfileImage();
  }, []);

  const loadProfileImage = async () => {
    try {
      setIsLoading(true);
      const imagePath = await imageStorage.getProfileImage();
      setProfileImage(imagePath);
    } catch (err: any) {
      console.error('[useProfileImage] Error loading image:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const pickImage = async (): Promise<boolean> => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission to access media library is required');
        return false;
      }

      // Pick image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (result.canceled) {
        return false;
      }

      const imageUri = result.assets[0].uri;
      
      // Save image
      const savedPath = await imageStorage.saveProfileImage(imageUri);
      if (savedPath) {
        setProfileImage(savedPath);
        setError(null);
        return true;
      }
      
      setError('Failed to save profile image');
      return false;
    } catch (err: any) {
      console.error('[useProfileImage] Error picking image:', err);
      setError(err.message);
      return false;
    }
  };

  const deleteImage = async (): Promise<boolean> => {
    try {
      const success = await imageStorage.deleteProfileImage();
      if (success) {
        setProfileImage(null);
        setError(null);
        return true;
      }
      setError('Failed to delete image');
      return false;
    } catch (err: any) {
      console.error('[useProfileImage] Error deleting image:', err);
      setError(err.message);
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return {
    profileImage,
    isLoading,
    error,
    pickImage,
    deleteImage,
    clearError,
    reload: loadProfileImage,
  };
}

export default useProfileImage;
