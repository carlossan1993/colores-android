import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { DrawingPreview } from '../components/DrawingPreview';
import { NavigationButton } from '../components/NavigationButton';
import { getDrawingProgress } from '../coloring/coloringReducer';
import type { Sessions } from '../coloring/sessionReducer';
import { catalog, categories } from '../content/catalog';
import type { DrawingCategory } from '../content/types';
import { drawingsFor } from '../navigation/navigation';
import { theme } from '../theme/theme';

export function HomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.home}>
        <View style={styles.hero} pointerEvents="none" accessible={false}>
          <DrawingPreview drawing={catalog[0]} colorful />
        </View>
        <View style={styles.welcome}>
          <Text accessibilityRole="header" style={styles.homeTitle}>
            Colores
          </Text>
          <Text style={styles.subtitle}>¡Vamos a colorear!</Text>
          <Pressable
            testID="start-coloring"
            accessibilityRole="button"
            accessibilityLabel="Elegir un dibujo"
            onPress={onStart}
            style={styles.start}
          >
            <Svg width={30} height={30} viewBox="0 0 32 32" accessible={false}>
              <Path d="M 10 5 L 27 16 L 10 27 Z" fill="#FFFFFF" />
            </Svg>
            <Text style={styles.startText}>Empezar</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

type BrowseProps = {
  category?: DrawingCategory;
  sessions: Sessions;
  onBack: () => void;
  onCategory: (category: DrawingCategory) => void;
  onDrawing: (id: string) => void;
};
const statusNames = {
  'not-started': 'Sin empezar',
  'in-progress': 'En progreso',
  completed: 'Terminado',
};

export function BrowseScreen({
  category,
  sessions,
  onBack,
  onCategory,
  onDrawing,
}: BrowseProps) {
  const { width, height } = useWindowDimensions();
  const compact = height < 400;
  const cardWidth = Math.min(width >= 960 ? 250 : 200, (width - 56) / 2);
  const categoryInfo = categories.find(item => item.id === category);
  return (
    <SafeAreaView
      testID={category ? 'screen-gallery' : 'screen-categories'}
      style={styles.screen}
    >
      <View style={styles.header}>
        <NavigationButton
          direction="back"
          testID="browse-back"
          label={category ? 'Volver a categorías' : 'Volver al inicio'}
          onPress={onBack}
        />
        <Text accessibilityRole="header" style={styles.title}>
          {categoryInfo?.name ?? 'Elige una categoría'}
        </Text>
      </View>
      <ScrollView
        key={category ?? 'categories'}
        contentContainerStyle={styles.grid}
      >
        {category
          ? drawingsFor(category).map(drawing => {
              const colors = sessions[drawing.id]?.colors ?? {};
              const progress = getDrawingProgress(colors, drawing.regionIds);
              return (
                <Pressable
                  key={drawing.id}
                  testID={`drawing-${drawing.id}`}
                  accessibilityRole="button"
                  accessibilityLabel={`${drawing.name}, ${
                    statusNames[progress.status]
                  }`}
                  onPress={() => onDrawing(drawing.id)}
                  style={[styles.card, { width: cardWidth }]}
                >
                  <View
                    pointerEvents="none"
                    accessible={false}
                    style={[
                      styles.preview,
                      compact ? styles.compactPreview : styles.largePreview,
                    ]}
                  >
                    <DrawingPreview drawing={drawing} colors={colors} />
                  </View>
                  <Text style={styles.cardTitle}>{drawing.name}</Text>
                  <Text
                    testID={`status-${drawing.id}`}
                    style={[
                      styles.status,
                      progress.status === 'completed' && styles.done,
                    ]}
                  >
                    {progress.status === 'completed'
                      ? '✓ '
                      : progress.status === 'in-progress'
                      ? '● '
                      : '○ '}
                    {statusNames[progress.status]}
                  </Text>
                </Pressable>
              );
            })
          : categories.map(item => (
              <Pressable
                key={item.id}
                testID={`category-${item.id}`}
                accessibilityRole="button"
                accessibilityLabel={item.name}
                onPress={() => onCategory(item.id)}
                style={[
                  styles.card,
                  { width: cardWidth, backgroundColor: item.color },
                ]}
              >
                <View
                  pointerEvents="none"
                  accessible={false}
                  style={[
                    styles.preview,
                    compact ? styles.compactPreview : styles.largePreview,
                  ]}
                >
                  <DrawingPreview
                    drawing={
                      catalog.find(drawing => drawing.id === item.coverId)!
                    }
                    colorful
                  />
                </View>
                <Text style={styles.cardTitle}>{item.name}</Text>
              </Pressable>
            ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  home: {
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 24,
  },
  hero: { flex: 1, maxWidth: 420, height: 220 },
  welcome: { flex: 1, maxWidth: 340, gap: 16 },
  homeTitle: { fontSize: 42, fontWeight: '900', color: theme.text },
  subtitle: { fontSize: 20, color: theme.muted },
  start: {
    minHeight: 64,
    paddingHorizontal: 20,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.accent,
    borderRadius: 24,
  },
  startText: { fontSize: 22, fontWeight: '800', color: '#FFFFFF' },
  header: {
    minHeight: 64,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 16,
  },
  title: { flex: 1, fontSize: 24, fontWeight: '800', color: theme.text },
  grid: {
    padding: 16,
    paddingTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    minHeight: 152,
    padding: 12,
    gap: 8,
    borderRadius: 24,
    backgroundColor: theme.surface,
    borderWidth: 2,
    borderColor: theme.border,
  },
  preview: { width: '100%' },
  compactPreview: { height: 104 },
  largePreview: { height: 152 },
  cardTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: theme.text,
    textAlign: 'center',
  },
  status: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.muted,
    textAlign: 'center',
  },
  done: { color: '#24714E' },
});
