import { catalog, categories } from '../src/content/catalog';
import { createColoringReducer, createInitialState, getDrawingProgress, HISTORY_LIMIT } from '../src/coloring/coloringReducer';
import { sessionReducer } from '../src/coloring/sessionReducer';
import type { Sessions } from '../src/coloring/sessionReducer';
import { decodeSnapshot, emptySnapshot, encodeSnapshot, restoreSessions, SCHEMA_VERSION } from '../src/storage/snapshot';

const colors = ['#EF6B6B', '#66BE96', '#62AFE2', '#343A46'] as const;

test('QA: all 40 drawings and preferences survive a complete offline save and reload', () => {
  expect(catalog).toHaveLength(40);
  expect(categories).toHaveLength(4);
  for (const category of categories) {
    expect(catalog.filter(drawing => drawing.category === category.id)).toHaveLength(10);
  }

  let sessions: Sessions = {};
  for (const drawing of catalog) {
    for (let index = 0; index < drawing.regionIds.length; index++) {
      sessions = sessionReducer(sessions, {
        drawingId: drawing.id,
        action: {
          type: 'paint',
          regionId: drawing.regionIds[index],
          color: colors[index % colors.length],
        },
      });
    }
    expect(getDrawingProgress(sessions[drawing.id].colors, drawing.regionIds).status).toBe('completed');
  }

  const preferences = { selectedColor: '#0A35F5', soundEnabled: false };
  const serialized = encodeSnapshot(sessions, preferences, emptySnapshot());
  // Android's native progress module rejects snapshots larger than 256 KiB.
  expect(serialized.length).toBeLessThan(262144);
  const restoredSnapshot = decodeSnapshot(serialized);
  expect(restoredSnapshot.schemaVersion).toBe(SCHEMA_VERSION);
  expect(restoredSnapshot.preferences).toEqual(preferences);

  const restored = restoreSessions(restoredSnapshot);
  expect(Object.keys(restored)).toHaveLength(40);
  for (const drawing of catalog) {
    expect(restored[drawing.id].colors).toEqual(sessions[drawing.id].colors);
    expect(getDrawingProgress(restored[drawing.id].colors, drawing.regionIds).status).toBe('completed');
    expect(restored[drawing.id].past).toHaveLength(0);
    expect(restored[drawing.id].future).toHaveLength(0);
  }
});

test('QA: erasing and resetting one drawing does not erase other drawings after restart', () => {
  const first = catalog[0];
  const second = catalog.find(drawing => drawing.category !== first.category)!;
  let sessions: Sessions = {};
  sessions = sessionReducer(sessions, {
    drawingId: first.id,
    action: { type: 'paint', regionId: first.regionIds[0], color: '#66BE96' },
  });
  sessions = sessionReducer(sessions, {
    drawingId: second.id,
    action: { type: 'paint', regionId: second.regionIds[0], color: '#62AFE2' },
  });
  sessions = sessionReducer(sessions, {
    drawingId: first.id,
    action: { type: 'reset' },
  });
  const stored = decodeSnapshot(encodeSnapshot(sessions, emptySnapshot().preferences, emptySnapshot()));
  const restored = restoreSessions(stored);
  expect(restored[first.id].colors).toEqual({});
  expect(restored[second.id].colors).toEqual({ [second.regionIds[0]]: '#62AFE2' });
  expect(getDrawingProgress(restored[first.id].colors, first.regionIds).status).toBe('not-started');
  expect(getDrawingProgress(restored[second.id].colors, second.regionIds).status).toBe('in-progress');
});

test('QA: rapid color changes remain deterministic and only the latest state is persisted', () => {
  const drawing = catalog.find(item => item.regionIds.length >= 3)!;
  const reduce = createColoringReducer(drawing.regionIds);
  let state = createInitialState();
  for (let index = 0; index < 300; index++) {
    state = reduce(state, {
      type: 'paint',
      regionId: drawing.regionIds[index % 3],
      color: colors[index % colors.length],
    });
  }
  expect(state.past.length).toBeLessThanOrEqual(HISTORY_LIMIT);
  const latest = { ...state.colors };
  const stored = decodeSnapshot(
    encodeSnapshot({ [drawing.id]: state }, { selectedColor: '#EF6B6B', soundEnabled: true }, emptySnapshot()),
  );
  expect(restoreSessions(stored)[drawing.id].colors).toEqual(latest);
  expect(restoreSessions(stored)[drawing.id].past).toHaveLength(0);
  expect(restoreSessions(stored)[drawing.id].future).toHaveLength(0);
});

test('QA: an unknown drawing or region never modifies persisted progress', () => {
  const drawing = catalog[0];
  const starting = sessionReducer({}, {
    drawingId: drawing.id,
    action: { type: 'paint', regionId: drawing.regionIds[0], color: '#66BE96' },
  });
  const unknownDrawing = sessionReducer(starting, {
    drawingId: 'unknown_drawing',
    action: { type: 'paint', regionId: 'region', color: '#EF6B6B' },
  });
  const unknownRegion = sessionReducer(unknownDrawing, {
    drawingId: drawing.id,
    action: { type: 'paint', regionId: 'unknown_region', color: '#EF6B6B' },
  });
  expect(unknownDrawing).toBe(starting);
  expect(unknownRegion).toBe(starting);
  const restored = restoreSessions(
    decodeSnapshot(encodeSnapshot(unknownRegion, emptySnapshot().preferences, emptySnapshot())),
  );
  expect(Object.keys(restored)).toEqual([drawing.id]);
  expect(restored[drawing.id].colors).toEqual({ [drawing.regionIds[0]]: '#66BE96' });
});
