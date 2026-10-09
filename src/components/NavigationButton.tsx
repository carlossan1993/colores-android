import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme/theme';

type Props = {
  direction: 'back' | 'next';
  label: string;
  testID: string;
  onPress?: () => void;
};
export function NavigationButton({ direction, label, testID, onPress }: Props) {
  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: !onPress }}
      disabled={!onPress}
      onPress={onPress}
      style={[styles.button, !onPress && styles.disabled]}
    >
      <Svg width={28} height={28} viewBox="0 0 32 32" accessible={false}>
        <Path
          d={
            direction === 'back'
              ? 'M 20 7 L 11 16 L 20 25'
              : 'M 12 7 L 21 16 L 12 25'
          }
          stroke={theme.text}
          strokeWidth={3}
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </Svg>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderColor: theme.border,
    borderWidth: 1,
  },
  disabled: { opacity: 0.3 },
});
