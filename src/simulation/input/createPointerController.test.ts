import test from 'node:test';
import assert from 'node:assert/strict';
import { PerspectiveCamera, Vector3, Scene } from 'three';
import { Simulation } from '../Simulation.ts';
import { createClothView } from '../rendering/createClothView.ts';
import { disposeScene } from '../rendering/disposeScene.ts';
import { createPointerController } from './createPointerController.ts';
import type { Tool } from '../types.ts';

// Only the DOM surface is replaced; raycasting, cloth geometry, and physics are real.
class PointerSurface extends EventTarget {
  captured: number | null = null;
  getBoundingClientRect() {
    return { left: 0, top: 0, width: 900, height: 700 };
  }
  setPointerCapture(id: number) {
    this.captured = id;
  }
  hasPointerCapture(id: number) {
    return this.captured === id;
  }
  releasePointerCapture() {
    this.captured = null;
  }
}

function setup(tool: Tool) {
  const element = new PointerSurface();
  const camera = new PerspectiveCamera(41, 900 / 700, 0.1, 80);
  camera.position.set(7.1, 4.5, 12.8);
  camera.lookAt(0.1, 2.7, 0);
  camera.updateMatrixWorld();
  const simulation = new Simulation();
  const view = createClothView(simulation.cloth);
  const scene = new Scene();
  scene.add(view.group);
  scene.updateMatrixWorld();
  let cutUpdates = 0;
  const controller = createPointerController({
    element: element as unknown as HTMLElement,
    camera,
    mesh: view.mesh,
    simulation,
    getTool: () => tool,
    onCut: () => {
      cutUpdates++;
      view.syncTopology();
    },
  });
  const send = (type: string, point: Vector3, pointerId = 1, button = 0) => {
    const projected = point.clone().project(camera);
    element.dispatchEvent(
      Object.assign(new Event(type), {
        clientX: ((projected.x + 1) / 2) * 900,
        clientY: ((1 - projected.y) / 2) * 700,
        pointerId,
        button,
      }),
    );
  };
  const cleanup = () => {
    controller.dispose();
    disposeScene(scene);
  };
  return {
    simulation,
    view,
    send,
    controller,
    element,
    cleanup,
    get cutUpdates() {
      return cutUpdates;
    },
  };
}

test('raycast grabs movable fabric and pointer coordinates update its target', (t) => {
  const fixture = setup('grab');
  t.after(fixture.cleanup);
  const { simulation, send } = fixture;
  const point = new Vector3(...simulation.cloth.points[700].position);
  send('pointerdown', point);
  assert(simulation.cloth.grab, 'The actual cloth mesh should be picked.');
  assert.equal(fixture.element.captured, 1);
  const target = new Vector3(1, 3.4, point.z);
  send('pointermove', target);
  const grabbed = simulation.cloth.grab;
  assert(Math.abs(grabbed.target[0] - target.x) < 0.05);
  const before = [...simulation.cloth.points[grabbed.index].position];
  simulation.cloth.step(1 / 120);
  assert.notDeepEqual(simulation.cloth.points[grabbed.index].position, before);
  send('pointerup', target);
  assert.equal(simulation.cloth.grab, null);
  assert.equal(fixture.element.captured, null);
});

test('continuous cut removes both spring types and affected mesh faces', (t) => {
  const fixture = setup('cut');
  t.after(fixture.cleanup);
  const initialIndices = fixture.view.mesh.geometry.index!.count;
  fixture.send('pointerdown', new Vector3(-2.5, 3, 0.6));
  fixture.send('pointermove', new Vector3(1.8, 3, 0.6));
  const links = fixture.simulation.cloth.constraints;
  assert(links.some((link) => !link.active && link.type === 'structural'));
  assert(links.some((link) => !link.active && link.type === 'shear'));
  assert(fixture.cutUpdates > 0);
  assert(fixture.view.mesh.geometry.index!.count < initialIndices);
});

test('secondary pointers cannot move or release an active grab', (t) => {
  const fixture = setup('grab');
  t.after(fixture.cleanup);
  const point = new Vector3(...fixture.simulation.cloth.points[700].position);
  fixture.send('pointerdown', point);
  const target = [...fixture.simulation.cloth.grab!.target];
  fixture.send('pointerdown', new Vector3(2, 4, 1), 2);
  fixture.send('pointermove', new Vector3(2, 4, 1), 2);
  fixture.send('pointerup', point, 2);
  assert.deepEqual(fixture.simulation.cloth.grab!.target, target);
  fixture.send('pointercancel', point);
  assert.equal(fixture.simulation.cloth.grab, null);
});

test('dispose releases the gesture and removes listeners', () => {
  const fixture = setup('wind');
  const point = new Vector3(0, 3, 0.6);
  fixture.send('pointerdown', point);
  assert.equal(fixture.simulation.gustStrength, 1.5);
  fixture.cleanup();
  fixture.simulation.gustStrength = 0;
  fixture.send('pointerdown', point);
  assert.equal(fixture.simulation.gustStrength, 0);
  assert.equal(fixture.element.captured, null);
});
