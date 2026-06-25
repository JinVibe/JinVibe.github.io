import * as THREE from "three";

export const createClouds = (scene: THREE.Scene) => {
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    transparent: true,
    opacity: 0.78,
  });

  const clouds: THREE.Group[] = [];
  for (let index = 0; index < 9; index += 1) {
    const cloud = new THREE.Group();
    for (let puff = 0; puff < 4; puff += 1) {
      const mesh = new THREE.Mesh(
        new THREE.SphereGeometry(1.7 + puff * 0.15, 12, 8),
        cloudMaterial,
      );
      mesh.position.set(puff * 1.8, Math.sin(puff) * 0.25, 0);
      cloud.add(mesh);
    }
    cloud.position.set(-52 + index * 15, 24 + (index % 3) * 4, -34 - index * 8);
    cloud.scale.setScalar(1.4 + (index % 2) * 0.25);
    clouds.push(cloud);
    scene.add(cloud);
  }

  return {
    update(delta: number) {
      clouds.forEach((cloud, index) => {
        cloud.position.x += delta * (0.5 + index * 0.04);
        if (cloud.position.x > 72) {
          cloud.position.x = -72;
        }
      });
    },
  };
};
