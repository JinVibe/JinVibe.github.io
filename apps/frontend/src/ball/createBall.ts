import * as THREE from "three";
import { PITCH } from "../world/pitch";

const BALL_RADIUS = 0.42;
const FRICTION = 0.982;
const GRAVITY = 18;
const idleVector = new THREE.Vector3();
const shotDirection = new THREE.Vector3();
const dribbleTarget = new THREE.Vector3();
const dribbleVelocity = new THREE.Vector3();

export type BallController = {
  mesh: THREE.Mesh;
  kick: (direction: THREE.Vector3, power?: number) => void;
  update: (delta: number) => { scored: boolean };
  reset: () => void;
  isNear: (position: THREE.Vector3, distance?: number) => boolean;
  nudge: (direction: THREE.Vector3, delta: number) => void;
  dribbleTo: (position: THREE.Vector3, direction: THREE.Vector3, delta: number) => void;
};

export const createBall = (): BallController => {
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(BALL_RADIUS, 32, 18),
    new THREE.MeshStandardMaterial({
      color: 0xf7f7f2,
      roughness: 0.55,
      metalness: 0.02,
    }),
  );
  mesh.position.set(0, BALL_RADIUS, 13);
  mesh.castShadow = true;

  const patchMaterial = new THREE.MeshStandardMaterial({
    color: 0x161616,
    roughness: 0.64,
    polygonOffset: true,
    polygonOffsetFactor: -1,
  });
  const patchGeometry = new THREE.CircleGeometry(0.13, 6);
  const patchDirections = [
    new THREE.Vector3(0, 1, 0),
    new THREE.Vector3(0.75, 0.22, 0.62),
    new THREE.Vector3(-0.7, 0.18, 0.68),
    new THREE.Vector3(0.42, -0.28, -0.86),
    new THREE.Vector3(-0.52, -0.22, -0.82),
  ];
  patchDirections.forEach((direction) => {
    const normal = direction.normalize();
    const patch = new THREE.Mesh(patchGeometry, patchMaterial);
    patch.position.copy(normal).multiplyScalar(BALL_RADIUS + 0.006);
    patch.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), normal);
    mesh.add(patch);
  });

  const velocity = new THREE.Vector3();
  const spinAxis = new THREE.Vector3(1, 0, 0);

  const reset = () => {
    mesh.position.set(0, BALL_RADIUS, 13);
    velocity.set(0, 0, 0);
  };

  return {
    mesh,
    kick(direction, power = 0.55) {
      shotDirection.copy(direction).normalize();
      const shotPower = THREE.MathUtils.lerp(17, 42, power);
      velocity.set(
        shotDirection.x * shotPower,
        THREE.MathUtils.lerp(3.8, 9.2, power),
        shotDirection.z * shotPower,
      );
    },
    update(delta) {
      mesh.position.addScaledVector(velocity, delta);
      velocity.y -= GRAVITY * delta;

      if (mesh.position.y <= BALL_RADIUS) {
        mesh.position.y = BALL_RADIUS;
        velocity.y = Math.max(0, velocity.y * -0.24);
        velocity.x *= FRICTION;
        velocity.z *= FRICTION;
      }

      if (mesh.position.x < PITCH.minX + BALL_RADIUS || mesh.position.x > PITCH.maxX - BALL_RADIUS) {
        mesh.position.x = THREE.MathUtils.clamp(
          mesh.position.x,
          PITCH.minX + BALL_RADIUS,
          PITCH.maxX - BALL_RADIUS,
        );
        velocity.x *= -0.42;
      }

      if (mesh.position.z > PITCH.maxZ - BALL_RADIUS) {
        mesh.position.z = PITCH.maxZ - BALL_RADIUS;
        velocity.z *= -0.42;
      }

      const scored =
        mesh.position.z <= PITCH.goalZ &&
        Math.abs(mesh.position.x) <= PITCH.goalWidth / 2 &&
        mesh.position.y <= PITCH.goalHeight;

      if (mesh.position.z < PITCH.minZ - 8 || Math.abs(mesh.position.x) > PITCH.maxX + 8) {
        reset();
      }

      spinAxis.set(velocity.z, 0, -velocity.x).normalize();
      if (Number.isFinite(spinAxis.x)) {
        mesh.rotateOnWorldAxis(spinAxis, velocity.length() * delta * 0.7);
      }

      return { scored };
    },
    reset,
    isNear(position, distance = 1.65) {
      return mesh.position.distanceTo(position) <= distance;
    },
    nudge(direction, delta) {
      velocity.addScaledVector(direction, 5.8 * delta);
    },
    dribbleTo(position, direction, delta) {
      const dribbleDirection =
        direction.lengthSq() > 0 ? direction : idleVector.set(0, 0, -1);
      dribbleVelocity.copy(dribbleDirection).normalize();
      dribbleTarget.copy(position).addScaledVector(dribbleVelocity, 1.15);
      dribbleTarget.y = BALL_RADIUS;
      mesh.position.lerp(dribbleTarget, Math.min(delta * 10, 1));
      velocity.lerp(dribbleVelocity.multiplyScalar(3.4), Math.min(delta * 8, 1));
    },
  };
};
