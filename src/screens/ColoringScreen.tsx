import React, { useMemo, useReducer, useState } from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { FreeEntitlementManager } from '../access/EntitlementManager';
import { InteractiveDrawing } from '../coloring/InteractiveDrawing';
import {
  createColoringReducer,
  createInitialState,
  getDrawingProgress,
} from '../coloring/coloringReducer';
import type {
  ColoringAction,
  ColoringState,
} from '../coloring/coloringReducer';
import type { DrawingDefinition } from '../content/types';
import { NavigationButton } from '../components/NavigationButton';
import { ColorPalette } from '../components/ColorPalette';
import { ColoringTools } from '../components/ColoringTools';
import { testDrawing } from '../content/testDrawing';
import { getColoringLayout } from '../layout/coloringLayout';
import { palette } from '../theme/palette';
import { theme } from '../theme/theme';
import type { SaveStatus } from '../storage/useProgress';

const access = new FreeEntitlementManager();

type Props = {
  drawing?: DrawingDefinition;
  state?: ColoringState;
  onAction?: (action: ColoringAction) => void;
  selectedColor?: string;
  onSelectColor?: (color: string) => void;
  onBack?: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  position?: string;
  saveStatus?: SaveStatus;
};

export function ColoringScreen({
  drawing = testDrawing,
  state: suppliedState,
  onAction,
  selectedColor: suppliedColor,
  onSelectColor,
  onBack,
  onPrevious,
  onNext,
  position,
  saveStatus,
}: Props) {
  const reducer = useMemo(
    () => createColoringReducer(drawing.regionIds),
    [drawing],
  );
  const [localState, localDispatch] = useReducer(
    reducer,
    undefined,
    createInitialState,
  );
  const state = suppliedState ?? localState;
  const dispatch = onAction ?? localDispatch;
  const [localColor, setLocalColor] = useState<string>(palette[0].color);
  const selectedColor = suppliedColor ?? localColor;
  const setSelectedColor = onSelectColor ?? setLocalColor;
  const window = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const layout = getColoringLayout(
    window.width - insets.left - insets.right,
    window.height - insets.top - insets.bottom,
  );
  const progress = getDrawingProgress(state.colors, drawing.regionIds);

  const confirmReset = () => {
    Alert.alert(
      '¿Empezamos de nuevo?',
      'Se borrarán los colores de este dibujo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Borrar',
          style: 'destructive',
          onPress: () => dispatch({ type: 'reset' }),
        },
      ],
    );
  };

  if (!access.canAccess(drawing)) {
    return null;
  }

  const tools = (
    <ColoringTools
      layout={layout}
      canUndo={state.past.length > 0}
      canRedo={state.future.length > 0}
      canReset={progress.colored > 0}
      onUndo={() => dispatch({ type: 'undo' })}
      onRedo={() => dispatch({ type: 'redo' })}
      onReset={confirmReset}
    />
  );
  const colors = (
    <ColorPalette
      layout={layout}
      selectedColor={selectedColor}
      onSelect={setSelectedColor}
    />
  );
  const heading = (
    <View style={styles.heading}>
      {onBack ? (
        <NavigationButton
          direction="back"
          testID="coloring-back"
          label="Volver a la galería"
          onPress={onBack}
        />
      ) : null}
      <Text
        accessibilityRole="header"
        numberOfLines={1}
        maxFontSizeMultiplier={1.3}
        style={[styles.title, layout.tablet && styles.tabletTitle]}
      >
        {drawing.name}
      </Text>
      <View
        style={[
          styles.progressBadge,
          progress.status === 'completed' && styles.completed,
        ]}
      >
        <Text
          testID="drawing-progress"
          accessibilityLiveRegion="polite"
          accessibilityLabel={`${progress.colored} de ${progress.total} zonas coloreadas`}
          maxFontSizeMultiplier={1.3}
          style={styles.progress}
        >
          {progress.status === 'completed'
            ? '¡Lo lograste!'
            : `${progress.colored} / ${progress.total}`}
        </Text>
        {saveStatus ? (
          <Text
            testID="storage-status"
            accessibilityLiveRegion="polite"
            style={styles.saveStatus}
          >
            {saveStatus === 'saved'
              ? 'Guardado'
              : saveStatus === 'saving'
              ? 'Guardando…'
              : 'Sin guardar'}
          </Text>
        ) : null}
      </View>
    </View>
  );

  const drawingNavigation = onBack ? (
    <View style={styles.drawingNavigation}>
      <NavigationButton
        direction="back"
        testID="drawing-previous"
        label="Dibujo anterior"
        onPress={onPrevious}
      />
      <Text testID="drawing-position" style={styles.progress}>
        {position}
      </Text>
      <NavigationButton
        direction="next"
        testID="drawing-next"
        label="Dibujo siguiente"
        onPress={onNext}
      />
    </View>
  ) : null;

  return (
    <SafeAreaView style={styles.screen}>
      <View
        testID={layout.bottomPalette ? 'layout-bottom' : 'layout-sidebar'}
        style={[
          styles.workspace,
          { padding: layout.outerPadding, gap: layout.sectionGap },
          layout.bottomPalette && styles.bottomWorkspace,
        ]}
      >
        <View style={[styles.main, { gap: layout.sectionGap }]}>
          <View
            style={[
              styles.header,
              layout.stackedHeader && styles.stackedHeader,
            ]}
          >
            {heading}
            {layout.bottomPalette ? (
              <View style={styles.compactTools}>
                {tools}
                {drawingNavigation}
              </View>
            ) : null}
          </View>
          <View
            testID="drawing-canvas"
            collapsable={false}
            style={styles.canvas}
          >
            <InteractiveDrawing
              drawing={drawing}
              colors={state.colors}
              onPaint={regionId =>
                dispatch({ type: 'paint', regionId, color: selectedColor })
              }
            />
          </View>
          {!layout.bottomPalette ? drawingNavigation : null}
        </View>
        {layout.bottomPalette ? (
          <View style={[styles.bottomPalette, { height: layout.cellSize + 8 }]}>
            {colors}
          </View>
        ) : (
          <View
            style={[
              styles.sidebar,
              {
                width: layout.panelWidth,
                padding: layout.panelPadding,
                gap: layout.sectionGap,
              },
            ]}
          >
            <View style={styles.paletteHeading}>
              <View
                style={[
                  styles.selectedColor,
                  { backgroundColor: selectedColor },
                ]}
              />
              <Text maxFontSizeMultiplier={1.2} style={styles.paletteTitle}>
                Colores
              </Text>
            </View>
            {colors}
            {tools}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  compactTools: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  drawingNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  screen: { flex: 1, backgroundColor: theme.background },
  workspace: { flex: 1, flexDirection: 'row' },
  bottomWorkspace: { flexDirection: 'column' },
  main: { flex: 1, minWidth: 0, minHeight: 0 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, minHeight: 32 },
  stackedHeader: { flexDirection: 'column', alignItems: 'stretch' },
  heading: {
    minHeight: 32,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  title: { flexShrink: 1, fontSize: 18, fontWeight: '800', color: theme.text },
  tabletTitle: { fontSize: 26 },
  saveStatus: { fontSize: 10, color: theme.muted, textAlign: 'center' },
  progressBadge: {
    backgroundColor: '#F0EBFC',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  completed: { backgroundColor: '#E1F4E9' },
  progress: { fontSize: 13, fontWeight: '700', color: theme.text },
  canvas: {
    flex: 1,
    minHeight: 0,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 24,
    overflow: 'hidden',
  },
  sidebar: { backgroundColor: theme.surface, borderRadius: 24 },
  paletteHeading: {
    height: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  selectedColor: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.text,
  },
  paletteTitle: { fontSize: 16, fontWeight: '700', color: theme.text },
  bottomPalette: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
