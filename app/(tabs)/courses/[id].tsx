/**
 * Course Detail Screen
 * Displays comprehensive course information with WebView for rich content
 */

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  Modal,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { WebView } from 'react-native-webview';
import { useCourses } from '@/src/hooks/useCourses';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Button } from '@/src/components/ui/Button';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

/**
 * Generate HTML content for course display
 */
function getCourseHTML(course: any) {
  return `
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${course.title}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            padding: 16px;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            background: white;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #0284c7 0%, #7c3aed 100%);
            color: white;
            padding: 24px;
            text-align: center;
          }
          .header h1 { font-size: 24px; margin-bottom: 12px; }
          .content { padding: 24px; }
          .section { margin-bottom: 24px; }
          .section h2 { font-size: 18px; margin-bottom: 12px; color: #000; }
          .section p { font-size: 14px; line-height: 1.6; color: #666; }
          .stats {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
            margin-bottom: 24px;
          }
          .stat-item {
            background: #f9fafb;
            padding: 12px;
            border-radius: 8px;
            text-align: center;
          }
          .stat-value { font-size: 20px; font-weight: bold; color: #0284c7; }
          .stat-label { font-size: 12px; color: #999; margin-top: 4px; }
          .buttons {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            padding: 24px;
          }
          .button {
            padding: 12px;
            border: none;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            text-align: center;
          }
          .button.primary {
            background: #0284c7;
            color: white;
          }
          .button.secondary {
            background: #f3f4f6;
            color: #0284c7;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${course.title}</h1>
            <p>by ${course.instructor?.fullName || 'Unknown'}</p>
          </div>
          <div class="content">
            <div class="stats">
              <div class="stat-item">
                <div class="stat-value">${(course.rating || 4.5).toFixed(1)}</div>
                <div class="stat-label">Rating</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${(course.enrolledCount || 0).toLocaleString()}</div>
                <div class="stat-label">Enrolled</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${course.duration || 20}</div>
                <div class="stat-label">Hours</div>
              </div>
            </div>
            
            <div class="section">
              <h2>About</h2>
              <p>${course.description || 'Learn industry-relevant skills from expert instructors.'}</p>
            </div>
            
            <div class="section">
              <h2>What You'll Learn</h2>
              <p>✓ Master core concepts</p>
              <p>✓ Build real projects</p>
              <p>✓ Get certified</p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `;
}

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const {
    courses,
    isLoading,
    toggleBookmark,
    addEnrollment,
    isBookmarked,
  } = useCourses();

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const webViewRef = useRef<WebView>(null);

  // Find the course
  const course = courses.find((c) => c.id === id);

  useEffect(() => {
    // Check if user is enrolled (would need to implement in real app)
    setIsEnrolled(false);
  }, [id]);

  if (isLoading && !course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContent}>
          <LoadingSpinner size="large" color={Colors.light.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!course) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <ErrorMessage
            message="Course not found"
            onDismiss={() => router.back()}
          />
        </View>
      </SafeAreaView>
    );
  }

  const handleBookmark = () => {
    toggleBookmark(course.id);
  };

  const handleEnroll = async () => {
    addEnrollment(course.id);
    setIsEnrolled(true);
  };

  const handleWebViewMessage = (event: any) => {
    const { action } = JSON.parse(event.nativeEvent.data);
    if (action === 'enroll') {
      handleEnroll();
    } else if (action === 'bookmark') {
      handleBookmark();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={12}>
          <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
        </Pressable>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {course.title}
        </Text>
        <Pressable onPress={handleBookmark} hitSlop={12}>
          <MaterialIcons
            name={isBookmarked(course.id) ? 'bookmark' : 'bookmark-border'}
            size={24}
            color={isBookmarked(course.id) ? Colors.light.primary : Colors.light.text}
          />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Course Image Section */}
        <View style={styles.imageSection}>
          <View style={styles.courseImage}>
            <MaterialIcons name="school" size={80} color="white" />
          </View>
        </View>

        {/* Course Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.instructorSection}>
            <View style={styles.instructorAvatar}>
              <MaterialIcons name="person" size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.instructorInfo}>
              <Text style={styles.instructorLabel}>Instructor</Text>
              <Text style={styles.instructorName}>
                {course.instructor?.fullName || 'Unknown'}
              </Text>
            </View>
          </View>

          {/* Stats Grid */}
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(course.rating || 4.5).toFixed(1)}
              </Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <MaterialIcons
                    key={i}
                    name={i <= Math.floor(course.rating || 4.5) ? 'star' : 'star-border'}
                    size={16}
                    color="#FBBF24"
                  />
                ))}
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {(course.enrolledCount || 0).toLocaleString()}
              </Text>
              <Text style={styles.statLabel}>Enrolled</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.statItem}>
              <Text style={styles.statValue}>{course.duration || 20}</Text>
              <Text style={styles.statLabel}>Hours</Text>
            </View>
          </View>
        </View>

        {/* Description Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About This Course</Text>
          <Text style={styles.description}>
            {course.description ||
              'Learn industry-relevant skills from expert instructors. This course covers everything you need to know to master the subject.'}
          </Text>
        </View>

        {/* Level & Category */}
        <View style={styles.section}>
          <View style={styles.badgesRow}>
            {course.level && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{course.level}</Text>
              </View>
            )}
            {course.category && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{course.category}</Text>
              </View>
            )}
          </View>
        </View>

        {/* What You'll Learn */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What You'll Learn</Text>
          {['Master core concepts', 'Build real projects', 'Get certified'].map(
            (item, index) => (
              <View key={index} style={styles.learningItem}>
                <MaterialIcons name="check-circle" size={20} color={Colors.light.success} />
                <Text style={styles.learningText}>{item}</Text>
              </View>
            )
          )}
        </View>

        {/* Requirements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Requirements</Text>
          <Text style={styles.description}>
            Basic understanding of the fundamentals. No prior experience required.
          </Text>
        </View>

        {/* View Full Content Button */}
        {course.description && (
          <Button
            label="View Full Content"
            onPress={() => setShowWebView(true)}
            variant="secondary"
            size="lg"
            isFullWidth
            style={styles.viewButton}
            rightIcon={<MaterialIcons name="open-in-new" size={20} color={Colors.light.primary} />}
          />
        )}

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          {!isEnrolled ? (
            <Button
              label="Enroll Now"
              onPress={handleEnroll}
              variant="primary"
              size="lg"
              isFullWidth
            />
          ) : (
            <View style={styles.enrolledBadge}>
              <MaterialIcons name="check-circle" size={20} color={Colors.light.success} />
              <Text style={styles.enrolledText}>Already Enrolled</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* WebView Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <SafeAreaView style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <Pressable onPress={() => setShowWebView(false)} hitSlop={12}>
              <MaterialIcons name="close" size={24} color={Colors.light.text} />
            </Pressable>
            <Text style={styles.webViewTitle} numberOfLines={1}>
              {course.title}
            </Text>
            <View style={{ width: 24 }} />
          </View>

          <WebView
            ref={webViewRef}
            source={{ html: getCourseHTML(course) }}
            onMessage={handleWebViewMessage}
            style={{ flex: 1 }}
            startInLoadingState
            renderLoading={() => (
              <View style={styles.webViewLoader}>
                <LoadingSpinner size="large" color={Colors.light.primary} />
              </View>
            )}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.text,
    marginHorizontal: Spacing.md,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  imageSection: {
    marginVertical: Spacing.lg,
    alignItems: 'center',
  },
  courseImage: {
    width: 200,
    height: 200,
    borderRadius: 16,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.lg,
  },
  instructorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.lg,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  instructorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  instructorInfo: {
    flex: 1,
  },
  instructorLabel: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    fontWeight: '500',
  },
  instructorName: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.text,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
  },
  ratingStars: {
    flexDirection: 'row',
    gap: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.light.border,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
    lineHeight: 24,
  },
  badgesRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: Colors.light.primary,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: 8,
  },
  badgeText: {
    fontSize: FontSizes.sm,
    color: 'white',
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  learningItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  learningText: {
    fontSize: FontSizes.base,
    color: Colors.light.text,
    fontWeight: '500',
  },
  viewButton: {
    marginBottom: Spacing.lg,
  },
  actionsContainer: {
    marginBottom: Spacing.lg,
  },
  enrolledBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#DCFCE7',
    paddingVertical: Spacing.lg,
    borderRadius: 12,
    gap: Spacing.md,
  },
  enrolledText: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.success,
  },
  webViewContainer: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  webViewTitle: {
    flex: 1,
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.text,
    marginHorizontal: Spacing.md,
  },
  webViewLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
