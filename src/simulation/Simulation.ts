import type { SimulationSettings, SimulationStats } from './types.ts';
import { Cloth } from './physics/Cloth.ts';
import { SOLVER_CONFIG } from './physics/config.ts';

/** Owns simulation time and wind independently of requestAnimationFrame and React. */
export class Simulation {
  readonly cloth: Cloth;
  accumulator: number;
  gustStrength: number;

  constructor(cloth = new Cloth()) {
    this.cloth = cloth;
    this.accumulator = 0;
    this.gustStrength = 0;
  }

  advance(elapsed: number, settings: SimulationSettings) {
    if (settings.paused) {
      this.accumulator = 0;
      return;
    }
    this.accumulator += Math.max(0, Math.min(elapsed, SOLVER_CONFIG.maxFrameTime));
    while (this.accumulator >= SOLVER_CONFIG.timestep) {
      this.cloth.step(SOLVER_CONFIG.timestep, { ...settings, gust: this.gustStrength });
      this.accumulator -= SOLVER_CONFIG.timestep;
      this.gustStrength *= SOLVER_CONFIG.gustDecay;
    }
  }

  addGust(strength = 2) {
    this.gustStrength = strength;
  }

  reset() {
    this.cloth.reset();
    this.accumulator = 0;
    this.gustStrength = 0;
  }

  getStats(fps: number): SimulationStats {
    return {
      fps,
      particles: this.cloth.points.length,
      constraints: this.cloth.activeConstraintCount,
    };
  }
}
