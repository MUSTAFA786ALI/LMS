/**
 * Search Screen
 * Browse and search for courses
 */

import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export default function SearchScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <MaterialIcons name="search" size={32} color={Colors.light.primary} />
          <Text style={styles.title}>Search Courses</Text>
        </View>
        <Text style={styles.placeholder}>Coming soon...</Text>
      </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSizes.xl,
    fontWeight: '700',
    color: Colors.light.text,
    marginTop: Spacing.md,
  },
  placeholder: {
    fontSize: FontSizes.base,
    color: Colors.light.textSecondary,
  },
});
