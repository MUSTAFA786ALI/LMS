/**
 * Button Component
 * Reusable button with variants
 */

import React from 'react';
import {
  Pressable,
  Text,
  StyleSheet,
  PressableProps,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius, Durations } from '../../constants/theme';

interface ButtonProps extends PressableProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  isFullWidth?: boolean;
  isDisabled?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.memo(
  ({
    label,
    variant = 'primary',
    size = 'md',
    isLoading = false,
    isFullWidth = true,
    isDisabled = false,
    leftIcon,
    rightIcon,
    style,
    onPress,
    ...props
  }: ButtonProps) => {
    const [isPressed, setIsPressed] = React.useState(false);

    const variants = {
      primary: {
        container: styles.primaryContainer,
        text: styles.primaryText,
      },
      secondary: {
        container: styles.secondaryContainer,
        text: styles.secondaryText,
      },
      danger: {
        container: styles.dangerContainer,
        text: styles.dangerText,
      },
    };

    const sizes = {
      sm: {
        container: styles.sizeSmContainer,
        text: styles.sizeSmText,
      },
      md: {
        container: styles.sizeMdContainer,
        text: styles.sizeMdText,
      },
      lg: {
        container: styles.sizeLgContainer,
        text: styles.sizeLgText,
      },
    };

    const selectedVariant = variants[variant];
    const selectedSize = sizes[size];

    const containerStyle = [
      styles.container,
      selectedVariant.container,
      selectedSize.container,
      isFullWidth && styles.fullWidth,
      isDisabled && styles.disabled,
      isPressed && styles.pressed,
      style,
    ].filter(Boolean) as ViewStyle[];

    return (
      <Pressable
        {...props}
        style={containerStyle}
        onPress={(e) => {
          if (!isLoading && !isDisabled && onPress) {
            onPress(e);
          }
        }}
        onPressIn={() => !isLoading && !isDisabled && setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        disabled={isLoading || isDisabled}
      >
        {leftIcon && !isLoading && <>{leftIcon}</>}
        {isLoading ? (
          <ActivityIndicator color={Colors.light.text} size="small" />
        ) : (
          <Text style={[styles.text, selectedVariant.text, selectedSize.text]}>
            {label}
          </Text>
        )}
        {rightIcon && !isLoading && <>{rightIcon}</>}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
  text: {
    fontWeight: '600',
  },

  // Variants
  primaryContainer: {
    backgroundColor: Colors.light.primary,
  },
  primaryText: {
    color: '#fff',
  },
  secondaryContainer: {
    backgroundColor: Colors.light.border,
  },
  secondaryText: {
    color: Colors.light.text,
  },
  dangerContainer: {
    backgroundColor: Colors.light.error,
  },
  dangerText: {
    color: '#fff',
  },

  // Sizes
  sizeSmContainer: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  sizeSmText: {
    fontSize: FontSizes.sm,
  },
  sizeMdContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  sizeMdText: {
    fontSize: FontSizes.base,
  },
  sizeLgContainer: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  sizeLgText: {
    fontSize: FontSizes.lg,
  },
});

export default Button;
