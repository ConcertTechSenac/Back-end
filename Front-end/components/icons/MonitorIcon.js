import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function MonitorIcon() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.screen}>
        <View style={styles.gear} />
      </View>
      <View style={styles.base} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  screen: {
    width: 30,
    height: 20,
    borderRadius: 3,
    borderWidth: 2.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gear: {
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  base: {
    width: 12,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
    marginTop: 2,
  },
});
