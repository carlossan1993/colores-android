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
import art21 from '../../assets/drawings/animals/fox_001.json';
import art22 from '../../assets/drawings/animals/lion_001.json';
import art23 from '../../assets/drawings/fruits/pear_001.json';
import art24 from '../../assets/drawings/fruits/watermelon_001.json';
import art25 from '../../assets/drawings/places/library_001.json';
import art26 from '../../assets/drawings/places/hospital_001.json';
import art27 from '../../assets/drawings/vehicles/bus_001.json';
import art28 from '../../assets/drawings/vehicles/rocket_001.json';
import art29 from '../../assets/drawings/animals/elephant_001.json';
import art30 from '../../assets/drawings/animals/fish_001.json';
import art31 from '../../assets/drawings/animals/owl_001.json';
import art32 from '../../assets/drawings/fruits/grapes_001.json';
import art33 from '../../assets/drawings/fruits/cherries_001.json';
import art34 from '../../assets/drawings/fruits/lemon_001.json';
import art35 from '../../assets/drawings/places/firestation_001.json';
import art36 from '../../assets/drawings/places/shop_001.json';
import art37 from '../../assets/drawings/vehicles/bicycle_001.json';
import art38 from '../../assets/drawings/vehicles/truck_001.json';
import art39 from '../../assets/drawings/vehicles/helicopter_001.json';
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
  define({ id: 'fox_001', name: 'Zorrito', category: 'animals', access: 'free', productId: null, asset: 'animals/fox_001' }, art21),
  define({ id: 'lion_001', name: 'Leoncito', category: 'animals', access: 'free', productId: null, asset: 'animals/lion_001' }, art22),
  define({ id: 'pear_001', name: 'Pera', category: 'fruits', access: 'free', productId: null, asset: 'fruits/pear_001' }, art23),
  define({ id: 'watermelon_001', name: 'Sandía', category: 'fruits', access: 'free', productId: null, asset: 'fruits/watermelon_001' }, art24),
  define({ id: 'library_001', name: 'Biblioteca', category: 'places', access: 'free', productId: null, asset: 'places/library_001' }, art25),
  define({ id: 'hospital_001', name: 'Hospital', category: 'places', access: 'free', productId: null, asset: 'places/hospital_001' }, art26),
  define({ id: 'bus_001', name: 'Autobús', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/bus_001' }, art27),
  define({ id: 'rocket_001', name: 'Cohete', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/rocket_001' }, art28),
  define({ id: 'elephant_001', name: 'Elefantito', category: 'animals', access: 'free', productId: null, asset: 'animals/elephant_001' }, art29),
  define({ id: 'fish_001', name: 'Pececito', category: 'animals', access: 'free', productId: null, asset: 'animals/fish_001' }, art30),
  define({ id: 'owl_001', name: 'Buhito', category: 'animals', access: 'free', productId: null, asset: 'animals/owl_001' }, art31),
  define({ id: 'grapes_001', name: 'Uvas', category: 'fruits', access: 'free', productId: null, asset: 'fruits/grapes_001' }, art32),
  define({ id: 'cherries_001', name: 'Cerezas', category: 'fruits', access: 'free', productId: null, asset: 'fruits/cherries_001' }, art33),
  define({ id: 'lemon_001', name: 'Limón', category: 'fruits', access: 'free', productId: null, asset: 'fruits/lemon_001' }, art34),
  define({ id: 'firestation_001', name: 'Estación de bomberos', category: 'places', access: 'free', productId: null, asset: 'places/firestation_001' }, art35),
  define({ id: 'shop_001', name: 'Tiendita', category: 'places', access: 'free', productId: null, asset: 'places/shop_001' }, art36),
  define({ id: 'bicycle_001', name: 'Bicicleta', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/bicycle_001' }, art37),
  define({ id: 'truck_001', name: 'Camioncito', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/truck_001' }, art38),
  define({ id: 'helicopter_001', name: 'Helicóptero', category: 'vehicles', access: 'free', productId: null, asset: 'vehicles/helicopter_001' }, art39),
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
