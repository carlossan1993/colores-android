import type { RegionColors } from '../coloring/coloringReducer';
import { catalog } from '../content/catalog';
import type { Sessions } from '../coloring/sessionReducer';
import { palette } from '../theme/palette';

export const SCHEMA_VERSION = 1;
export type Preferences = { selectedColor: string; soundEnabled: boolean };
export type Snapshot = {
  schemaVersion: 1;
  drawings: Record<string, RegionColors>;
  preferences: Preferences;
};
export class UnsupportedSchemaError extends Error {}
const object = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

export function emptySnapshot(): Snapshot {
  return {
    schemaVersion: SCHEMA_VERSION,
    drawings: {},
    preferences: { selectedColor: palette[0].color, soundEnabled: true },
  };
}

export function decodeSnapshot(raw: string | null): Snapshot {
  if (raw === null) {
    return emptySnapshot();
  }
  if (raw.length > 262144) {
    throw new Error('Snapshot too large');
  }
  const value: unknown = JSON.parse(raw);
  if (!object(value)) {
    throw new Error('Invalid snapshot');
  }
  if (
    typeof value.schemaVersion === 'number' &&
    value.schemaVersion !== SCHEMA_VERSION
  ) {
    throw new UnsupportedSchemaError('Unsupported progress schema');
  }
  if (
    value.schemaVersion !== SCHEMA_VERSION ||
    !object(value.drawings) ||
    !object(value.preferences)
  ) {
    throw new Error('Invalid snapshot structure');
  }
  const snapshot = emptySnapshot();
  for (const [id, regions] of Object.entries(value.drawings)) {
    if (!/^[a-z][a-z0-9_]*$/.test(id) || !object(regions)) {
      continue;
    }
    const known = catalog.find(drawing => drawing.id === id);
    const colors: Record<string, string> = {};
    for (const [region, color] of Object.entries(regions)) {
      if (
        /^[a-z][a-z0-9_]*$/.test(region) &&
        typeof color === 'string' &&
        /^#[0-9a-f]{6}$/i.test(color) &&
        (!known || known.regionIds.includes(region)) &&
        color.toUpperCase() !== '#FFFFFF'
      ) {
        colors[region] = color.toUpperCase();
      }
    }
    snapshot.drawings[id] = colors;
  }
  const color = value.preferences.selectedColor;
  if (
    typeof color === 'string' &&
    palette.some(item => item.color === color.toUpperCase())
  ) {
    snapshot.preferences.selectedColor = color.toUpperCase();
  }
  if (typeof value.preferences.soundEnabled === 'boolean') {
    snapshot.preferences.soundEnabled = value.preferences.soundEnabled;
  }
  return snapshot;
}

export function restoreSessions(snapshot: Snapshot): Sessions {
  return Object.fromEntries(
    catalog
      .filter(drawing => snapshot.drawings[drawing.id])
      .map(drawing => [
        drawing.id,
        { colors: snapshot.drawings[drawing.id], past: [], future: [] },
      ]),
  );
}

export function encodeSnapshot(
  sessions: Sessions,
  preferences: Preferences,
  base: Snapshot,
): string {
  const drawings = { ...base.drawings };
  for (const [id, session] of Object.entries(sessions)) {
    drawings[id] = session.colors;
  }
  // History, screenshots and the derived completed flag are not persisted.
  return JSON.stringify({
    schemaVersion: SCHEMA_VERSION,
    drawings,
    preferences,
  });
}
