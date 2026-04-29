import React, { useState } from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import COLORS from '../constants/colors';
import SearchIcon from './icons/SearchIcon';

export default function SearchBar() {
  const [query, setQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.bar}>
        <SearchIcon />
        <TextInput
          style={styles.input}
          placeholder="Busque no HARD!"
          placeholderTextColor={COLORS.gray400}
          value={query}
          onChangeText={setQuery}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 25,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: COLORS.white,
    fontWeight: '500',
  },
});
