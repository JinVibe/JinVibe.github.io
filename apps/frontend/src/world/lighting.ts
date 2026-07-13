import * as THREE from "three";

export const addWorldLighting = (scene: THREE.Scene) => {
  const sun = new THREE.DirectionalLight(0xfff2cf, 3.4);
  sun.position.set(20, 42, 24);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -55;
  sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55;
  sun.shadow.camera.bottom = -55;
  scene.add(sun);

  const skyLight = new THREE.HemisphereLight(0xc8e8ff, 0x2c5e31, 1.7);
  scene.add(skyLight);
};
