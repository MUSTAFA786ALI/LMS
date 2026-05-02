/**
 * CourseCard Component
 * Reusable course card for listings
 * Optimized with React.memo for performance in large lists
 */

import React, { useCallback } from 'react';
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  ViewStyle,
  ImageStyle,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Course } from '@/src/types/course';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';

interface CourseCardProps {
  course: Course;
  onPress: (courseId: string) => void;
  onBookmark?: (courseId: string) => void;
  isBookmarked?: boolean;
  variant?: 'grid' | 'list';
  style?: ViewStyle;
}

export const CourseCard = React.memo(
  ({
    course,
    onPress,
    onBookmark,
    isBookmarked = false,
    variant = 'grid',
    style,
  }: CourseCardProps) => {
    const handlePress = useCallback(() => {
      onPress(course.id);
    }, [course.id, onPress]);

    const handleBookmark = useCallback(
      (e: any) => {
        e.stopPropagation?.();
        onBookmark?.(course.id);
      },
      [course.id, onBookmark]
    );

    if (variant === 'list') {
      return (
        <Pressable style={[styles.listCard, style]} onPress={handlePress}>
          <View style={styles.listImageContainer}>
            <MaterialIcons name="school" size={32} color={Colors.light.primary} />
          </View>

          <View style={styles.listContent}>
            <Text style={styles.title} numberOfLines={1}>
              {course.title}
            </Text>
            <Text style={styles.instructor} numberOfLines={1}>
              {course.instructor?.fullName || 'Unknown Instructor'}
            </Text>
            <View style={styles.listFooter}>
              <View style={styles.ratingBadge}>
                <MaterialIcons name="star" size={12} color="#FBBF24" />
                <Text style={styles.ratingText}>
                  {(course.rating || 4.5).toFixed(1)}
                </Text>
              </View>
              <Text style={styles.enrollCount}>
                {(course.enrolledCount || 0).toLocaleString()}
              </Text>
            </View>
          </View>

          <Pressable onPress={handleBookmark} hitSlop={12}>
            <MaterialIcons
              name={isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={isBookmarked ? Colors.light.primary : Colors.light.textTertiary}
            />
          </Pressable>
        </Pressable>
      );
    }

    // Grid variant
    return (
      <Pressable style={[styles.gridCard, style]} onPress={handlePress}>
        <View style={styles.imageContainer}>
          <MaterialIcons
            name="school"
            size={48}
            color={Colors.light.primary}
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          <Text style={styles.instructor} numberOfLines={1}>
            {course.instructor?.fullName || 'Unknown'}
          </Text>

          <View style={styles.footer}>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={12} color="#FBBF24" />
              <Text style={styles.ratingText}>
                {(course.rating || 4.5).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          style={styles.bookmarkButton}
          onPress={handleBookmark}
          hitSlop={12}
        >
          <MaterialIcons
            name={isBookmarked ? 'bookmark' : 'bookmark-border'}
            size={20}
            color={isBookmarked ? Colors.light.primary : Colors.light.textTertiary}
          />
        </Pressable>
      </Pressable>
    );
  }
);

CourseCard.displayName = 'CourseCard';

const styles = StyleSheet.create({
  // Grid Card Styles
  gridCard: {
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.md,
  },
  imageContainer: {
    width: '100%',
    height: 120,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: Spacing.sm,
  },
  title: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  instructor: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ratingText: {
    fontSize: FontSizes.xs,
    color: Colors.light.text,
    fontWeight: '600',
  },
  bookmarkButton: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.light.background,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: Colors.light.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // List Card Styles
  listCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  listImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    backgroundColor: Colors.light.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  listContent: {
    flex: 1,
  },
  listFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
  enrollCount: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
  },
});
