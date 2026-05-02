/**
 * Error Message Component
 */

import React from 'react';
import { View, Text, StyleSheet, ViewStyle, Pressable } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
  style?: ViewStyle;
}

export const ErrorMessage = React.memo(
  ({ message, onDismiss, style }: ErrorMessageProps) => {
    if (!message) return null;

    return (
      <View style={[styles.container, style]}>
        <MaterialIcons
          name="error-outline"
          size={20}
          color={Colors.light.error}
          style={styles.icon}
        />
        <Text style={styles.text}>{message}</Text>
        {onDismiss && (
          <Pressable onPress={onDismiss}>
            <MaterialIcons name="close" size={20} color={Colors.light.error} />
          </Pressable>
        )}
      </View>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEE2E2',
    borderColor: Colors.light.error,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.md,
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.sm,
  },
  text: {
    flex: 1,
    fontSize: FontSizes.sm,
    color: Colors.light.error,
    fontWeight: '500',
  },
});

export default ErrorMessage;
