import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { createSceneEngine } from '../simulation/createSceneEngine.ts';
import type { SceneEngine, SimulationSettings, SimulationStats } from '../simulation/types.ts';

export interface ClothSceneProps {
  settings: SimulationSettings;
  engineRef: RefObject<SceneEngine | null>;
  onStats: (stats: SimulationStats) => void;
}

export function ClothScene({ settings, engineRef, onStats }: ClothSceneProps) {
  const host = useRef<HTMLDivElement>(null);
  const initialSettings = useRef(settings);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let engine: SceneEngine | undefined;
    try {
      engine = createSceneEngine(element, initialSettings.current, onStats);
      engineRef.current = engine;
    } catch (error) {
      console.error('Could not create the cloth scene.', error);
      setFailed(true);
    }
    return () => {
      engine?.dispose();
      if (engineRef.current === engine) engineRef.current = null;
    };
  }, [engineRef, onStats]);

  useEffect(() => {
    engineRef.current?.setSettings(settings);
  }, [engineRef, settings]);

  return (
    <div
      ref={host}
      className={`scene-canvas tool-${settings.tool}`}
      role="img"
      aria-label="Interactive sunlit room with a simulated linen curtain. Choose a tool, then drag on the curtain."
    >
      {failed && (
        <p className="scene-error" role="alert">
          The room could not load. Try a browser with WebGL enabled.
        </p>
      )}
    </div>
  );
}
