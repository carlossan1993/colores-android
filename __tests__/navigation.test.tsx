import React from 'react';
import { Alert, BackHandler } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import { Path } from 'react-native-svg';
import App from '../App';
import { catalog, categories } from '../src/content/catalog';
import { adjacentDrawing, backRoute } from '../src/navigation/navigation';
import { sessionReducer } from '../src/coloring/sessionReducer';
import { createColoringReducer, createInitialState, getDrawingProgress } from '../src/coloring/coloringReducer';

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
  expect(adjacentDrawing('castle_001', 1)?.id).toBe('school_001');
  expect(adjacentDrawing('cat_001', 1)?.id).toBe('dog_001');
  for (const category of categories) {
    const drawings = catalog.filter(d => d.category === category.id);
    expect(drawings.length).toBe(10);
    expect(adjacentDrawing(drawings[0].id, -1)).toBeUndefined();
    expect(adjacentDrawing(drawings[drawings.length - 1].id, 1)).toBeUndefined();
  }
  expect(backRoute({ screen: 'settings' })).toEqual({ screen: 'home' });
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
  const dialog = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  const exitApp = jest.spyOn(BackHandler, 'exitApp').mockImplementation(() => {});
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
    await press('settings-open');
    expect(control('sound-toggle').props.accessibilityState.checked).toBe(true);
    await press('sound-toggle');
    expect(control('sound-toggle').props.accessibilityState.checked).toBe(false);
    expect(
      renderer.root.findAll(node => node.props.testID === 'settings-privacy').length,
    ).toBeGreaterThan(0);
    await press('settings-back');
    await press('settings-open');
    expect(control('sound-toggle').props.accessibilityState.checked).toBe(false);
    await press('sound-toggle');
    await press('settings-back');
    await press('start-coloring');
    for (const category of ['animals', 'fruits', 'vehicles']) {
      await press(`category-${category}`);
      const drawing = catalog.find(item => item.category === category)!;
      await press(`drawing-${drawing.id}`);
      expect(control('drawing-next').props.disabled).not.toBe(true);
      if (category === 'animals') {
        for (const region of renderer.root
          .findAllByType(Path)
          .filter(node => node.props.testID?.startsWith('region-'))) {
          await ReactTestRenderer.act(() => region.props.onPress());
        }
      }
      if (category === 'animals') {
        expect(
          renderer.root.findAll(node => node.props.testID === 'completion-celebration').length,
        ).toBeGreaterThan(0);
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
    expect(
      renderer.root.findAll(node => node.props.testID === 'completion-celebration'),
    ).toHaveLength(0);
    expect(roof().props.fill).toBe('#F54536');
    await press('color-66BE96');
    await press('drawing-next');
    expect(roof().props.fill).toBe('#FFFFFF');
    await ReactTestRenderer.act(() => roof().props.onPress());
    expect(roof().props.fill).toBe('#66BE96');
    await press('drawing-previous');
    expect(roof().props.fill).toBe('#F54536');
    await press('action-undo');
    expect(roof().props.fill).toBe('#FFFFFF');
    await press('action-redo');
    expect(roof().props.fill).toBe('#F54536');
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
    let homeBack: boolean | null | undefined;
    await ReactTestRenderer.act(() => {
      homeBack = handlers[handlers.length - 1]();
    });
    expect(homeBack).toBe(true);
    expect(dialog).toHaveBeenCalledTimes(1);
    expect(dialog.mock.calls[0][0]).toBe('¿Quieres salir de Colorimbo?');
    const exitChoices = dialog.mock.calls[0][2]!;
    expect(exitChoices.find(choice => choice.text === 'Seguir coloreando')?.style).toBe('cancel');
    expect(exitApp).not.toHaveBeenCalled();
    await ReactTestRenderer.act(() => {
      exitChoices.find(choice => choice.text === 'Salir')!.onPress!();
    });
    expect(exitApp).toHaveBeenCalledTimes(1);
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
    back.mockRestore();
    dialog.mockRestore();
    exitApp.mockRestore();
  }
});

test('every catalog entry paints its own regions and can be completed independently', () => {
  expect(catalog).toHaveLength(40);
  for (const drawing of catalog) {
    const reduce = createColoringReducer(drawing.regionIds);
    let state = createInitialState();
    for (const region of drawing.regions) {
      state = reduce(state, { type: 'paint', regionId: region.id, color: '#EF6B6B' });
    }
    expect(getDrawingProgress(state.colors, drawing.regionIds).status).toBe('completed');
    expect(Object.keys(state.colors)).toHaveLength(drawing.regionIds.length);
    const undo = reduce(state, { type: 'undo' });
    expect(getDrawingProgress(undo.colors, drawing.regionIds).status).toBe('in-progress');
  }
});
