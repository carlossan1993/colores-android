import React from 'react';
import * as ReactNative from 'react-native';
import { Path } from 'react-native-svg';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { getColoringLayout } from '../src/layout/coloringLayout';

test.each([
  [640, 360, false, false],
  [892, 412, false, false],
  [1024, 600, true, false],
  [1280, 800, true, false],
  [800, 280, false, true],
  [420, 760, false, true],
])(
  'keeps 48dp touch targets and a fitting palette at %sx%s',
  (width, height, tablet, bottom) => {
    const layout = getColoringLayout(width as number, height as number);
    expect(layout.tablet).toBe(tablet);
    expect(layout.bottomPalette).toBe(bottom);
    expect(layout.cellSize).toBeGreaterThanOrEqual(48);
    if (!layout.bottomPalette) {
      expect(layout.panelWidth - 2 * layout.panelPadding).toBe(
        3 * layout.cellSize + 2 * layout.cellGap,
      );
      const paletteHeight = layout.cellSize * 4 + layout.cellGap * 3 + 4;
      const panelContents =
        28 +
        paletteHeight +
        layout.cellSize +
        2 * layout.sectionGap +
        2 * layout.panelPadding;
      expect(panelContents).toBeLessThanOrEqual(
        (height as number) - 2 * layout.outerPadding,
      );
      const canvasWidth =
        (width as number) -
        2 * layout.outerPadding -
        layout.panelWidth -
        layout.sectionGap;
      expect(canvasWidth).toBeGreaterThan((width as number) * 0.65);
    }
  },
);

test('resizing between phone, tablet and small window preserves color and undo', async () => {
  const dimensions = jest.spyOn(ReactNative, 'useWindowDimensions');
  dimensions.mockReturnValue({
    width: 640,
    height: 360,
    scale: 1,
    fontScale: 1,
  });
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    const roof = () =>
      renderer.root
        .findAllByType(Path)
        .find(region => region.props.id === 'roof')!;
    await ReactTestRenderer.act(() => roof().props.onPress());
    for (const [width, height] of [
      [1280, 800],
      [800, 280],
      [420, 760],
      [640, 360],
    ]) {
      dimensions.mockReturnValue({ width, height, scale: 1, fontScale: 1 });
      await ReactTestRenderer.act(() => renderer.update(<App />));
      expect(roof().props.fill).toBe('#EF6B6B');
      const swatches = renderer.root.findAll(
        node =>
          node.props.testID?.startsWith('color-') &&
          typeof node.props.onPress === 'function',
      );
      expect(swatches).toHaveLength(12);
    }
    const undo = renderer.root.findAll(
      node =>
        node.props.testID === 'action-undo' &&
        typeof node.props.onPress === 'function',
    )[0];
    await ReactTestRenderer.act(() => undo.props.onPress());
    expect(roof().props.fill).toBe('#FFFFFF');
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
    dimensions.mockRestore();
  }
});
