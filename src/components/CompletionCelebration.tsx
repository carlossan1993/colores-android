import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, Text } from 'react-native';

// Feedback is visual, temporary, and never intercepts touches on the SVG.
export function CompletionCelebration({ trigger }: { trigger: number }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    if (trigger === 0) {
      return;
    }
    opacity.setValue(0);
    scale.setValue(0.9);
    const animation = Animated.parallel([
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.delay(1100),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(scale, {
        toValue: 1,
        duration: 280,
        useNativeDriver: true,
      }),
    ]);
    animation.start();
    return () => animation.stop();
  }, [opacity, scale, trigger]);

  return trigger === 0 ? null : (
    <Animated.View
      testID="completion-celebration"
      pointerEvents="none"
      accessible={false}
      style={[styles.banner, { opacity, transform: [{ scale }] }]}
    >
      <Text style={styles.star}>★</Text>
      <Text style={styles.text}>¡Bravo, lo terminaste!</Text>
      <Text style={styles.star}>★</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    position: 'absolute',
    top: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#E1F4E9',
    borderWidth: 2,
    borderColor: '#66BE96',
  },
  text: { fontSize: 18, fontWeight: '800', color: '#245C45' },
  star: { fontSize: 18, fontWeight: '800', color: '#D78E24' },
});
