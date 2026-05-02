/**
 * SearchBar Component
 * Reusable search input with debouncing
 */

import React, { useState, useRef, useEffect } from 'react';
import { View, TextInput, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors, Spacing, FontSizes } from '@/src/constants/theme';
import { debounce } from '@/src/utils/helpers';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear?: () => void;
  containerStyle?: ViewStyle;
  debounceDelay?: number;
  editable?: boolean;
}

export const SearchBar = React.memo(
  ({
    value,
    onChangeText,
    placeholder = 'Search courses...',
    onClear,
    containerStyle,
    debounceDelay = 300,
    editable = true,
  }: SearchBarProps) => {
    const [displayValue, setDisplayValue] = useState(value);
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

    return (
      <View style={[styles.container, containerStyle]}>
        <MaterialIcons
          name="search"
          size={20}
          color={Colors.light.textTertiary}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.textTertiary}
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
              color={Colors.light.textSecondary}
              style={styles.clearIcon}
            />
          </Pressable>
        )}
      </View>
    );
  }
);

SearchBar.displayName = 'SearchBar';

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.cardBg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.light.border,
    paddingHorizontal: Spacing.md,
    height: 48,
  },
  searchIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: FontSizes.base,
    color: Colors.light.text,
    fontWeight: '400',
    padding: 0,
  },
  clearIcon: {
    marginLeft: Spacing.sm,
  },
});
