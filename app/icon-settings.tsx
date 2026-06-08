import React from 'react';
import {
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
} from 'react-native';

import { appIcons } from '@/src/constants/icons';
import { useIconStore } from '@/src/store/iconstore';

export default function IconSettings() {
  const { selectedIcon, setSelectedIcon } = useIconStore();

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 20,
        }}
      >
        App Icon Settings
      </Text>

      <Image
        source={appIcons[selectedIcon]}
        style={{
          width: 120,
          height: 120,
          alignSelf: 'center',
          marginBottom: 30,
        }}
      />

      {Object.keys(appIcons).map((icon) => (
        <Pressable
          key={icon}
          onPress={() => setSelectedIcon(icon)}
          style={{
            padding: 16,
            marginBottom: 12,
            borderWidth: 1,
            borderRadius: 12,
          }}
        >
          <Text>{icon}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}