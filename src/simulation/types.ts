export type Coordinates = [number, number, number];

export type Tool = 'grab' | 'wind' | 'cut';

export interface SimulationSettings {
  tool: Tool;
  wind: number;
  stiffness: number;
  damping: number;
  color: string;
  mesh: boolean;
  light: boolean;
  paused: boolean;
}

export type SetSetting = <Key extends keyof SimulationSettings>(
  key: Key,
  value: SimulationSettings[Key],
) => void;

export type Notify = (message: string) => void;

export interface SimulationStats {
  fps: number;
  particles: number;
  constraints: number;
}

export interface SceneEngine {
  setSettings(settings: SimulationSettings): void;
  reset(): void;
  gust(): void;
  snapshot(): void;
  dispose(): void;
}
