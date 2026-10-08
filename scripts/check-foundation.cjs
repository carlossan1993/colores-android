const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const manifest = read('android/app/src/main/AndroidManifest.xml');
const gradle = read('android/app/build.gradle');
const app = JSON.parse(read('app.json'));

assert.match(manifest, /android:screenOrientation="sensorLandscape"/);
assert.match(manifest, /android:allowBackup="false"/);
assert.match(manifest, /android:usesCleartextTraffic="false"/);
assert.match(gradle, /debuggableVariants = \["debug"\]/);
assert.match(gradle, /applicationIdSuffix "\.preview"/);
assert.match(gradle, /debuggable false/);
assert.equal(app.name, 'Colores');
assert.match(read('index.js'), /AppRegistry.registerComponent/);
assert.match(
  read('android/app/src/main/java/com/carlossan1993/colores/MainActivity.kt'),
  /getMainComponentName\(\): String = "Colores"/,
);
assert.match(
  read('android/gradle/wrapper/gradle-wrapper.properties'),
  /distributionSha256Sum=[a-f0-9]{64}/,
);

for (const [, declaration] of manifest.matchAll(
  /(<uses-permission\b[^>]*>)/g,
)) {
  assert.match(
    declaration,
    /tools:node="remove"/,
    'Main manifest must not request permissions',
  );
}
assert.ok(
  !fs.existsSync(path.join(root, 'android/app/debug.keystore')),
  'Signing keys must not be stored in the source tree',
);
console.log(
  'Foundation verified: native entrypoint, landscape, bundled preview and no source signing key.',
);
