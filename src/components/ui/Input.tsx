/**
 * Input Component
 * Text input with label and error handling
 */

import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input = React.forwardRef<TextInput, InputProps>(
  (
    {
      label,
      error,
      leftIcon,
      rightIcon,
      containerStyle,
      style,
      ...props
    }: InputProps,
    ref
  ) => {
    const hasError = !!error;

    return (
      <View style={[styles.container, containerStyle]}>
        {label && <Text style={styles.label}>{label}</Text>}

        <View style={[styles.inputContainer, hasError && styles.inputContainerError]}>
          {leftIcon && <View style={styles.iconLeft}>{leftIcon}</View>}

          <TextInput
            ref={ref}
            {...props}
            style={[
              styles.input,
              leftIcon && styles.inputWithLeftIcon,
              rightIcon && styles.inputWithRightIcon,
              style,
            ].filter(Boolean) as TextStyle[]}
            placeholderTextColor={Colors.light.textTertiary}
          />

          {rightIcon && <View style={styles.iconRight}>{rightIcon}</View>}
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
      </View>
    );
  }
);

Input.displayName = 'Input';

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.light.surface,
    paddingHorizontal: Spacing.md,
  },
  inputContainerError: {
    borderColor: Colors.light.error,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
    fontSize: FontSizes.base,
    color: Colors.light.text,
  },
  inputWithLeftIcon: {
    marginLeft: Spacing.sm,
  },
  inputWithRightIcon: {
    marginRight: Spacing.sm,
  },
  iconLeft: {
    marginRight: Spacing.sm,
  },
  iconRight: {
    marginLeft: Spacing.sm,
  },
  error: {
    marginTop: Spacing.xs,
    fontSize: FontSizes.xs,
    color: Colors.light.error,
  },
});

export default Input;
