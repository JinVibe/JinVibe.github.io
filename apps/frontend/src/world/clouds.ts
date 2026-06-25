import * as THREE from "three";

export const createClouds = (scene: THREE.Scene) => {
  const cloudCount = 9;
  const puffsPerCloud = 4;
  const cloudPositions = Array.from({ length: cloudCount }, (_, index) => ({
    x: -52 + index * 15,
    y: 24 + (index % 3) * 4,
    z: -34 - index * 8,
    scale: 1.4 + (index % 2) * 0.25,
    speed: 0.5 + index * 0.04,
  }));

  const cloudGeometry = new THREE.SphereGeometry(1, 12, 8);
  const cloudMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 1,
    transparent: true,
    opacity: 0.78,
  });

  const clouds = new THREE.InstancedMesh(
    cloudGeometry,
    cloudMaterial,
    cloudCount * puffsPerCloud,
  );
  clouds.frustumCulled = false;
  scene.add(clouds);

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();

  const syncMatrices = () => {
    cloudPositions.forEach((cloud, cloudIndex) => {
      for (let puff = 0; puff < puffsPerCloud; puff += 1) {
        const puffScale = (1.7 + puff * 0.15) * cloud.scale;
        position.set(
          cloud.x + puff * 1.8 * cloud.scale,
          cloud.y + Math.sin(puff) * 0.25 * cloud.scale,
          cloud.z,
        );
        scale.setScalar(puffScale);
        matrix.compose(position, quaternion, scale);
        clouds.setMatrixAt(cloudIndex * puffsPerCloud + puff, matrix);
      }
    });
    clouds.instanceMatrix.needsUpdate = true;
  };

  syncMatrices();

  return {
    update(delta: number) {
      cloudPositions.forEach((cloud) => {
        cloud.x += delta * cloud.speed;
        if (cloud.x > 72) {
          cloud.x = -72;
        }
      });
      syncMatrices();
    },
  };
};
