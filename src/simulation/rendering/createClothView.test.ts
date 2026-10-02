import test from 'node:test';
import assert from 'node:assert/strict';
import { Scene, LineSegments, Mesh, BoxGeometry, MeshStandardMaterial } from 'three';
import { Cloth } from '../physics/Cloth.ts';
import { createClothView } from './createClothView.ts';
import { disposeScene } from './disposeScene.ts';

test('wireframe buffers are reused and track active constraints after cuts and reset', (t) => {
  const cloth = new Cloth();
  const view = createClothView(cloth);
  const scene = new Scene();
  scene.add(view.group);
  t.after(() => disposeScene(scene));
  const wire = view.group.children.find((child) => child instanceof LineSegments) as LineSegments;
  const buffer = wire.geometry.getAttribute('position');
  view.update({ color: '#af7864', mesh: true });
  assert.equal(wire.geometry.drawRange.count, 8192);
  assert.equal(view.mesh.geometry.index!.count, 6048);
  for (let x = -2.2; x < 1.6; x += 0.1) cloth.cut(x, 3);
  view.syncTopology();
  view.update({ color: '#af7864', mesh: true });
  assert.equal(wire.geometry.getAttribute('position'), buffer);
  assert.equal(wire.geometry.drawRange.count, cloth.activeConstraintCount * 2);
  assert(view.mesh.geometry.index!.count < 6048);
  assert([...view.mesh.geometry.getAttribute('normal').array].every(Number.isFinite));
  cloth.reset();
  view.syncTopology();
  view.update({ color: '#85896b', mesh: false });
  assert.equal(wire.visible, false);
  assert.equal(view.mesh.geometry.index!.count, 6048);
});

test('scene cleanup disposes shared resources once and can be called repeatedly', () => {
  const scene = new Scene();
  const geometry = new BoxGeometry();
  const material = new MeshStandardMaterial();
  let geometryDisposals = 0;
  let materialDisposals = 0;
  geometry.addEventListener('dispose', () => geometryDisposals++);
  material.addEventListener('dispose', () => materialDisposals++);
  scene.add(new Mesh(geometry, material), new Mesh(geometry, material));
  disposeScene(scene);
  disposeScene(scene);
  assert.equal(geometryDisposals, 1);
  assert.equal(materialDisposals, 1);
  assert.equal(scene.children.length, 0);
});
