/**
 * Custom Hook: useNotifications
 * Manages local notifications with permission handling and snooze functionality
 */

import { useEffect, useRef, useState } from 'react';
import {
  requestNotificationPermissions,
  sendLocalNotification,
  cancelNotification,
  cancelAllNotifications,
  setNotificationHandler as setupNotificationHandler,
  snoozeNotification,
  SNOOZE_DURATIONS,
  SNOOZE_LABELS,
  type SnoozeDuration,
} from '../services/notifications';

interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  delayMs?: number;
}

export function useNotifications() {
  const notificationIdRef = useRef<string | null>(null);
  const [lastNotification, setLastNotification] = useState<NotificationData | null>(null);

  useEffect(() => {
    // Request permissions on mount
    (async () => {
      await requestNotificationPermissions();
    })();
  }, []);

  const sendNotification = async (notification: NotificationData): Promise<boolean> => {
    try {
      const id = await sendLocalNotification(notification);
      if (id) {
        notificationIdRef.current = id;
        // Store notification data for snoozing later
        setLastNotification(notification);
        return true;
      }
      return false;
    } catch (error) {
      console.error('[useNotifications] Error sending notification:', error);
      return false;
    }
  };

  const snooze = async (duration: SnoozeDuration = SNOOZE_DURATIONS.MEDIUM): Promise<boolean> => {
    if (!notificationIdRef.current || !lastNotification) {
      console.warn('[useNotifications] No active notification to snooze');
      return false;
    }

    try {
      const newId = await snoozeNotification(
        notificationIdRef.current,
        {
          title: lastNotification.title,
          body: lastNotification.body,
          data: lastNotification.data,
        },
        duration
      );

      if (newId) {
        notificationIdRef.current = newId;
        return true;
      }
      return false;
    } catch (error) {
      console.error('[useNotifications] Error snoozing notification:', error);
      return false;
    }
  };

  const cancelCurrent = async () => {
    if (notificationIdRef.current) {
      try {
        await cancelNotification(notificationIdRef.current);
        notificationIdRef.current = null;
        return true;
      } catch (error) {
        console.error('[useNotifications] Error canceling notification:', error);
        return false;
      }
    }
    return false;
  };

  const cancelAll = async () => {
    try {
      await cancelAllNotifications();
      notificationIdRef.current = null;
      return true;
    } catch (error) {
      console.error('[useNotifications] Error canceling all notifications:', error);
      return false;
    }
  };

  const setupHandler = (
    onReceived?: (notification: any) => void,
    onTapped?: (response: any) => void
  ) => {
    setupNotificationHandler(onReceived, onTapped);
  };

  return {
    sendNotification,
    cancelCurrent,
    cancelAll,
    setupHandler,
    snooze,
    SNOOZE_DURATIONS,
    SNOOZE_LABELS,
    activeNotificationId: notificationIdRef.current,
    lastNotification,
  };
}

export default useNotifications;
