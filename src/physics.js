export const COLS = 28,
  ROWS = 36;
export class Cloth {
  constructor() {
    this.reset();
  }
  reset() {
    this.points = [];
    this.links = [];
    this.faces = [];
    this.time = 0;
    this.grab = null;
    for (let y = 0; y <= ROWS; y++)
      for (let x = 0; x <= COLS; x++) {
        const p = [
          -2.15 + (x / COLS) * 3.65,
          5.45 - (y / ROWS) * 4.55,
          0.52 + Math.cos((x / COLS) * Math.PI * 16) * 0.115,
        ];
        this.points.push({ p: [...p], old: [...p], home: [...p], pin: y === 0 });
      }
    const edges = new Map();
    const add = (a, b, type) => {
      const link = {
        a,
        b,
        rest: Math.hypot(...this.points[a].p.map((v, i) => v - this.points[b].p[i])),
        type,
        active: true,
      };
      this.links.push(link);
      edges.set(`${Math.min(a, b)}:${Math.max(a, b)}`, link);
      return link;
    };
    for (let y = 0; y <= ROWS; y++)
      for (let x = 0; x <= COLS; x++) {
        const a = y * (COLS + 1) + x;
        if (x < COLS) add(a, a + 1, 'structural');
        if (y < ROWS) add(a, a + COLS + 1, 'structural');
        if (x < COLS && y < ROWS) {
          add(a, a + COLS + 2, 'shear');
          add(a + 1, a + COLS + 1, 'shear');
        }
      }
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const a = y * (COLS + 1) + x,
          b = a + 1,
          c = a + COLS + 1,
          d = c + 1;
        for (const ids of [
          [a, c, b],
          [b, c, d],
        ])
          this.faces.push({
            ids,
            edges: ids.map((v, i) => {
              const w = ids[(i + 1) % 3];
              return edges.get(`${Math.min(v, w)}:${Math.max(v, w)}`);
            }),
          });
      }
  }
  cut(x, y, r = 0.16) {
    let count = 0;
    for (const l of this.links) {
      if (!l.active) continue;
      const a = this.points[l.a].p,
        b = this.points[l.b].p;
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
  step(dt, { wind = 25, stiffness = 75, damping = 60, gust = 0 } = {}) {
    this.time += dt;
    const t = this.time;
    for (let i = 0; i < this.points.length; i++) {
      const q = this.points[i];
      if (q.pin) continue;
      const v = q.p.map((n, j) =>
        Math.max(-0.16, Math.min(0.16, (n - q.old[j]) * (0.995 - damping * 0.00055))),
      );
      q.old = [...q.p];
      const wave = Math.sin(t * 2.2 + q.p[1] * 1.3 + i * 0.013);
      q.p[0] += v[0] + (wind * 0.012 + gust * 9) * dt * dt;
      q.p[1] += v[1] - 9.8 * dt * dt;
      q.p[2] += v[2] + (wind * 0.11 + gust * 28) * (0.6 + wave * 0.4) * dt * dt;
    }
    for (let k = 0; k < 9; k++) {
      for (const l of this.links) {
        if (!l.active) continue;
        const a = this.points[l.a],
          b = this.points[l.b];
        const dx = b.p[0] - a.p[0],
          dy = b.p[1] - a.p[1],
          dz = b.p[2] - a.p[2];
        const len = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (len < 1e-8) continue;
        const weights = (!a.pin ? 1 : 0) + (!b.pin ? 1 : 0);
        if (!weights) continue;
        const f =
          (((len - l.rest) / len) *
            (l.type === 'shear' ? 0.35 : 0.65) *
            (0.35 + stiffness * 0.0065)) /
          weights;
        if (!a.pin) {
          a.p[0] += dx * f;
          a.p[1] += dy * f;
          a.p[2] += dz * f;
        }
        if (!b.pin) {
          b.p[0] -= dx * f;
          b.p[1] -= dy * f;
          b.p[2] -= dz * f;
        }
      }
      for (const q of this.points) {
        if (q.pin) {
          q.p = [...q.home];
          continue;
        }
        q.p[0] = Math.max(-4.5, Math.min(4.5, q.p[0]));
        q.p[1] = Math.max(0.12, Math.min(5.6, q.p[1]));
        q.p[2] = Math.max(0.05, Math.min(3, q.p[2]));
      }
      if (this.grab) {
        const q = this.points[this.grab.index];
        if (!q.pin) q.p = q.p.map((n, i) => n + (this.grab.target[i] - n) * 0.65);
      }
    }
  }
}
