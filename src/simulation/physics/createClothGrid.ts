import type { Particle, Constraint, Face, ClothGrid } from './types.ts';
import type { Coordinates } from '../types.ts';
import { CLOTH_CONFIG } from './config.ts';

export function createClothGrid(config = CLOTH_CONFIG): ClothGrid {
  const { columns, rows, left, top, width, height, depth, foldCount, foldAmplitude } = config;
  const points: Particle[] = [];
  const constraints: Constraint[] = [];
  const faces: Face[] = [];
  for (let y = 0; y <= rows; y++)
    for (let x = 0; x <= columns; x++) {
      const position: Coordinates = [
        left + (x / columns) * width,
        top - (y / rows) * height,
        depth + Math.cos((x / columns) * Math.PI * foldCount * 2) * foldAmplitude,
      ];
      points.push({ position, previous: [...position], initial: [...position], pinned: y === 0 });
    }
  const edges = new Map<string, Constraint>();
  const add = (a: number, b: number, type: Constraint['type']) => {
    const link: Constraint = {
      a,
      b,
      rest: Math.hypot(...points[a].position.map((v, i) => v - points[b].position[i])),
      type,
      active: true,
    };
    constraints.push(link);
    edges.set(`${Math.min(a, b)}:${Math.max(a, b)}`, link);
    return link;
  };
  for (let y = 0; y <= rows; y++)
    for (let x = 0; x <= columns; x++) {
      const a = y * (columns + 1) + x;
      if (x < columns) add(a, a + 1, 'structural');
      if (y < rows) add(a, a + columns + 1, 'structural');
      if (x < columns && y < rows) {
        add(a, a + columns + 2, 'shear');
        add(a + 1, a + columns + 1, 'shear');
      }
    }
  for (let y = 0; y < rows; y++)
    for (let x = 0; x < columns; x++) {
      const a = y * (columns + 1) + x,
        b = a + 1,
        c = a + columns + 1,
        d = c + 1;
      for (const ids of [
        [a, c, b],
        [b, c, d],
      ])
        faces.push({
          ids,
          edges: ids.map((v, i) => {
            const w = ids[(i + 1) % 3];
            const edge = edges.get(`${Math.min(v, w)}:${Math.max(v, w)}`);
            if (!edge) throw new Error('Missing cloth face constraint.');
            return edge;
          }),
        });
    }
  return { points, constraints, faces };
}
