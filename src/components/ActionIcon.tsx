import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

export type ActionName = 'undo' | 'redo' | 'reset' | 'erase' | 'check';

type Props = { name: ActionName; color: string; size?: number };

export function ActionIcon({ name, color, size = 28 }: Props) {
  const paths: Record<ActionName, string> = {
    undo: 'M 11 6 L 5 12 L 11 18 M 5 12 H 19 C 25 12 28 16 28 22',
    redo: 'M 21 6 L 27 12 L 21 18 M 27 12 H 13 C 7 12 4 16 4 22',
    reset: 'M 25 9 A 11 11 0 1 0 27 20 M 25 3 V 10 H 18',
    erase:
      'M 5 18 L 17 5 Q 19 3 21 5 L 28 12 Q 30 14 28 16 L 16 29 H 11 Z M 10 13 L 23 24 M 16 29 H 29',
    check: 'M 7 16 L 13 22 L 25 10',
  };
  return (
    <Svg width={size} height={size} viewBox="0 0 32 32" accessible={false}>
      {name === 'check' ? (
        <Circle cx={16} cy={16} r={15} fill="#FFFFFF" />
      ) : null}
      <Path
        d={paths[name]}
        fill="none"
        stroke={color}
        strokeWidth={2.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
