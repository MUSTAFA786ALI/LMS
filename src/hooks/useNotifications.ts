/**
 * Custom Hook: useNotifications
 * Manages local notifications with permission handling
 */

import { useEffect, useRef } from 'react';
import {
  requestNotificationPermissions,
  sendLocalNotification,
  cancelNotification,
  cancelAllNotifications,
  setNotificationHandler as setupNotificationHandler,
} from '../services/notifications';

interface NotificationData {
  title: string;
  body: string;
  data?: Record<string, any>;
  delayMs?: number;
}

export function useNotifications() {
  const notificationIdRef = useRef<string | null>(null);

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
        return true;
      }
      return false;
    } catch (error) {
      console.error('[useNotifications] Error sending notification:', error);
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
  };
}

export default useNotifications;
