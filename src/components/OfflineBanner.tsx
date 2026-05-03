/**
 * Offline Banner Component
 * Shows when device is offline using NativeWind
 */

import React, { useEffect, useState } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import { Colors } from '../constants/theme';
import { MaterialIcons } from '@expo/vector-icons';

export const OfflineBanner = React.memo(() => {
  const [isOnline, setIsOnline] = useState(true);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsOnline(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  if (isOnline) return null;

  return (
    <View className={`flex flex-row items-center justify-center py-2 px-4 gap-2 ${isDark ? 'bg-red-900' : 'bg-red-600'}`}>
      <MaterialIcons name="wifi-off" size={16} color="#fff" />
      <Text className="text-xs text-white font-medium">You are offline. Using cached data.</Text>
    </View>
  );
});

OfflineBanner.displayName = 'OfflineBanner';

export default OfflineBanner;
