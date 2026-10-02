import {
  Hand,
  RotateCcw,
  Pause,
  Play,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Check,
} from 'lucide-react';
import type { RefObject } from 'react';
import { ClothScene } from './ClothScene.tsx';
import type { ClothSceneProps } from './ClothScene.tsx';

interface SimulationStageProps extends ClothSceneProps {
  stageRef: RefObject<HTMLElement | null>;
  sound: boolean;
  fullscreen: boolean;
  notice: string;
  toggleSound: () => void;
  toggleFullscreen: () => void;
  togglePause: () => void;
  reset: () => void;
}

export function SimulationStage({
  settings,
  stageRef,
  engineRef,
  onStats,
  sound,
  toggleSound,
  fullscreen,
  toggleFullscreen,
  togglePause,
  reset,
  notice,
}: SimulationStageProps) {
  return (
    <section className="stage" ref={stageRef}>
      <ClothScene settings={settings} engineRef={engineRef} onStats={onStats} />
      <div className="scene-top">
        <span className="scene-label">
          <span /> The quiet corner <span className="label-divider" /> 01
        </span>
        <button
          className="glass icon-button"
          aria-label={sound ? 'Mute ambient sound' : 'Play ambient sound'}
          aria-pressed={sound}
          onClick={toggleSound}
        >
          {sound ? <Volume2 size={17} /> : <VolumeX size={17} />}
        </button>
      </div>
      <div className="scene-caption">
        <span className="tiny-sun">☼</span> SUNLIT ROOM <span>·</span>{' '}
        {settings.light ? '9:41 AM' : '6:18 PM'}
      </div>
      <div className="interaction-hint">
        <Hand size={17} />
        <span>
          {settings.tool === 'grab'
            ? 'Reach out. Give it a gentle pull.'
            : settings.tool === 'wind'
              ? 'Press and hold to send a breeze.'
              : 'Trace a line to cut the fabric.'}
        </span>
      </div>
      <div className="scene-bottom">
        <div className="scene-controls">
          <button
            className="glass icon-button"
            onClick={togglePause}
            aria-label={settings.paused ? 'Resume simulation' : 'Pause simulation'}
          >
            {settings.paused ? <Play size={17} /> : <Pause size={17} />}
          </button>
          <button className="glass icon-button" onClick={reset} aria-label="Reset curtain">
            <RotateCcw size={17} />
          </button>
          <span>{settings.paused ? 'A moment of stillness' : 'Make yourself at home.'}</span>
        </div>
        <button
          className="glass icon-button"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen ? <Minimize2 size={17} /> : <Maximize2 size={17} />}
        </button>
      </div>
      {notice && (
        <div className="toast" role="status">
          <Check size={15} />
          {notice}
        </div>
      )}
    </section>
  );
}
