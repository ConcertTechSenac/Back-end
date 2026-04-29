import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function SearchIcon() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.circle} />
      <View style={styles.handle} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: 18,
    height: 18,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.white,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  handle: {
    width: 6,
    height: 2,
    backgroundColor: COLORS.white,
    borderRadius: 1,
    position: 'absolute',
    bottom: 1,
    right: 0,
    transform: [{ rotate: '45deg' }],
  },
});
