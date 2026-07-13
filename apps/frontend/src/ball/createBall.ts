import * as THREE from "three";
import { PITCH } from "../world/pitch";

const BALL_RADIUS = 0.42;
const FRICTION = 0.985;
const GRAVITY = 18;

export type BallController = {
  mesh: THREE.Mesh;
  kick: (direction: THREE.Vector3, power?: number) => void;
  update: (delta: number) => { scored: boolean };
  reset: () => void;
  isNear: (position: THREE.Vector3, distance?: number) => boolean;
  nudge: (direction: THREE.Vector3, delta: number) => void;
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

  const velocity = new THREE.Vector3();
  const spinAxis = new THREE.Vector3(1, 0, 0);

  const reset = () => {
    mesh.position.set(0, BALL_RADIUS, 13);
    velocity.set(0, 0, 0);
  };

  return {
    mesh,
    kick(direction, power = 29) {
      const shotDirection = direction.clone().normalize();
      velocity.set(shotDirection.x * power, 7.4, shotDirection.z * power);
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
      velocity.addScaledVector(direction, 8 * delta);
    },
  };
};
