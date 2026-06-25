import * as THREE from "three";
import type { MovementInput } from "../input/keyboard";
import { getTerrainHeight, WORLD_BOUNDS } from "../world/terrain";

const movementVector = new THREE.Vector3();

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
        player.position.add(movementVector);
        player.position.x = THREE.MathUtils.clamp(
          player.position.x,
          WORLD_BOUNDS.minX,
          WORLD_BOUNDS.maxX,
        );
        player.position.z = THREE.MathUtils.clamp(
          player.position.z,
          WORLD_BOUNDS.minZ,
          WORLD_BOUNDS.maxZ,
        );
        player.rotation.y = Math.atan2(movementVector.x, movementVector.z);
      }

      const groundHeight = getTerrainHeight(player.position.x, player.position.z);
      player.position.y = groundHeight + 0.18 + Math.sin(elapsed * 5.2) * 0.035;
      hat.rotation.z = Math.sin(elapsed * 3.2) * 0.05;
    },
  };
};
