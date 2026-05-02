/**
 * Custom Hook: useTheme
 * Manages theme switching based on user preferences and system settings
 */

import { useColorScheme } from 'react-native';
import { usePreferencesStore } from '@/src/store/prefsStore';
import { Colors } from '@/src/constants/theme';

type ThemeType = 'light' | 'dark';

interface ThemeColors {
  primary: string;
  secondary: string;
  background: string;
  text: string;
  textSecondary: string;
  border: string;
  cardBg: string;
  success: string;
  error: string;
  warning: string;
}

export function useTheme() {
  const { theme: preferredTheme } = usePreferencesStore((state) => ({
    theme: state.theme,
  }));

  const systemColorScheme = useColorScheme();

  // Determine active theme
  const getActiveTheme = (): ThemeType => {
    if (preferredTheme === 'auto') {
      return (systemColorScheme as ThemeType) || 'light';
    }
    return preferredTheme as ThemeType;
  };

  const activeTheme = getActiveTheme();
  const isDark = activeTheme === 'dark';

  // Get theme colors
  const themeColors: ThemeColors = isDark ? Colors.dark : Colors.light;

  return {
    isDark,
    activeTheme,
    colors: themeColors,
    preferredTheme,
  };
}

export default useTheme;
