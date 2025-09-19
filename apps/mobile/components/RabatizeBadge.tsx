import { StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';

import { theme } from '@/constants/theme';

type RabatizeBadgeProps = {
  size?: 'sm' | 'md' | 'lg';
  style?: StyleProp<ViewStyle>;
};

const sizeMap = {
  sm: {
    diameter: 72,
    ringInset: 6,
    core: 34,
    highlight: 16,
    highlightTop: 12,
    highlightLeft: 20,
    waveHeight: 22,
    waveOffset: 12,
    letter: 26,
  },
  md: {
    diameter: 110,
    ringInset: 8,
    core: 56,
    highlight: 22,
    highlightTop: 16,
    highlightLeft: 30,
    waveHeight: 32,
    waveOffset: 18,
    letter: 40,
  },
  lg: {
    diameter: 180,
    ringInset: 12,
    core: 94,
    highlight: 34,
    highlightTop: 26,
    highlightLeft: 48,
    waveHeight: 52,
    waveOffset: 28,
    letter: 66,
  },
} as const satisfies Record<'sm' | 'md' | 'lg', Record<string, number>>;

export const RabatizeBadge = ({ size = 'md', style }: RabatizeBadgeProps) => {
  const dimensions = sizeMap[size];
  const diameter = dimensions.diameter;

  return (
    <View style={[styles.root, style]}>
      <View
        style={[
          styles.frame,
          {
            width: diameter,
            height: diameter,
            borderRadius: diameter / 2,
          },
        ]}
      >
        <View
          style={[
            styles.ring,
            {
              top: dimensions.ringInset,
              bottom: dimensions.ringInset,
              left: dimensions.ringInset,
              right: dimensions.ringInset,
              borderRadius: (diameter - dimensions.ringInset * 2) / 2,
            },
          ]}
        />
        <View
          style={[
            styles.core,
            {
              width: dimensions.core,
              height: dimensions.core,
              borderRadius: dimensions.core / 2,
              marginLeft: -dimensions.core / 2,
              marginTop: -dimensions.core / 2,
            },
          ]}
        />
        <View
          style={[
            styles.wave,
            {
              height: dimensions.waveHeight,
              left: dimensions.ringInset + 6,
              right: dimensions.ringInset + 6,
              bottom: dimensions.waveOffset,
              borderRadius: dimensions.waveHeight,
            },
          ]}
        />
        <View
          style={[
            styles.highlight,
            {
              width: dimensions.highlight,
              height: dimensions.highlight,
              borderRadius: dimensions.highlight / 2,
              top: dimensions.highlightTop,
              left: dimensions.highlightLeft,
            },
          ]}
        />
        <View
          style={[
            styles.spark,
            {
              width: dimensions.highlight / 2,
              height: dimensions.highlight / 2,
              borderRadius: dimensions.highlight / 4,
              top: dimensions.highlightTop + dimensions.highlight / 2,
              right: dimensions.highlightLeft,
            },
          ]}
        />
        <Text
          style={[
            styles.letter,
            {
              fontSize: dimensions.letter,
              marginLeft: -(dimensions.letter * 0.34),
              marginTop: -(dimensions.letter * 0.58),
            },
          ]}
        >
          R
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  root: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.shadowLight,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 10, height: 12 },
    shadowOpacity: 0.22,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
    position: 'relative',
  },
  ring: {
    position: 'absolute',
    backgroundColor: theme.colors.accent,
    shadowColor: theme.colors.shadowDark,
    shadowOffset: { width: 6, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
  },
  core: {
    position: 'absolute',
    backgroundColor: theme.colors.accentSoft,
    top: '50%',
    left: '50%',
  },
  wave: {
    position: 'absolute',
    backgroundColor: '#ffe6ba',
    opacity: 0.9,
  },
  highlight: {
    position: 'absolute',
    backgroundColor: '#ffd9a4',
    opacity: 0.9,
  },
  spark: {
    position: 'absolute',
    backgroundColor: '#fff6df',
  },
  letter: {
    position: 'absolute',
    color: '#fff4d6',
    fontWeight: '800',
    left: '50%',
    top: '50%',
    textShadowColor: 'rgba(84, 44, 11, 0.35)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
});

export default RabatizeBadge;
