/**
 * Notifications Service
 * Handles local notification permissions and scheduling
 * Gracefully handles Expo Go limitations where notifications may not be fully available
 */

// Snooze duration constants (in seconds) - optimized for testing
export const SNOOZE_DURATIONS = {
  SHORT: 30,      // 30 seconds
  MEDIUM: 60,     // 1 minute
  LONG: 120,      // 2 minutes
} as const;

export type SnoozeDuration = typeof SNOOZE_DURATIONS[keyof typeof SNOOZE_DURATIONS];

// Map for readable labels
export const SNOOZE_LABELS: Record<SnoozeDuration, string> = {
  [SNOOZE_DURATIONS.SHORT]: '30 seconds',
  [SNOOZE_DURATIONS.MEDIUM]: '1 minute',
  [SNOOZE_DURATIONS.LONG]: '2 minutes',
};

// Flag to track if notifications are available
let notificationsAvailable = true;
let Notifications: any = null;

/**
 * Safely load the notifications module
 */
function getNotifications() {
  if (Notifications !== null) {
    return Notifications;
  }

  try {
    Notifications = require('expo-notifications');
    
    // Try to initialize handler
    try {
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          shouldShowBanner: true,
          shouldShowList: true,
        }),
      });
    } catch (error) {
      notificationsAvailable = false;
      console.warn('[Notifications] Handler initialization failed:', error);
    }

    return Notifications;
  } catch (error) {
    notificationsAvailable = false;
    console.warn('[Notifications] Failed to load expo-notifications:', error);
    return null;
  }
}

/**
 * Request notification permissions
 * Safely handles cases where notifications aren't fully supported
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      console.warn('[Notifications] Notifications not available in this environment');
      return false;
    }

    const { status } = await Notif.getPermissionsAsync();

    if (status === 'granted') {
      return true;
    }

    const { status: newStatus } = await Notif.requestPermissionsAsync();
    return newStatus === 'granted';
  } catch (error) {
    notificationsAvailable = false;
    console.warn('[Notifications] Error requesting permissions:', error);
    return false;
  }
}

/**
 * Check if notifications are enabled
 */
export async function areNotificationsEnabled(): Promise<boolean> {
  try {
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      return false;
    }
    const { status } = await Notif.getPermissionsAsync();
    return status === 'granted';
  } catch {
    notificationsAvailable = false;
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
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      console.warn('[Notifications] Notifications not available');
      return null;
    }

    const hasPermission = await areNotificationsEnabled();

    if (!hasPermission) {
      console.warn('[Notifications] Permissions not granted');
      return null;
    }

    const notificationId = await Notif.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: 'default',
      },
      trigger: data.delayMs ? {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: Math.ceil(data.delayMs / 1000),
      } : null,
    });

    return notificationId;
  } catch (error) {
    notificationsAvailable = false;
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
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      console.warn('[Notifications] Notifications not available');
      return null;
    }

    const hasPermission = await areNotificationsEnabled();

    if (!hasPermission) {
      console.warn('[Notifications] Permissions not granted');
      return null;
    }

    const notificationId = await Notif.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: 'default',
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.DATE,
        date: data.fireDate,
      },
    });

    return notificationId;
  } catch (error) {
    notificationsAvailable = false;
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
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      console.warn('[Notifications] Notifications not available');
      return null;
    }

    const hasPermission = await areNotificationsEnabled();

    if (!hasPermission) {
      console.warn('[Notifications] Permissions not granted');
      return null;
    }

    const notificationId = await Notif.scheduleNotificationAsync({
      content: {
        title: data.title,
        body: data.body,
        data: data.data || {},
        sound: 'default',
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: data.seconds,
        repeats: true,
      },
    });

    return notificationId;
  } catch (error) {
    notificationsAvailable = false;
    console.error('[Notifications] Error scheduling recurring notification:', error);
    return null;
  }
}

/**
 * Cancel a scheduled notification
 */
export async function cancelNotification(notificationId: string): Promise<void> {
  try {
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      return;
    }
    await Notif.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('[Notifications] Error canceling notification:', error);
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      return;
    }
    await Notif.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('[Notifications] Error canceling all notifications:', error);
  }
}

/**
 * Snooze a notification by canceling it and rescheduling after specified duration
 * @param notificationId - ID of notification to snooze
 * @param originalNotification - Original notification data to reschedule
 * @param duration - Snooze duration in seconds
 * @returns New notification ID or null
 */
export async function snoozeNotification(
  notificationId: string,
  originalNotification: {
    title: string;
    body: string;
    data?: Record<string, any>;
  },
  duration: SnoozeDuration = SNOOZE_DURATIONS.MEDIUM
): Promise<string | null> {
  try {
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      console.warn('[Notifications] Notifications not available for snooze');
      return null;
    }

    // Cancel the original notification
    await cancelNotification(notificationId);

    // Reschedule after snooze duration
    const newNotificationId = await Notif.scheduleNotificationAsync({
      content: {
        title: originalNotification.title,
        body: originalNotification.body,
        data: {
          ...originalNotification.data,
          snoozed: true,
          snoozeDuration: duration,
        },
        sound: 'default',
      },
      trigger: {
        type: Notif.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: duration,
      },
    });

    console.log(
      `[Notifications] Notification snoozed for ${SNOOZE_LABELS[duration]} (new ID: ${newNotificationId})`
    );

    return newNotificationId;
  } catch (error) {
    notificationsAvailable = false;
    console.error('[Notifications] Error snoozing notification:', error);
    return null;
  }
}

/**
 * Set up notification handler
 */
export function setNotificationHandler(
  onReceived?: (notification: any) => void,
  onTapped?: (response: any) => void
): void {
  try {
    const Notif = getNotifications();
    if (!Notif || !notificationsAvailable) {
      console.warn('[Notifications] Notifications not available, handler not set');
      return;
    }

    Notif.setNotificationHandler({
      handleNotification: async (notification: any) => {
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
      const subscription = Notif.addNotificationResponseReceivedListener((response: any) => {
        onTapped(response);
      });

      if (typeof subscription !== 'undefined') {
        // Return cleanup function through a separate mechanism
        subscription.remove();
      }
    }
  } catch (error) {
    notificationsAvailable = false;
    console.error('[Notifications] Error setting up notification handler:', error);
  }
}
