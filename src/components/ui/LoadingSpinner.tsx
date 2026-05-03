/**
 * Loading Spinner Component
 * Using NativeWind for styling
 */

import React from 'react';
import { View, ActivityIndicator, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export const LoadingSpinner = React.memo(
  ({
    size = 'large',
    color,
  }: LoadingSpinnerProps) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const defaultColor = color || (isDark ? Colors.dark.primary : Colors.light.primary);

    return (
      <View className="justify-center items-center p-5">
        <ActivityIndicator size={size} color={defaultColor} />
      </View>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;
