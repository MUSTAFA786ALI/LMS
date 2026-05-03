/**
 * Search Screen
 * Browse and search for courses
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useCourses } from '@/src/hooks/useCourses';
import { SearchBar } from '@/src/components/SearchBar';
import { CourseCard } from '@/src/components/CourseCard';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';

export default function SearchScreen() {
  const router = useRouter();
  const {
    courses,
    filteredCourses,
    bookmarkedCourseIds,
    searchQuery,
    isLoading,
    error,
    fetchCourses,
    searchCourses,
    toggleBookmark,
    clearError,
    isBookmarked,
  } = useCourses();

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleCoursePress = (courseId: string) => {
    router.push(`/(tabs)/courses/${courseId}`);
  };

  const displayCourses = searchQuery.length > 0 ? filteredCourses : courses;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Explore Courses</Text>
          <Text style={styles.subtitle}>Find your next learning path</Text>
        </View>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChangeText={searchCourses}
          placeholder="Search by course name..."
        />

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
        ) : displayCourses.length > 0 ? (
          <>
            {/* Results Count */}
            {searchQuery.length > 0 && (
              <Text style={styles.resultsCount}>
                Found {displayCourses.length} course{displayCourses.length !== 1 ? 's' : ''}
              </Text>
            )}

            {/* Course List */}
            <FlatList
              data={displayCourses}
              contentContainerStyle={styles.listContent}
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
              scrollEventThrottle={16}
              showsVerticalScrollIndicator={false}
            />
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateTitle}>
              {searchQuery.length > 0 ? 'No courses found' : 'No courses available'}
            </Text>
            <Text style={styles.emptyStateText}>
              {searchQuery.length > 0
                ? `Try a different search term`
                : 'Check back later for new courses'}
            </Text>
          </View>
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
  header: {
    paddingVertical: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  searchBar: {
    marginBottom: Spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.md,
    fontWeight: '500',
  },
  listContent: {
    paddingBottom: Spacing.lg,
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
    marginBottom: Spacing.sm,
  },
  emptyStateText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },
});
