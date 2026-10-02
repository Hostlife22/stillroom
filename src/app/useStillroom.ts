import type { SceneEngine, SetSetting } from '../simulation/types.ts';
import type { SettingsAction } from './settings.ts';
import { useCallback, useReducer, useRef, useState } from 'react';
import { createInitialState, settingsReducer } from './settings.ts';
import { useNotice } from '../hooks/useNotice.ts';
import { useAmbientSound } from '../hooks/useAmbientSound.ts';
import { useFullscreen } from '../hooks/useFullscreen.ts';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts.ts';

/** Coordinates UI state and commands; the engine owns all simulation state. */
export function useStillroom() {
  const [{ settings, preset }, dispatch] = useReducer(settingsReducer, null, () =>
    createInitialState(window.matchMedia('(prefers-reduced-motion: reduce)').matches),
  );
  const [stats, setStats] = useState({ fps: 0, particles: 0, constraints: 0 });
  const [helpOpen, setHelpOpen] = useState(false);
  const engineRef = useRef<SceneEngine | null>(null);
  const stageRef = useRef<HTMLElement>(null);
  const { notice, notify } = useNotice();
  const audio = useAmbientSound(notify);
  const fullscreen = useFullscreen(stageRef, notify);

  const setSetting: SetSetting = useCallback(
    (key, value) => dispatch({ type: 'set', key, value } as SettingsAction),
    [],
  );
  const selectPreset = useCallback((name: string) => dispatch({ type: 'preset', name }), []);
  const togglePause = useCallback(() => dispatch({ type: 'toggle-pause' }), []);
  const openHelp = useCallback(() => setHelpOpen(true), []);
  const closeHelp = useCallback(() => setHelpOpen(false), []);
  const reset = useCallback(() => {
    engineRef.current?.reset();
    notify('A fresh start. Your curtain is restored.');
  }, [notify]);
  const addGust = useCallback(() => {
    setSetting('paused', false);
    engineRef.current?.gust();
    notify('A little breeze, coming through.');
  }, [setSetting, notify]);
  const saveImage = useCallback(() => {
    if (!engineRef.current) return;
    try {
      engineRef.current.snapshot();
      notify('Your quiet corner, saved.');
    } catch {
      notify('The room image could not be saved.');
    }
  }, [notify]);
  useKeyboardShortcuts({ setSetting, togglePause, reset, closeHelp, helpOpen });

  return {
    settings,
    preset,
    stats,
    setStats,
    helpOpen,
    notice,
    engineRef,
    stageRef,
    setSetting,
    selectPreset,
    togglePause,
    openHelp,
    closeHelp,
    reset,
    addGust,
    saveImage,
    ...audio,
    ...fullscreen,
  };
}
