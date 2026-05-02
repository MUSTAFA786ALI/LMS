/**
 * Root Layout
 * Main app router with auth-based navigation and theme support
 */

import React, { useEffect, useMemo } from 'react';
import { View, useColorScheme } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAuthStore } from '@/src/store/authStore';
import { usePreferencesStore } from '@/src/store/prefsStore';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { OfflineBanner } from '@/src/components/OfflineBanner';
import { Colors } from '@/src/constants/theme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const systemColorScheme = useColorScheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const { theme: preferredTheme } = usePreferencesStore((state) => ({
    theme: state.theme,
  }));

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
          <Stack>
            {isAuthenticated ? (
              <>
                <Stack.Screen name="(tabs)" options={{ headerShown: false, gestureEnabled: false }} />
              </>
            ) : (
              <>
                <Stack.Screen name="(auth)" options={{ headerShown: false, gestureEnabled: false }} />
              </>
            )}
            <Stack.Screen name="index" options={{ headerShown: false, gestureEnabled: false }} />
          </Stack>
          <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor="transparent" />
        </ThemeProvider>
      </View>
    </ErrorBoundary>
  );
}
