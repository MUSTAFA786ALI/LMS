/**
 * Home Screen
 * Main feed showing courses and recommendations
 */

import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCourses } from '@/src/hooks/useCourses';
import { useAuth } from '@/src/hooks/useAuth';
import { useOfflineFirst } from '@/src/hooks/useOfflineFirst';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { CourseCard } from '@/src/components/CourseCard';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    courses,
    enrolledCourseIds,
    bookmarkedCourseIds,
    isLoading,
    error,
    fetchCourses,
    toggleBookmark,
    clearError,
    isBookmarked,
  } = useCourses();

  const offlineFirst = useOfflineFirst();
  const [refreshing, setRefreshing] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCoursePress = (courseId: string) => {
    router.push(`/(tabs)/courses/${courseId}`);
  };

  const handleLogout = () => {
    router.replace('/(auth)/login');
  };

  const handleRefresh = async () => {
    if (!offlineFirst.isOnline) {
      setSyncMessage('Cannot refresh while offline');
      setTimeout(() => setSyncMessage(null), 3000);
      return;
    }

    setRefreshing(true);
    try {
      const result = await offlineFirst.refresh();
      if (result.success) {
        setSyncMessage('Refreshed! Using latest data');
      } else {
        setSyncMessage(`Refresh failed: ${result.error}`);
      }
    } catch (error: any) {
      setSyncMessage(error.message || 'Refresh failed');
    } finally {
      setRefreshing(false);
      setTimeout(() => setSyncMessage(null), 3000);
    }
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

        {/* Cache Status Banner */}
        {!offlineFirst.isOnline || !offlineFirst.isCacheValid ? (
          <View style={styles.cacheBanner}>
            <View style={styles.bannerContent}>
              <View style={styles.bannerLeft}>
                {offlineFirst.isOnline && !offlineFirst.isCacheValid ? (
                  <>
                    <MaterialIcons name="update" size={18} color={Colors.light.primary} />
                    <Text style={styles.bannerText}>Data may be outdated (cached {offlineFirst.getCacheAge()})</Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons name="wifi-off" size={18} color={Colors.light.error} />
                    <Text style={styles.bannerText}>Offline - showing cached data</Text>
                  </>
                )}
              </View>
              {offlineFirst.isOnline && (
                <Pressable
                  onPress={handleRefresh}
                  disabled={refreshing}
                  hitSlop={8}
                  style={styles.refreshButton}
                >
                  {refreshing ? (
                    <LoadingSpinner size="small" color={Colors.light.primary} />
                  ) : (
                    <MaterialIcons name="refresh" size={18} color={Colors.light.primary} />
                  )}
                </Pressable>
              )}
            </View>
            {syncMessage && (
              <Text style={styles.syncMessage}>{syncMessage}</Text>
            )}
          </View>
        ) : null}

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
                    <View style={styles.featuredCardWrapper}>
                      <CourseCard
                        course={item}
                        variant="grid"
                        onPress={handleCoursePress}
                        onBookmark={toggleBookmark}
                        isBookmarked={isBookmarked(item.id)}
                      />
                    </View>
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
                    <CourseCard
                      course={item}
                      variant="list"
                      onPress={handleCoursePress}
                      onBookmark={toggleBookmark}
                      isBookmarked={isBookmarked(item.id)}
                    />
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
  featuredCardWrapper: {
    width: 160,
    marginRight: Spacing.md,
  },
  allCoursesList: {
    paddingBottom: Spacing.xl,
  },
  enrollCount: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginTop: Spacing.xs,
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
  cacheBanner: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.light.primary,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  bannerText: {
    fontSize: FontSizes.sm,
    color: '#92400E',
    fontWeight: '500',
    flex: 1,
  },
  refreshButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.sm,
  },
  syncMessage: {
    fontSize: FontSizes.xs,
    color: '#92400E',
    marginTop: Spacing.xs,
    fontStyle: 'italic',
  },
});
