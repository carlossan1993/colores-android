/* eslint-env jest */
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

// Native disk I/O is exercised by the APK tests, not by the JS test runner.
jest.mock('./src/storage/nativeStorage', () => ({
  nativeStorage: {
    readSnapshot: jest.fn(async () => null),
    readBackup: jest.fn(async () => null),
    writeSnapshot: jest.fn(async () => {}),
  },
}));
beforeEach(() => {
  const { nativeStorage } = require('./src/storage/nativeStorage');
  nativeStorage.readSnapshot.mockReset().mockResolvedValue(null);
  nativeStorage.readBackup.mockReset().mockResolvedValue(null);
  nativeStorage.writeSnapshot.mockReset().mockResolvedValue(undefined);
});
