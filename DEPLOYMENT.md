# Deployment Guide - Mini LMS Mobile App

## Table of Contents
1. [Pre-Deployment](#pre-deployment)
2. [Android Deployment](#android-deployment)
3. [iOS Deployment](#ios-deployment)
4. [App Store Optimization](#app-store-optimization)
5. [Post-Launch Monitoring](#post-launch-monitoring)

## Pre-Deployment

### 1. Version Bump
```bash
# Update version in app.json and package.json
npm version patch  # for bug fixes
npm version minor  # for new features
npm version major  # for breaking changes

# Git tag
git tag v1.0.0
git push origin v1.0.0
```

### 2. Verify Everything Works
```bash
# Type checking
npm run type-check

# Run tests
npm test

# Linting
npm run lint

# Build check
eas build --platform android --profile preview
eas build --platform ios --profile preview
```

### 3. Create Release Notes
File: `RELEASE_NOTES.md`
```markdown
# Version 1.0.0 - May 2, 2026

## What's New
- Course catalog with search functionality
- Bookmark and enrollment tracking
- Offline support with automatic caching
- Push notifications for course reminders
- User authentication with secure token storage

## Bug Fixes
- Fixed offline banner not showing
- Improved search performance with debouncing
- Fixed enrollment state sync issues

## Known Issues
- None at this time

## Migration Notes
- First release, no migration needed
```

## Android Deployment

### Step 1: Create Google Play Developer Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Create developer account ($25 one-time fee)
3. Set up billing
4. Create a new app

### Step 2: Set Up App Signing
```bash
# Generate keystore file
keytool -genkey -v -keystore mini-lms.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias mini-lms-key

# Store keystore credentials securely (NOT in version control)
# Save in: ~/.android/gradle.properties
org.gradle.jvmargs=-Xmx2048m
KEYSTORE_PATH=/path/to/mini-lms.keystore
KEYSTORE_PASSWORD=your_password
KEY_ALIAS=mini-lms-key
KEY_PASSWORD=your_password
```

### Step 3: Configure App
In `eas.json`:
```json
{
  "build": {
    "production": {
      "android": {
        "buildType": "app-bundle",
        "autoIncrement": true,
        "env": {
          "KEYSTORE_PATH": "/path/to/mini-lms.keystore",
          "KEYSTORE_PASSWORD": "...",
          "KEY_ALIAS": "mini-lms-key",
          "KEY_PASSWORD": "..."
        }
      }
    }
  }
}
```

### Step 4: Build for Play Store
```bash
# Build production app bundle
eas build --platform android --profile production

# Or build locally with gradle
cd android
./gradlew bundleRelease
```

### Step 5: Upload to Play Store
1. Go to Google Play Console
2. Select your app
3. Navigate to Release → Production
4. Upload AAB file
5. Fill in app details:
   - Screenshots (minimum 2)
   - Short description
   - Full description
   - Release notes

### Step 6: Review and Launch
1. Select rollout percentage (start with 5%)
2. Review content rating questionnaire
3. Submit for review
4. Wait for approval (typically 2-4 hours)
5. Gradually increase rollout to 100%

### Android Screenshots Requirements
```
Dimensions: 1080 x 1920 pixels
Format: PNG or JPEG
Count: Minimum 2, recommended 4-8
Content: Show key features, sign-in, course browsing, bookmarks
```

## iOS Deployment

### Step 1: Create Apple Developer Account
1. Go to [Apple Developer Program](https://developer.apple.com/programs/)
2. Enroll ($99/year)
3. Complete identity verification
4. Set up two-factor authentication

### Step 2: Create App in App Store Connect
1. Go to [App Store Connect](https://appstoreconnect.apple.com/)
2. My Apps → Create New App
3. Platform: iOS
4. App Name: Mini LMS
5. Primary Language: English
6. Bundle ID: com.minilms.app
7. SKU: (unique identifier)

### Step 3: Set Up Code Signing
```bash
# Create signing certificate
# This is done through Apple Developer portal:
# 1. Certificates, Identifiers & Profiles
# 2. Create new Certificate (iOS App Development or Distribution)
# 3. Download and install certificate

# For EAS:
eas credentials
# Follow prompts to set up credentials
```

### Step 4: Build for App Store
```bash
# Build production app
eas build --platform ios --profile production

# Or build locally with Xcode
xcode-select --install
xcodebuild -workspace ios/MiniBLMS.xcworkspace \
  -scheme Release -configuration Release \
  -derivedDataPath build/ -archivePath build/MiniBLMS.xcarchive \
  -archiveAction
```

### Step 5: Submit via App Store Connect
```bash
# Using Transporter
eas submit --platform ios

# Or manually:
# 1. Go to App Store Connect
# 2. TestFlight → New Build
# 3. Upload .ipa file via Transporter app
```

### Step 6: App Store Review
1. Fill app information:
   - Privacy policy URL
   - Support URL
   - Category: Education
   
2. Add screenshots (required):
   - 5.5" display (iPhone 14/15)
   - 6.7" display (larger devices)
   - 4.7" display (iPhone SE)
   
3. Submit for Review
4. Wait for review (typically 24-48 hours)
5. If approved, release to App Store

### iOS Screenshots Requirements
```
iPhone 6.7-inch: 1284 x 2778 pixels
iPhone 5.5-inch: 1242 x 2208 pixels
iPad Pro 12.9": 2048 x 2732 pixels
Format: PNG or JPEG
Count: Minimum 2, required for each device size
```

## App Store Optimization

### Metadata
```
App Name: Mini LMS (max 30 chars)
Subtitle: Learn Anywhere, Anytime (max 30 chars)
Keywords: education,learning,courses,skills,development (max 100 chars)
Categories: Education, Productivity
```

### Description
```
Mini LMS - Your Personal Learning Management System

Learn on your schedule with our comprehensive mobile learning platform.
Explore thousands of courses, bookmark your favorites, and track your 
progress.

Key Features:
✓ Browse & Search Courses
✓ Bookmark Favorites
✓ Track Enrollments
✓ Offline Mode
✓ Push Notifications
✓ Responsive Design

Whether you're learning new skills or advancing your career, Mini LMS 
has you covered.
```

### Privacy Policy
Required elements:
- Data collected (email, name, learning progress)
- How data is used
- Storage location
- User rights (access, deletion)
- Contact information

### Screenshots (Strategy)
1. **Screen 1**: Home with featured courses
2. **Screen 2**: Search and browse functionality
3. **Screen 3**: Course detail view
4. **Screen 4**: Bookmarks screen
5. **Screen 5**: Offline capability

## Post-Launch Monitoring

### Crash Monitoring
```typescript
// Monitor crashes with Sentry
import * as Sentry from '@sentry/react-native';

export function setupCrashMonitoring() {
  Sentry.init({
    dsn: 'YOUR_SENTRY_DSN',
    tracesSampleRate: 0.1,
  });
}
```

### Analytics
```typescript
// Track important events
import { logEvent } from '@react-native-firebase/analytics';

logEvent('course_viewed', {
  courseId: '123',
  courseName: 'React Basics',
});

logEvent('course_enrolled', {
  courseId: '123',
});
```

### User Feedback
- Encourage reviews in app stores
- Monitor app store reviews
- Respond to user feedback
- Fix critical issues quickly

### Performance Monitoring
- Startup time
- API response times
- Crash rates
- Memory usage
- Battery impact

### Version Tracking
```typescript
// In app.json
{
  "version": "1.0.0"
}

// Access in app
import Constants from 'expo-constants';
const appVersion = Constants.expoConfig.version;
```

## Troubleshooting

### Build Failures
```bash
# Clear build cache
eas build:cancel  # Cancel pending builds

# Check credentials
eas credentials

# View detailed logs
eas build --platform android --profile production --log-all
```

### Review Rejections
Common reasons:
- **Performance**: App crashes or loads slowly
- **Privacy**: Missing privacy policy
- **Content**: Inappropriate content
- **Functionality**: Broken features

Solution: Fix issues and resubmit in 24 hours

### Update Strategy
```bash
# For critical bugs: Patch version (1.0.1)
# For new features: Minor version (1.1.0)
# For breaking changes: Major version (2.0.0)

# Always test on real devices before release
# Start with 5-10% rollout for Android
```

## Release Checklist

- [ ] Bump version
- [ ] Create release notes
- [ ] Type-check passes
- [ ] Tests pass
- [ ] Build succeeds locally
- [ ] Test on real Android device
- [ ] Test on real iOS device
- [ ] Test offline functionality
- [ ] Privacy policy current
- [ ] Screenshots prepared
- [ ] App description complete
- [ ] All links working
- [ ] No console errors
- [ ] No sensitive data in logs
- [ ] Git tag created
- [ ] Build submitted to play stores
- [ ] Monitoring set up
- [ ] Update documentation

## Support

For issues:
- Check [Expo documentation](https://docs.expo.dev/)
- Review [EAS Build docs](https://docs.expo.dev/build/)
- Check [Google Play docs](https://developer.android.com/distribute)
- Review [App Store Connect docs](https://help.apple.com/app-store-connect/)

## Timeline

```
Day 1: Prepare for release
      - Version bump
      - Testing
      - Screenshots
      
Day 2: Submit to app stores
      - Google Play (typically approved within 2-4 hours)
      - Apple App Store (typically approved within 24-48 hours)
      
Day 3: Monitor and respond
      - Watch crash rates
      - Monitor user reviews
      - Be ready to release hotfix if needed
```
