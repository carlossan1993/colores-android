import { FreeEntitlementManager } from '../access/EntitlementManager';
import { catalog } from '../content/catalog';
import type { DrawingCategory } from '../content/types';

export type Route =
  | { screen: 'home' }
  | { screen: 'categories' }
  | { screen: 'gallery'; category: DrawingCategory }
  | { screen: 'coloring'; drawingId: string };

const access = new FreeEntitlementManager();
export const drawingsFor = (category: DrawingCategory) =>
  catalog.filter(
    drawing => drawing.category === category && access.canAccess(drawing),
  );

export function backRoute(route: Route): Route {
  if (route.screen === 'coloring') {
    const drawing = catalog.find(item => item.id === route.drawingId);
    return drawing
      ? { screen: 'gallery', category: drawing.category }
      : { screen: 'categories' };
  }
  if (route.screen === 'gallery') {
    return { screen: 'categories' };
  }
  return { screen: 'home' };
}

export function adjacentDrawing(drawingId: string, direction: -1 | 1) {
  const current = catalog.find(item => item.id === drawingId);
  if (!current || !access.canAccess(current)) {
    return undefined;
  }
  const drawings = drawingsFor(current.category);
  return drawings[
    drawings.findIndex(item => item.id === drawingId) + direction
  ];
}
