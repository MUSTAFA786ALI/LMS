/**
 * Root Layout
 * Main app router with auth-based navigation
 */

import React, { useEffect } from 'react';
import { View } from 'react-native';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import { useAuthStore } from '@/src/store/authStore';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import { OfflineBanner } from '@/src/components/OfflineBanner';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);

  return (
    <ErrorBoundary>
      <View style={{ flex: 1 }}>
        <OfflineBanner />
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
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
          <StatusBar style="auto" />
        </ThemeProvider>
      </View>
    </ErrorBoundary>
  );
}
