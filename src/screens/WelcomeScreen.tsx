import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../theme/theme';

// First installable milestone. The SVG coloring screen arrives in stage 2.
export function WelcomeScreen() {
  const [selectedColor, setSelectedColor] = useState<string>(theme.colors[0]);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.introduction}>
          <Text accessibilityRole="header" style={styles.title}>
            Colores
          </Text>
          <Text style={styles.subtitle}>Un mundo para pintar</Text>
          <Text style={styles.description}>
            Tus dibujos, tus colores y toda tu imaginación.
          </Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Juega sin internet</Text>
          </View>
        </View>
        <View style={styles.card}>
          <View
            accessible
            accessibilityLabel="Vista del color elegido"
            style={[styles.colorPreview, { backgroundColor: selectedColor }]}
          />
          <Text style={styles.cardTitle}>¡Elige tu color favorito!</Text>
          <View style={styles.palette}>
            {theme.colors.map((color, index) => (
              <Pressable
                key={color}
                accessibilityRole="button"
                accessibilityLabel={`Elegir ${colorNames[index]}`}
                accessibilityState={{ selected: selectedColor === color }}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.swatch,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedSwatch,
                ]}
              />
            ))}
          </View>
          <Text style={styles.note}>Pronto tendrás dibujos para colorear</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const colorNames = ['rojo', 'naranja', 'amarillo', 'verde', 'azul', 'violeta'];

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  content: {
    flexGrow: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 28,
    paddingHorizontal: 32,
    paddingVertical: 24,
  },
  introduction: { flexGrow: 1, flexBasis: 240, maxWidth: 430 },
  title: { fontSize: 54, fontWeight: '800', color: theme.text },
  subtitle: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.accent,
    marginTop: 8,
  },
  description: {
    fontSize: 18,
    lineHeight: 26,
    color: theme.muted,
    marginTop: 14,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: '#E1F4E9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginTop: 20,
  },
  badgeText: { fontSize: 15, fontWeight: '600', color: '#276749' },
  card: {
    flexGrow: 1,
    flexBasis: 310,
    maxWidth: 510,
    alignItems: 'center',
    backgroundColor: theme.surface,
    borderColor: theme.border,
    borderWidth: 2,
    borderRadius: 32,
    padding: 24,
    gap: 18,
  },
  colorPreview: { width: 104, height: 104, borderRadius: 36 },
  cardTitle: {
    fontSize: 21,
    fontWeight: '700',
    color: theme.text,
    textAlign: 'center',
  },
  palette: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
  },
  swatch: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedSwatch: { borderColor: theme.text },
  note: { fontSize: 14, color: theme.muted, textAlign: 'center' },
});
