/**
 * Custom Hook: useBookmarkNotifications
 * Triggers notification when user bookmarks 5+ courses
 */

import { useEffect } from 'react';
import { useCourseStore } from '../store/courseStore';
import { useNotifications } from './useNotifications';
import { usePreferencesStore } from '../store/prefsStore';

export function useBookmarkNotifications() {
  const bookmarkedCourseIds = useCourseStore((state) => state.bookmarkedCourseIds);
  const notificationsEnabled = usePreferencesStore((state) => state.notificationsEnabled);
  const { sendNotification } = useNotifications();

  useEffect(() => {
    const checkBookmarkCount = async () => {
      const count = bookmarkedCourseIds.size;
      
      // Trigger notification when 5 bookmarks are reached
      if (count === 5 && notificationsEnabled) {
        await sendNotification({
          title: '🎉 Milestone Reached!',
          body: `You've bookmarked 5 courses! You're building your learning library.`,
          data: { type: 'bookmark_milestone', count: 5 },
          delayMs: 500,
        });
      }
      
      // Trigger another notification at 10 bookmarks
      if (count === 10 && notificationsEnabled) {
        await sendNotification({
          title: '🏆 Great Progress!',
          body: `You've bookmarked 10 courses! Keep building your learning path.`,
          data: { type: 'bookmark_milestone', count: 10 },
          delayMs: 500,
        });
      }
    };

    checkBookmarkCount();
  }, [bookmarkedCourseIds.size, notificationsEnabled]);

  return {
    bookmarkCount: bookmarkedCourseIds.size,
  };
}

export default useBookmarkNotifications;
