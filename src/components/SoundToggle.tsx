import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { theme } from '../theme/theme';

type Props = { enabled: boolean; onToggle: () => void };

export function SoundToggle({ enabled, onToggle }: Props) {
  return (
    <Pressable
      testID="sound-toggle"
      accessibilityRole="switch"
      accessibilityLabel={enabled ? 'Silenciar sonido' : 'Activar sonido'}
      accessibilityState={{ checked: enabled }}
      onPress={onToggle}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <View pointerEvents="none">
        <Svg viewBox="0 0 32 32" width={26} height={26} accessible={false}>
          <Path
            d="M 5 12 H 10 L 17 6 V 26 L 10 20 H 5 Z"
            stroke={theme.text}
            strokeWidth={2.4}
            strokeLinejoin="round"
            fill="none"
          />
          {enabled ? (
            <Path
              d="M 21 11 Q 27 16 21 21 M 24 7 Q 33 16 24 25"
              fill="none"
              stroke={theme.text}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          ) : (
            <Path
              d="M 21 11 L 29 21 M 29 11 L 21 21"
              fill="none"
              stroke={theme.text}
              strokeWidth={2.4}
              strokeLinecap="round"
            />
          )}
        </Svg>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#F0EBFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pressed: { opacity: 0.72 },
});
