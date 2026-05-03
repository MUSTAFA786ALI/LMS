/**
 * Input Component
 * Text input with label and error handling using NativeWind
 */

import React from 'react';
import { View, Text, TextInput, TextInputProps, useColorScheme } from 'react-native';
import { Colors } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      ...props
    }: InputProps,
    ref
  ) => {
    const hasError = !!error;
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const containerClass = 'w-full mb-3';
    const labelClass = 'text-sm font-semibold mb-1';
    const labelColorClass = isDark ? 'text-white' : 'text-black';

    const inputContainerClass = `
      flex flex-row items-center border rounded-lg px-3
      ${isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-300'}
      ${hasError ? (isDark ? 'border-red-600' : 'border-red-500') : ''}
    `.trim();

    const inputClass = `
      flex-1 py-3 text-base
      ${isDark ? 'text-white' : 'text-black'}
    `.trim();

    const errorClass = 'mt-1 text-xs text-red-500 dark:text-red-400';

    return (
      <View className={containerClass}>
        {label && <Text className={`${labelClass} ${labelColorClass}`}>{label}</Text>}

        <View className={inputContainerClass}>
          {leftIcon && <View className="mr-2">{leftIcon}</View>}

          <TextInput
            ref={ref}
            {...props}
            className={inputClass}
            placeholderTextColor={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          />

          {rightIcon && <View className="ml-2">{rightIcon}</View>}
        </View>

        {error && <Text className={errorClass}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;
