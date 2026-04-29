import React from 'react';
import { View, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';

export default function AccessibilityIcon() {
  return (
    <View style={styles.circle}>
      <View style={styles.head} />
      <View style={styles.body} />
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: 12,
    alignItems: 'center',
    paddingTop: 3,
  },
  head: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: COLORS.primary,
  },
  body: {
    width: 10,
    height: 7,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    backgroundColor: COLORS.primary,
    marginTop: 1,
  },
});
