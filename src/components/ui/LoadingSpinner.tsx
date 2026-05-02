/**
 * Loading Spinner Component
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../constants/theme';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
  style?: ViewStyle;
}

export const LoadingSpinner = React.memo(
  ({
    size = 'large',
    color = Colors.light.primary,
    style,
  }: LoadingSpinnerProps) => {
    return (
      <View style={[styles.container, style]}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }
);

LoadingSpinner.displayName = 'LoadingSpinner';

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default LoadingSpinner;
