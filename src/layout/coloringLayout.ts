// Sizes are dp. Safe-area insets are deducted before calling this function.
export function getColoringLayout(width: number, height: number) {
  const tablet = width >= 960 && height >= 560;
  const bottomPalette = width < 560 || height < 340;
  const cellSize = tablet ? 64 : 48;
  const cellGap = tablet ? 10 : 6;
  const panelPadding = tablet ? 16 : 8;
  return {
    tablet,
    bottomPalette,
    stackedHeader: bottomPalette && width < 520,
    cellSize,
    cellGap,
    panelPadding,
    panelWidth: cellSize * 3 + cellGap * 2 + panelPadding * 2,
    outerPadding: tablet ? 12 : 8,
    sectionGap: tablet ? 12 : 8,
  };
}

export type ColoringLayout = ReturnType<typeof getColoringLayout>;
