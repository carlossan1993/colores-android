import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import type { ColoringLayout } from '../layout/coloringLayout';
import { theme } from '../theme/theme';
import { ActionIcon } from './ActionIcon';

type Props = {
  layout: ColoringLayout;
  canUndo: boolean;
  canRedo: boolean;
  canReset: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onReset: () => void;
};

export function ColoringTools(props: Props) {
  const { layout } = props;
  const actions = [
    {
      id: 'undo' as const,
      label: 'Deshacer',
      enabled: props.canUndo,
      onPress: props.onUndo,
    },
    {
      id: 'redo' as const,
      label: 'Rehacer',
      enabled: props.canRedo,
      onPress: props.onRedo,
    },
    {
      id: 'reset' as const,
      label: 'Reiniciar',
      enabled: props.canReset,
      onPress: props.onReset,
    },
  ];
  return (
    <View style={[styles.tools, { gap: layout.cellGap }]}>
      {actions.map(action => (
        <Pressable
          key={action.id}
          testID={`action-${action.id}`}
          accessibilityRole="button"
          accessibilityLabel={action.label}
          accessibilityState={{ disabled: !action.enabled }}
          disabled={!action.enabled}
          onPress={action.onPress}
          style={({ pressed }) => [
            styles.button,
            { width: layout.cellSize, minHeight: layout.cellSize },
            action.id === 'reset' && styles.reset,
            !action.enabled && styles.disabled,
            pressed && styles.pressed,
          ]}
        >
          <View pointerEvents="none" style={styles.content}>
            <ActionIcon
              name={action.id}
              color={action.id === 'reset' ? '#A95435' : theme.text}
              size={layout.tablet ? 30 : 26}
            />
            {layout.tablet ? (
              <Text maxFontSizeMultiplier={1.2} style={styles.label}>
                {action.label}
              </Text>
            ) : null}
          </View>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    borderRadius: 14,
    backgroundColor: '#F0EBFC',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  reset: { backgroundColor: '#FFF0E8' },
  disabled: { opacity: 0.38 },
  pressed: { opacity: 0.72 },
  content: { alignItems: 'center', gap: 2 },
  label: { fontSize: 12, fontWeight: '600', color: theme.text },
});
