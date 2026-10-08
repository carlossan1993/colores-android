import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { WelcomeScreen } from '../screens/WelcomeScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <WelcomeScreen />
    </SafeAreaProvider>
  );
}
