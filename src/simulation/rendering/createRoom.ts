import * as THREE from 'three';

/** Static room geometry and lights; all objects are owned by the returned scene. */
export function createRoom() {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#dbd6c7');
  const hemi = new THREE.HemisphereLight('#fff5dc', '#b3aa8e', 2.6);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#ffedd0', 4);
  sun.position.set(-3, 8, 5);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -9, right: 9, top: 10, bottom: -8 });
  sun.shadow.bias = -0.001;
  sun.shadow.normalBias = 0.025;
  sun.shadow.radius = 4;
  scene.add(sun);
  const mat = (color: THREE.ColorRepresentation, roughness = 1) =>
    new THREE.MeshStandardMaterial({ color, roughness });
  const plaster = mat('#dbd3c1'),
    wood = mat('#9d7750'),
    trim = mat('#e8e0ce'),
    dark = mat('#4f4939');
  function box(
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    m: THREE.Material,
  ) {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), m);
    mesh.position.set(x, y, z);
    mesh.receiveShadow = true;
    mesh.castShadow = true;
    scene.add(mesh);
    return mesh;
  }
  box(15, 0.15, 11, 0, -0.1, 2, mat('#a58a67'));
  for (let i = -7; i < 8; i++) box(0.013, 0.005, 11, i, 0.0, 2, mat('#88714f'));
  box(5.1, 8, 0.18, -5.05, 4, -0.35, plaster);
  box(5.3, 8, 0.18, 4.75, 4, -0.35, plaster);
  box(4.85, 1.5, 0.18, -0.075, 6.95, -0.35, plaster);
  box(4.85, 0.65, 0.18, -0.075, 0.325, -0.35, plaster);
  box(4.8, 5.5, 0.06, -0.05, 3.45, -0.6, new THREE.MeshBasicMaterial({ color: '#dbe0cd' }));
  for (let i = 0; i < 14; i++) {
    const m = new THREE.Mesh(
      new THREE.SphereGeometry(0.4 + Math.random() * 0.6, 12, 8),
      mat(i % 2 ? '#a4ae87' : '#b9bf9d'),
    );
    m.position.set(-2.5 + Math.random() * 5, 0.7 + Math.random() * 2, -0.55);
    m.scale.z = 0.04;
    scene.add(m);
  }
  for (const x of [-2.5, -0.05, 2.4]) box(0.1, 5.7, 0.22, x, 3.4, -0.12, trim);
  for (const y of [0.55, 3.4, 6.2]) box(5, 0.1, 0.24, -0.05, y, -0.1, trim);
  box(5.25, 0.13, 0.48, -0.05, 0.55, 0.02, trim);
  box(15, 0.18, 0.1, 0, 0.14, -0.18, trim);
  function cylinder(
    rt: number,
    rb: number,
    h: number,
    x: number,
    y: number,
    z: number,
    m: THREE.Material,
  ) {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rt, rb, h, 40), m);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }
  const rod = cylinder(0.035, 0.035, 4.3, -0.27, 5.58, 0.55, dark);
  rod.rotation.z = Math.PI / 2;
  for (let i = 0; i < 17; i++) {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(0.067, 0.012, 8, 20), dark);
    ring.position.set(-2.15 + (i / 16) * 3.65, 5.49, 0.55);
    scene.add(ring);
  }
  // A low linen lounge chair and a little oak side table.
  const seat = mat('#ddd6c4');
  box(2.5, 0.55, 1.8, 3.25, 0.8, 1.6, seat);
  const back = box(2.5, 1.25, 0.45, 3.25, 1.55, 0.85, seat);
  back.rotation.x = -0.12;
  box(0.32, 0.65, 1.85, 2.1, 1.13, 1.6, seat);
  box(0.32, 0.65, 1.85, 4.4, 1.13, 1.6, seat);
  for (const x of [2.3, 4.2]) for (const z of [1.1, 2.15]) box(0.12, 0.55, 0.12, x, 0.3, z, wood);
  const pillow = box(0.8, 0.65, 0.23, 3, 1.55, 1.2, mat('#8b8d69'));
  pillow.rotation.z = -0.12;
  cylinder(0.69, 0.69, 0.12, 1.4, 0.72, 3, wood);
  for (let i = 0; i < 3; i++) {
    const a = (i * Math.PI * 2) / 3;
    box(0.075, 0.67, 0.075, 1.4 + Math.cos(a) * 0.44, 0.34, 3 + Math.sin(a) * 0.44, wood);
  }
  cylinder(0.12, 0.1, 0.18, 1.45, 0.88, 3, mat('#e8e0cf'));
  box(0.48, 0.045, 0.34, 1.15, 0.81, 2.9, mat('#657259'));
  cylinder(0.34, 0.26, 0.58, -3.15, 0.3, 1, mat('#ae7958'));
  cylinder(0.3, 0.3, 0.025, -3.15, 0.6, 1, mat('#484131'));
  const leafMat = mat('#566847');
  for (let i = 0; i < 15; i++) {
    const a = i * 2.4,
      y = 0.75 + i * 0.095;
    cylinder(0.012, 0.015, y, -3.15, 0.6 + y / 2, 1, dark);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(1, 12, 8), leafMat);
    leaf.scale.set(0.3, 0.065, 0.13);
    leaf.position.set(-3.15 + Math.sin(a) * 0.25, 0.7 + y, 1 + Math.cos(a) * 0.23);
    leaf.rotation.set(0.4, a, Math.sin(a) * 0.7);
    scene.add(leaf);
  }
  const rug = box(5.4, 0.018, 3.2, 0.1, 0.012, 3.4, mat('#c7baa0'));
  rug.rotation.y = -0.06;
  // Light falling through the window onto the oak floor.
  const lightMat = new THREE.MeshBasicMaterial({
    color: '#f7e5b1',
    transparent: true,
    opacity: 0.16,
    depthWrite: false,
  });
  for (let i = 0; i < 2; i++) {
    const p = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 4), lightMat);
    p.rotation.x = -Math.PI / 2;
    p.rotation.z = -0.42;
    p.position.set(-1 + i * 1.85, 0.028, 1.7);
    scene.add(p);
  }

  return {
    scene,
    setLighting(enabled: boolean) {
      sun.intensity = enabled ? 4 : 1.1;
    },
  };
}
