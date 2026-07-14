import * as THREE from "three";

const cameraOffset = new THREE.Vector3(0, 7.8, 14.5);
const desiredCamera = new THREE.Vector3();
const lookTarget = new THREE.Vector3();

export const updateFollowCamera = (
  camera: THREE.PerspectiveCamera,
  target: THREE.Object3D,
) => {
  desiredCamera.copy(target.position).add(cameraOffset);
  camera.position.lerp(desiredCamera, 0.09);
  lookTarget.set(target.position.x, target.position.y + 1.25, target.position.z - 9);
  camera.lookAt(lookTarget);
};
