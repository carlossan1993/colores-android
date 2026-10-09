import React from 'react';
import { BackHandler } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { Path } from 'react-native-svg';
import App from '../App';
import { catalog, categories } from '../src/content/catalog';
import { adjacentDrawing, backRoute } from '../src/navigation/navigation';
import { sessionReducer } from '../src/coloring/sessionReducer';

test('catalog covers four categories and adjacent navigation stops at category boundaries', () => {
  expect(categories).toHaveLength(4);
  expect(new Set(catalog.map(drawing => drawing.id)).size).toBe(catalog.length);
  for (const category of categories) {
    expect(catalog.some(drawing => drawing.category === category.id)).toBe(
      true,
    );
  }
  expect(adjacentDrawing('house_001', 1)?.id).toBe('castle_001');
  expect(adjacentDrawing('house_001', -1)).toBeUndefined();
  expect(adjacentDrawing('castle_001', 1)).toBeUndefined();
  expect(adjacentDrawing('cat_001', 1)).toBeUndefined();
  expect(backRoute({ screen: 'coloring', drawingId: 'house_001' })).toEqual({
    screen: 'gallery',
    category: 'places',
  });
});

test('session state isolates drawing IDs and rejects unknown regions and drawings', () => {
  const painted = sessionReducer(
    {},
    {
      drawingId: 'house_001',
      action: { type: 'paint', regionId: 'roof', color: '#EF6B6B' },
    },
  );
  const both = sessionReducer(painted, {
    drawingId: 'castle_001',
    action: { type: 'paint', regionId: 'roof', color: '#66BE96' },
  });
  expect(both.house_001.colors.roof).toBe('#EF6B6B');
  expect(both.castle_001.colors.roof).toBe('#66BE96');
  expect(
    sessionReducer(both, {
      drawingId: 'cat_001',
      action: { type: 'paint', regionId: 'roof', color: '#EF6B6B' },
    }),
  ).toBe(both);
  expect(
    sessionReducer(both, { drawingId: 'unknown', action: { type: 'reset' } }),
  ).toBe(both);
});

test('home, every category, gallery previews, next/previous, undo and Android Back preserve the session', async () => {
  const handlers: (() => boolean | null | undefined)[] = [];
  const back = jest
    .spyOn(BackHandler, 'addEventListener')
    .mockImplementation((_name, handler) => {
      handlers.push(() => handler({} as Parameters<typeof handler>[0]));
      return { remove: jest.fn() };
    });
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    const control = (id: string) =>
      renderer.root.findAll(
        node =>
          node.props.testID === id &&
          (typeof node.props.onPress === 'function' ||
            typeof node.props.disabled === 'boolean'),
      )[0];
    const press = async (id: string) => {
      await ReactTestRenderer.act(() => control(id).props.onPress());
    };
    const roof = () =>
      renderer.root
        .findAllByType(Path)
        .find(node => node.props.testID === 'region-roof')!;
    await press('start-coloring');
    for (const category of ['animals', 'fruits', 'vehicles']) {
      await press(`category-${category}`);
      const drawing = catalog.find(item => item.category === category)!;
      await press(`drawing-${drawing.id}`);
      expect(control('drawing-next').props.disabled).toBe(true);
      if (category === 'animals') {
        for (const region of renderer.root
          .findAllByType(Path)
          .filter(node => node.props.testID?.startsWith('region-'))) {
          await ReactTestRenderer.act(() => region.props.onPress());
        }
      }
      await press('coloring-back');
      if (category === 'animals') {
        expect(control('drawing-cat_001').props.accessibilityLabel).toContain(
          'Terminado',
        );
      }
      await press('browse-back');
    }
    await press('category-places');
    await press('drawing-house_001');
    await ReactTestRenderer.act(() => roof().props.onPress());
    await press('coloring-back');
    expect(control('drawing-house_001').props.accessibilityLabel).toContain(
      'En progreso',
    );
    await press('drawing-house_001');
    expect(roof().props.fill).toBe('#EF6B6B');
    await press('color-66BE96');
    await press('drawing-next');
    expect(roof().props.fill).toBe('#FFFFFF');
    await ReactTestRenderer.act(() => roof().props.onPress());
    expect(roof().props.fill).toBe('#66BE96');
    await press('drawing-previous');
    expect(roof().props.fill).toBe('#EF6B6B');
    await press('action-undo');
    expect(roof().props.fill).toBe('#FFFFFF');
    await press('action-redo');
    expect(roof().props.fill).toBe('#EF6B6B');
    let handled: boolean | null | undefined;
    await ReactTestRenderer.act(() => {
      handled = handlers[handlers.length - 1]();
    });
    expect(handled).toBe(true);
    expect(control('drawing-house_001').props.accessibilityLabel).toContain(
      'En progreso',
    );
    await press('browse-back');
    await press('browse-back');
    expect(handlers[handlers.length - 1]()).toBe(false);
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
    back.mockRestore();
  }
});
