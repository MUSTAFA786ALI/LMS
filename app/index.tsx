/**
 * Splash/Index Screen
 * Handles app initialization and routing
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

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const hydrateAuth = useAuthStore((state) => state.hydrate);
  const hydrateCourses = useCourseStore((state) => state.hydrate);
  const hydratePrefs = usePreferencesStore((state) => state.hydrate);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Hydrate all stores in parallel
        await Promise.all([hydrateAuth(), hydrateCourses(), hydratePrefs()]);

        // Small delay for better UX
        await new Promise((resolve) => setTimeout(resolve, 500));

        setIsInitialized(true);

        // Route based on auth state
        if (useAuthStore.getState().isAuthenticated) {
          router.replace('/(tabs)/home');
        } else {
          router.replace('/(auth)/login');
        }
      } catch (error) {
        console.error('[SplashScreen] Initialization error:', error);
        // Default to login on error
        setIsInitialized(true);
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
