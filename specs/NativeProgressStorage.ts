import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  readSnapshot(): Promise<string | null>;
  readBackup(): Promise<string | null>;
  writeSnapshot(value: string): Promise<void>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeProgressStorage');
