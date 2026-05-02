# Build Configuration & Optimization

## APP Build Settings (app.json)

```json
{
  "expo": {
    "name": "Mini LMS",
    "slug": "mini-lms",
    "version": "1.0.0",
    "assetBundlePatterns": ["**/*"],
    "platforms": ["ios", "android"],
    
    // Android Configuration
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.minilms.app",
      "versionCode": 1,
      "permissions": [
        "android.permission.ACCESS_NETWORK_STATE",
        "android.permission.INTERNET",
        "android.permission.POST_NOTIFICATIONS"
      ]
    },
    
    // iOS Configuration
    "ios": {
      "supportsTabletMode": false,
      "bundleIdentifier": "com.minilms.app",
      "buildNumber": "1",
      "infoPlist": {
        "NSLocalNetworkUsageDescription": "Allow LMS to use local network",
        "NSBonjourServiceTypes": ["_http._tcp"]
      }
    },
    
    // Splash Screen
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#0284c7"
    },
    
    // Plugins
    "plugins": [
      [
        "expo-image-picker",
        {
          "photosPermission": "Allow Mini LMS to access your photos"
        }
      ]
    ]
  }
}
```

## Build Optimization Checklist

### Bundle Size Optimization
- [ ] Enable tree-shaking in Babel
- [ ] Remove unused dependencies
- [ ] Use dynamic imports for large modules
- [ ] Optimize images (WebP format, compression)
- [ ] Code splitting by route

### Performance
- [ ] Remove dev dependencies from production
- [ ] Enable minification
- [ ] Optimize CSS-in-JS (NativeWind)
- [ ] Lazy load heavy components
- [ ] Memoize expensive computations

### Security
- [ ] Secure API keys (environment variables)
- [ ] Code obfuscation (ProGuard for Android)
- [ ] Signing certificates
- [ ] Remove console logs in production

### App Store Requirements
- [ ] Privacy policy
- [ ] Terms of service
- [ ] App icons all sizes
- [ ] Screenshots for stores
- [ ] App description and keywords

## Building for Production

### Prerequisites
```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure
```

### Generate Android APK
```bash
# Development build
eas build --platform android --profile preview

# Production build (Play Store)
eas build --platform android --profile production
```

### Generate iOS IPA
```bash
# Development build
eas build --platform ios --profile preview

# Production build (App Store)
eas build --platform ios --profile production
```

### Local Build (Development)
```bash
# Android (requires Android SDK)
expo build:android --type apk

# iOS (requires Xcode)
expo build:ios --type archive
```

## Code Optimization

### Remove Console Logs (Production)
```typescript
// babel.config.js
module.exports = function(api) {
  const isProduction = api.env('production');
  
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'nativewind/babel',
      isProduction && 'transform-remove-console',
    ].filter(Boolean),
  };
};
```

### Dynamic Imports
```typescript
// Instead of importing large module upfront
// Use dynamic import for routes not immediately needed

// Before:
import HeavyComponent from './HeavyComponent';

// After (lazy load):
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Image Optimization
```typescript
// Use WebP format with fallback
import { Image } from 'expo-image';

export function OptimizedImage() {
  return (
    <Image
      source={{
        uri: 'https://example.com/image.webp',
      }}
      contentFit="cover"
      transition={1000}
    />
  );
}
```

## Environment Configuration

### .env.example
```
EXPO_PUBLIC_API_BASE_URL=https://api.freeapi.app/
EXPO_PUBLIC_APP_NAME=Mini LMS
EXPO_PUBLIC_APP_VERSION=1.0.0
EXPO_PUBLIC_ENVIRONMENT=production
```

### Load Environment Variables
```typescript
// src/constants/theme.ts
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.freeapi.app/';
const ENVIRONMENT = process.env.EXPO_PUBLIC_ENVIRONMENT || 'development';
```

## Firebase/Analytics (Optional)

### Install Firebase
```bash
npm install @react-native-firebase/app @react-native-firebase/analytics
```

### Configure
```typescript
import analytics from '@react-native-firebase/analytics';

export async function trackEvent(eventName: string, params?: Record<string, any>) {
  try {
    await analytics().logEvent(eventName, params);
  } catch (error) {
    console.warn('[Analytics] Error tracking event:', error);
  }
}
```

## Monitoring & Logging

### Setup Sentry for Error Tracking
```bash
npm install @sentry/react-native
```

### Initialize
```typescript
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'YOUR_SENTRY_DSN',
  environment: process.env.EXPO_PUBLIC_ENVIRONMENT,
  tracesSampleRate: 1.0,
});
```

## Release Checklist

- [ ] Update version in app.json
- [ ] Update version in package.json
- [ ] Create release notes
- [ ] Run type checking: `npm run type-check`
- [ ] Run tests: `npm test`
- [ ] Build production: `eas build`
- [ ] Test on device
- [ ] Review app store requirements
- [ ] Submit to app stores
- [ ] Tag release in git: `git tag v1.0.0`

## Versioning

### Semantic Versioning
- **Major** (1.0.0): Breaking changes
- **Minor** (1.1.0): New features (backward compatible)
- **Patch** (1.0.1): Bug fixes

### Update Version
```bash
# Bump version
npm version patch    # 1.0.0 → 1.0.1
npm version minor    # 1.0.0 → 1.1.0
npm version major    # 1.0.0 → 2.0.0
```

## Build Profiles (eas.json)

```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      },
      "ios": {
        "buildType": "simulator"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      },
      "ios": {
        "buildType": "archive"
      }
    }
  },
  "submit": {
    "production": {
      "android": {
        "track": "production"
      },
      "ios": {
        "ascAppId": "YOUR_ASC_APP_ID"
      }
    }
  }
}
```

## Performance Metrics

Monitor these metrics in production:
- **App Size**: < 50MB (Android), < 100MB (iOS)
- **Startup Time**: < 3s
- **First Interactive**: < 5s
- **Crash Rate**: < 0.1%
- **Memory Usage**: < 100MB (average)

## App Store Submission

### Google Play Store
1. Create Google Play Developer account
2. Create app in Play Console
3. Add app signing key
4. Upload build (bundle or APK)
5. Add store listing details
6. Set pricing
7. Submit for review

### Apple App Store
1. Create Apple Developer account
2. Create app in App Store Connect
3. Create signing certificates
4. Upload build via Xcode/Transporter
5. Add app information
6. Submit for review

## Resources

- [Expo Build Documentation](https://docs.expo.dev/build/)
- [EAS Submit](https://docs.expo.dev/eas-update/)
- [React Native Performance](https://reactnative.dev/docs/performance)
- [Bundle Size Analysis](https://docs.expo.dev/build/optimization/)
