import React from 'react';
import Svg, { Path } from 'react-native-svg';
import type { DrawingDefinition } from '../content/types';
import type { RegionColors } from '../coloring/coloringReducer';
import { palette } from '../theme/palette';

type Props = {
  drawing: DrawingDefinition;
  colors?: RegionColors;
  colorful?: boolean;
};
export function DrawingPreview({
  drawing,
  colors = {},
  colorful = false,
}: Props) {
  return (
    <Svg
      width="100%"
      height="100%"
      viewBox={drawing.viewBox}
      accessible={false}
    >
      {drawing.regions.map((region, index) => (
        <Path
          key={region.id}
          d={region.path}
          fill={
            colors[region.id] ??
            (colorful ? palette[index % (palette.length - 1)].color : '#FFFFFF')
          }
          stroke="#202020"
          strokeWidth={6}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
    </Svg>
  );
}
