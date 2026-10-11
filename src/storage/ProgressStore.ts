import { decodeSnapshot, UnsupportedSchemaError } from './snapshot';
import type { Snapshot } from './snapshot';

export interface ProgressStorage {
  readSnapshot(): Promise<string | null>;
  readBackup(): Promise<string | null>;
  writeSnapshot(value: string): Promise<void>;
}

// Each edit receives its own disk acknowledgement. Writes always run in order.
export class ProgressStore {
  private tail: Promise<void> = Promise.resolve();
  private outstanding = 0;
  private latest: string | undefined;
  private saved: string | undefined;
  constructor(private readonly storage: ProgressStorage) {}

  async load(): Promise<Snapshot> {
    const raw = await this.storage.readSnapshot();
    if (raw === null) {
      const backup = await this.storage.readBackup();
      return decodeSnapshot(backup);
    }
    try {
      const snapshot = decodeSnapshot(raw);
      this.saved = raw;
      return snapshot;
    } catch (error) {
      if (error instanceof UnsupportedSchemaError) {
        throw error;
      }
      const backup = await this.storage.readBackup();
      if (backup === null) {
        throw error;
      }
      return decodeSnapshot(backup);
    }
  }

  save(value: string): Promise<void> {
    this.latest = value;
    if (value === this.saved && this.outstanding === 0) {
      return Promise.resolve();
    }
    return this.enqueue(value);
  }

  retry(): Promise<void> {
    if (this.outstanding > 0) {
      return this.tail;
    }
    return this.latest === undefined || this.latest === this.saved
      ? Promise.resolve()
      : this.enqueue(this.latest);
  }

  private enqueue(value: string): Promise<void> {
    this.outstanding++;
    const operation = this.tail
      .catch(() => {})
      .then(() => this.storage.writeSnapshot(value))
      .then(() => {
        this.saved = value;
      })
      .finally(() => {
        this.outstanding--;
      });
    this.tail = operation;
    return operation;
  }
}
