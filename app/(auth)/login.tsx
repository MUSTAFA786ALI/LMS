/**
 * Login Screen
 * User authentication with email and password
 */

import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/src/hooks/useAuth';
import { Button } from '@/src/components/ui/Button';
import { Input } from '@/src/components/ui/Input';
import { ErrorMessage } from '@/src/components/ui/ErrorMessage';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

// Validation schema
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'test@example.com',
      password: 'password123',
    },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      setSubmitError(null);
      clearError();

      try {
        const result = await login(data.email, data.password);

        if (result.success) {
          // Navigate to home screen
          router.replace('/(tabs)/home');
        } else {
          setSubmitError(result.error || 'Login failed');
        }
      } catch (err: any) {
        setSubmitError(err.message || 'An error occurred');
      }
    },
    [login, clearError, router]
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <MaterialIcons name="school" size={48} color={Colors.light.primary} />
            </View>
            <Text style={styles.title}>Mini LMS</Text>
            <Text style={styles.subtitle}>Learn Anywhere, Anytime</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Error Messages */}
            {(submitError || error) && (
              <ErrorMessage
                message={submitError || error || ''}
                onDismiss={() => {
                  setSubmitError(null);
                  clearError();
                }}
              />
            )}

            {/* Email Field */}
            <Controller
              control={control}
              name="email"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Email"
                  placeholder="Enter your email"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  error={errors.email?.message}
                  editable={!isLoading}
                  leftIcon={<MaterialIcons name="email" size={20} color={Colors.light.primary} />}
                />
              )}
            />

            {/* Password Field */}
            <Controller
              control={control}
              name="password"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Password"
                  placeholder="Enter your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showPassword}
                  error={errors.password?.message}
                  editable={!isLoading}
                  leftIcon={<MaterialIcons name="lock" size={20} color={Colors.light.primary} />}
                  rightIcon={
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <MaterialIcons
                        name={showPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color={Colors.light.textTertiary}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            {/* Login Button */}
            <Button
              label={isLoading ? 'Logging in...' : 'Login'}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              isDisabled={isLoading}
              variant="primary"
              size="lg"
              style={styles.loginButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/register')} disabled={isLoading}>
              <Text style={styles.footerLink}>Sign up</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.xl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes['3xl'],
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  loginButton: {
    marginTop: Spacing.lg,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: FontSizes.sm,
    color: Colors.light.textSecondary,
  },
  footerLink: {
    fontSize: FontSizes.sm,
    color: Colors.light.primary,
    fontWeight: '600',
  },
});
