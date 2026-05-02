/**
 * Notifications Service
 * Handles local notification permissions and scheduling
 */

import * as Notifications from 'expo-notifications';
import { AppState, AppStateStatus } from 'react-native';

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    return newStatus === 'granted';
  } catch (error) {
    console.error('[Notifications] Error requesting permissions:', error);
    return false;
  }
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    return status === 'granted';
  } catch {
    return false;
  }
}

/**
 * Send a local notification immediately
 */
export async function sendLocalNotification(data: {
  title: string;
  body: string;
  data?: Record<string, any>;
  delayMs?: number;
}): Promise<string | null> {
  try {
    const hasPermission = await areNotificationsEnabled();

    if (!hasPermission) {
      console.warn('[Notifications] Permissions not granted');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: 'default',
      },
      trigger: data.delayMs ? {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.ceil(data.delayMs / 1000),
      } : null,
    });

    return notificationId;
  } catch (error) {
    console.error('[Notifications] Error sending notification:', error);
    return null;
  }
}

/**
 * Schedule a notification for a specific time
 */
export async function scheduleNotificationAt(data: {
  title: string;
  body: string;
  fireDate: Date;
  data?: Record<string, any>;
}): Promise<string | null> {
  try {
    const hasPermission = await areNotificationsEnabled();

    if (!hasPermission) {
      console.warn('[Notifications] Permissions not granted');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: data.fireDate,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('[Notifications] Error scheduling notification:', error);
    return null;
  }
}

/**
 * Schedule a recurring notification
 */
export async function scheduleRecurringNotification(data: {
  title: string;
  body: string;
  seconds: number; // interval in seconds
  data?: Record<string, any>;
}): Promise<string | null> {
  try {
    const hasPermission = await areNotificationsEnabled();

    if (!hasPermission) {
      console.warn('[Notifications] Permissions not granted');
      return null;
    }

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: data.seconds,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    console.error('[Notifications] Error scheduling recurring notification:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('[Notifications] Error canceling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('[Notifications] Error canceling all notifications:', error);
  }
}

/**
 * Set up notification handler
 */
export function setNotificationHandler(
  onReceived?: (notification: Notifications.Notification) => void,
  onTapped?: (response: Notifications.NotificationResponse) => void
): void {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      onReceived?.(notification);
      return {
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      };
    },
  });

  if (onTapped) {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      onTapped(response);
    });

    if (typeof subscription !== 'undefined') {
      // Return cleanup function through a separate mechanism
      subscription.remove();
    }
  }
}
