import type { Coordinates } from '../types.ts';

export interface Particle {
  position: Coordinates;
  previous: Coordinates;
  initial: Coordinates;
  pinned: boolean;
}

export interface Constraint {
  a: number;
  b: number;
  rest: number;
  type: 'structural' | 'shear';
  active: boolean;
}

export interface Face {
  ids: number[];
  edges: Constraint[];
}

export interface ClothGrid {
  points: Particle[];
  constraints: Constraint[];
  faces: Face[];
}

export interface Grab {
  index: number;
  target: Coordinates;
}

export interface Forces {
  wind?: number;
  stiffness?: number;
  damping?: number;
  gust?: number;
}
