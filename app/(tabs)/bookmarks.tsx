/**
 * Bookmarks Screen
 * Saved courses and bookmarks
 */

import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCourses } from '@/src/hooks/useCourses';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function BookmarksScreen() {
  const router = useRouter();
  const {
    courses,
    isLoading,
    bookmarkedCourseIds,
    enrolledCourseIds,
    getBookmarkedCourses,
    getEnrolledCourses,
    toggleBookmark,
  } = useCourses();

  useEffect(() => {
    // Hook will hydrate on mount
  }, []);

  // Memoize bookmarked and enrolled courses to update when IDs change
  const bookmarkedCourses = useMemo(
    () => getBookmarkedCourses(),
    [bookmarkedCourseIds.join(','), courses.length]
  );
  
  const enrolledCourses = useMemo(
    () => getEnrolledCourses(),
    [enrolledCourseIds.join(','), courses.length]
  );

  const handleCoursePress = (courseId: string) => {
    const course = courses.find(c => c.id === courseId);
    if (course) {
      router.push({
        pathname: '/courses/[id]',
        params: { id: courseId, course: JSON.stringify(course) },
      });
    } else {
      console.error('[BookmarksScreen] Course not found:', courseId);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Learning</Text>
          <Text style={styles.subtitle}>Manage your courses and bookmarks</Text>
        </View>

        {isLoading ? (
          <View style={styles.centerContent}>
            <LoadingSpinner size="large" color={Colors.light.primary} />
          </View>
        ) : (
          <>
            {/* Enrolled Courses Section */}
            {enrolledCourses.length > 0 && (
              <>
                <Text style={styles.sectionTitle}>Currently Learning</Text>
                {enrolledCourses.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.courseItem}
                    onPress={() => handleCoursePress(item.id)}
                  >
                    <View style={styles.courseImage}>
                      <MaterialIcons
                        name="school"
                        size={32}
                        color={Colors.light.primary}
                      />
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.instructorName} numberOfLines={1}>
                        {item.instructor?.fullName || 'Unknown'}
                      </Text>
                      <View style={styles.courseFooter}>
                        <View style={styles.rating}>
                          <MaterialIcons name="star" size={12} color="#FBBF24" />
                          <Text style={styles.ratingText}>
                            {(item.rating || 4.5).toFixed(1)}
                          </Text>
                        </View>
                        <View style={styles.badge}>
                          <MaterialIcons
                            name="check-circle"
                            size={12}
                            color={Colors.light.success}
                          />
                          <Text style={styles.badgeText}>Enrolled</Text>
                        </View>
                      </View>
                    </View>
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={Colors.light.textTertiary}
                    />
                  </Pressable>
                ))}
              </>
            )}

            {/* Bookmarked Courses Section */}
            {bookmarkedCourses.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
                  Saved for Later
                </Text>
                {bookmarkedCourses.map((item) => (
                  <Pressable
                    key={item.id}
                    style={styles.courseItem}
                    onPress={() => handleCoursePress(item.id)}
                  >
                    <View style={styles.courseImage}>
                      <MaterialIcons
                        name="school"
                        size={32}
                        color={Colors.light.primary}
                      />
                    </View>
                    <View style={styles.courseInfo}>
                      <Text style={styles.courseTitle} numberOfLines={1}>
                        {item.title}
                      </Text>
                      <Text style={styles.instructorName} numberOfLines={1}>
                        {item.instructor?.fullName || 'Unknown'}
                      </Text>
                      <View style={styles.courseFooter}>
                        <View style={styles.rating}>
                          <MaterialIcons name="star" size={12} color="#FBBF24" />
                          <Text style={styles.ratingText}>
                            {(item.rating || 4.5).toFixed(1)}
                          </Text>
                        </View>
                      </View>
                    </View>
                    <Pressable
                      onPress={() => toggleBookmark(item.id)}
                      hitSlop={12}
                    >
                      <MaterialIcons
                        name="bookmark"
                        size={24}
                        color={Colors.light.primary}
                      />
                    </Pressable>
                  </Pressable>
                ))}
              </>
            )}

            {/* Empty State */}
            {bookmarkedCourses.length === 0 && enrolledCourses.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="bookmark-border"
                  size={48}
                  color={Colors.light.textTertiary}
                />
                <Text style={styles.emptyStateTitle}>Nothing here yet</Text>
                <Text style={styles.emptyStateText}>
                  Enroll in courses or bookmark them to access later
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
  },
  header: {
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.lg,
  },
  centerContent: {
    minHeight: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  courseImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  courseTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
  },
  instructorName: {
    fontSize: FontSizes.xs,
    color: Colors.light.textTertiary,
    marginTop: 2,
  },
  courseFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
    gap: Spacing.md,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    color: Colors.light.textTertiary,
    marginLeft: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    borderRadius: 4,
    backgroundColor: '#F0FDF4',
  },
  badgeText: {
    fontSize: FontSizes.xs,
    color: Colors.light.success,
    fontWeight: '500',
  },
  emptyState: {
    minHeight: 400,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.text,
    marginTop: Spacing.md,
  },
  emptyStateText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textTertiary,
    marginTop: Spacing.xs,
    textAlign: 'center',
  },
});
