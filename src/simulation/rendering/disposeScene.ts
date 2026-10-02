import { DirectionalLight, SpotLight, PointLight } from 'three';
import type { Scene, BufferGeometry, Material, Mesh } from 'three';

/** Shared room materials are disposed once, along with allocated shadow maps. */
export function disposeScene(scene: Scene) {
  const resources = new Set<BufferGeometry | Material>();
  scene.traverse((object) => {
    const mesh = object as Mesh;
    if (mesh.geometry) resources.add(mesh.geometry);
    if (mesh.material) for (const material of [mesh.material].flat()) resources.add(material);
    if (
      object instanceof DirectionalLight ||
      object instanceof SpotLight ||
      object instanceof PointLight
    )
      object.shadow.dispose();
  });
  for (const resource of resources) resource.dispose();
  scene.clear();
}
