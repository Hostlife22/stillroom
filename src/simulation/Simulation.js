import { Cloth } from './physics/Cloth.js';
import { SOLVER_CONFIG } from './physics/config.js';

/** Owns simulation time and wind independently of requestAnimationFrame and React. */
export class Simulation {
  constructor(cloth = new Cloth()) {
    this.cloth = cloth;
    this.accumulator = 0;
    this.gustStrength = 0;
  }

  advance(elapsed, settings) {
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

  addGust(strength = 2) { this.gustStrength = strength; }

  reset() {
    this.cloth.reset();
    this.accumulator = 0;
    this.gustStrength = 0;
  }

  getStats(fps) {
    return { fps, particles: this.cloth.points.length, constraints: this.cloth.activeConstraintCount };
  }
}
