import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FreeEntitlementManager } from '../access/EntitlementManager';
import { createInitialState } from '../coloring/coloringReducer';
import { useProgress } from '../storage/useProgress';
import { theme } from '../theme/theme';
import { catalog } from '../content/catalog';
import {
  adjacentDrawing,
  backRoute,
  drawingsFor,
} from '../navigation/navigation';
import type { Route } from '../navigation/navigation';
import { BrowseScreen, HomeScreen } from '../screens/BrowseScreens';
import { ColoringScreen } from '../screens/ColoringScreen';

const access = new FreeEntitlementManager();
export default function App() {
  const [route, setRoute] = useState<Route>({ screen: 'home' });
  const progress = useProgress();
  const { sessions, preferences, saveStatus } = progress;
  const selectedColor = preferences.selectedColor;
  const goBack = () => setRoute(backRoute(route));
  const openDrawing = (drawingId: string) => {
    const drawing = catalog.find(item => item.id === drawingId);
    if (drawing && access.canAccess(drawing)) {
      setRoute({ screen: 'coloring', drawingId });
    }
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (route.screen === 'home') {
          return false;
        }
        setRoute(backRoute(route));
        return true;
      },
    );
    return () => subscription.remove();
  }, [route]);

  if (progress.loadState !== 'ready') {
    return (
      <SafeAreaProvider>
        <StatusBar hidden />
        <View style={styles.loading}>
          {progress.loadState === 'loading' ? (
            <ActivityIndicator size="large" color={theme.accent} />
          ) : null}
          <Text style={styles.message}>
            {progress.loadState === 'loading'
              ? 'Abriendo tus dibujos…'
              : progress.loadState === 'unsupported'
              ? 'Actualiza la app para abrir tus dibujos.'
              : 'No pudimos abrir tus dibujos. Tu progreso se conserva.'}
          </Text>
          {progress.loadState !== 'loading' ? (
            <Pressable
              testID="retry-load"
              accessibilityRole="button"
              onPress={progress.retryLoad}
              style={styles.retry}
            >
              <Text style={styles.retryText}>Reintentar</Text>
            </Pressable>
          ) : null}
        </View>
      </SafeAreaProvider>
    );
  }

  let screen: React.ReactNode;
  if (route.screen === 'home') {
    screen = <HomeScreen onStart={() => setRoute({ screen: 'categories' })} />;
  } else if (route.screen === 'coloring') {
    const drawing = catalog.find(item => item.id === route.drawingId)!;
    const drawings = drawingsFor(drawing.category);
    const previous = adjacentDrawing(drawing.id, -1);
    const next = adjacentDrawing(drawing.id, 1);
    screen = (
      <ColoringScreen
        key={drawing.id}
        drawing={drawing}
        state={sessions[drawing.id] ?? createInitialState()}
        onAction={action =>
          action.type === 'paint'
            ? progress.paintRegion(drawing.id, action.regionId)
            : progress.dispatch(drawing.id, action)
        }
        selectedColor={selectedColor}
        onSelectColor={progress.selectColor}
        saveStatus={saveStatus}
        onBack={goBack}
        onPrevious={previous ? () => openDrawing(previous.id) : undefined}
        onNext={next ? () => openDrawing(next.id) : undefined}
        position={`${
          drawings.findIndex(item => item.id === drawing.id) + 1
        } / ${drawings.length}`}
      />
    );
  } else {
    screen = (
      <BrowseScreen
        category={route.screen === 'gallery' ? route.category : undefined}
        sessions={sessions}
        onBack={goBack}
        onCategory={category => setRoute({ screen: 'gallery', category })}
        onDrawing={openDrawing}
      />
    );
  }
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      {saveStatus === 'error' ? (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>
            No se pudo guardar. Reintenta antes de salir.
          </Text>
          <Pressable
            testID="retry-save"
            accessibilityRole="button"
            onPress={progress.retrySave}
            style={styles.retry}
          >
            <Text style={styles.retryText}>Reintentar</Text>
          </Pressable>
        </View>
      ) : null}
      {screen}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    backgroundColor: theme.background,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  message: { fontSize: 18, color: theme.text, textAlign: 'center' },
  retry: {
    minWidth: 112,
    minHeight: 48,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: theme.accent,
  },
  retryText: { fontWeight: '700', color: '#FFFFFF' },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 12,
    backgroundColor: '#FCE0D9',
  },
  errorText: { flex: 1, color: theme.text, fontSize: 14 },
});
