import NativeCompletionSound from '../../specs/NativeCompletionSound';

// The music is bundled with the APK: no streaming, permissions or SDKs.
// A missing / unavailable device audio output must not block coloring.
export function setBackgroundMusicEnabled(enabled: boolean): void {
  try {
    NativeCompletionSound?.setBackgroundMusicEnabled(enabled);
  } catch {
    // Music is optional; progress saving and touch painting always continue.
  }
}
