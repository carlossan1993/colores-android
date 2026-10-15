import React from 'react';
import { Path } from 'react-native-svg';
import ReactTestRenderer from 'react-test-renderer';
import { ColoringScreen } from '../src/screens/ColoringScreen';
import { palette } from '../src/theme/palette';
import { decodeSnapshot } from '../src/storage/snapshot';

test('primarios aprobados ocupan las posiciones indicadas y los otros 9 colores siguen intactos', () => {
  expect(palette.map(item => item.name)).toEqual([
    'rojo', 'naranja', 'amarillo',
    'verde', 'azul', 'violeta',
    'rosa', 'marrón', 'gris',
    'negro', 'celeste', 'blanco para borrar',
  ]);
  expect(palette[0].color).toBe('#F54536');
  expect(palette[2].color).toBe('#FAF332');
  expect(palette[4].color).toBe('#0A35F5');
  expect(palette).toHaveLength(12);
  expect(new Set(palette.map(item => item.color)).size).toBe(12);
  expect(palette[11].color).toBe('#FFFFFF');
});

test.each([
  ['rojo', '#F54536'],
  ['azul', '#0A35F5'],
  ['amarillo', '#FAF332'],
] as const)('seleccionar %s pinta las zonas realmente con %s', async (name, hex) => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<ColoringScreen />);
    });
    const control = renderer.root.findAll(
      node => node.props.accessibilityLabel === `Elegir ${name}`
        && typeof node.props.onPress === 'function',
    )[0];
    expect(control.props.testID).toBe(`color-${hex.slice(1)}`);
    await ReactTestRenderer.act(() => control.props.onPress());
    expect(control.props.accessibilityState.selected).toBe(true);
    const region = renderer.root.findAllByType(Path).find(node => node.props.id === 'roof')!;
    await ReactTestRenderer.act(() => region.props.onPress());
    expect(region.props.fill).toBe(hex);
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
  }
});

test.each([
  ['#EF6B6B', '#F54536'],
  ['#62AFE2', '#0A35F5'],
  ['#F4D35E', '#FAF332'],
] as const)('al actualizar solo migra la selección %s, preservando regiones históricas', (oldHex, newHex) => {
  const stored = JSON.stringify({
    schemaVersion: 1,
    drawings: { house_001: { roof: oldHex } },
    preferences: { selectedColor: oldHex.toLowerCase(), soundEnabled: false },
  });
  const restored = decodeSnapshot(stored);
  expect(restored.preferences.selectedColor).toBe(newHex);
  expect(restored.preferences.soundEnabled).toBe(false);
  expect(restored.drawings.house_001.roof).toBe(oldHex);
});
