import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NavigationButton } from '../components/NavigationButton';
import { SoundToggle } from '../components/SoundToggle';
import { theme } from '../theme/theme';

type Props = {
  soundEnabled: boolean;
  onToggleSound: () => void;
  onBack: () => void;
};

export function SettingsScreen({ soundEnabled, onToggleSound, onBack }: Props) {
  return (
    <SafeAreaView testID="screen-settings" style={styles.screen}>
      <View style={styles.header}>
        <NavigationButton
          direction="back"
          testID="settings-back"
          label="Volver al inicio"
          onPress={onBack}
        />
        <Text accessibilityRole="header" style={styles.title}>
          Ajustes
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.heading}>Sonidos</Text>
          <View style={styles.soundRow}>
            <View style={styles.explanation}>
              <Text style={styles.rowTitle}>Sonido al terminar</Text>
              <Text testID="settings-sound-status" style={styles.description}>
                {soundEnabled ? 'Activado' : 'Silenciado'}
              </Text>
            </View>
            <SoundToggle enabled={soundEnabled} onToggle={onToggleSound} />
          </View>
        </View>
        <View testID="settings-privacy" style={styles.section}>
          <Text style={styles.heading}>Privacidad para familias</Text>
          <Text style={styles.paragraph}>
            Colorimbo funciona sin conexión a Internet. No requiere crear una
            cuenta ni proporcionar nombre, correo o ubicación.
          </Text>
          <Text style={styles.paragraph}>
            Los dibujos coloreados y la preferencia de sonido se guardan
            únicamente en este dispositivo. Esta versión no envía esos datos
            a un servidor.
          </Text>
          <Text style={styles.paragraph}>
            No incluye anuncios, compras ni suscripciones. Si se desinstala
            la aplicación o se borran sus datos, el progreso puede perderse.
          </Text>
          <Text style={styles.paragraph}>
            Contacto para familias: colorimbo.app@gmail.com
          </Text>
        </View>
        <Text testID="settings-version" style={styles.version}>
          Colorimbo · versión 0.15.0 (prueba)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.background },
  header: {
    minHeight: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  title: { fontSize: 24, fontWeight: '800', color: theme.text },
  content: {
    paddingHorizontal: 18,
    paddingBottom: 30,
    paddingTop: 8,
    alignItems: 'center',
    gap: 14,
  },
  section: {
    width: '100%',
    maxWidth: 800,
    borderRadius: 22,
    backgroundColor: theme.surface,
    padding: 16,
    gap: 10,
    borderWidth: 2,
    borderColor: theme.border,
  },
  heading: { fontSize: 19, fontWeight: '800', color: theme.text },
  soundRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  explanation: { flex: 1, gap: 4 },
  rowTitle: { fontSize: 16, fontWeight: '700', color: theme.text },
  description: { fontSize: 14, color: theme.muted },
  paragraph: { fontSize: 14, lineHeight: 21, color: theme.text },
  version: { fontSize: 13, color: theme.muted, textAlign: 'center' },
});
