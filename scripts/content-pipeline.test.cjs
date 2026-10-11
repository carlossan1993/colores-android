const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { run, generateCatalog } = require('./content-pipeline.cjs');

const project = path.resolve(__dirname, '..');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'colores-content-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'assets'), { recursive: true });
  fs.mkdirSync(path.join(root, 'src/content'), { recursive: true });
  fs.cpSync(path.join(project, 'assets/drawings'),
    path.join(root, 'assets/drawings'), { recursive: true });
  fs.copyFileSync(path.join(project, 'src/content/catalog.ts'),
    path.join(root, 'src/content/catalog.ts'));
  return root;
}

function updateJson(file, change) {
  const value = JSON.parse(fs.readFileSync(file, 'utf8'));
  change(value);
  fs.writeFileSync(file, JSON.stringify(value, null, 2) + '\n');
}

test('all 13 valid drawings stay in sync with generated catalog and SVGs', t => {
  const root = fixture(t);
  assert.deepEqual(run(root), { drawings: 13, regions: 98 });
  const file = path.join(root, 'src/content/catalog.ts');
  run(root, true);
  assert.equal(fs.readFileSync(file, 'utf8'),
    generateCatalog(JSON.parse(fs.readFileSync(
      path.join(root, 'assets/drawings/catalog.json'), 'utf8'))));
  assert.deepEqual(run(root), { drawings: 13, regions: 98 });
});

test('duplicate IDs are rejected before generating catalog', t => {
  const root = fixture(t);
  updateJson(path.join(root, 'assets/drawings/catalog.json'), entries => {
    entries[1].id = entries[0].id;
  });
  assert.throws(() => run(root), /Duplicate drawing ID/);
});

test('missing metadata or extra geometry is detected', t => {
  const root = fixture(t);
  updateJson(path.join(root, 'assets/drawings/catalog.json'), entries => {
    entries.splice(1, 1);
  });
  assert.throws(() => run(root), /Unregistered drawing/);
});

test('duplicate regions and unclosed paths are rejected', t => {
  const root = fixture(t);
  const file = path.join(root, 'assets/drawings/fruits/apple_001.json');
  updateJson(file, geometry => {
    geometry.regions[1].id = geometry.regions[0].id;
  });
  assert.throws(() => run(root), /Duplicate region ID/);
  updateJson(file, geometry => {
    geometry.regions[1].id = 'stem';
    geometry.regions[0].path = 'M 0 0 L 100 100';
  });
  assert.throws(() => run(root), /Invalid or unclosed SVG path/);
});

test('premium and free metadata must use coherent product IDs', t => {
  const root = fixture(t);
  updateJson(path.join(root, 'assets/drawings/catalog.json'), entries => {
    entries[0].access = 'premium';
    entries[0].productId = null;
  });
  assert.throws(() => run(root), /Invalid free\/premium metadata/);
});

test('generated SVG and TypeScript drift causes CI failure', t => {
  const root = fixture(t);
  const svg = path.join(root, 'assets/drawings/fruits/apple_001.svg');
  fs.appendFileSync(svg, '\n');
  assert.throws(() => run(root), /SVG out of sync/);
  run(root, true);
  fs.appendFileSync(path.join(root, 'src/content/catalog.ts'), '\n');
  assert.throws(() => run(root), /Generated catalog out of sync/);
});
