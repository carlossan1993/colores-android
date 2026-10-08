import {
  createColoringReducer,
  createInitialState,
  getDrawingProgress,
  HISTORY_LIMIT,
} from '../src/coloring/coloringReducer';

const regionIds = ['roof', 'wall', 'door'];
const reduce = createColoringReducer(regionIds);
const paint = (regionId: string, color = '#EF6B6B') => ({
  type: 'paint' as const,
  regionId,
  color,
});

test('painting and repainting affect only the touched region without mutating prior state', () => {
  const initial = createInitialState();
  const first = reduce(initial, paint('roof'));
  const second = reduce(first, paint('wall', '#66BE96'));
  const third = reduce(second, paint('roof', '#62AFE2'));
  expect(initial.colors).toEqual({});
  expect(first.colors).toEqual({ roof: '#EF6B6B' });
  expect(second.colors).toEqual({ roof: '#EF6B6B', wall: '#66BE96' });
  expect(third.colors).toEqual({ roof: '#62AFE2', wall: '#66BE96' });
});

test('undo and redo restore exact states; a new stroke discards the redo branch', () => {
  const first = reduce(createInitialState(), paint('roof'));
  const second = reduce(first, paint('wall'));
  const undone = reduce(second, { type: 'undo' });
  expect(undone.colors).toEqual(first.colors);
  expect(reduce(undone, { type: 'redo' }).colors).toEqual(second.colors);
  const diverged = reduce(undone, paint('door'));
  expect(diverged.future).toEqual([]);
  expect(reduce(diverged, { type: 'redo' })).toBe(diverged);
});

test('no-op paint preserves redo; invalid IDs and colors cannot modify a drawing', () => {
  const state = reduce(createInitialState(), paint('roof'));
  const withRedo = reduce(reduce(state, paint('wall')), { type: 'undo' });
  expect(reduce(withRedo, paint('roof'))).toBe(withRedo);
  expect(reduce(withRedo, paint('unknown'))).toBe(withRedo);
  expect(reduce(withRedo, paint('wall', 'invalid'))).toBe(withRedo);
  expect(withRedo.future).toHaveLength(1);
});

test('reset is one reversible action and resetting an empty drawing is a no-op', () => {
  const initial = createInitialState();
  expect(reduce(initial, { type: 'reset' })).toBe(initial);
  const painted = reduce(reduce(initial, paint('roof')), paint('wall'));
  const reset = reduce(painted, { type: 'reset' });
  expect(reset.colors).toEqual({});
  expect(reduce(reset, { type: 'undo' }).colors).toEqual(painted.colors);
});

test('white erases a region and completion depends on all declared regions', () => {
  let state = createInitialState();
  expect(getDrawingProgress(state.colors, regionIds).status).toBe(
    'not-started',
  );
  state = reduce(state, paint('roof'));
  expect(getDrawingProgress(state.colors, regionIds)).toEqual({
    colored: 1,
    total: 3,
    status: 'in-progress',
  });
  state = reduce(reduce(state, paint('wall')), paint('door'));
  expect(getDrawingProgress(state.colors, regionIds).status).toBe('completed');
  state = reduce(state, paint('door', '#ffffff'));
  expect(state.colors.door).toBeUndefined();
  expect(getDrawingProgress(state.colors, regionIds).status).toBe(
    'in-progress',
  );
  expect(
    getDrawingProgress({ ...state.colors, unknown: '#000000' }, regionIds)
      .colored,
  ).toBe(2);
});

test('rapid painting stays deterministic and keeps a bounded undo history', () => {
  let state = createInitialState();
  for (let i = 0; i < 120; i++) {
    state = reduce(state, paint('roof', i % 2 === 0 ? '#EF6B6B' : '#62AFE2'));
  }
  expect(state.colors.roof).toBe('#62AFE2');
  expect(state.past).toHaveLength(HISTORY_LIMIT);
  for (let i = 0; i < HISTORY_LIMIT; i++) {
    state = reduce(state, { type: 'undo' });
  }
  expect(state.past).toHaveLength(0);
  expect(state.future).toHaveLength(HISTORY_LIMIT);
  expect(reduce(state, { type: 'undo' })).toBe(state);
});

test('rejects drawings with empty or duplicate IDs', () => {
  expect(() => createColoringReducer([])).toThrow();
  expect(() => createColoringReducer(['roof', 'roof'])).toThrow();
  expect(() => createColoringReducer([''])).toThrow();
});
