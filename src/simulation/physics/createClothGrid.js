import { CLOTH_CONFIG } from "./config.js";

export function createClothGrid(config = CLOTH_CONFIG) {
const { columns, rows, left, top, width, height, depth, foldCount, foldAmplitude } = config;
    const points = [];
    const constraints = [];
    const faces = [];
    for (let y = 0; y <= rows; y++)
      for (let x = 0; x <= columns; x++) {
        const position = [
          left + (x / columns) * width,
          top - (y / rows) * height,
          depth + Math.cos((x / columns) * Math.PI * foldCount * 2) * foldAmplitude,
        ];
        points.push({ position, previous: [...position], initial: [...position], pinned: y === 0 });
      }
    const edges = new Map();
    const add = (a, b, type) => {
      const link = {
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
              return edges.get(`${Math.min(v, w)}:${Math.max(v, w)}`);
            }),
          });
      }
return { points, constraints, faces };
}
