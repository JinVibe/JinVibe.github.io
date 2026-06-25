import * as THREE from "three";

export const WORLD_BOUNDS = {
  minX: -78,
  maxX: 78,
  minZ: -84,
  maxZ: 62,
} as const;

export const getTerrainHeight = (x: number, z: number) =>
  Math.sin(x * 0.08) * 1.1 +
  Math.cos(z * 0.075) * 0.9 +
  Math.sin((x + z) * 0.035) * 1.4;

export const createTerrain = () => {
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(240, 240, 120, 120),
    new THREE.MeshStandardMaterial({
      color: 0x72a953,
      roughness: 0.92,
      metalness: 0.02,
    }),
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;

  const groundPositions = ground.geometry.attributes.position;
  for (let index = 0; index < groundPositions.count; index += 1) {
    const x = groundPositions.getX(index);
    const z = groundPositions.getY(index);
    groundPositions.setZ(index, getTerrainHeight(x, z));
  }

  ground.geometry.computeVertexNormals();

  const path = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 150, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0xd1b46b,
      roughness: 1,
    }),
  );
  path.rotation.x = -Math.PI / 2;
  path.rotation.z = -0.16;
  path.position.set(-5, 0.08, -22);
  path.receiveShadow = true;

  return { ground, path };
};
