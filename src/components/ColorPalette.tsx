import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import type { ColoringLayout } from '../layout/coloringLayout';
import { palette } from '../theme/palette';
import { theme } from '../theme/theme';
import { ActionIcon } from './ActionIcon';

type Props = {
  layout: ColoringLayout;
  selectedColor: string;
  onSelect: (color: string) => void;
};

export function ColorPalette({ layout, selectedColor, onSelect }: Props) {
  return (
    <ScrollView
      horizontal={layout.bottomPalette}
      style={styles.scroll}
      contentContainerStyle={[
        styles.colors,
        { gap: layout.cellGap },
        layout.bottomPalette ? styles.horizontal : styles.grid,
      ]}
      showsHorizontalScrollIndicator
      showsVerticalScrollIndicator
    >
      {palette.map(item => {
        const selected = selectedColor === item.color;
        return (
          <Pressable
            key={item.color}
            testID={`color-${item.color.slice(1)}`}
            accessibilityRole="button"
            accessibilityLabel={`Elegir ${item.name}`}
            accessibilityState={{ selected }}
            onPress={() => onSelect(item.color)}
            style={({ pressed }) => [
              styles.swatch,
              {
                width: layout.cellSize,
                height: layout.cellSize,
                backgroundColor: item.color,
              },
              selected && styles.selected,
              pressed && styles.pressed,
            ]}
          >
            <View pointerEvents="none">
              {selected ? (
                <ActionIcon
                  name="check"
                  color={theme.text}
                  size={layout.tablet ? 28 : 22}
                />
              ) : item.color === '#FFFFFF' ? (
                <ActionIcon name="erase" color={theme.muted} size={22} />
              ) : null}
            </View>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  colors: { flexGrow: 1, paddingVertical: 2 },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignContent: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    // Keep the natural row width: centering overflowing content can place the
    // final swatch beyond Android's horizontal scroll range.
    flexGrow: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 2,
  },
  swatch: {
    borderRadius: 100,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { borderWidth: 3, borderColor: theme.text },
  pressed: { opacity: 0.72 },
});
