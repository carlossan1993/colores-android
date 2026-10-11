import { shouldCelebrateCompletion } from '../src/coloring/completionTransition';

test('celebrates only the newly completed drawing', () => {
  const inProgress = { drawingId: 'cat_001', completed: false };
  const complete = { drawingId: 'cat_001', completed: true };
  expect(shouldCelebrateCompletion(inProgress, complete)).toBe(true);
  expect(shouldCelebrateCompletion(complete, complete)).toBe(false);
  expect(shouldCelebrateCompletion(inProgress, inProgress)).toBe(false);
  expect(
    shouldCelebrateCompletion(
      { drawingId: 'cat_001', completed: false },
      { drawingId: 'apple_001', completed: true },
    ),
  ).toBe(false);
  expect(shouldCelebrateCompletion(complete, inProgress)).toBe(false);
});
