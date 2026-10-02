import * as THREE from 'three';
import type { Cloth } from '../physics/Cloth.ts';
import type { SimulationSettings } from '../types.ts';

/** Projects solver data into GPU buffers without allocating geometry each frame. */
export function createClothView(cloth: Cloth) {
  const group = new THREE.Group();
  const geometry = new THREE.BufferGeometry();
  const positions = new THREE.BufferAttribute(new Float32Array(cloth.points.length * 3), 3);
  positions.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positions);
  const material = new THREE.MeshStandardMaterial({
    color: '#85896b',
    roughness: 0.96,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  group.add(mesh);

  const wireGeometry = new THREE.BufferGeometry();
  const wirePositions = new THREE.BufferAttribute(
    new Float32Array(cloth.constraints.length * 6),
    3,
  );
  wirePositions.setUsage(THREE.DynamicDrawUsage);
  wireGeometry.setAttribute('position', wirePositions);
  const wire = new THREE.LineSegments(
    wireGeometry,
    new THREE.LineBasicMaterial({
      color: '#e4e8cf',
      transparent: true,
      opacity: 0.35,
    }),
  );
  wire.visible = false;
  group.add(wire);

  function syncTopology() {
    geometry.setIndex(
      cloth.faces
        .filter((face) => face.edges.every((edge) => edge.active))
        .flatMap((face) => face.ids),
    );
  }

  function update({ color, mesh: showWireframe }: Pick<SimulationSettings, 'color' | 'mesh'>) {
    cloth.points.forEach((particle, index) => positions.array.set(particle.position, index * 3));
    positions.needsUpdate = true;
    geometry.computeVertexNormals();
    geometry.computeBoundingSphere();
    material.color.set(color);
    wire.visible = showWireframe;
    if (showWireframe) {
      let offset = 0;
      for (const link of cloth.constraints) {
        if (!link.active) continue;
        wirePositions.array.set(cloth.points[link.a].position, offset);
        wirePositions.array.set(cloth.points[link.b].position, offset + 3);
        offset += 6;
      }
      wirePositions.needsUpdate = true;
      wireGeometry.setDrawRange(0, offset / 3);
      wireGeometry.boundingSphere = geometry.boundingSphere?.clone() ?? null;
    }
  }

  syncTopology();
  update({ color: '#85896b', mesh: false });
  return { group, mesh, syncTopology, update };
}
