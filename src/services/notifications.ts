/**
 * Notifications Service
 * Handles local notification permissions and scheduling
 * Gracefully handles Expo Go limitations where notifications may not be fully available
 */

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
