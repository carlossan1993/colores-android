import { playCompletionSound } from '../src/audio/completionSound';
import NativeCompletionSound from '../specs/NativeCompletionSound';

jest.mock('../specs/NativeCompletionSound', () => ({
  __esModule: true,
  default: { playCompletion: jest.fn() },
}));

test('mute prevents any native sound; enabled plays a single short cue', () => {
  const sound = jest.mocked(NativeCompletionSound)!;
  playCompletionSound(false);
  expect(sound.playCompletion).not.toHaveBeenCalled();
  playCompletionSound(true);
  expect(sound.playCompletion).toHaveBeenCalledTimes(1);
});
