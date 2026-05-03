/**
 * SearchBar Component
 * Reusable search input with debouncing using NativeWind
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, useColorScheme } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/src/constants/theme';
import { debounce } from '@/src/utils/helpers';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  debounceDelay?: number;
  editable?: boolean;
}

export const SearchBar = React.memo(
  ({
    value,
    onChangeText,
    placeholder = 'Search courses...',
    onClear,
    debounceDelay = 300,
    editable = true,
  }: SearchBarProps) => {
    const [displayValue, setDisplayValue] = useState(value);
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';

    const debouncedSearch = useRef(
      debounce((text: string) => {
        onChangeText(text);
      }, debounceDelay)
    ).current;

    useEffect(() => {
      setDisplayValue(value);
    }, [value]);

    const handleChange = (text: string) => {
      setDisplayValue(text);
      debouncedSearch(text);
    };

    const handleClear = () => {
      setDisplayValue('');
      onChangeText('');
      onClear?.();
    };

    const containerClass = `
      flex flex-row items-center rounded-lg border h-12 px-3
      ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300'}
    `.trim();

    const inputClass = `
      flex-1 text-base
      ${isDark ? 'text-white' : 'text-black'}
    `.trim();

    return (
      <View className={containerClass}>
        <MaterialIcons
          name="search"
          size={20}
          color={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
        />
        <TextInput
          className={`${inputClass} ml-2 p-0`}
          placeholder={placeholder}
          placeholderTextColor={isDark ? Colors.dark.textTertiary : Colors.light.textTertiary}
          value={displayValue}
          onChangeText={handleChange}
          editable={editable}
          returnKeyType="search"
          clearButtonMode="never"
        />
        {displayValue.length > 0 && (
          <Pressable onPress={handleClear} hitSlop={8}>
            <MaterialIcons
              name="close"
              size={20}
              color={isDark ? Colors.dark.textSecondary : Colors.light.textSecondary}
              style={{ marginLeft: 8 }}
            />
          </Pressable>
        )}
      </View>
    );
  }
);

SearchBar.displayName = 'SearchBar';

export default SearchBar;
