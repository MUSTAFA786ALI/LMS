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
        
        // CRITICAL: Absolute 5-second timeout to prevent any hang
        const absoluteTimeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Initialization timeout')), 5000)
        );

        // Hydrate all stores in parallel with timeout protection
        try {
          await Promise.race([
            Promise.all([
              hydrateAuth().catch(err => {
                console.warn('[SplashScreen] Auth hydration failed:', err.message);
              }),
              hydrateCourses().catch(err => {
                console.warn('[SplashScreen] Course hydration failed:', err.message);
              }),
              hydratePrefs().catch(err => {
                console.warn('[SplashScreen] Prefs hydration failed:', err.message);
              })
            ]),
            absoluteTimeoutPromise
          ]);
        } catch (hydrationError: any) {
          console.warn('[SplashScreen] Hydration timeout/error:', hydrationError.message);
        }

        setIsInitialized(true);

        // Get current auth state and navigate immediately
        const isAuthenticated = useAuthStore.getState().isAuthenticated;
        
        // Navigate without delay - the router will handle async operations
        if (isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('[SplashScreen] Critical error:', error);
        setIsInitialized(true);
        // Default to login on critical error
        router.replace('/(auth)/login');
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
