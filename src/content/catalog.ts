// Generado automáticamente por scripts/content-pipeline.cjs. No editar manualmente.
import art0 from '../../assets/drawings/animals/cat_001.json';
import art1 from '../../assets/drawings/fruits/apple_001.json';
import art2 from '../../assets/drawings/places/house_001.json';
import art3 from '../../assets/drawings/places/castle_001.json';
import art4 from '../../assets/drawings/vehicles/car_001.json';
import art5 from '../../assets/drawings/animals/dog_001.json';
import art6 from '../../assets/drawings/animals/rabbit_001.json';
import art7 from '../../assets/drawings/fruits/banana_001.json';
import art8 from '../../assets/drawings/fruits/strawberry_001.json';
import art9 from '../../assets/drawings/places/school_001.json';
import art10 from '../../assets/drawings/places/barn_001.json';
import art11 from '../../assets/drawings/vehicles/boat_001.json';
import art12 from '../../assets/drawings/vehicles/plane_001.json';
import art13 from '../../assets/drawings/animals/turtle_001.json';
import art14 from '../../assets/drawings/animals/butterfly_001.json';
import art15 from '../../assets/drawings/fruits/orange_001.json';
import art16 from '../../assets/drawings/fruits/pineapple_001.json';
import art17 from '../../assets/drawings/places/lighthouse_001.json';
import art18 from '../../assets/drawings/places/park_001.json';
import art19 from '../../assets/drawings/vehicles/train_001.json';
import art20 from '../../assets/drawings/vehicles/tractor_001.json';
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
  define({ id: 'dog_001', name: 'Perrito', category: 'animals', access: 'free', productId: null, asset: 'animals/dog_001' }, art5),
  define({ id: 'rabbit_001', name: 'Conejito', category: 'animals', access: 'free', productId: null, asset: 'animals/rabbit_001' }, art6),
  define({ id: 'banana_001', name: 'Banana', category: 'fruits', access: 'free', productId: null, asset: 'fruits/banana_001' }, art7),
  define({ id: 'strawberry_001', name: 'Fresa', category: 'fruits', access: 'free', productId: null, asset: 'fruits/strawberry_001' }, art8),
  define({ id: 'school_001', name: 'Escuela', category: 'places', access: 'free', productId: null, asset: 'places/school_001' }, art9),
  define({ id: 'barn_001', name: 'Granero', category: 'places', access: 'free', productId: null, asset: 'places/barn_001' }, art10),
  define({ id: 'boat_001', name: 'Barquito', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/boat_001' }, art11),
  define({ id: 'plane_001', name: 'Avión', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/plane_001' }, art12),
  define({ id: 'turtle_001', name: 'Tortuguita', category: 'animals', access: 'free', productId: null, asset: 'animals/turtle_001' }, art13),
  define({ id: 'butterfly_001', name: 'Mariposa', category: 'animals', access: 'free', productId: null, asset: 'animals/butterfly_001' }, art14),
  define({ id: 'orange_001', name: 'Naranja', category: 'fruits', access: 'free', productId: null, asset: 'fruits/orange_001' }, art15),
  define({ id: 'pineapple_001', name: 'Piña', category: 'fruits', access: 'free', productId: null, asset: 'fruits/pineapple_001' }, art16),
  define({ id: 'lighthouse_001', name: 'Faro', category: 'places', access: 'free', productId: null, asset: 'places/lighthouse_001' }, art17),
  define({ id: 'park_001', name: 'Parque', category: 'places', access: 'free', productId: null, asset: 'places/park_001' }, art18),
  define({ id: 'train_001', name: 'Trencito', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/train_001' }, art19),
  define({ id: 'tractor_001', name: 'Tractor', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/tractor_001' }, art20),
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
