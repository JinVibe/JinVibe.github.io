import * as THREE from "three";

export const createPlayer = () => {
  const player = new THREE.Group();

  const kitMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    roughness: 0.66,
  });
  const shortMaterial = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.72,
  });
  const skinMaterial = new THREE.MeshStandardMaterial({
    color: 0xd8a16f,
    roughness: 0.55,
  });
  const sockMaterial = new THREE.MeshStandardMaterial({
    color: 0xe5e7eb,
    roughness: 0.5,
  });
  const bootMaterial = new THREE.MeshStandardMaterial({
    color: 0x111111,
    roughness: 0.45,
  });

  const torso = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.42, 0.92, 7, 16),
    kitMaterial,
  );
  torso.castShadow = true;
  torso.position.y = 1.6;
  player.add(torso);

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.28, 18, 14),
    skinMaterial,
  );
  head.position.y = 2.32;
  head.castShadow = true;
  player.add(head);

  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.29, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.48),
    new THREE.MeshStandardMaterial({ color: 0x2a1a12, roughness: 0.8 }),
  );
  hair.position.y = 2.39;
  hair.castShadow = true;
  player.add(hair);

  const shorts = new THREE.Mesh(
    new THREE.BoxGeometry(0.78, 0.3, 0.46),
    shortMaterial,
  );
  shorts.position.y = 1.02;
  shorts.castShadow = true;
  player.add(shorts);

  const armGeometry = new THREE.CapsuleGeometry(0.09, 0.72, 4, 8);
  const leftArm = new THREE.Mesh(armGeometry, skinMaterial);
  leftArm.position.set(-0.55, 1.55, 0);
  leftArm.rotation.z = -0.28;
  leftArm.castShadow = true;
  const rightArm = leftArm.clone();
  rightArm.position.x = 0.55;
  rightArm.rotation.z = 0.28;
  player.add(leftArm, rightArm);

  const legGeometry = new THREE.CapsuleGeometry(0.11, 0.78, 4, 8);
  const leftLeg = new THREE.Mesh(legGeometry, sockMaterial);
  leftLeg.position.set(-0.22, 0.48, 0);
  leftLeg.castShadow = true;
  const rightLeg = leftLeg.clone();
  rightLeg.position.x = 0.22;
  player.add(leftLeg, rightLeg);

  const bootGeometry = new THREE.BoxGeometry(0.22, 0.12, 0.48);
  const leftBoot = new THREE.Mesh(bootGeometry, bootMaterial);
  leftBoot.position.set(-0.22, 0.08, -0.08);
  leftBoot.castShadow = true;
  const rightBoot = leftBoot.clone();
  rightBoot.position.x = 0.22;
  player.add(leftBoot, rightBoot);

  return { player, leftLeg, rightLeg, leftArm, rightArm };
};
