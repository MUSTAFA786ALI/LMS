/**
 * Error Boundary Component
 * Catches and displays unhandled errors
 */

import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Colors, Spacing, FontSizes, BorderRadius } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: React.ReactNode;
  onReset?: () => void;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
    this.props.onReset?.();
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <View style={styles.content}>
            <MaterialIcons
              name="error-outline"
              size={48}
              color={Colors.light.error}
              style={styles.icon}
            />
            <Text style={styles.title}>Oops! Something went wrong</Text>
            <Text style={styles.message}>
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>

            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text style={styles.debugTitle}>Debug Info:</Text>
                <Text style={styles.debugText}>{this.state.error?.toString()}</Text>
              </View>
            )}

            <Pressable
              style={[styles.button, styles.primaryButton]}
              onPress={this.handleReset}
            >
              <Text style={styles.primaryButtonText}>Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: Spacing.lg,
  },
  content: {
    alignItems: 'center',
    maxWidth: 400,
  },
  icon: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  message: {
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.lg,
    textAlign: 'center',
    lineHeight: 22,
  },
  debugInfo: {
    width: '100%',
    backgroundColor: '#FFF0F0',
    borderColor: Colors.light.error,
    borderWidth: 1,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  debugTitle: {
    fontSize: FontSizes.sm,
    fontWeight: '600',
    color: Colors.light.error,
    marginBottom: Spacing.xs,
  },
  debugText: {
    fontSize: FontSizes.xs,
    color: Colors.light.error,
    fontFamily: 'monospace',
  },
  button: {
    width: '100%',
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: Colors.light.primary,
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: FontSizes.base,
    fontWeight: '600',
  },
});

export default ErrorBoundary;
