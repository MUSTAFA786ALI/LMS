/**
 * App Constants
 */

/**
 * Color Palette
 */
export const Colors = {
  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    cardBg: '#FAFAFA',
    text: '#000000',
    textSecondary: '#666666',
    textTertiary: '#999999',
    border: '#E0E0E0',
    error: '#DC2626',
    success: '#16A34A',
    warning: '#EA580C',
    info: '#0284C7',
    primary: '#0284C7',
    secondary: '#7C3AED',
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    cardBg: '#272727',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    textTertiary: '#808080',
    border: '#333333',
    error: '#F87171',
    success: '#4ADE80',
    warning: '#FB923C',
    info: '#38BFEF',
    primary: '#38BFEF',
    secondary: '#A78BFA',
  },
};

/**
 * Spacing Scale
 */
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 48,
};

/**
 * Typography
 */
export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

/**
 * Border Radius
 */
export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  '2xl': 20,
  full: 9999,
};

/**
 * Shadows
 */
export const Shadows = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 10,
  },
};

/**
 * Animation Durations (ms)
 */
export const Durations = {
  fast: 150,
  base: 300,
  slow: 500,
  slower: 700,
};

/**
 * API Configuration
 */
export const API_CONFIG = {
  BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.freeapi.app/',
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 500,
};

/**
 * Storage Keys
 */
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  COURSES_CACHE: 'courses_cache',
  BOOKMARKS: 'bookmarks',
  ENROLLMENTS: 'enrollments',
  USER_PREFS: 'user_prefs',
  LAST_SYNC: 'last_sync',
  THEME: 'theme',
  PROFILE_IMAGE: 'profile_image',
  LAST_APP_OPEN: 'last_app_open',
};

/**
 * Feature Flags
 */
export const FEATURE_FLAGS = {
  ENABLE_SENTRY: process.env.EXPO_PUBLIC_ENABLE_SENTRY === 'true',
  ENABLE_ANALYTICS: process.env.EXPO_PUBLIC_ENABLE_ANALYTICS === 'true',
  ENABLE_AI_RECOMMENDATIONS: process.env.EXPO_PUBLIC_ENABLE_AI_RECOMMENDATIONS === 'true',
};

/**
 * Validation Rules
 */
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD_MIN_LENGTH: 6,
  USERNAME_MIN_LENGTH: 3,
  FULLNAME_MIN_LENGTH: 2,
};

/**
 * Error Messages
 */
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  TIMEOUT_ERROR: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'Unauthorized. Please log in.',
  FORBIDDEN: 'You do not have permission to access this resource.',
  NOT_FOUND: 'Resource not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  INVALID_EMAIL: 'Please enter a valid email address.',
  PASSWORD_REQUIRED: 'Password is required.',
  FULLNAME_REQUIRED: 'Full name is required.',
};

/**
 * Success Messages
 */
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Logged in successfully!',
  REGISTER_SUCCESS: 'Registered successfully! Please log in.',
  LOGOUT_SUCCESS: 'Logged out successfully!',
  BOOKMARK_ADDED: 'Bookmarked!',
  BOOKMARK_REMOVED: 'Bookmark removed!',
  COURSE_ENROLLED: 'You are now enrolled!',
};
