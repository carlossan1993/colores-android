import { catalog } from '../content/catalog';
import { createColoringReducer, createInitialState } from './coloringReducer';
import type { ColoringAction, ColoringState } from './coloringReducer';

export type Sessions = Readonly<Record<string, ColoringState>>;
const reducers = new Map(
  catalog.map(drawing => [
    drawing.id,
    createColoringReducer(drawing.regionIds),
  ]),
);

// Memory only in stage 4. Durable, versioned storage belongs to stage 5.
export function sessionReducer(
  sessions: Sessions,
  action: { drawingId: string; action: ColoringAction },
): Sessions {
  const reducer = reducers.get(action.drawingId);
  if (!reducer) {
    return sessions;
  }
  const previous = sessions[action.drawingId] ?? createInitialState();
  const next = reducer(previous, action.action);
  return next === previous
    ? sessions
    : { ...sessions, [action.drawingId]: next };
}
