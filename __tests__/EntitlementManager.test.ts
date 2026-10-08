import { FreeEntitlementManager } from '../src/access/EntitlementManager';

const access = new FreeEntitlementManager();

test('allows free drawings offline', () => {
  expect(access.canAccess({ access: 'free', productId: null })).toBe(true);
});

test('does not accidentally unlock premium content in V1', () => {
  expect(
    access.canAccess({ access: 'premium', productId: 'animals_pack' }),
  ).toBe(false);
});
