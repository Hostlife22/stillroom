import React, { useEffect, useRef, useState } from 'react';
import { createSceneEngine } from '../simulation/createSceneEngine.js';

export function ClothScene({ settings, engineRef, onStats }) {
  const host = useRef(null);
  const initialSettings = useRef(settings);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let engine;
    try {
      engine = createSceneEngine(host.current, initialSettings.current, onStats);
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

  useEffect(() => { engineRef.current?.setSettings(settings); }, [engineRef, settings]);

  return <div ref={host} className={`scene-canvas tool-${settings.tool}`} role="img"
    aria-label="Interactive sunlit room with a simulated linen curtain. Choose a tool, then drag on the curtain.">
    {failed && <p className="scene-error" role="alert">The room could not load. Try a browser with WebGL enabled.</p>}
  </div>;
}
