/**
 * Button Component
 * Reusable button with variants using NativeWind
 */

import React from 'react';
import { Pressable, Text, PressableProps, ActivityIndicator, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

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
    onPress,
    ...props
  }: ButtonProps) => {
    const [isPressed, setIsPressed] = React.useState(false);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    // Variant styles
    const variantClasses = {
      primary: {
        container: isDark ? 'bg-cyan-500' : 'bg-sky-500',
        text: 'text-white',
      },
      secondary: {
        container: isDark ? 'bg-gray-600' : 'bg-gray-200',
        text: isDark ? 'text-white' : 'text-black',
      },
      danger: {
        container: isDark ? 'bg-red-600' : 'bg-red-500',
        text: 'text-white',
      },
    };

    // Size styles
    const sizeClasses = {
      sm: {
        container: 'px-3 py-2',
        text: 'text-sm',
      },
      md: {
        container: 'px-4 py-3',
        text: 'text-base',
      },
      lg: {
        container: 'px-6 py-4',
        text: 'text-lg',
      },
    };

    const selectedVariant = variantClasses[variant];
    const selectedSize = sizeClasses[size];

    const containerClass = `
      flex flex-row items-center justify-center rounded-lg gap-2
      ${selectedVariant.container}
      ${selectedSize.container}
      ${isFullWidth ? 'w-full' : ''}
      ${isDisabled ? 'opacity-50' : ''}
      ${isPressed && !isLoading ? 'opacity-80' : ''}
    `.trim();

    const textClass = `
      font-semibold
      ${selectedVariant.text}
      ${selectedSize.text}
    `.trim();

    return (
      <Pressable
        {...props}
        className={containerClass}
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
          <ActivityIndicator color={isDark ? Colors.dark.text : Colors.light.text} size="small" />
        ) : (
          <Text className={textClass}>{label}</Text>
        )}
        {rightIcon && !isLoading && <>{rightIcon}</>}
      </Pressable>
    );
  }
);

Button.displayName = 'Button';

export default Button;
