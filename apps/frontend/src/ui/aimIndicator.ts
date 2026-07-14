import * as THREE from "three";

const direction = new THREE.Vector3();
const midpoint = new THREE.Vector3();

export const createAimIndicator = () => {
  const group = new THREE.Group();
  group.visible = false;

  const material = new THREE.MeshStandardMaterial({
    color: 0xfacc15,
    emissive: 0x9a5b00,
    emissiveIntensity: 0.5,
    roughness: 0.42,
    transparent: true,
    opacity: 0.82,
  });
  const shaft = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 4.2, 12), material);
  shaft.rotation.x = Math.PI / 2;
  shaft.castShadow = true;

  const head = new THREE.Mesh(new THREE.ConeGeometry(0.34, 0.92, 18), material);
  head.rotation.x = -Math.PI / 2;
  head.position.z = -2.55;
  head.castShadow = true;

  group.add(shaft, head);

  return {
    group,
    update(origin: THREE.Vector3, aimDirection: THREE.Vector3 | null, power: number) {
      const visible = Boolean(aimDirection) && power > 0.02;
      group.visible = visible;

      if (!visible || !aimDirection) {
        return;
      }

      direction.copy(aimDirection).normalize();
      midpoint.copy(origin).addScaledVector(direction, 3.4);
      group.position.set(midpoint.x, 0.18, midpoint.z);
      group.rotation.y = Math.atan2(direction.x, direction.z);
      group.scale.set(1, 1, THREE.MathUtils.lerp(0.72, 1.36, power));
    },
  };
};
