export type DrawingCategory = 'animals' | 'fruits' | 'places' | 'vehicles';

export type DrawingAccess =
  | { access: 'free'; productId: null }
  | { access: 'premium'; productId: string };

export type DrawingMetadata = DrawingAccess & {
  id: string;
  name: string;
  category: DrawingCategory;
  asset: string;
  regionIds: readonly string[];
};

export type SvgRegion = {
  id: string;
  name: string;
  path: string;
};

export type DrawingDefinition = DrawingMetadata & {
  viewBox: string;
  regions: readonly SvgRegion[];
};
