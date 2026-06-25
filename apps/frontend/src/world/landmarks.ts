import * as THREE from "three";
import { getTerrainHeight } from "./terrain";

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
  tower.position.set(16, getTerrainHeight(16, -58), -58);

  return tower;
};

const addTrees = (scene: THREE.Scene) => {
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

  const trunkGeometry = new THREE.CylinderGeometry(0.16, 0.24, 1.35, 8);
  const leafGeometry = new THREE.ConeGeometry(0.92, 2.2, 9);
  const trunkMaterial = new THREE.MeshStandardMaterial({
    color: 0x6f4a28,
    roughness: 0.88,
  });
  const leafMaterial = new THREE.MeshStandardMaterial({
    color: 0x2f6d3d,
    roughness: 0.9,
  });

  const trunks = new THREE.InstancedMesh(
    trunkGeometry,
    trunkMaterial,
    treePoints.length,
  );
  const leaves = new THREE.InstancedMesh(
    leafGeometry,
    leafMaterial,
    treePoints.length,
  );
  trunks.castShadow = true;
  leaves.castShadow = true;

  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scaleVector = new THREE.Vector3();

  treePoints.forEach(([x, z, scale], index) => {
    const groundHeight = getTerrainHeight(x, z);

    position.set(x, groundHeight + 0.68 * scale, z);
    scaleVector.setScalar(scale);
    matrix.compose(position, quaternion, scaleVector);
    trunks.setMatrixAt(index, matrix);

    position.set(x, groundHeight + 2.1 * scale, z);
    matrix.compose(position, quaternion, scaleVector);
    leaves.setMatrixAt(index, matrix);
  });

  trunks.instanceMatrix.needsUpdate = true;
  leaves.instanceMatrix.needsUpdate = true;
  scene.add(trunks, leaves);
};

export const addLandmarks = (scene: THREE.Scene) => {
  addTrees(scene);
  scene.add(createTower());
};
