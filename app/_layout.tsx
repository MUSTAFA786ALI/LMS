/**
 * Root Layout
 * Main app router with auth-based navigation and theme support
 */

import "../global.css";
import React, { useMemo, useEffect } from 'react';
import * as Sentry from '@sentry/react-native';
import { View, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { usePreferencesStore } from '@/src/store/prefsStore';
import { useBookmarkNotifications } from '@/src/hooks/useBookmarkNotifications';
import { useInactivityReminder } from '@/src/hooks/useInactivityReminder';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { OfflineBanner } from '@/src/components/OfflineBanner';
import { Colors } from '@/src/constants/theme';

Sentry.init({
  dsn: 'https://d76f8348cb26bdd9536d2fee3693c06f@o4509598742413312.ingest.us.sentry.io/4511518739988480',
  tracesSampleRate: 1.0,
  enableNativeFramesTracking: true,
});

function RootLayout() {
  const systemColorScheme = useColorScheme();
  // Use individual selector to avoid creating new objects on every render
  const preferredTheme = usePreferencesStore((state) => state.theme);

  // Initialize notification hooks - these should not block rendering
  try {
    useBookmarkNotifications();
    useInactivityReminder();
  } catch (error) {
    console.warn('[RootLayout] Error initializing notification hooks:', error);
  }

  // Determine active theme based on preference and system
  const activeTheme = useMemo(() => {
    if (preferredTheme === 'auto') {
      return systemColorScheme || 'light';
    }
    return preferredTheme;
  }, [preferredTheme, systemColorScheme]);

  const isDark = activeTheme === 'dark';

  // Create custom theme with our colors
  const customDarkTheme = {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      primary: Colors.dark.primary,
      background: Colors.dark.background,
      card: Colors.dark.cardBg,
      text: Colors.dark.text,
      border: Colors.dark.border,
      notification: Colors.dark.warning,
    },
  };

  const customLightTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      primary: Colors.light.primary,
      background: Colors.light.background,
      card: Colors.light.cardBg,
      text: Colors.light.text,
      border: Colors.light.border,
      notification: Colors.light.warning,
    },
  };

  return (
    <ErrorBoundary>
      <View style={{ flex: 1, backgroundColor: isDark ? Colors.dark.background : Colors.light.background }}>
        <OfflineBanner />
        <ThemeProvider value={isDark ? customDarkTheme : customLightTheme}>
          <Stack
            screenOptions={{
              headerShown: false,
              gestureEnabled: false,
            }}
          >
            <Stack.Screen name="index" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(tabs)" />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" />
        </ThemeProvider>
      </View>
    </ErrorBoundary>
  );
}

export default Sentry.wrap(RootLayout);