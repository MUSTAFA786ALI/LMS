/**
 * Offline Banner Component
 * Shows when device is offline
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors, Spacing, FontSizes } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const OfflineBanner = React.memo(() => {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  if (isOnline) return null;

  return (
    <View style={styles.container}>
      <MaterialIcons name="wifi-off" size={16} color="#fff" style={styles.icon} />
      <Text style={styles.text}>You are offline. Using cached data.</Text>
    </View>
  );
});

OfflineBanner.displayName = 'OfflineBanner';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.light.error,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  icon: {
    marginRight: Spacing.xs,
  },
  text: {
    fontSize: FontSizes.xs,
    color: '#fff',
    fontWeight: '500',
  },
});

export default OfflineBanner;
