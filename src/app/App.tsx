import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ColoringScreen } from '../screens/ColoringScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <ColoringScreen />
    </SafeAreaProvider>
  );
}
