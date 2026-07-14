import * as THREE from "three";
import type { MovementInput } from "../input/keyboard";
import { PITCH } from "../world/pitch";

const movementVector = new THREE.Vector3();
const desiredVelocity = new THREE.Vector3();
const velocity = new THREE.Vector3();
const nextPosition = new THREE.Vector3();
const facingDirection = new THREE.Vector3(0, 0, -1);

const lerpAngle = (current: number, target: number, amount: number) => {
  const delta = Math.atan2(Math.sin(target - current), Math.cos(target - current));

  return current + delta * amount;
};

export type PlayerControllerOptions = {
  player: THREE.Group;
  leftLeg: THREE.Object3D;
  rightLeg: THREE.Object3D;
  leftArm: THREE.Object3D;
  rightArm: THREE.Object3D;
  speed?: number;
};

export const createPlayerController = ({
  player,
  leftLeg,
  rightLeg,
  leftArm,
  rightArm,
  speed = 12,
}: PlayerControllerOptions) => {
  let stridePhase = 0;

  return {
    update(input: MovementInput, delta: number, elapsed: number) {
      movementVector.set(0, 0, 0);
      if (input.forward) movementVector.z -= 1;
      if (input.backward) movementVector.z += 1;
      if (input.left) movementVector.x -= 1;
      if (input.right) movementVector.x += 1;

      const hasInput = movementVector.lengthSq() > 0;
      const currentMaxSpeed = input.shootHeld ? speed * 0.68 : speed;

      if (hasInput) {
        movementVector.normalize();
        desiredVelocity.copy(movementVector).multiplyScalar(currentMaxSpeed);
        velocity.lerp(desiredVelocity, 1 - Math.exp(-delta * 9.5));
      } else {
        velocity.multiplyScalar(Math.exp(-delta * 7.2));
      }

      nextPosition.copy(player.position).addScaledVector(velocity, delta);
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

      if (nextPosition.x === PITCH.minX + 1 || nextPosition.x === PITCH.maxX - 1) {
        velocity.x = 0;
      }
      if (nextPosition.z === PITCH.minZ + 4 || nextPosition.z === PITCH.maxZ - 2) {
        velocity.z = 0;
      }

      player.position.x = nextPosition.x;
      player.position.z = nextPosition.z;

      const speedRatio = THREE.MathUtils.clamp(velocity.length() / speed, 0, 1);
      if (velocity.lengthSq() > 0.08) {
        const targetRotation = Math.atan2(velocity.x, velocity.z);
        player.rotation.y = lerpAngle(
          player.rotation.y,
          targetRotation,
          1 - Math.exp(-delta * 11),
        );
      }

      stridePhase += delta * THREE.MathUtils.lerp(3, 10.5, speedRatio);
      const legSwing = Math.sin(stridePhase) * THREE.MathUtils.lerp(0.05, 0.72, speedRatio);
      const armSwing = -legSwing * 0.62;

      player.position.y = Math.sin(stridePhase * 2) * 0.035 * speedRatio;
      leftLeg.rotation.x = legSwing;
      rightLeg.rotation.x = -leftLeg.rotation.x;
      leftArm.rotation.x = armSwing;
      rightArm.rotation.x = -armSwing;
    },
    getFacingDirection() {
      facingDirection.set(Math.sin(player.rotation.y), 0, Math.cos(player.rotation.y)).normalize();
      return facingDirection;
    },
    getSpeed() {
      return velocity.length();
    },
  };
};
