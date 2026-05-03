/**
 * CourseCard Component
 * Reusable course card for listings using NativeWind
 * Optimized with React.memo for performance in large lists
 */

import React, { useCallback } from 'react';
import { View, Pressable, Text, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Course } from '@/src/types/course';
import { Colors } from '@/src/constants/theme';

interface CourseCardProps {
  course: Course;
  onPress: (courseId: string) => void;
  onBookmark?: (courseId: string) => void;
  isBookmarked?: boolean;
  variant?: 'grid' | 'list';
}

export const CourseCard = React.memo(
  ({
    course,
    onPress,
    onBookmark,
    isBookmarked = false,
    variant = 'grid',
  }: CourseCardProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

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

    const primaryColor = isDark ? Colors.dark.primary : Colors.light.primary;
    const bgColor = isDark ? 'bg-gray-800' : 'bg-white';
    const textColor = isDark ? 'text-white' : 'text-black';
    const borderColor = isDark ? 'border-gray-700' : 'border-gray-200';

    if (variant === 'list') {
      return (
        <Pressable
          className={`flex flex-row items-center rounded-lg ${bgColor} border ${borderColor} p-3 mb-3 gap-3`}
          onPress={handlePress}
        >
          <View className={`w-12 h-12 rounded-lg ${isDark ? 'bg-blue-900' : 'bg-blue-100'} justify-center items-center`}>
            <MaterialIcons name="school" size={32} color={primaryColor} />
          </View>

          <View className="flex-1">
            <Text className={`text-sm font-semibold ${textColor}`} numberOfLines={1}>
              {course.title}
            </Text>
            <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`} numberOfLines={1}>
              {course.instructor?.fullName || 'Unknown Instructor'}
            </Text>
            <View className="flex flex-row items-center gap-2 mt-2">
              <View className={`flex flex-row items-center gap-1 px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <MaterialIcons name="star" size={12} color="#FBBF24" />
                <Text className={`text-xs font-semibold ${textColor}`}>
                  {(course.rating || 4.5).toFixed(1)}
                </Text>
              </View>
              <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {(course.enrolledCount || 0).toLocaleString()}
              </Text>
            </View>
          </View>

          <Pressable onPress={handleBookmark} hitSlop={12}>
            <MaterialIcons
              name={isBookmarked ? 'bookmark' : 'bookmark-border'}
              size={24}
              color={isBookmarked ? primaryColor : (isDark ? Colors.dark.textTertiary : Colors.light.textTertiary)}
            />
          </Pressable>
        </Pressable>
      );
    }

    // Grid variant
    return (
      <Pressable
        className={`rounded-lg overflow-hidden border ${borderColor} ${bgColor} mb-3`}
        onPress={handlePress}
      >
        <View className={`w-full h-32 ${isDark ? 'bg-blue-900' : 'bg-blue-500'} justify-center items-center`}>
          <MaterialIcons name="school" size={48} color="#fff" />
        </View>

        <View className="p-2">
          <Text className={`text-sm font-semibold ${textColor} mb-1`} numberOfLines={2}>
            {course.title}
          </Text>
          <Text className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'} mb-2`} numberOfLines={1}>
            {course.instructor?.fullName || 'Unknown'}
          </Text>

          <View className="flex flex-row items-center">
            <View className={`flex flex-row items-center gap-1 px-2 py-1 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <MaterialIcons name="star" size={12} color="#FBBF24" />
              <Text className={`text-xs font-semibold ${textColor}`}>
                {(course.rating || 4.5).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        <Pressable
          className={`absolute top-2 right-2 w-9 h-9 rounded-full ${isDark ? 'bg-gray-900' : 'bg-white'} justify-center items-center shadow`}
          onPress={handleBookmark}
          hitSlop={12}
        >
          <MaterialIcons
            name={isBookmarked ? 'bookmark' : 'bookmark-border'}
            size={20}
            color={isBookmarked ? primaryColor : (isDark ? Colors.dark.textTertiary : Colors.light.textTertiary)}
          />
        </Pressable>
      </Pressable>
    );
  }
);

CourseCard.displayName = 'CourseCard';

export default CourseCard;
