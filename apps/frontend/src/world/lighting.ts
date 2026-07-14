import * as THREE from "three";

export const addWorldLighting = (scene: THREE.Scene) => {
  const sun = new THREE.DirectionalLight(0xfff0d6, 2.6);
  sun.position.set(18, 36, 20);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -55;
  sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55;
  sun.shadow.camera.bottom = -55;
  scene.add(sun);

  const skyLight = new THREE.HemisphereLight(0xbdd7ec, 0x294632, 1.35);
  scene.add(skyLight);
};
