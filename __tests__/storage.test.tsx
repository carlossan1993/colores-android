import React from 'react';
import { Alert } from 'react-native';
import { Path } from 'react-native-svg';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { getDrawingProgress } from '../src/coloring/coloringReducer';
import { ProgressStore } from '../src/storage/ProgressStore';
import { nativeStorage } from '../src/storage/nativeStorage';
import {
  decodeSnapshot,
  emptySnapshot,
  encodeSnapshot,
  restoreSessions,
  UnsupportedSchemaError,
} from '../src/storage/snapshot';

const disk = jest.mocked(nativeStorage);
const raw = (
  drawings = {},
  preferences = { selectedColor: '#66BE96', soundEnabled: false },
) => JSON.stringify({ schemaVersion: 1, drawings, preferences });

test('versioned snapshot restores exact colors and preferences, derives progress and excludes history', () => {
  const snapshot = decodeSnapshot(
    raw({
      house_001: { roof: '#66be96', wall: '#FFFFFF', bad: '#000000' },
      future_001: { face: '#62AFE2' },
    }),
  );
  const sessions = restoreSessions(snapshot);
  expect(sessions.house_001.colors).toEqual({ roof: '#66BE96' });
  expect(sessions.house_001.past).toEqual([]);
  expect(snapshot.preferences).toEqual({
    selectedColor: '#66BE96',
    soundEnabled: false,
  });
  expect(getDrawingProgress(sessions.house_001.colors, ['roof']).status).toBe(
    'completed',
  );
  const encoded = JSON.parse(
    encodeSnapshot(sessions, snapshot.preferences, snapshot),
  );
  expect(encoded.drawings.future_001).toEqual({ face: '#62AFE2' });
  expect(encoded.drawings.house_001).toEqual({ roof: '#66BE96' });
  expect(encoded).not.toHaveProperty('past');
  expect(encoded).not.toHaveProperty('completed');
});

test('missing data starts blank; malformed structures fail; unknown schema is preserved', () => {
  expect(decodeSnapshot(null)).toEqual(emptySnapshot());
  for (const invalid of ['broken', '[]', '{}', raw({ house_001: [] })]) {
    if (invalid === raw({ house_001: [] })) {
      expect(decodeSnapshot(invalid).drawings).toEqual({});
    } else {
      expect(() => decodeSnapshot(invalid)).toThrow();
    }
  }
  expect(() =>
    decodeSnapshot(
      JSON.stringify({ schemaVersion: 2, drawings: {}, preferences: {} }),
    ),
  ).toThrow(UnsupportedSchemaError);
  expect(
    decodeSnapshot(
      raw(
        { house_001: { roof: 'red', window_left: '#123' } },
        { selectedColor: 'bad', soundEnabled: false },
      ),
    ).preferences.selectedColor,
  ).toBe('#EF6B6B');
});

test('corrupt primary recovers backup; future versions and disk read failures do not become empty progress', async () => {
  disk.readSnapshot.mockResolvedValue('broken');
  disk.readBackup.mockResolvedValue(raw({ house_001: { roof: '#66BE96' } }));
  const store = new ProgressStore(nativeStorage);
  expect((await store.load()).drawings.house_001.roof).toBe('#66BE96');
  disk.readSnapshot.mockResolvedValue('{"schemaVersion":2}');
  await expect(store.load()).rejects.toThrow(UnsupportedSchemaError);
  disk.readSnapshot.mockRejectedValue(new Error('disk failure'));
  await expect(store.load()).rejects.toThrow('disk failure');
  expect(disk.writeSnapshot).not.toHaveBeenCalled();
});

test('rapid saves serialize, so an old write cannot overwrite the newest one', async () => {
  let finish!: () => void;
  disk.writeSnapshot.mockImplementationOnce(
    () =>
      new Promise<void>(resolve => {
        finish = resolve;
      }),
  );
  const store = new ProgressStore(nativeStorage);
  const a = store.save('first');
  const b = store.save('second');
  const c = store.save('last');
  await Promise.resolve();
  await Promise.resolve();
  expect(disk.writeSnapshot.mock.calls.map(call => call[0])).toEqual(['first']);
  finish();
  await Promise.all([a, b, c]);
  expect(disk.writeSnapshot.mock.calls.map(call => call[0])).toEqual([
    'first',
    'second',
    'last',
  ]);
  await store.save('last');
  expect(disk.writeSnapshot).toHaveBeenCalledTimes(3);
});

