/** Shared room materials are disposed once, along with any allocated shadow maps. */
export function disposeScene(scene) {
  const resources = new Set();
  scene.traverse(object => {
    if (object.geometry) resources.add(object.geometry);
    if (object.material) {
      for (const material of [object.material].flat()) resources.add(material);
    }
    if (object.shadow) object.shadow.dispose();
  });
  for (const resource of resources) resource.dispose();
  scene.clear();
}
