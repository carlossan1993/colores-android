// Generado automáticamente por scripts/content-pipeline.cjs. No editar manualmente.
import art0 from '../../assets/drawings/animals/cat_001.json';
import art1 from '../../assets/drawings/fruits/apple_001.json';
import art2 from '../../assets/drawings/places/house_001.json';
import art3 from '../../assets/drawings/places/castle_001.json';
import art4 from '../../assets/drawings/vehicles/car_001.json';
import type { DrawingAccess, DrawingCategory, DrawingDefinition, SvgRegion } from './types';

function define(metadata: DrawingAccess & Pick<DrawingDefinition, 'id' | 'name' | 'category' | 'asset'>, geometry: { viewBox: string; regions: readonly SvgRegion[] }): DrawingDefinition {
  return { ...metadata, ...geometry, regionIds: geometry.regions.map(region => region.id) };
}

export const catalog: readonly DrawingDefinition[] = [
  define({ id: 'cat_001', name: 'Gatito', category: 'animals', access: 'free', productId: null, asset: 'animals/cat_001' }, art0),
  define({ id: 'apple_001', name: 'Manzana', category: 'fruits', access: 'free', productId: null, asset: 'fruits/apple_001' }, art1),
  define({ id: 'house_001', name: 'Mi casita', category: 'places', access: 'free', productId: null, asset: 'places/house_001' }, art2),
  define({ id: 'castle_001', name: 'Castillo', category: 'places', access: 'free', productId: null, asset: 'places/castle_001' }, art3),
  define({ id: 'car_001', name: 'Auto', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/car_001' }, art4),
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
