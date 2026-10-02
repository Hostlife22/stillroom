import test from 'node:test';
import assert from 'node:assert/strict';
import { Simulation } from './Simulation.ts';
import type { SimulationSettings } from './types.ts';

const settings: SimulationSettings = {
  tool: 'grab',
  wind: 25,
  damping: 60,
  stiffness: 75,
  color: '#85896b',
  mesh: false,
  light: true,
  paused: false,
};

test('fixed-step simulation is independent of render frame grouping', () => {
  const fast = new Simulation();
  const slow = new Simulation();
  for (let i = 0; i < 60; i++) fast.advance(1 / 120, settings);
  for (let i = 0; i < 10; i++) slow.advance(1 / 20, settings);
  assert.deepEqual(fast.cloth.points, slow.cloth.points);
});

test('pause drops accumulated time and resume does not replay it', () => {
  const simulation = new Simulation();
  simulation.advance(1 / 240, settings);
  simulation.addGust();
  const before = structuredClone(simulation.cloth.points);
  simulation.advance(10, { ...settings, paused: true });
  assert.deepEqual(simulation.cloth.points, before);
  assert.equal(simulation.accumulator, 0);
  assert.equal(simulation.gustStrength, 2);
  simulation.advance(1 / 120, settings);
  assert.equal(simulation.cloth.time, 1 / 120);
});

test('long frames are capped and reset clears forces, drag, and cuts', () => {
  const simulation = new Simulation();
  simulation.advance(60, settings);
  assert(simulation.cloth.time <= 0.05 + Number.EPSILON);
  simulation.addGust();
  simulation.cloth.grab = { index: 700, target: [1, 3, 1] };
  simulation.cloth.cut(0, 3);
  assert(simulation.cloth.activeConstraintCount < 4096);
  simulation.reset();
  assert.equal(simulation.gustStrength, 0);
  assert.equal(simulation.accumulator, 0);
  assert.equal(simulation.cloth.grab, null);
  assert.deepEqual(simulation.getStats(60), { fps: 60, particles: 1073, constraints: 4096 });
});
