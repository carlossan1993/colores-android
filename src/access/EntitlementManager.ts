import type { DrawingAccess } from '../content/types';

export interface EntitlementManager {
  canAccess(content: DrawingAccess): boolean;
}

// V1 grants free content only. No billing SDK or purchase UI is installed.
// V2 can replace this implementation without changing the coloring engine.
export class FreeEntitlementManager implements EntitlementManager {
  canAccess(content: DrawingAccess): boolean {
    return content.access === 'free';
  }
}
