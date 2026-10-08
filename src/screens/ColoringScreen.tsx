import React, { useReducer, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FreeEntitlementManager } from '../access/EntitlementManager';
import { InteractiveDrawing } from '../coloring/InteractiveDrawing';
import {
  createColoringReducer,
  createInitialState,
  getDrawingProgress,
} from '../coloring/coloringReducer';
import { testDrawing } from '../content/testDrawing';
import { palette } from '../theme/palette';
import { theme } from '../theme/theme';

const reducer = createColoringReducer(testDrawing.regionIds);
const access = new FreeEntitlementManager();

export function ColoringScreen() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const [selectedColor, setSelectedColor] = useState<string>(palette[0].color);
  const { height } = useWindowDimensions();
  const compact = height < 420;
  const progress = getDrawingProgress(state.colors, testDrawing.regionIds);

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

  if (!access.canAccess(testDrawing)) {
    return null;
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.workspace}>
        <View style={styles.main}>
          <View style={styles.header}>
            <Text accessibilityRole="header" style={styles.title}>
              {testDrawing.name}
            </Text>
            <Text accessibilityLiveRegion="polite" style={styles.progress}>
              {progress.status === 'completed'
                ? '¡Lo lograste!'
                : `${progress.colored} / ${progress.total}`}
            </Text>
          </View>
          <View style={styles.canvas}>
            <InteractiveDrawing
              drawing={testDrawing}
              colors={state.colors}
              onPaint={regionId =>
                dispatch({ type: 'paint', regionId, color: selectedColor })
              }
            />
          </View>
          <View style={styles.toolbar}>
            <ToolButton
              label="Deshacer"
              symbol="↶"
              disabled={state.past.length === 0}
              onPress={() => dispatch({ type: 'undo' })}
            />
            <ToolButton
              label="Rehacer"
              symbol="↷"
              disabled={state.future.length === 0}
              onPress={() => dispatch({ type: 'redo' })}
            />
            <ToolButton
              label="Reiniciar"
              symbol="↺"
              disabled={progress.colored === 0}
              onPress={confirmReset}
            />
          </View>
        </View>

        <View style={[styles.sidebar, compact && styles.compactSidebar]}>
          <Text style={styles.paletteTitle}>Colores</Text>
          <ScrollView
            contentContainerStyle={styles.palette}
            showsVerticalScrollIndicator={false}
          >
            {palette.map(item => (
              <Pressable
                key={item.color}
                accessibilityRole="button"
                accessibilityLabel={`Elegir ${item.name}`}
                accessibilityState={{ selected: selectedColor === item.color }}
                onPress={() => setSelectedColor(item.color)}
                style={[
                  styles.swatch,
                  { backgroundColor: item.color },
                  selectedColor === item.color && styles.selectedSwatch,
                ]}
              >
                {selectedColor === item.color ? (
                  <Text style={styles.checkmark}>✓</Text>
                ) : null}
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}

type ToolButtonProps = {
  label: string;
  symbol: string;
  disabled: boolean;
  onPress: () => void;
};

function ToolButton({ label, symbol, disabled, onPress }: ToolButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={[styles.toolButton, disabled && styles.disabledButton]}
    >
      <Text style={styles.toolSymbol}>{symbol}</Text>
      <Text style={styles.toolLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  workspace: { flex: 1, flexDirection: 'row', padding: 12, gap: 12 },
  main: { flex: 1, minWidth: 0, gap: 8 },
  header: {
    minHeight: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  title: { fontSize: 22, fontWeight: '800', color: theme.text },
  progress: { fontSize: 16, fontWeight: '700', color: theme.accent },
  canvas: {
    flex: 1,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
    borderRadius: 24,
    overflow: 'hidden',
  },
  toolbar: { flexDirection: 'row', justifyContent: 'center', gap: 12 },
  toolButton: {
    minHeight: 48,
    minWidth: 84,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.border,
  },
  toolSymbol: { fontSize: 30, color: theme.text },
  toolLabel: { fontSize: 13, fontWeight: '600', color: theme.text },
  disabledButton: { opacity: 0.35 },
  sidebar: {
    width: 136,
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 12,
    gap: 12,
  },
  compactSidebar: { width: 124, padding: 8 },
  paletteTitle: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
    color: theme.text,
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
    paddingBottom: 8,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: theme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedSwatch: { borderWidth: 3, borderColor: theme.text },
  checkmark: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    textShadowColor: theme.text,
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
