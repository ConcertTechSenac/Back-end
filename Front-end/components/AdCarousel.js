import React, { useState, useRef } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import COLORS from '../constants/colors';

const { width } = Dimensions.get('window');
const ADS = [0, 1, 2];

export default function AdCarousel() {
  const [active, setActive] = useState(0);
  const flatRef = useRef(null);

  const onScroll = (e) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / width);
    setActive(idx);
  };

  return (
    <View style={styles.wrapper}>
      <FlatList
        ref={flatRef}
        data={ADS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        keyExtractor={(i) => String(i)}
        renderItem={() => (
          <View style={styles.slide}>
            <Text style={styles.placeholder}>Carrossel de anúncios!</Text>
          </View>
        )}
      />
      <View style={styles.dotsRow}>
        {ADS.map((_, i) => (
          <View key={i} style={[styles.dot, i === active && styles.dotActive]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 8,
  },
  slide: {
    width,
    height: 160,
    backgroundColor: COLORS.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    color: COLORS.gray600,
    fontSize: 14,
    fontWeight: '500',
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.gray200,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
    width: 20,
    borderRadius: 4,
  },
});
