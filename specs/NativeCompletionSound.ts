import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

// Optional by design: absence of an audio module must never block coloring.
export interface Spec extends TurboModule {
  playCompletion(): void;
}
export default TurboModuleRegistry.get<Spec>('NativeCompletionSound');
