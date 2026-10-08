import geometry from '../../assets/drawings/places/house_001.json';
import type { DrawingDefinition } from './types';

export const testDrawing: DrawingDefinition = {
  id: 'house_001',
  name: 'Mi casita',
  category: 'places',
  access: 'free',
  productId: null,
  asset: 'places/house_001',
  regionIds: geometry.regions.map(region => region.id),
  viewBox: geometry.viewBox,
  regions: geometry.regions,
};
