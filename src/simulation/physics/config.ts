export const CLOTH_CONFIG = Object.freeze({
  columns: 28,
  rows: 36,
  width: 3.65,
  height: 4.55,
  left: -2.15,
  top: 5.45,
  depth: 0.52,
  foldAmplitude: 0.115,
  foldCount: 8,
  iterations: 9,
  cutRadius: 0.16,
});

export const SOLVER_CONFIG = Object.freeze({
  timestep: 1 / 120,
  maxFrameTime: 1 / 20,
  gustDecay: 0.994,
});
