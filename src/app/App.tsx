import React, { useEffect, useReducer, useState } from 'react';
import { BackHandler, StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FreeEntitlementManager } from '../access/EntitlementManager';
import { createInitialState } from '../coloring/coloringReducer';
import { sessionReducer } from '../coloring/sessionReducer';
import { catalog } from '../content/catalog';
import {
  adjacentDrawing,
  backRoute,
  drawingsFor,
} from '../navigation/navigation';
import type { Route } from '../navigation/navigation';
import { BrowseScreen, HomeScreen } from '../screens/BrowseScreens';
import { ColoringScreen } from '../screens/ColoringScreen';
import { palette } from '../theme/palette';

const access = new FreeEntitlementManager();
export default function App() {
  const [route, setRoute] = useState<Route>({ screen: 'home' });
  const [sessions, dispatch] = useReducer(sessionReducer, {});
  const [selectedColor, setSelectedColor] = useState<string>(palette[0].color);
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
        onAction={action => dispatch({ drawingId: drawing.id, action })}
        selectedColor={selectedColor}
        onSelectColor={setSelectedColor}
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
      {screen}
    </SafeAreaProvider>
  );
}
