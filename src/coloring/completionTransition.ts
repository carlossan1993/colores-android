// Keep the celebration tied to an actual transition, not a saved completed drawing.
export type CompletionSnapshot = {
  drawingId: string;
  completed: boolean;
};

export function shouldCelebrateCompletion(
  previous: CompletionSnapshot,
  current: CompletionSnapshot,
): boolean {
  return (
    previous.drawingId === current.drawingId &&
    !previous.completed &&
    current.completed
  );
}
