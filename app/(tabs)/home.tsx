/**
 * Home Screen
 * Main feed showing courses and recommendations
 */

import React, { useEffect } from 'react';
import {
  View,
  ScrollView,
  Text,
  SafeAreaView,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useCourses } from '@/src/hooks/useCourses';
import { useAuth } from '@/src/hooks/useAuth';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    courses,
    enrolledCourseIds,
    isLoading,
    error,
    fetchCourses,
    clearError,
  } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCoursePress = (courseId: string) => {
    router.push(`/(tabs)/courses/${courseId}`);
  };

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  // Featured courses (first 3)
  const featuredCourses = courses.slice(0, 3);

  // All courses
  const allCourses = courses;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greeting}>Welcome back, {user?.fullName || 'Learner'}! 👋</Text>
          </View>
          <Pressable onPress={handleLogout} hitSlop={12}>
            <MaterialIcons name="logout" size={24} color={Colors.light.primary} />
          </Pressable>
        </View>

        {/* Error Message */}
        {error && (
          <ErrorMessage
            message={error}
            onDismiss={clearError}
          />
        )}

        {/* Loading State */}
        {isLoading && !courses.length ? (
          <View style={styles.centerContent}>
            <LoadingSpinner size="large" color={Colors.light.primary} />
          </View>
        ) : (
          <>
            {/* Featured Section */}
            {featuredCourses.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Featured Courses</Text>
                  <Pressable onPress={() => router.push('/(tabs)/search')}>
                    <Text style={styles.seeMore}>See all →</Text>
                  </Pressable>
                </View>

                <FlatList
                  data={featuredCourses}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  scrollEventThrottle={16}
                  contentContainerStyle={styles.courseList}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.featuredCard}
                      onPress={() => handleCoursePress(item.id)}
                    >
                      <View
                        style={[
                          styles.courseImage,
                          { backgroundColor: Colors.light.primary },
                        ]}
                      >
                        <MaterialIcons name="school" size={48} color="white" />
                      </View>
                      <Text style={styles.courseTitle} numberOfLines={2}>
                        {item.title}
                      </Text>
                      <Text style={styles.courseInstructor} numberOfLines={1}>
                        {item.instructor?.fullName || 'Unknown'}
                      </Text>
                      <View style={styles.courseFooter}>
                        <View style={styles.rating}>
                          <MaterialIcons name="star" size={14} color="#FBBF24" />
                          <Text style={styles.ratingText}>
                            {(item.rating || 4.5).toFixed(1)}
                          </Text>
                        </View>
                        <Text style={styles.enrollCount}>
                          {(item.enrolledCount || 0).toLocaleString()} enrolled
                        </Text>
                      </View>
                    </Pressable>
                  )}
                  keyExtractor={(item) => item.id}
                  scrollEnabled
                />
              </View>
            )}

            {/* Continue Learning Section */}
            {enrolledCourseIds.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Continue Learning</Text>
                <Text style={styles.enrollCount}>
                  You have {enrolledCourseIds.length} enrolled courses
                </Text>
              </View>
            )}

            {/* All Courses Section */}
            {allCourses.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>All Courses</Text>
                <FlatList
                  data={allCourses}
                  scrollEnabled={false}
                  contentContainerStyle={styles.allCoursesList}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.courseListItem}
                      onPress={() => handleCoursePress(item.id)}
                    >
                      <View style={styles.courseListItemImage}>
                        <MaterialIcons name="school" size={32} color={Colors.light.primary} />
                      </View>
                      <View style={styles.courseListItemContent}>
                        <Text style={styles.courseListItemTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.courseListItemInstructor} numberOfLines={1}>
                          {item.instructor?.fullName || 'Unknown'}
                        </Text>
                        <View style={styles.courseListItemFooter}>
                          <MaterialIcons name="star" size={12} color="#FBBF24" />
                          <Text style={styles.courseListItemRating}>
                            {(item.rating || 4.5).toFixed(1)}
                          </Text>
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
                />
              </View>
            )}

            {/* Empty State */}
            {!isLoading && allCourses.length === 0 && (
              <View style={styles.emptyState}>
                <MaterialIcons
                  name="school"
                  size={48}
                  color={Colors.light.textTertiary}
                />
                <Text style={styles.emptyStateTitle}>No courses available</Text>
                <Text style={styles.emptyStateText}>
                  Check back later for new courses
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
  scrollContent: {
    paddingHorizontal: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  headerLeft: {
    flex: 1,
  },
  greeting: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.text,
  },
  centerContent: {
    height: 300,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.light.text,
  },
  seeMore: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: '600',
  },
  courseList: {
    paddingRight: Spacing.lg,
  },
  featuredCard: {
    width: 160,
    marginRight: Spacing.md,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  courseImage: {
    width: '100%',
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },
  courseTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    paddingHorizontal: Spacing.sm,
    paddingTop: Spacing.sm,
  },
  courseInstructor: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    paddingHorizontal: Spacing.sm,
  },
  courseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm,
    paddingBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    color: Colors.light.text,
    fontWeight: '600',
  },
  enrollCount: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
  },
  allCoursesList: {
    paddingBottom: Spacing.xl,
  },
  courseListItem: {
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
  courseListItemImage: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  courseListItemContent: {
    flex: 1,
  },
  courseListItemTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: 2,
  },
  courseListItemInstructor: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    marginBottom: 4,
  },
  courseListItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  courseListItemRating: {
    fontSize: FontSizes.xs,
    color: Colors.light.text,
    fontWeight: '600',
  },
  emptyState: {
    height: 300,
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
    color: Colors.light.textSecondary,
    marginTop: Spacing.sm,
  },
});
