import * as THREE from "three";
import type { MovementInput } from "../input/keyboard";
import { isPositionBlocked } from "../world/collision";
import { getTerrainHeight, WORLD_BOUNDS } from "../world/terrain";

const movementVector = new THREE.Vector3();
const nextPosition = new THREE.Vector3();

export type PlayerControllerOptions = {
  player: THREE.Group;
  hat: THREE.Object3D;
  speed?: number;
};

export const createPlayerController = ({
  player,
  hat,
  speed = 10,
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
          WORLD_BOUNDS.minX,
          WORLD_BOUNDS.maxX,
        );
        nextPosition.z = THREE.MathUtils.clamp(
          nextPosition.z,
          WORLD_BOUNDS.minZ,
          WORLD_BOUNDS.maxZ,
        );

        if (!isPositionBlocked(nextPosition.x, nextPosition.z)) {
          player.position.x = nextPosition.x;
          player.position.z = nextPosition.z;
        }

        player.rotation.y = Math.atan2(movementVector.x, movementVector.z);
      }

      const groundHeight = getTerrainHeight(player.position.x, player.position.z);
      player.position.y = groundHeight + 0.18 + Math.sin(elapsed * 5.2) * 0.035;
      hat.rotation.z = Math.sin(elapsed * 3.2) * 0.05;
    },
  };
};
