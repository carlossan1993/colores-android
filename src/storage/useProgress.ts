import { useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { sessionReducer } from '../coloring/sessionReducer';
import type { Sessions } from '../coloring/sessionReducer';
import type { ColoringAction } from '../coloring/coloringReducer';
import { nativeStorage } from './nativeStorage';
import { ProgressStore } from './ProgressStore';
import {
  emptySnapshot,
  encodeSnapshot,
  restoreSessions,
  UnsupportedSchemaError,
} from './snapshot';
import type { Preferences } from './snapshot';

export type SaveStatus = 'saving' | 'saved' | 'error';
type Progress = { sessions: Sessions; preferences: Preferences };
function updateDrawing(
  previous: Progress,
  drawingId: string,
  action: ColoringAction,
): Progress {
  const sessions = sessionReducer(previous.sessions, { drawingId, action });
  return sessions === previous.sessions ? previous : { ...previous, sessions };
}
export function useProgress() {
  const [progress, setProgress] = useState<{
    sessions: Sessions;
    preferences: Preferences;
  }>(() => ({ sessions: {}, preferences: emptySnapshot().preferences }));
  const [loadState, setLoadState] = useState<
    'loading' | 'ready' | 'error' | 'unsupported'
  >('loading');
  const [attempt, setAttempt] = useState(0);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const store = useRef<ProgressStore | null>(null);
  if (!store.current) {
    store.current = new ProgressStore(nativeStorage);
  }
  const base = useRef(emptySnapshot());
  const revision = useRef(0);

  useEffect(() => {
    let active = true;
    setLoadState('loading');
    store
      .current!.load()
      .then(snapshot => {
        if (!active) {
          return;
        }
        base.current = snapshot;
        setProgress({
          sessions: restoreSessions(snapshot),
          preferences: snapshot.preferences,
        });
        setLoadState('ready');
      })
      .catch(error => {
        if (active) {
          setLoadState(
            error instanceof UnsupportedSchemaError ? 'unsupported' : 'error',
          );
        }
      });
    return () => {
      active = false;
    };
  }, [attempt]);

  useEffect(() => {
    if (loadState !== 'ready') {
      return;
    }
    let active = true;
    const current = ++revision.current;
    setSaveStatus('saving');
    store
      .current!.save(
        encodeSnapshot(progress.sessions, progress.preferences, base.current),
      )
      .then(() => {
        if (active && current === revision.current) {
          setSaveStatus('saved');
        }
      })
      .catch(() => {
        if (active && current === revision.current) {
          setSaveStatus('error');
        }
      });
    return () => {
      active = false;
    };
  }, [progress, loadState]);

  const retrySave = () => {
    const current = revision.current;
    setSaveStatus('saving');
    store
      .current!.retry()
      .then(() => {
        if (current === revision.current) {
          setSaveStatus('saved');
        }
      })
      .catch(() => {
        if (current === revision.current) {
          setSaveStatus('error');
        }
      });
  };

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state !== 'active' && loadState === 'ready') {
        store.current!.retry().catch(() => setSaveStatus('error'));
      }
    });
    return () => subscription.remove();
  }, [loadState]);

  return {
    ...progress,
    loadState,
    saveStatus,
    retryLoad: () => setAttempt(value => value + 1),
    retrySave,
    dispatch: (drawingId: string, action: ColoringAction) =>
      setProgress(previous => updateDrawing(previous, drawingId, action)),
    // Read the selected color inside the queued update, after earlier palette events.
    paintRegion: (drawingId: string, regionId: string) =>
      setProgress(previous =>
        updateDrawing(previous, drawingId, {
          type: 'paint',
          regionId,
          color: previous.preferences.selectedColor,
        }),
      ),
    selectColor: (selectedColor: string) =>
      setProgress(previous =>
        previous.preferences.selectedColor === selectedColor
          ? previous
          : {
              ...previous,
              preferences: { ...previous.preferences, selectedColor },
            },
      ),
  };
}
