/**
 * Register Screen
 * New user account creation
 */

import React, { useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  Pressable,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
const registerSchema = z
  .object({
    username: z.string().min(3, 'Username must be at least 3 characters'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { register, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [submitError, setSubmitError] = React.useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      setSubmitError(null);
      clearError();

      try {
        const result = await register(data.email, data.password, data.username);

        if (result.success) {
          // After successful registration, redirect to login screen
          // User needs to login to get auth tokens
          router.replace('/(auth)/login');
        } else {
          setSubmitError(result.error || 'Registration failed');
        }
      } catch (err: any) {
        setSubmitError(err.message || 'An error occurred');
      }
    },
    [register, clearError, router]
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
            <Pressable onPress={() => router.back()} hitSlop={12}>
              <MaterialIcons name="arrow-back" size={24} color={Colors.light.text} />
            </Pressable>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>Join our learning community</Text>
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

            {/* Username Field */}
            <Controller
              control={control}
              name="username"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Username"
                  placeholder="Choose a username"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  autoCapitalize="none"
                  error={errors.username?.message}
                  editable={!isLoading}
                  leftIcon={<MaterialIcons name="person" size={20} color={Colors.light.primary} />}
                />
              )}
            />

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
                  placeholder="Enter password (min. 6 characters)"
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

            {/* Confirm Password Field */}
            <Controller
              control={control}
              name="confirmPassword"
              render={({ field: { value, onChange, onBlur } }) => (
                <Input
                  label="Confirm Password"
                  placeholder="Confirm your password"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  secureTextEntry={!showConfirmPassword}
                  error={errors.confirmPassword?.message}
                  editable={!isLoading}
                  leftIcon={<MaterialIcons name="lock" size={20} color={Colors.light.primary} />}
                  rightIcon={
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <MaterialIcons
                        name={showConfirmPassword ? 'visibility' : 'visibility-off'}
                        size={20}
                        color={Colors.light.textTertiary}
                      />
                    </Pressable>
                  }
                />
              )}
            />

            {/* Register Button */}
            <Button
              label={isLoading ? 'Creating account...' : 'Sign Up'}
              onPress={handleSubmit(onSubmit)}
              isLoading={isLoading}
              isDisabled={isLoading}
              variant="primary"
              size="lg"
              style={styles.registerButton}
            />
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => router.push('/(auth)/login')} disabled={isLoading}>
              <Text style={styles.footerLink}>Login</Text>
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
    paddingVertical: Spacing.lg,
  },
  header: {
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSizes['2xl'],
    fontWeight: '700',
    color: Colors.light.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
  },
  form: {
    marginBottom: Spacing.xl,
  },
  registerButton: {
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
