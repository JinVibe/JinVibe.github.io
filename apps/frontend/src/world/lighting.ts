import * as THREE from "three";

export const addWorldLighting = (scene: THREE.Scene) => {
  const sun = new THREE.DirectionalLight(0xfff1bd, 3.2);
  sun.position.set(24, 38, 18);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  sun.shadow.camera.left = -55;
  sun.shadow.camera.right = 55;
  sun.shadow.camera.top = 55;
  sun.shadow.camera.bottom = -55;
  scene.add(sun);

  const skyLight = new THREE.HemisphereLight(0xbddfff, 0x567044, 1.9);
  scene.add(skyLight);
};
