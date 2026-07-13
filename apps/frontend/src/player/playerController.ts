import * as THREE from "three";
import type { MovementInput } from "../input/keyboard";
import { PITCH } from "../world/pitch";

const movementVector = new THREE.Vector3();
const nextPosition = new THREE.Vector3();
const facingDirection = new THREE.Vector3(0, 0, -1);

export type PlayerControllerOptions = {
  player: THREE.Group;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  speed?: number;
};

export const createPlayerController = ({
  player,
  leftLeg,
  rightLeg,
  speed = 13,
}: PlayerControllerOptions) => {
  return {
    update(input: MovementInput, delta: number, elapsed: number) {
      movementVector.set(0, 0, 0);
      if (input.forward) movementVector.z -= 1;
      if (input.backward) movementVector.z += 1;
      if (input.left) movementVector.x -= 1;
      if (input.right) movementVector.x += 1;

      if (movementVector.lengthSq() > 0) {
        movementVector.normalize().multiplyScalar(speed * delta);
        nextPosition.copy(player.position).add(movementVector);
        nextPosition.x = THREE.MathUtils.clamp(
          nextPosition.x,
          PITCH.minX + 1,
          PITCH.maxX - 1,
        );
        nextPosition.z = THREE.MathUtils.clamp(
          nextPosition.z,
          PITCH.minZ + 4,
          PITCH.maxZ - 2,
        );

        player.position.x = nextPosition.x;
        player.position.z = nextPosition.z;
        player.rotation.y = Math.atan2(movementVector.x, movementVector.z);
      }

      player.position.y = Math.sin(elapsed * 8) * (movementVector.lengthSq() > 0 ? 0.045 : 0.012);
      leftLeg.rotation.x = Math.sin(elapsed * 10) * (movementVector.lengthSq() > 0 ? 0.55 : 0.08);
      rightLeg.rotation.x = -leftLeg.rotation.x;
    },
    getFacingDirection() {
      facingDirection.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y)).normalize();
      return facingDirection;
    },
  };
};
