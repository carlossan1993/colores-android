import cat from '../../assets/drawings/animals/cat_001.json';
import apple from '../../assets/drawings/fruits/apple_001.json';
import castle from '../../assets/drawings/places/castle_001.json';
import car from '../../assets/drawings/vehicles/car_001.json';
import { testDrawing } from './testDrawing';
import type { DrawingCategory, DrawingDefinition, SvgRegion } from './types';

function define(
  id: string,
  name: string,
  category: DrawingCategory,
  geometry: { viewBox: string; regions: readonly SvgRegion[] },
): DrawingDefinition {
  return {
    id,
    name,
    category,
    access: 'free',
    productId: null,
    asset: `${category}/${id}`,
    regionIds: geometry.regions.map(region => region.id),
    ...geometry,
  };
}

// Small sample catalog for navigation. The 40-drawing catalog is stage 7.
export const catalog: readonly DrawingDefinition[] = [
  define('cat_001', 'Gatito', 'animals', cat),
  define('apple_001', 'Manzana', 'fruits', apple),
  testDrawing,
  define('castle_001', 'Castillo', 'places', castle),
  define('car_001', 'Auto', 'vehicles', car),
];

export const categories: readonly {
  id: DrawingCategory;
  name: string;
  color: string;
  coverId: string;
}[] = [
  { id: 'animals', name: 'Animales', color: '#FCE0D9', coverId: 'cat_001' },
  { id: 'fruits', name: 'Frutas', color: '#E1F4E9', coverId: 'apple_001' },
  { id: 'places', name: 'Lugares', color: '#EBE4FC', coverId: 'house_001' },
  { id: 'vehicles', name: 'Vehículos', color: '#DDEFFA', coverId: 'car_001' },
];
