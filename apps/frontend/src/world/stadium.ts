import * as THREE from "three";
import { PITCH } from "./pitch";

const crowdColors = [0x243447, 0xf4f4f5, 0x9f1239, 0x1d4ed8, 0x111827] as const;

const createStand = (x: number, z: number, width: number, rotationY = 0) => {
  const stand = new THREE.Group();
  stand.rotation.y = rotationY;
  stand.position.set(x, 0, z);

  const concrete = new THREE.MeshStandardMaterial({
    color: 0x6f7680,
    roughness: 0.86,
  });
  const seatMaterial = new THREE.MeshStandardMaterial({
    color: 0x1f2937,
    roughness: 0.78,
  });

  for (let row = 0; row < 5; row += 1) {
    const deck = new THREE.Mesh(
      new THREE.BoxGeometry(width, 0.36, 2.1),
      concrete,
    );
    deck.position.set(0, 0.4 + row * 0.58, row * 1.72);
    deck.castShadow = true;
    deck.receiveShadow = true;
    stand.add(deck);

    const seats = new THREE.Mesh(
      new THREE.BoxGeometry(width * 0.94, 0.14, 0.7),
      seatMaterial,
    );
    seats.position.set(0, 0.68 + row * 0.58, row * 1.72 - 0.28);
    seats.castShadow = true;
    stand.add(seats);
  }

  return stand;
};

const createCrowd = () => {
  const crowd = new THREE.Group();
  const bodyGeometry = new THREE.CapsuleGeometry(0.12, 0.32, 3, 6);
  const headGeometry = new THREE.SphereGeometry(0.11, 8, 6);
  const matrix = new THREE.Matrix4();
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3(1, 1, 1);

  crowdColors.forEach((color, colorIndex) => {
    const material = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.8,
    });
    const bodies = new THREE.InstancedMesh(bodyGeometry, material, 42);
    const heads = new THREE.InstancedMesh(
      headGeometry,
      new THREE.MeshStandardMaterial({ color: 0xc88f65, roughness: 0.7 }),
      42,
    );

    for (let index = 0; index < 42; index += 1) {
      const side = index % 2 === 0 ? -1 : 1;
      const lane = Math.floor(index / 2);
      const x = side * (PITCH.maxX + 8 + (lane % 3) * 2.0);
      const z = PITCH.minZ + 6 + Math.floor(lane / 3) * 4.1 + colorIndex * 0.42;
      const y = 1.55 + (lane % 5) * 0.58;

      position.set(x, y, z);
      matrix.compose(position, quaternion, scale);
      bodies.setMatrixAt(index, matrix);

      position.y += 0.35;
      matrix.compose(position, quaternion, scale);
      heads.setMatrixAt(index, matrix);
    }

    bodies.castShadow = true;
    heads.castShadow = true;
    crowd.add(bodies, heads);
  });

  return crowd;
};

const createFloodlight = (x: number, z: number) => {
  const group = new THREE.Group();
  const pole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.22, 16, 12),
    new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 }),
  );
  pole.position.y = 8;
  pole.castShadow = true;

  const rig = new THREE.Mesh(
    new THREE.BoxGeometry(4.8, 0.32, 0.34),
    new THREE.MeshStandardMaterial({ color: 0x1f2937, roughness: 0.46 }),
  );
  rig.position.y = 16.1;
  rig.castShadow = true;

  const light = new THREE.SpotLight(0xfff4d0, 2.2, 95, Math.PI / 5, 0.45, 1.25);
  light.position.set(0, 15.9, 0);
  light.target.position.set(-x * 0.35, 0, -8);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);

  group.position.set(x, 0, z);
  group.add(pole, rig, light, light.target);

  return group;
};

const createAdvertisingBoards = () => {
  const boards = new THREE.Group();
  const boardMaterial = new THREE.MeshStandardMaterial({
    color: 0x101827,
    roughness: 0.62,
    metalness: 0.1,
  });

  for (let index = 0; index < 8; index += 1) {
    const board = new THREE.Mesh(new THREE.BoxGeometry(6, 1.1, 0.18), boardMaterial);
    board.position.set(-21 + index * 6, 0.65, PITCH.minZ - 2.6);
    board.castShadow = true;
    boards.add(board);
  }

  return boards;
};

export const createStadium = () => {
  const stadium = new THREE.Group();
  stadium.add(
    createStand(PITCH.minX - 9.5, -5, PITCH.length * 0.82, Math.PI / 2),
    createStand(PITCH.maxX + 9.5, -5, PITCH.length * 0.82, -Math.PI / 2),
    createCrowd(),
    createFloodlight(PITCH.minX - 13, PITCH.minZ - 6),
    createFloodlight(PITCH.maxX + 13, PITCH.minZ - 6),
    createAdvertisingBoards(),
  );

  return stadium;
};
