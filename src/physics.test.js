import test from 'node:test';
import assert from 'node:assert/strict';
import { Cloth } from './physics.js';
test('cloth remains finite and pinned during sustained extreme wind and dragging', () => {
  const c = new Cloth();
  c.grab = { index: 700, target: [4.5, 5, 3] };
  for (let i = 0; i < 1000; i++) {
    c.step(1 / 120, { wind: 100, stiffness: 0, damping: 0, gust: 2 });
    if (i === 300) c.grab = null;
  }
  for (const q of c.points) {
    assert(q.p.every(Number.isFinite));
    assert(q.p[1] >= 0.12 && q.p[1] <= 5.6);
    assert(q.p[2] >= 0.05 && q.p[2] <= 3);
    if (q.pin) assert.deepEqual(q.p, q.home);
  }
});
test('cuts break structural and shear links, release fabric, and reset restores it', () => {
  const c = new Cloth(),
    n = c.links.length;
  for (let x = -2.2; x < 1.6; x += 0.1) c.cut(x, 3, 0.13);
  assert(c.links.some((l) => !l.active && l.type === 'structural'));
  assert(c.links.some((l) => !l.active && l.type === 'shear'));
  assert(c.faces.some((f) => f.edges.some((e) => !e.active)));
  for (let i = 0; i < 500; i++) c.step(1 / 120, { wind: 0 });
  assert(c.points.at(-1).p[1] < 0.5);
  assert(c.points.every((q) => q.p.every(Number.isFinite)));
  c.reset();
  assert.equal(c.links.length, n);
  assert(c.links.every((l) => l.active));
});
