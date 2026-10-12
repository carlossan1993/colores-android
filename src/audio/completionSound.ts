import NativeCompletionSound from '../../specs/NativeCompletionSound';

// Sound is short, optional, and uses the phone's media volume.
export function playCompletionSound(enabled: boolean): void {
  if (!enabled) {
    return;
  }
  try {
    NativeCompletionSound?.playCompletion();
  } catch {
    // Never prevent a child from coloring if the audio device is unavailable.
  }
}
