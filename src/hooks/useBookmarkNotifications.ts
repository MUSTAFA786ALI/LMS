/**
 * Custom Hook: useBookmarkNotifications
 * Triggers notification when user bookmarks 5+ courses
 */

import { useEffect, useRef } from 'react';
import { useCourseStore } from '../store/courseStore';
import { useNotifications } from './useNotifications';
import { usePreferencesStore } from '../store/prefsStore';

export function useBookmarkNotifications() {
  const bookmarkedCourseIds = useCourseStore((state) => state.bookmarkedCourseIds);
  const notificationsEnabled = usePreferencesStore((state) => state.notificationsEnabled);
  const { sendNotification } = useNotifications();
  const prevCountRef = useRef<number>(0);

  useEffect(() => {
    const checkBookmarkCount = async () => {
      const count = bookmarkedCourseIds.size;
      const prevCount = prevCountRef.current;
      
      // If bookmark count increased, send notification
      if (count > prevCount && notificationsEnabled) {
        // Milestone notifications
        if (count === 5) {
          await sendNotification({
            title: '🎉 Milestone Reached!',
            body: `You've bookmarked 5 courses! You're building your learning library.`,
            data: { type: 'bookmark_milestone', count: 5 },
            delayMs: 300,
          });
        } else if (count === 10) {
          await sendNotification({
            title: '🏆 Great Progress!',
            body: `You've bookmarked 10 courses! Keep building your learning path.`,
            data: { type: 'bookmark_milestone', count: 10 },
            delayMs: 300,
          });
        } else {
          // Regular bookmark notification
          await sendNotification({
            title: '📌 Bookmarked!',
            body: `Course saved to your bookmarks.`,
            data: { type: 'bookmark_added', count },
            delayMs: 300,
          });
        }
      }
      
      prevCountRef.current = count;
    };

    checkBookmarkCount();
  }, [bookmarkedCourseIds.size, notificationsEnabled]);

  return {
    bookmarkCount: bookmarkedCourseIds.size,
  };
}

export default useBookmarkNotifications;
