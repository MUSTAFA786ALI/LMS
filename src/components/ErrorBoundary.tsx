/**
 * Error Boundary Component
 * Catches and displays unhandled errors using NativeWind
 */

import React from 'react';
import { View, Text, Pressable, useColorScheme } from 'react-native';
import { Colors } from '../constants/theme';
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
      // Use light theme by default for error screens
      return (
        <View className="flex-1 justify-center items-center bg-white px-4">
          <View className="items-center max-w-md">
            <MaterialIcons
              name="error-outline"
              size={48}
              color={Colors.light.error}
              style={{ marginBottom: 24 }}
            />
            <Text className="text-2xl font-bold text-black mb-2 text-center">
              Oops! Something went wrong
            </Text>
            <Text className="text-base text-gray-600 mb-6 text-center leading-relaxed">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>

            {__DEV__ && (
              <View className="w-full bg-red-100 border border-red-500 rounded-lg p-3 mb-6">
                <Text className="text-sm font-semibold text-red-600 mb-1">Debug Info:</Text>
                <Text className="text-xs text-red-600 font-mono">
                  {this.state.error?.toString()}
                </Text>
              </View>
            )}

            <Pressable
              className="w-full bg-sky-500 py-3 rounded-lg items-center"
              onPress={this.handleReset}
            >
              <Text className="text-white text-base font-semibold">Try Again</Text>
            </Pressable>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
