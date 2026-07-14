import * as THREE from "three";

export const PITCH = {
  width: 44,
  length: 72,
  minX: -22,
  maxX: 22,
  minZ: -36,
  maxZ: 36,
  goalZ: -35.6,
  goalWidth: 12,
  goalHeight: 5,
} as const;

const createLine = (
  width: number,
  depth: number,
  x: number,
  z: number,
  color = 0xf8fff4,
) => {
  const line = new THREE.Mesh(
    new THREE.BoxGeometry(width, 0.025, depth),
    new THREE.MeshStandardMaterial({ color, roughness: 0.8 }),
  );
  line.position.set(x, 0.035, z);
  line.receiveShadow = true;

  return line;
};

const createGoalPost = (x: number, y: number, z: number, height: number) => {
  const post = new THREE.Mesh(
    new THREE.CylinderGeometry(0.13, 0.13, height, 16),
    new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.38 }),
  );
  post.position.set(x, y, z);
  post.castShadow = true;

  return post;
};

export const createPitch = () => {
  const group = new THREE.Group();
  const grass = new THREE.Mesh(
    new THREE.PlaneGeometry(PITCH.width + 10, PITCH.length + 10, 1, 1),
    new THREE.MeshStandardMaterial({
      color: 0x2f6f3a,
      roughness: 0.92,
    }),
  );
  grass.rotation.x = -Math.PI / 2;
  grass.receiveShadow = true;
  group.add(grass);

  const stripeMaterialA = new THREE.MeshStandardMaterial({
    color: 0x2a6336,
    roughness: 0.96,
  });
  const stripeMaterialB = new THREE.MeshStandardMaterial({
    color: 0x377944,
    roughness: 0.96,
  });

  for (let index = 0; index < 8; index += 1) {
    const stripe = new THREE.Mesh(
      new THREE.PlaneGeometry(PITCH.width + 8, PITCH.length / 8),
      index % 2 === 0 ? stripeMaterialA : stripeMaterialB,
    );
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.z = PITCH.minZ + (index + 0.5) * (PITCH.length / 8);
    stripe.position.y = 0.01;
    stripe.receiveShadow = true;
    group.add(stripe);
  }

  group.add(
    createLine(PITCH.width, 0.18, 0, PITCH.minZ),
    createLine(PITCH.width, 0.18, 0, PITCH.maxZ),
    createLine(0.18, PITCH.length, PITCH.minX, 0),
    createLine(0.18, PITCH.length, PITCH.maxX, 0),
    createLine(PITCH.width, 0.14, 0, 0),
  );

  const penaltyWidth = 27;
  const penaltyDepth = 15;
  const penaltyZ = PITCH.goalZ + penaltyDepth / 2;
  group.add(
    createLine(penaltyWidth, 0.16, 0, PITCH.goalZ),
    createLine(0.16, penaltyDepth, -penaltyWidth / 2, penaltyZ),
    createLine(0.16, penaltyDepth, penaltyWidth / 2, penaltyZ),
    createLine(penaltyWidth, 0.16, 0, PITCH.goalZ + penaltyDepth),
  );

  const centerCircle = new THREE.Mesh(
    new THREE.TorusGeometry(7, 0.065, 8, 96),
    new THREE.MeshStandardMaterial({ color: 0xf8fff4, roughness: 0.8 }),
  );
  centerCircle.rotation.x = -Math.PI / 2;
  centerCircle.position.y = 0.045;
  group.add(centerCircle);

  const goal = new THREE.Group();
  const postY = PITCH.goalHeight / 2;
  const leftPost = createGoalPost(-PITCH.goalWidth / 2, postY, PITCH.goalZ, PITCH.goalHeight);
  const rightPost = createGoalPost(PITCH.goalWidth / 2, postY, PITCH.goalZ, PITCH.goalHeight);
  const crossbar = createGoalPost(0, PITCH.goalHeight, PITCH.goalZ, PITCH.goalWidth);
  crossbar.rotation.z = Math.PI / 2;
  goal.add(leftPost, rightPost, crossbar);

  const netMaterial = new THREE.MeshStandardMaterial({
    color: 0xdde7ee,
    transparent: true,
    opacity: 0.32,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  const backNet = new THREE.Mesh(new THREE.PlaneGeometry(PITCH.goalWidth, PITCH.goalHeight), netMaterial);
  backNet.position.set(0, PITCH.goalHeight / 2, PITCH.goalZ - 3);
  const leftNet = new THREE.Mesh(new THREE.PlaneGeometry(3, PITCH.goalHeight), netMaterial);
  leftNet.rotation.y = Math.PI / 2;
  leftNet.position.set(-PITCH.goalWidth / 2, PITCH.goalHeight / 2, PITCH.goalZ - 1.5);
  const rightNet = leftNet.clone();
  rightNet.position.x = PITCH.goalWidth / 2;
  goal.add(backNet, leftNet, rightNet);

  group.add(goal);

  return group;
};
