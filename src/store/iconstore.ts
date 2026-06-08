import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface IconState {
  selectedIcon: string;
  setSelectedIcon: (icon: string) => void;
}

export const useIconStore = create<IconState>()(
  persist(
    (set) => ({
      selectedIcon: 'default',
      setSelectedIcon: (icon) =>
        set({ selectedIcon: icon }),
    }),
    {
      name: 'icon-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);