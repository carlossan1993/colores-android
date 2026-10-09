const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const base = path.resolve(__dirname, '../assets/drawings/places/house_001');
const geometry = JSON.parse(fs.readFileSync(`${base}.json`, 'utf8'));
const ids = geometry.regions.map(region => region.id);
assert.equal(new Set(ids).size, ids.length, 'Duplicate SVG region IDs');
assert.equal(
  ids.length,
  8,
  'This prototype has exactly eight paintable regions',
);
for (const region of geometry.regions) {
  assert.match(region.id, /^[a-z][a-z0-9_]*$/);
  assert.ok(region.name.length > 0);
  assert.match(region.path, /^M .* Z$/, 'A paintable region must be closed');
}

const svg = [
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${geometry.viewBox}">`,
  '  <title>Mi casita: dibujo original de prueba con ocho regiones</title>',
  ...geometry.regions.map(
    region =>
      `  <path id="${region.id}" d="${region.path}" fill="#FFFFFF" stroke="#202020" stroke-width="6" stroke-linejoin="round" stroke-linecap="round" />`,
  ),
  '</svg>',
  '',
].join('\n');

if (process.argv.includes('--write')) {
  fs.writeFileSync(`${base}.svg`, svg);
} else {
  assert.equal(
    fs.readFileSync(`${base}.svg`, 'utf8'),
    svg,
    'SVG export is out of sync with the interactive geometry',
  );
}
console.log(
  'Drawing verified: eight unique closed regions, synchronized SVG export.',
);

for (const category of ['animals', 'fruits', 'places', 'vehicles']) {
  const dir = path.resolve(__dirname, '../assets/drawings', category);
  for (const file of fs
    .readdirSync(dir)
    .filter(name => name.endsWith('.json'))) {
    const definition = JSON.parse(
      fs.readFileSync(path.join(dir, file), 'utf8'),
    );
    const regionIds = definition.regions.map(region => region.id);
    assert.ok(regionIds.length > 0);
    assert.equal(new Set(regionIds).size, regionIds.length);
    assert.equal(definition.viewBox, '0 0 640 300');
    for (const region of definition.regions) {
      assert.match(region.id, /^[a-z][a-z0-9_]*$/);
      assert.ok(region.name.length > 0);
      assert.match(region.path, /^M .* Z$/);
      assert.ok(
        fs
          .readFileSync(path.join(dir, file.replace('.json', '.svg')), 'utf8')
          .includes(`id="${region.id}" d="${region.path}"`),
      );
    }
  }
}
console.log('Navigation sample assets verified in all four categories.');
