import { setBackgroundMusicEnabled } from '../src/audio/backgroundMusic';
import NativeCompletionSound from '../specs/NativeCompletionSound';

jest.mock('../specs/NativeCompletionSound', () => ({
  __esModule: true,
  default: { setBackgroundMusicEnabled: jest.fn(), playCompletion: jest.fn() },
}));

test('el mismo botón activa y silencia el loop nativo', () => {
  const sound = jest.mocked(NativeCompletionSound)!;
  setBackgroundMusicEnabled(true);
  setBackgroundMusicEnabled(false);
  expect(sound.setBackgroundMusicEnabled).toHaveBeenNthCalledWith(1, true);
  expect(sound.setBackgroundMusicEnabled).toHaveBeenNthCalledWith(2, false);
});

test('un fallo del audio nativo nunca afecta al coloreado', () => {
  const sound = jest.mocked(NativeCompletionSound)!;
  jest.mocked(sound.setBackgroundMusicEnabled).mockImplementationOnce(() => {
    throw new Error('audio output unavailable');
  });
  expect(() => setBackgroundMusicEnabled(true)).not.toThrow();
});
