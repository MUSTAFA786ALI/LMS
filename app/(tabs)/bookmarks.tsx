/**
 * Bookmarks Screen
 * Saved courses and bookmarks
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
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
    getBookmarkedCourses,
    getEnrolledCourses,
    toggleBookmark,
  } = useCourses();

  useEffect(() => {
    // Hook will hydrate on mount
  }, []);

  const bookmarkedCourses = getBookmarkedCourses();
  const enrolledCourses = getEnrolledCourses();

  const handleCoursePress = (courseId: string) => {
    router.push(`/(tabs)/courses/${courseId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>My Learning</Text>

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
                <FlatList
                  data={enrolledCourses}
                  contentContainerStyle={styles.listContent}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <Pressable
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
                  )}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
              </>
            )}

            {/* Bookmarked Courses Section */}
            {bookmarkedCourses.length > 0 && (
              <>
                <Text style={[styles.sectionTitle, { marginTop: Spacing.xl }]}>
                  Saved for Later
                </Text>
                <FlatList
                  data={bookmarkedCourses}
                  contentContainerStyle={styles.listContent}
                  scrollEnabled={false}
                  renderItem={({ item }) => (
                    <Pressable
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
                  )}
                  keyExtractor={(item) => item.id}
                  showsVerticalScrollIndicator={false}
                />
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
      </View>
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
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.text,
    marginVertical: Spacing.lg,
  },
  sectionTitle: {
    fontSize: FontSizes.base,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: Spacing.lg,
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
    flex: 1,
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
