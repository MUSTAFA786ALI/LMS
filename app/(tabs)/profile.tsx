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
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/hooks/useAuth';
import { usePreferencesStore } from '@/src/store/prefsStore';
import { useNotifications } from '@/src/hooks/useNotifications';
import { useCourseStore } from '@/src/store/courseStore';
import { useProfileImage } from '@/src/hooks/useProfileImage';
import { useBookmarkNotifications } from '@/src/hooks/useBookmarkNotifications';
import { useInactivityReminder } from '@/src/hooks/useInactivityReminder';
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

  // Get user statistics
  const enrolledCourseIds = useCourseStore((state) => state.enrolledCourseIds);
  const bookmarkedCourseIds = useCourseStore((state) => state.bookmarkedCourseIds);
  
  // Profile image hook
  const { profileImage, pickImage, deleteImage, isLoading: imageLoading } = useProfileImage();
  
  // Notification hooks
  const { sendNotification, snooze, SNOOZE_DURATIONS, SNOOZE_LABELS, activeNotificationId } = useNotifications();
  const { bookmarkCount } = useBookmarkNotifications();
  useInactivityReminder();

  const [testNotificationLoading, setTestNotificationLoading] = useState(false);
  const [imageActionModal, setImageActionModal] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [snoozeButtonsVisible, setSnoozeButtonsVisible] = useState(false);
  const [snoozingDuration, setSnoozingDuration] = useState<number | null>(null);

  const handleLogout = async () => {
    if (loggingOut) return; // Prevent multiple clicks
    setLoggingOut(true);
    try {
      console.log('[ProfileScreen] Logout starting...');
      const result = await logout();
      console.log('[ProfileScreen] Logout completed:', result);
      
      // Add small delay to ensure state is cleared
      setTimeout(() => {
        console.log('[ProfileScreen] Navigating to login...');
        router.replace('/(auth)/login');
      }, 200);
    } catch (error) {
      console.error('[ProfileScreen] Logout failed:', error);
      setLoggingOut(false);
    }
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

  const handlePickImage = async () => {
    const success = await pickImage();
    if (success) {
      setImageActionModal(false);
    }
  };

  const handleDeleteImage = async () => {
    await deleteImage();
    setImageActionModal(false);
  };

  const handleTestNotification = async () => {
    setTestNotificationLoading(true);
    setSnoozeButtonsVisible(false);
    setSnoozingDuration(null);
    try {
      const success = await sendNotification({
        title: '🧪 Test Notification',
        body: 'Test snooze functionality - click snooze buttons below!',
        delayMs: 500,
      });
      if (success) {
        setSnoozeButtonsVisible(true);
      } else {
        alert('Notifications disabled. Please enable notifications in settings.');
      }
    } catch (error) {
      console.error('Error sending test notification:', error);
    } finally {
      setTestNotificationLoading(false);
    }
  };

  const handleSnooze = async (duration: number) => {
    setSnoozingDuration(duration);
    const success = await snooze(duration);
    if (success) {
      console.log(`[ProfileScreen] Notification snoozed for ${SNOOZE_LABELS[duration as any]}`);
      setSnoozeButtonsVisible(false);
      // Show message to user
      alert(`✅ Snoozed for ${SNOOZE_LABELS[duration as any]}. Notification will reappear soon!`);
    }
    setSnoozingDuration(null);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <View style={styles.profileCard}>
          <Pressable
            style={styles.avatarContainer}
            onPress={() => setImageActionModal(true)}
          >
            {profileImage ? (
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.avatar}>
                <MaterialIcons name="person" size={48} color={Colors.light.primary} />
              </View>
            )}
            <View style={styles.editIconBg}>
              <MaterialIcons name="camera-alt" size={16} color="white" />
            </View>
          </Pressable>
          <View style={styles.profileInfo}>
            <Text style={styles.userName}>{user?.fullName || 'User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'email@example.com'}</Text>
          </View>
        </View>

        {/* User Statistics Section */}
        <View style={styles.statsSection}>
          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <MaterialIcons name="school" size={24} color={Colors.light.primary} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Enrolled</Text>
              <Text style={styles.statValue}>{enrolledCourseIds.size}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <MaterialIcons name="bookmark" size={24} color={Colors.light.warning} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Bookmarks</Text>
              <Text style={styles.statValue}>{bookmarkCount}</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={styles.statIconBg}>
              <MaterialIcons name="trending-up" size={24} color={Colors.light.success} />
            </View>
            <View style={styles.statContent}>
              <Text style={styles.statLabel}>Progress</Text>
              <Text style={styles.statValue}>{Math.round((enrolledCourseIds.size / Math.max(enrolledCourseIds.size + 1, 1)) * 100)}%</Text>
            </View>
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

          {/* App Icon Setting */}
          <Pressable
            style={styles.settingItem}
            onPress={() => router.push('/icon-settings')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="apps" size={24} color={Colors.light.primary} />
              <Text style={styles.settingLabel}>App Icon</Text>
            </View>
            <MaterialIcons
              name="chevron-right"
              size={24}
              color={Colors.light.textTertiary}
            />
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
            <>
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

              {/* Snooze Buttons - Shown after test notification is sent */}
              {snoozeButtonsVisible && activeNotificationId && (
                <View style={styles.snoozeContainer}>
                  <Text style={styles.snoozeTitle}>Test Snooze Durations:</Text>
                  
                  <Pressable
                    style={[
                      styles.snoozeButton,
                      snoozingDuration === SNOOZE_DURATIONS.SHORT && styles.snoozeButtonLoading,
                    ]}
                    onPress={() => handleSnooze(SNOOZE_DURATIONS.SHORT)}
                    disabled={snoozingDuration !== null}
                  >
                    {snoozingDuration === SNOOZE_DURATIONS.SHORT ? (
                      <LoadingSpinner size="small" color={Colors.light.primary} />
                    ) : (
                      <>
                        <MaterialIcons name="schedule" size={18} color={Colors.light.primary} />
                        <Text style={styles.snoozeButtonText}>
                          Snooze {SNOOZE_LABELS[SNOOZE_DURATIONS.SHORT]}
                        </Text>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    style={[
                      styles.snoozeButton,
                      snoozingDuration === SNOOZE_DURATIONS.MEDIUM && styles.snoozeButtonLoading,
                    ]}
                    onPress={() => handleSnooze(SNOOZE_DURATIONS.MEDIUM)}
                    disabled={snoozingDuration !== null}
                  >
                    {snoozingDuration === SNOOZE_DURATIONS.MEDIUM ? (
                      <LoadingSpinner size="small" color={Colors.light.primary} />
                    ) : (
                      <>
                        <MaterialIcons name="schedule" size={18} color={Colors.light.primary} />
                        <Text style={styles.snoozeButtonText}>
                          Snooze {SNOOZE_LABELS[SNOOZE_DURATIONS.MEDIUM]}
                        </Text>
                      </>
                    )}
                  </Pressable>

                  <Pressable
                    style={[
                      styles.snoozeButton,
                      snoozingDuration === SNOOZE_DURATIONS.LONG && styles.snoozeButtonLoading,
                    ]}
                    onPress={() => handleSnooze(SNOOZE_DURATIONS.LONG)}
                    disabled={snoozingDuration !== null}
                  >
                    {snoozingDuration === SNOOZE_DURATIONS.LONG ? (
                      <LoadingSpinner size="small" color={Colors.light.primary} />
                    ) : (
                      <>
                        <MaterialIcons name="schedule" size={18} color={Colors.light.primary} />
                        <Text style={styles.snoozeButtonText}>
                          Snooze {SNOOZE_LABELS[SNOOZE_DURATIONS.LONG]}
                        </Text>
                      </>
                    )}
                  </Pressable>
                </View>
              )}
            </>
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

        {/* Debug / Sentry Test Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Developer Testing</Text>

          <Pressable
            style={styles.settingItem}
            onPress={() => {
              throw new Error('Test Sentry JS Crash');
            }}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="bug-report" size={24} color={Colors.light.danger} />
              <Text style={styles.settingLabel}>Trigger JS Crash</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.light.textTertiary} />
          </Pressable>

          <Pressable
            style={styles.settingItem}
            onPress={() => router.push('/crash-test')}
          >
            <View style={styles.settingLeft}>
              <MaterialIcons name="warning" size={24} color={Colors.light.warning} />
              <Text style={styles.settingLabel}>Trigger Infinite Loop</Text>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={Colors.light.textTertiary} />
          </Pressable>
        </View>

        {/* Logout Button */}
        <View style={styles.logoutSection}>
          <Button
            label={loggingOut ? "Logging out..." : "Logout"}
            onPress={handleLogout}
            disabled={loggingOut}
            variant="danger"
            size="lg"
            isFullWidth
          />
        </View>
      </ScrollView>

      {/* Image Action Modal */}
      <Modal
        visible={imageActionModal}
        transparent
        animationType="slide"
        onRequestClose={() => setImageActionModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Profile Picture</Text>
              <Pressable onPress={() => setImageActionModal(false)}>
                <MaterialIcons name="close" size={24} color={Colors.light.text} />
              </Pressable>
            </View>

            <Button
              label="Upload Photo"
              onPress={handlePickImage}
              variant="primary"
              size="lg"
              isFullWidth
              leftIcon={<MaterialIcons name="upload" size={20} color="white" />}
              style={styles.modalButton}
            />

            {profileImage && (
              <Button
                label="Delete Photo"
                onPress={handleDeleteImage}
                variant="danger"
                size="lg"
                isFullWidth
                leftIcon={<MaterialIcons name="delete" size={20} color="white" />}
                style={styles.modalButton}
              />
            )}

            <Button
              label="Cancel"
              onPress={() => setImageActionModal(false)}
              variant="secondary"
              size="lg"
              isFullWidth
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    marginBottom: Spacing.xl,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  avatarContainer: {
    position: 'relative',
    marginRight: Spacing.md,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  editIconBg: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.light.cardBg,
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
  statsSection: {
    flexDirection: 'row',
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    marginBottom: Spacing.xl,
    overflow: 'hidden',
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  statIconBg: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  statContent: {
    flex: 1,
  },
  statLabel: {
    fontSize: FontSizes.xs,
    color: Colors.light.textSecondary,
    marginBottom: 2,
  },
  statValue: {
    fontSize: FontSizes.base,
    fontWeight: '700',
    color: Colors.light.text,
  },
  statDivider: {
    width: 1,
    backgroundColor: Colors.light.border,
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
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.border,
    ...{
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
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
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.light.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  modalTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '700',
    color: Colors.light.text,
  },
  modalButton: {
    marginBottom: Spacing.md,
  },
  // Snooze Styles
  snoozeContainer: {
    marginLeft: Spacing.lg,
    marginRight: Spacing.lg,
    marginBottom: Spacing.lg,
    padding: Spacing.lg,
    backgroundColor: '#EFF6FF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.primary,
  },
  snoozeTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.md,
  },
  snoozeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    backgroundColor: Colors.light.background,
    borderRadius: 8,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    gap: Spacing.sm,
  },
  snoozeButtonLoading: {
    backgroundColor: '#F0F0F0',
  },
  snoozeButtonText: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.primary,
  },
});
