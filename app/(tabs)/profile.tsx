/**
 * Profile Screen
 * User profile and preferences
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { usePreferencesStore } from '@/src/store/prefsStore';
import { useNotifications } from '@/src/hooks/useNotifications';
import { LoadingSpinner } from '@/src/components/ui/LoadingSpinner';
import { Button } from '@/src/components/ui/Button';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const theme = usePreferencesStore((state) => state.theme);
  const setTheme = usePreferencesStore((state) => state.setTheme);
  const notificationsEnabled = usePreferencesStore((state) => state.notificationsEnabled);
  const setNotificationsEnabled = usePreferencesStore((state) => state.setNotificationsEnabled);
  const inactivityReminderEnabled = usePreferencesStore((state) => state.inactivityReminderEnabled);
  const setInactivityReminderEnabled = usePreferencesStore((state) => state.setInactivityReminderEnabled);

  const { sendNotification } = useNotifications();
  const [testNotificationLoading, setTestNotificationLoading] = useState(false);

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleThemeToggle = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  const handleNotificationsToggle = async () => {
    await setNotificationsEnabled(!notificationsEnabled);
  };

  const handleInactivityReminderToggle = async () => {
    await setInactivityReminderEnabled(!inactivityReminderEnabled);
  };

  const handleTestNotification = async () => {
    setTestNotificationLoading(true);
    try {
      const success = await sendNotification({
        title: 'Course Reminder',
        body: 'You have a course waiting! Check out your learning progress.',
        delayMs: 2000,
      });
      if (!success) {
        alert('Notifications disabled. Please enable notifications in settings.');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setTestNotificationLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={48} color={Colors.light.primary} />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          {/* Theme Toggle */}
          <Pressable
            style={styles.settingItem}
            onPress={handleThemeToggle}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="dark-mode" size={24} color={Colors.light.primary} />
              <Text style={styles.settingLabel}>Dark Mode</Text>
            </View>
            <View style={[
              styles.toggle,
              theme === 'dark' && styles.toggleActive,
            ]}>
              <View style={[
                styles.toggleDot,
                theme === 'dark' && styles.toggleDotActive,
              ]} />
            </View>
          </Pressable>

          {/* Language Setting */}
          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MaterialIcons name="language" size={24} color={Colors.light.primary} />
              <Text style={styles.settingLabel}>Language</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.light.textTertiary} />
          </Pressable>

          {/* Notifications Setting */}
          <Pressable
            style={styles.settingItem}
            onPress={handleNotificationsToggle}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="notifications" size={24} color={Colors.light.primary} />
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <View style={[
              styles.toggle,
              notificationsEnabled && styles.toggleActive,
            ]}>
              <View style={[
                styles.toggleDot,
                notificationsEnabled && styles.toggleDotActive,
              ]} />
            </View>
          </Pressable>

          {/* Inactivity Reminder */}
          {notificationsEnabled && (
            <Pressable
              style={styles.settingItem}
              onPress={handleInactivityReminderToggle}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons name="schedule" size={24} color={Colors.light.primary} />
                <Text style={styles.settingLabel}>Remind me to learn</Text>
              </View>
              <View style={[
                styles.toggle,
                inactivityReminderEnabled && styles.toggleActive,
              ]}>
                <View style={[
                  styles.toggleDot,
                  inactivityReminderEnabled && styles.toggleDotActive,
                ]} />
              </View>
            </Pressable>
          )}

          {/* Test Notification Button */}
          {notificationsEnabled && (
            <Pressable
              style={styles.settingItem}
              onPress={handleTestNotification}
            >
              <View style={styles.settingLeft}>
                <MaterialIcons name="mail" size={24} color={Colors.light.primary} />
                <Text style={styles.settingLabel}>Test Notification</Text>
              </View>
              {testNotificationLoading ? (
                <LoadingSpinner size="small" color={Colors.light.primary} />
              ) : (
                <MaterialIcons name="chevron-right" size={24} color={Colors.light.textTertiary} />
              )}
            </Pressable>
          )}
        </View>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Version</Text>
            <Text style={styles.settingValue}>1.0.0</Text>
          </Pressable>

          <Pressable style={styles.settingItem}>
            <Text style={styles.settingLabel}>Help & Support</Text>
            <MaterialIcons name="chevron-right" size={24} color={Colors.light.textTertiary} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            label="Logout"
            onPress={handleLogout}
            variant="danger"
            size="lg"
            isFullWidth
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: 2,
  },
  userEmail: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.textSecondary,
    textTransform: 'uppercase',
    marginBottom: Spacing.md,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  settingLabel: {
    fontSize: FontSizes.base,
    color: Colors.light.text,
    fontWeight: '500',
  },
  settingValue: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.light.border,
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  toggleActive: {
    backgroundColor: Colors.light.primary,
  },
  toggleDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.light.background,
    alignSelf: 'flex-start',
  },
  toggleDotActive: {
    alignSelf: 'flex-end',
  },
  logoutSection: {
    marginTop: Spacing.xl,
    marginBottom: Spacing.lg,
  },
});
