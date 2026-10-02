import type { SceneEngine, SimulationSettings, SimulationStats } from './types.ts';
import * as THREE from 'three';
import { Simulation } from './Simulation.ts';
import { createPointerController } from './input/createPointerController.ts';
import { createClothView } from './rendering/createClothView.ts';
import { createRoom } from './rendering/createRoom.ts';
import { disposeScene } from './rendering/disposeScene.ts';

const STATS_INTERVAL = 700;

/** Browser adapter. Owns the renderer, event listeners, frame loop, and their lifetime. */
export function createSceneEngine(
  element: HTMLElement,
  initialSettings: SimulationSettings,
  onStats: (stats: SimulationStats) => void,
): SceneEngine {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  element.appendChild(renderer.domElement);

  const camera = new THREE.PerspectiveCamera(41, 1, 0.1, 80);
  camera.position.set(7.1, 4.5, 12.8);
  camera.lookAt(0.1, 2.7, 0);
  const room = createRoom();
  const simulation = new Simulation();
  const view = createClothView(simulation.cloth);
  room.scene.add(view.group);
  let settings = initialSettings;
  const pointer = createPointerController({
    element,
    camera,
    mesh: view.mesh,
    simulation,
    getTool: () => settings.tool,
    onCut: view.syncTopology,
  });

  function resize() {
    const width = Math.max(1, element.clientWidth);
    const height = Math.max(1, element.clientHeight);
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  const observer = new ResizeObserver(resize);
  observer.observe(element);
  resize();

  let disposed = false;
  let frame = 0;
  let last: number | null = null;
  let statTime: number | null = null;
  let frames = 0;
  function animate(now: number) {
    if (disposed) return;
    const elapsed = last === null ? 0 : (now - last) / 1000;
    last = now;
    statTime ??= now;
    simulation.advance(elapsed, settings);
    view.update(settings);
    room.setLighting(settings.light);
    renderer.render(room.scene, camera);
    frames++;
    if (now - statTime >= STATS_INTERVAL) {
      onStats(simulation.getStats(Math.round((frames * 1000) / (now - statTime))));
      statTime = now;
      frames = 0;
    }
    frame = requestAnimationFrame(animate);
  }
  onStats(simulation.getStats(0));
  frame = requestAnimationFrame(animate);

  return {
    setSettings(next) {
      if (next.tool !== settings.tool || next.paused !== settings.paused) pointer.release();
      settings = next;
    },
    reset() {
      pointer.release();
      simulation.reset();
      view.syncTopology();
      view.update(settings);
      onStats(simulation.getStats(0));
    },
    gust() {
      simulation.addGust();
    },
    snapshot() {
      renderer.render(room.scene, camera);
      const link = document.createElement('a');
      link.download = 'stillroom.png';
      link.href = renderer.domElement.toDataURL('image/png');
      link.click();
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      pointer.dispose();
      disposeScene(room.scene);
      renderer.dispose();
      renderer.domElement.remove();
    },
  };
}
