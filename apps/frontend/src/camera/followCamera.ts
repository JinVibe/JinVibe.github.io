import * as THREE from "three";

const cameraOffset = new THREE.Vector3(0, 7.2, 13);

export const updateFollowCamera = (
  camera: THREE.PerspectiveCamera,
  target: THREE.Object3D,
) => {
  const desiredCamera = target.position.clone().add(cameraOffset);
  camera.position.lerp(desiredCamera, 0.075);
  camera.lookAt(target.position.x, target.position.y + 1.2, target.position.z);
};
