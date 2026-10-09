export const UNPAINTED_COLOR = '#FFFFFF';
export const HISTORY_LIMIT = 50;

export type RegionColors = Readonly<Record<string, string>>;
export type ColoringState = {
  colors: RegionColors;
  past: readonly RegionColors[];
  future: readonly RegionColors[];
};
export type ColoringAction =
  | { type: 'paint'; regionId: string; color: string }
  | { type: 'undo' }
  | { type: 'redo' }
  | { type: 'reset' };

export function createInitialState(): ColoringState {
  return { colors: {}, past: [], future: [] };
}

function recordChange(
  state: ColoringState,
  colors: RegionColors,
): ColoringState {
  return {
    colors,
    past: [...state.past, state.colors].slice(-HISTORY_LIMIT),
    future: [],
  };
}

export function createColoringReducer(regionIds: readonly string[]) {
  const validRegions = new Set(regionIds);
  if (
    validRegions.size === 0 ||
    validRegions.size !== regionIds.length ||
    regionIds.some(id => !id.trim())
  ) {
    throw new Error('A drawing needs unique, nonempty region IDs');
  }

  return (state: ColoringState, action: ColoringAction): ColoringState => {
    switch (action.type) {
      case 'paint': {
        if (
          !validRegions.has(action.regionId) ||
          !/^#[0-9a-f]{6}$/i.test(action.color)
        ) {
          return state;
        }
        const color = action.color.toUpperCase();
        if ((state.colors[action.regionId] ?? UNPAINTED_COLOR) === color) {
          return state;
        }
        const colors = { ...state.colors };
        if (color === UNPAINTED_COLOR) {
          delete colors[action.regionId];
        } else {
          colors[action.regionId] = color;
        }
        return recordChange(state, colors);
      }
      case 'undo': {
        const previous = state.past[state.past.length - 1];
        if (!previous) {
          return state;
        }
        return {
          colors: previous,
          past: state.past.slice(0, -1),
          future: [state.colors, ...state.future].slice(0, HISTORY_LIMIT),
        };
      }
      case 'redo': {
        const next = state.future[0];
        if (!next) {
          return state;
        }
        return {
          colors: next,
          past: [...state.past, state.colors].slice(-HISTORY_LIMIT),
          future: state.future.slice(1),
        };
      }
      case 'reset':
        return Object.keys(state.colors).length
          ? recordChange(state, {})
          : state;
    }
  };
}

export function getDrawingProgress(
  colors: RegionColors,
  regionIds: readonly string[],
) {
  const total = regionIds.length;
  const colored = regionIds.filter(
    id => colors[id] && colors[id] !== UNPAINTED_COLOR,
  ).length;
  const status: 'not-started' | 'in-progress' | 'completed' =
    colored === 0
      ? 'not-started'
      : colored === total
      ? 'completed'
      : 'in-progress';
  return { colored, total, status };
}
