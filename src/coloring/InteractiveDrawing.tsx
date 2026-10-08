import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { DrawingDefinition } from '../content/types';
import type { RegionColors } from './coloringReducer';
import { UNPAINTED_COLOR } from './coloringReducer';

type Props = {
  drawing: DrawingDefinition;
  colors: RegionColors;
  onPaint: (regionId: string) => void;
};

export function InteractiveDrawing({ drawing, colors, onPaint }: Props) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={drawing.viewBox}
      preserveAspectRatio="xMidYMid meet"
    >
      {drawing.regions.map(region => (
        <Path
          key={region.id}
          id={region.id}
          testID={`region-${region.id}`}
          accessible
          accessibilityLabel={`Colorear ${region.name.toLowerCase()}`}
          d={region.path}
          fill={colors[region.id] ?? UNPAINTED_COLOR}
          stroke="#202020"
          strokeWidth={6}
          strokeLinejoin="round"
          strokeLinecap="round"
          onPress={() => onPaint(region.id)}
        />
      ))}
    </Svg>
  );
}