test('failed write retains the latest snapshot and retries successfully', async () => {
  disk.writeSnapshot.mockRejectedValueOnce(new Error('full disk'));
  const store = new ProgressStore(nativeStorage);
  await expect(store.save('latest')).rejects.toThrow('full disk');
  await store.retry();
  expect(disk.writeSnapshot.mock.calls.map(call => call[0])).toEqual([
    'latest',
    'latest',
  ]);
});

const control = (renderer: ReactTestRenderer.ReactTestRenderer, id: string) =>
  renderer.root.findAll(
    node =>
      node.props.testID === id &&
      (typeof node.props.onPress === 'function' ||
        typeof node.props.disabled === 'boolean'),
  )[0];
const press = async (
  renderer: ReactTestRenderer.ReactTestRenderer,
  id: string,
) => {
  await ReactTestRenderer.act(() => control(renderer, id).props.onPress());
};
const roof = (renderer: ReactTestRenderer.ReactTestRenderer) =>
  renderer.root
    .findAllByType(Path)
    .find(node => node.props.testID === 'region-roof')!;
async function openHouse(renderer: ReactTestRenderer.ReactTestRenderer) {
  await press(renderer, 'start-coloring');
  await press(renderer, 'category-places');
  await press(renderer, 'drawing-house_001');
}

test('App restart restores separate drawings, selected color and persisted reset', async () => {
  let stored: string | null = null;
  disk.readSnapshot.mockImplementation(async () => stored);
  disk.writeSnapshot.mockImplementation(async value => {
    stored = value;
  });
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  const alert = jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    await openHouse(renderer);
    await ReactTestRenderer.act(() => roof(renderer).props.onPress());
    await press(renderer, 'drawing-next');
    await press(renderer, 'color-66BE96');
    await ReactTestRenderer.act(() => roof(renderer).props.onPress());
    await ReactTestRenderer.act(() => renderer.unmount());
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    await openHouse(renderer);
    expect(roof(renderer).props.fill).toBe('#EF6B6B');
    expect(control(renderer, 'action-undo').props.disabled).toBe(true);
    expect(
      control(renderer, 'color-66BE96').props.accessibilityState.selected,
    ).toBe(true);
    await press(renderer, 'drawing-next');
    expect(roof(renderer).props.fill).toBe('#66BE96');
    await press(renderer, 'action-reset');
    const erase = alert.mock.calls[0][2]!.find(
      choice => choice.text === 'Borrar',
    )!;
    await ReactTestRenderer.act(() => erase.onPress!());
    await ReactTestRenderer.act(() => renderer.unmount());
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    await openHouse(renderer);
    await press(renderer, 'drawing-next');
    expect(roof(renderer).props.fill).toBe('#FFFFFF');
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
    alert.mockRestore();
  }
});

test('restoration gates interaction and never writes a blank snapshot while reading', async () => {
  let finish!: (value: string) => void;
  disk.readSnapshot.mockImplementationOnce(
    () =>
      new Promise<string>(resolve => {
        finish = resolve;
      }),
  );
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    expect(control(renderer, 'start-coloring')).toBeUndefined();
    expect(disk.writeSnapshot).not.toHaveBeenCalled();
    await ReactTestRenderer.act(() =>
      finish(raw({ house_001: { roof: '#62AFE2' } })),
    );
    await openHouse(renderer);
    expect(roof(renderer).props.fill).toBe('#62AFE2');
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
  }
});

test('read failure blocks overwriting existing data and offers retry; save failure keeps painting and offers retry', async () => {
  disk.readSnapshot.mockRejectedValueOnce(new Error('read failed'));
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  try {
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });
    expect(control(renderer, 'start-coloring')).toBeUndefined();
    expect(disk.writeSnapshot).not.toHaveBeenCalled();
    await press(renderer, 'retry-load');
    await openHouse(renderer);
    disk.writeSnapshot.mockRejectedValueOnce(new Error('full disk'));
    await ReactTestRenderer.act(() => roof(renderer).props.onPress());
    expect(roof(renderer).props.fill).toBe('#EF6B6B');
    expect(control(renderer, 'retry-save')).toBeDefined();
    await press(renderer, 'retry-save');
    expect(control(renderer, 'retry-save')).toBeUndefined();
    expect(
      JSON.parse(
        disk.writeSnapshot.mock.calls[
          disk.writeSnapshot.mock.calls.length - 1
        ][0],
      ).drawings.house_001.roof,
    ).toBe('#EF6B6B');
  } finally {
    if (renderer) {
      await ReactTestRenderer.act(() => renderer.unmount());
    }
  }
});
