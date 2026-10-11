const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const ROOT = path.resolve(__dirname, '..');
const CATEGORY_IDS = ['animals', 'fruits', 'places', 'vehicles'];
const DRAWING_ID = /^[a-z][a-z0-9_]*$/;
const SVG_PATH = /^M[\d\s,.\-+MLHVCSQTAZ]*Z$/;

function ensure(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function loadJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function escapeXml(value) {
  return value.replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function renderSvg(item, geometry) {
  const lines = [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + geometry.viewBox + '">',
  ];
  if (item.svgTitle) {
    lines.push('  <title>' + escapeXml(item.svgTitle) + '</title>');
  }
  for (const region of geometry.regions) {
    lines.push(
      '  <path id="' + region.id + '" d="' + region.path +
      '" fill="#FFFFFF" stroke="#202020" stroke-width="6"' +
      ' stroke-linejoin="round" stroke-linecap="round" />',
    );
  }
  lines.push('</svg>', '');
  return lines.join('\n');
}

function generateCatalog(items) {
  const q = value => "'" + value.replace(/\\/g, '\\\\').replace(/'/g, "\\'") + "'";
  const lines = [
    '// Generado automáticamente por scripts/content-pipeline.cjs. No editar manualmente.',
    ...items.map((item, i) => "import art" + i + " from '../../assets/drawings/" + item.asset + ".json';"),
    "import type { DrawingAccess, DrawingCategory, DrawingDefinition, SvgRegion } from './types';",
    '',
    'function define(metadata: DrawingAccess & Pick<DrawingDefinition, 'id' | 'name' | 'category' | 'asset'>, geometry: { viewBox: string; regions: readonly SvgRegion[] }): DrawingDefinition {',
    '  return { ...metadata, ...geometry, regionIds: geometry.regions.map(region => region.id) };',
    '}',
    '',
    'export const catalog: readonly DrawingDefinition[] = [',
    ...items.map((item, i) =>
      '  define({ id: ' + q(item.id) + ', name: ' + q(item.name) +
      ', category: ' + q(item.category) + ', access: ' + q(item.access) +
      ', productId: ' + (item.productId === null ? 'null' : q(item.productId)) +
      ', asset: ' + q(item.asset) + ' }, art' + i + '),'),
    '];',
    '',
    'export const categories: readonly {',
    '  id: DrawingCategory;',
    '  name: string;',
    '  color: string;',
    '  coverId: string;',
    '}[] = [',
    "  { id: 'animals', name: 'Animales', color: '#FCE0D9', coverId: 'cat_001' },",
    "  { id: 'fruits', name: 'Frutas', color: '#E1F4E9', coverId: 'apple_001' },",
    "  { id: 'places', name: 'Lugares', color: '#EBE4FC', coverId: 'house_001' },",
    "  { id: 'vehicles', name: 'Vehículos', color: '#DDEFFA', coverId: 'car_001' },",
    '];',
    '',
  ];
  return lines.join('\n');
}

function run(root = ROOT, write = false) {
  const assetsRoot = path.join(root, 'assets/drawings');
  const items = loadJson(path.join(assetsRoot, 'catalog.json'));
  ensure(Array.isArray(items) && items.length > 0,
    'Catalog must contain at least one drawing');
  const ids = new Set();
  const listedAssets = new Set();
  for (const item of items) {
    ensure(item && typeof item === 'object' && !Array.isArray(item),
      'Catalog entry must be an object');
    ensure(typeof item.id === 'string' && DRAWING_ID.test(item.id),
      'Invalid drawing ID: ' + item.id);
    ensure(!ids.has(item.id), 'Duplicate drawing ID: ' + item.id);
    ids.add(item.id);
    ensure(typeof item.name === 'string' && item.name.trim().length > 0,
      'Missing drawing name: ' + item.id);
    ensure(CATEGORY_IDS.includes(item.category),
      'Invalid category: ' + item.id);
    ensure(item.asset === item.category + '/' + item.id,
      'Asset must match category/ID: ' + item.id);
    ensure(
      (item.access === 'free' && item.productId === null) ||
      (item.access === 'premium' && typeof item.productId === 'string' &&
        item.productId.trim().length > 0),
      'Invalid free/premium metadata: ' + item.id,
    );
    ensure(item.svgTitle === undefined ||
      (typeof item.svgTitle === 'string' && item.svgTitle.trim().length > 0),
      'Invalid SVG title: ' + item.id);
    listedAssets.add(item.asset);
    const base = path.join(assetsRoot, item.asset);
    ensure(fs.existsSync(base + '.json'), 'Missing geometry: ' + item.asset);
    const geometry = loadJson(base + '.json');
    ensure(geometry && typeof geometry.viewBox === 'string',
      'Missing viewBox: ' + item.id);
    const box = geometry.viewBox.trim().split(/\s+/).map(Number);
    ensure(box.length === 4 && box.every(Number.isFinite) &&
      box[2] > 0 && box[3] > 0, 'Invalid viewBox: ' + item.id);
    ensure(Array.isArray(geometry.regions) && geometry.regions.length > 0,
      'Drawing must have paintable regions: ' + item.id);
    const regionIds = new Set();
    for (const region of geometry.regions) {
      ensure(region && typeof region.id === 'string' &&
        DRAWING_ID.test(region.id), 'Invalid region ID: ' + item.id);
      ensure(!regionIds.has(region.id),
        'Duplicate region ID: ' + item.id + '/' + region.id);
      regionIds.add(region.id);
      ensure(typeof region.name === 'string' &&
        region.name.trim().length > 0,
        'Missing region name: ' + item.id + '/' + region.id);
      ensure(typeof region.path === 'string' &&
        SVG_PATH.test(region.path.trim()),
        'Invalid or unclosed SVG path: ' + item.id + '/' + region.id);
    }
    const svg = renderSvg(item, geometry);
    if (write) {
      fs.writeFileSync(base + '.svg', svg);
    } else {
      ensure(fs.existsSync(base + '.svg'),
        'Missing SVG export: ' + item.asset);
      assert.equal(fs.readFileSync(base + '.svg', 'utf8'), svg,
        'SVG out of sync: ' + item.asset +
        '. Run npm run content:generate.');
    }
  }
  for (const category of CATEGORY_IDS) {
    const directory = path.join(assetsRoot, category);
    ensure(fs.existsSync(directory), 'Missing category folder: ' + category);
    const jsonFiles = fs.readdirSync(directory).filter(file =>
      file.endsWith('.json'));
    for (const file of jsonFiles) {
      ensure(listedAssets.has(category + '/' + file.slice(0, -5)),
        'Unregistered drawing: ' + category + '/' + file);
    }
    ensure(items.some(item => item.category === category),
      'Category has no drawings: ' + category);
  }
  for (const coverId of ['cat_001', 'apple_001', 'house_001', 'car_001']) {
    ensure(ids.has(coverId), 'Missing category cover: ' + coverId);
  }
  const catalogFile = path.join(root, 'src/content/catalog.ts');
  const output = generateCatalog(items);
  if (write) {
    fs.writeFileSync(catalogFile, output);
  } else {
    assert.equal(fs.readFileSync(catalogFile, 'utf8'), output,
      'Generated catalog out of sync. Run npm run content:generate.');
  }
  return { drawings: items.length, regions: items.reduce((count, item) =>
    count + loadJson(path.join(assetsRoot, item.asset + '.json')).regions.length, 0) };
}

if (require.main === module) {
  try {
    const result = run(ROOT, process.argv.includes('--write'));
    console.log('Content verified: ' + result.drawings +
      ' drawings, ' + result.regions + ' closed regions.');
  } catch (error) {
    console.error('Content validation failed:', error.message);
    process.exitCode = 1;
  }
}

module.exports = { run, renderSvg, generateCatalog };
