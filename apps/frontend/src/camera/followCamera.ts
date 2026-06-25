import * as THREE from "three";

const cameraOffset = new THREE.Vector3(0, 7.2, 13);
const desiredCamera = new THREE.Vector3();

export const updateFollowCamera = (
  camera: THREE.PerspectiveCamera,
  target: THREE.Object3D,
) => {
  desiredCamera.copy(target.position).add(cameraOffset);
  camera.position.lerp(desiredCamera, 0.075);
  camera.lookAt(target.position.x, target.position.y + 1.2, target.position.z);
};
