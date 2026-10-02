import type { Camera, Mesh } from 'three';
import type { Simulation } from '../Simulation.ts';
import type { Tool } from '../types.ts';
import { Plane, Raycaster, Vector2, Vector3 } from 'three';

const DEFAULT_DEPTH = 0.6;
const CUT_SPACING = 0.08;
const PICK_RADIUS = 0.6;

/** Owns one pointer gesture and releases both capture and particle state on teardown. */
interface PointerOptions {
  element: HTMLElement;
  camera: Camera;
  mesh: Mesh;
  simulation: Simulation;
  getTool: () => Tool;
  onCut: () => void;
}

export function createPointerController({
  element,
  camera,
  mesh,
  simulation,
  getTool,
  onCut,
}: PointerOptions) {
  const ray = new Raycaster();
  const pointer = new Vector2();
  const plane = new Plane(new Vector3(0, 0, 1), -DEFAULT_DEPTH);
  const hit = new Vector3();
  const cloth = simulation.cloth;
  let pointerId: number | null = null;
  let previous: Vector3 | null = null;
  let tool: Tool | null = null;

  function locate(event: PointerEvent) {
    const bounds = element.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return null;
    pointer.set(
      ((event.clientX - bounds.left) / bounds.width) * 2 - 1,
      1 - ((event.clientY - bounds.top) / bounds.height) * 2,
    );
    ray.setFromCamera(pointer, camera);
    return ray.ray.intersectPlane(plane, hit)?.clone() ?? null;
  }

  function apply(event: PointerEvent) {
    const position = locate(event);
    if (!position) return;
    if (tool === 'cut') {
      let changed = 0;
      const steps = previous ? Math.ceil(position.distanceTo(previous) / CUT_SPACING) : 0;
      for (let i = 0; i <= steps; i++) {
        const point = previous ? previous.clone().lerp(position, i / (steps || 1)) : position;
        changed += cloth.cut(point.x, point.y);
      }
      if (changed) onCut();
      previous = position;
    } else if (tool === 'wind') {
      simulation.addGust(1.5);
    } else if (cloth.grab) {
      cloth.grab.target = position.toArray();
    }
  }

  function start(event: PointerEvent) {
    if (pointerId !== null || (event.button !== undefined && event.button !== 0)) return;
    if (!locate(event)) return;
    pointerId = event.pointerId;
    tool = getTool();
    element.setPointerCapture(pointerId);
    if (tool === 'grab') {
      mesh.updateMatrixWorld();
      const intersection = ray.intersectObject(mesh)[0];
      if (intersection) {
        let index = -1;
        let distance = PICK_RADIUS;
        cloth.points.forEach((particle, candidate) => {
          const next = intersection.point.distanceTo(new Vector3(...particle.position));
          if (!particle.pinned && next < distance) {
            distance = next;
            index = candidate;
          }
        });
        if (index >= 0) {
          plane.constant = -intersection.point.z;
          cloth.grab = { index, target: [...cloth.points[index].position] };
        }
      }
    }
    apply(event);
  }

  function move(event: PointerEvent) {
    if (event.pointerId === pointerId) apply(event);
  }

  function release(event?: PointerEvent) {
    if (event && event.pointerId !== pointerId) return;
    const captured = pointerId;
    pointerId = null;
    cloth.grab = null;
    previous = null;
    tool = null;
    plane.constant = -DEFAULT_DEPTH;
    if (captured !== null && element.hasPointerCapture(captured))
      element.releasePointerCapture(captured);
  }

  const listeners = {
    pointerdown: start,
    pointermove: move,
    pointerup: release,
    pointercancel: release,
    lostpointercapture: release,
  };
  for (const [name, handler] of Object.entries(listeners))
    element.addEventListener(name, handler as EventListener);
  return {
    release,
    dispose() {
      for (const [name, handler] of Object.entries(listeners))
        element.removeEventListener(name, handler as EventListener);
      release();
    },
  };
}
