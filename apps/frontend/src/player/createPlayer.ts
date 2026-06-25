import * as THREE from "three";

export const createPlayer = () => {
  const player = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.48, 1.05, 5, 12),
    new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.72 }),
  );
  body.castShadow = true;
  body.position.y = 1.05;
  player.add(body);

  const hat = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 0.72, 4),
    new THREE.MeshStandardMaterial({ color: 0x1f6c46, roughness: 0.8 }),
  );
  hat.position.y = 2.05;
  hat.rotation.y = Math.PI * 0.25;
  hat.castShadow = true;
  player.add(hat);

  return { player, hat };
};
