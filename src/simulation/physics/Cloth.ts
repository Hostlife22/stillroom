import type { Particle, Constraint, Face, Grab, Forces } from './types.ts';
import { CLOTH_CONFIG } from './config.ts';
import { createClothGrid } from './createClothGrid.ts';

/** Particle solver. Positions are plain arrays; this module has no rendering dependencies. */
export class Cloth {
  points: Particle[];
  constraints: Constraint[];
  faces: Face[];
  time = 0;
  grab: Grab | null = null;

  constructor() {
    const grid = createClothGrid();
    this.points = grid.points;
    this.constraints = grid.constraints;
    this.faces = grid.faces;
  }

  reset() {
    Object.assign(this, createClothGrid());
    this.time = 0;
    this.grab = null;
  }

  get activeConstraintCount() {
    return this.constraints.reduce((count, link) => count + Number(link.active), 0);
  }

  cut(x: number, y: number, r: number = CLOTH_CONFIG.cutRadius) {
    let count = 0;
    for (const l of this.constraints) {
      if (!l.active) continue;
      const a = this.points[l.a].position,
        b = this.points[l.b].position;
      const dx = b[0] - a[0],
        dy = b[1] - a[1],
        t = Math.max(
          0,
          Math.min(1, ((x - a[0]) * dx + (y - a[1]) * dy) / (dx * dx + dy * dy || 1)),
        );
      if (Math.hypot(a[0] + dx * t - x, a[1] + dy * t - y) < r) {
        l.active = false;
        count++;
      }
    }
    return count;
  }
  step(dt: number, { wind = 25, stiffness = 75, damping = 60, gust = 0 }: Forces = {}) {
    this.time += dt;
    const t = this.time;
    for (let i = 0; i < this.points.length; i++) {
      const q = this.points[i];
      if (q.pinned) continue;
      const v = q.position.map((n, j) =>
        Math.max(-0.16, Math.min(0.16, (n - q.previous[j]) * (0.995 - damping * 0.00055))),
      );
      q.previous = [...q.position];
      const wave = Math.sin(t * 2.2 + q.position[1] * 1.3 + i * 0.013);
      q.position[0] += v[0] + (wind * 0.012 + gust * 9) * dt * dt;
      q.position[1] += v[1] - 9.8 * dt * dt;
      q.position[2] += v[2] + (wind * 0.11 + gust * 28) * (0.6 + wave * 0.4) * dt * dt;
    }
    for (let k = 0; k < CLOTH_CONFIG.iterations; k++) {
      for (const l of this.constraints) {
        if (!l.active) continue;
        const a = this.points[l.a],
          b = this.points[l.b];
        const dx = b.position[0] - a.position[0],
          dy = b.position[1] - a.position[1],
          dz = b.position[2] - a.position[2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (len < 1e-8) continue;
        const weights = (!a.pinned ? 1 : 0) + (!b.pinned ? 1 : 0);
        if (!weights) continue;
        const f =
          (((len - l.rest) / len) *
            (l.type === 'shear' ? 0.35 : 0.65) *
            (0.35 + stiffness * 0.0065)) /
          weights;
        if (!a.pinned) {
          a.position[0] += dx * f;
          a.position[1] += dy * f;
          a.position[2] += dz * f;
        }
        if (!b.pinned) {
          b.position[0] -= dx * f;
          b.position[1] -= dy * f;
          b.position[2] -= dz * f;
        }
      }
      for (const q of this.points) {
        if (q.pinned) {
          q.position = [...q.initial];
          continue;
        }
        q.position[0] = Math.max(-4.5, Math.min(4.5, q.position[0]));
        q.position[1] = Math.max(0.12, Math.min(5.6, q.position[1]));
        q.position[2] = Math.max(0.05, Math.min(3, q.position[2]));
      }
      if (this.grab) {
        const q = this.points[this.grab.index];
        if (!q.pinned) {
          const { target } = this.grab;
          for (let i = 0; i < 3; i++) q.position[i] += (target[i] - q.position[i]) * 0.65;
        }
      }
    }
  }
}
