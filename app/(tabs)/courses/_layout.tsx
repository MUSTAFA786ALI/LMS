/**
 * Courses Group Layout
 * Nested within tabs for course detail routes
 */

import { Stack } from 'expo-router';

export default function CoursesLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="[id]" />
    </Stack>
  );
}
