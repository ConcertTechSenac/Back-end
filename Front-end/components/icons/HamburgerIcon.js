import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function HamburgerIcon() {
  return (
    <View style={styles.wrapper}>
      {[0, 1, 2].map((i) => (
        <View key={i} style={styles.line} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 5,
  },
  line: {
    width: 22,
    height: 2.5,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});
