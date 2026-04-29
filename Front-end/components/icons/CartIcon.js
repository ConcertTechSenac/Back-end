import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function CartIcon() {
  return (
    <View style={styles.wrapper}>
      <View style={styles.body} />
      <View style={styles.wheels}>
        <View style={styles.wheel} />
        <View style={styles.wheel} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  body: {
    width: 20,
    height: 14,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 2,
  },
  wheels: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 2,
  },
  wheel: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: COLORS.primary,
  },
});
