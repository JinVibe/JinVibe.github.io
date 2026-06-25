import * as THREE from "three";

const createTree = (x: number, z: number, scale: number) => {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16 * scale, 0.24 * scale, 1.35 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x6f4a28, roughness: 0.88 }),
  );
  trunk.position.y = 0.68 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.92 * scale, 2.2 * scale, 9),
    new THREE.MeshStandardMaterial({ color: 0x2f6d3d, roughness: 0.9 }),
  );
  leaves.position.y = 2.1 * scale;
  leaves.castShadow = true;
  tree.add(leaves);

  tree.position.set(x, 0, z);

  return tree;
};

const createTower = () => {
  const tower = new THREE.Group();
  const towerBase = new THREE.Mesh(
    new THREE.CylinderGeometry(2.2, 2.7, 12, 9),
    new THREE.MeshStandardMaterial({ color: 0x8f8b7c, roughness: 0.86 }),
  );
  towerBase.position.y = 6;
  towerBase.castShadow = true;
  towerBase.receiveShadow = true;
  tower.add(towerBase);

  const towerTop = new THREE.Mesh(
    new THREE.ConeGeometry(3.2, 4.5, 9),
    new THREE.MeshStandardMaterial({ color: 0x49657a, roughness: 0.78 }),
  );
  towerTop.position.y = 14.1;
  towerTop.castShadow = true;
  tower.add(towerTop);

  const beacon = new THREE.PointLight(0xf6d26b, 5, 26);
  beacon.position.y = 16.4;
  tower.add(beacon);
  tower.position.set(16, 0, -58);

  return tower;
};

export const addLandmarks = (scene: THREE.Scene) => {
  const treePoints = [
    [-23, -12, 1.2],
    [-29, 9, 1.6],
    [-18, 26, 1.1],
    [19, -20, 1.4],
    [31, -3, 1.7],
    [27, 24, 1.2],
    [-43, -38, 2.1],
    [45, -33, 1.8],
    [-52, 30, 1.5],
    [53, 31, 2],
  ] as const;

  treePoints.forEach(([x, z, scale]) => {
    scene.add(createTree(x, z, scale));
  });

  scene.add(createTower());
};
