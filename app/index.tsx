/**
 * Splash/Index Screen
 * Handles app initialization - stores are hydrated here
 */

import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '@/src/store/authStore';
import { useCourseStore } from '@/src/store/courseStore';
import { usePreferencesStore } from '@/src/store/prefsStore';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Colors } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SplashScreen() {
  const router = useRouter();
  const [isInitialized, setIsInitialized] = React.useState(false);

  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const hydrateCourses = useCourseStore((state) => state.hydrate);
  const hydratePrefs = usePreferencesStore((state) => state.hydrate);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        console.log('[SplashScreen] Starting app initialization');
        
        // Add timeout to prevent infinite loading (10 seconds)
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Hydration timeout - took too long')), 10000)
        );

        // Hydrate all stores in parallel with timeout protection
        try {
          await Promise.race([
            Promise.all([hydrateAuth(), hydrateCourses(), hydratePrefs()]),
            timeoutPromise
          ]);
        } catch (hydrationError: any) {
          console.warn('[SplashScreen] Hydration warning (continuing anyway):', hydrationError.message);
          // Continue with partial hydration instead of blocking
        }

        // Small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsInitialized(true);

        // Get current auth state and navigate after layout is ready
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        
        // Use a small timeout to ensure layout is mounted
        setTimeout(() => {
          if (isAuthenticated) {
            router.replace('/(tabs)/home');
          } else {
            router.replace('/(auth)/login');
          }
        }, 100);
      } catch (error) {
        console.error('[SplashScreen] Initialization error:', error);
        setIsInitialized(true);
        // Default to login on error
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 100);
      }
    };

    initializeApp();
  }, [router, hydrateAuth, hydrateCourses, hydratePrefs]);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <MaterialIcons name="school" size={64} color={Colors.light.primary} />
      </View>
      <LoadingSpinner size="large" color={Colors.light.primary} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
  logoContainer: {
    marginBottom: 32,
  },
});
