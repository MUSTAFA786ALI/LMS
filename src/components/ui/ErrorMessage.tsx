/**
 * Error Message Component
 * Using NativeWind for styling
 */

import React from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorMessageProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorMessage = React.memo(
  ({ message, onDismiss }: ErrorMessageProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    if (!message) return null;

    const containerClass = `
      flex flex-row items-center rounded-lg px-3 py-3 mb-3 gap-2
      ${isDark ? 'bg-red-900 border border-red-700' : 'bg-red-100 border border-red-500'}
    `.trim();

    const textClass = `flex-1 text-sm ${isDark ? 'text-red-200' : 'text-red-600'}`;
    const errorColor = isDark ? Colors.dark.error : Colors.light.error;

    return (
      <View className={containerClass}>
        <MaterialIcons name="error-outline" size={20} color={errorColor} />
        <Text className={textClass}>{message}</Text>
        {onDismiss && (
          <Pressable onPress={onDismiss}>
            <MaterialIcons name="close" size={20} color={errorColor} />
          </Pressable>
        )}
      </View>
    );
  }
);

ErrorMessage.displayName = 'ErrorMessage';

export default ErrorMessage;
