import * as THREE from "three";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

app.innerHTML = `
  <section class="hud" aria-label="World status">
    <h1>JinVibe Field</h1>
    <p>바람이 지나가는 초원, 낮은 언덕, 멀리 보이는 고대 탑을 탐험하는 첫 프로토타입입니다.</p>
  </section>
  <div class="status" aria-label="Controls">
    <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
    <span>move</span>
  </div>
`;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x99c8e8);
scene.fog = new THREE.Fog(0x99c8e8, 42, 155);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  500,
);
camera.position.set(0, 8, 15);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
app.appendChild(renderer.domElement);

const sun = new THREE.DirectionalLight(0xfff1bd, 3.2);
sun.position.set(24, 38, 18);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -55;
sun.shadow.camera.right = 55;
sun.shadow.camera.top = 55;
sun.shadow.camera.bottom = -55;
scene.add(sun);

const skyLight = new THREE.HemisphereLight(0xbddfff, 0x567044, 1.9);
scene.add(skyLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(240, 240, 120, 120),
  new THREE.MeshStandardMaterial({
    color: 0x72a953,
    roughness: 0.92,
    metalness: 0.02,
  }),
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;

const groundPositions = ground.geometry.attributes.position;
for (let index = 0; index < groundPositions.count; index += 1) {
  const x = groundPositions.getX(index);
  const y = groundPositions.getY(index);
  const height =
    Math.sin(x * 0.08) * 1.1 +
    Math.cos(y * 0.075) * 0.9 +
    Math.sin((x + y) * 0.035) * 1.4;
  groundPositions.setZ(index, height);
}
ground.geometry.computeVertexNormals();
scene.add(ground);

const path = new THREE.Mesh(
  new THREE.PlaneGeometry(9, 150, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0xd1b46b,
    roughness: 1,
  }),
);
path.rotation.x = -Math.PI / 2;
path.rotation.z = -0.16;
path.position.set(-5, 0.08, -22);
path.receiveShadow = true;
scene.add(path);

const hero = new THREE.Group();
const heroBody = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.48, 1.05, 5, 12),
  new THREE.MeshStandardMaterial({ color: 0x2e8b57, roughness: 0.72 }),
);
heroBody.castShadow = true;
heroBody.position.y = 1.05;
hero.add(heroBody);

const heroHat = new THREE.Mesh(
  new THREE.ConeGeometry(0.55, 0.72, 4),
  new THREE.MeshStandardMaterial({ color: 0x1f6c46, roughness: 0.8 }),
);
heroHat.position.y = 2.05;
heroHat.rotation.y = Math.PI * 0.25;
heroHat.castShadow = true;
hero.add(heroHat);
scene.add(hero);

const createTree = (x: number, z: number, scale: number) => {
  const tree = new THREE.Group();
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16 * scale, 0.24 * scale, 1.35 * scale, 8),
    new THREE.MeshStandardMaterial({ color: 0x6f4a28, roughness: 0.88 }),
  );
  trunk.position.y = 0.68 * scale;
  trunk.castShadow = true;
  tree.add(trunk);

  const leaves = new THREE.Mesh(
    new THREE.ConeGeometry(0.92 * scale, 2.2 * scale, 9),
    new THREE.MeshStandardMaterial({ color: 0x2f6d3d, roughness: 0.9 }),
  );
  leaves.position.y = 2.1 * scale;
  leaves.castShadow = true;
  tree.add(leaves);

  tree.position.set(x, 0, z);
  scene.add(tree);
};

const treePoints = [
  [-23, -12, 1.2],
  [-29, 9, 1.6],
  [-18, 26, 1.1],
  [19, -20, 1.4],
  [31, -3, 1.7],
  [27, 24, 1.2],
  [-43, -38, 2.1],
  [45, -33, 1.8],
  [-52, 30, 1.5],
  [53, 31, 2],
];
treePoints.forEach(([x, z, scale]) => createTree(x, z, scale));

const tower = new THREE.Group();
const towerBase = new THREE.Mesh(
  new THREE.CylinderGeometry(2.2, 2.7, 12, 9),
  new THREE.MeshStandardMaterial({ color: 0x8f8b7c, roughness: 0.86 }),
);
towerBase.position.y = 6;
towerBase.castShadow = true;
towerBase.receiveShadow = true;
tower.add(towerBase);

const towerTop = new THREE.Mesh(
  new THREE.ConeGeometry(3.2, 4.5, 9),
  new THREE.MeshStandardMaterial({ color: 0x49657a, roughness: 0.78 }),
);
towerTop.position.y = 14.1;
towerTop.castShadow = true;
tower.add(towerTop);

const beacon = new THREE.PointLight(0xf6d26b, 5, 26);
beacon.position.y = 16.4;
tower.add(beacon);
tower.position.set(16, 0, -58);
scene.add(tower);

const cloudMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 1,
  transparent: true,
  opacity: 0.78,
});

const clouds: THREE.Group[] = [];
for (let index = 0; index < 9; index += 1) {
  const cloud = new THREE.Group();
  for (let puff = 0; puff < 4; puff += 1) {
    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(1.7 + puff * 0.15, 12, 8),
      cloudMaterial,
    );
    mesh.position.set(puff * 1.8, Math.sin(puff) * 0.25, 0);
    cloud.add(mesh);
  }
  cloud.position.set(-52 + index * 15, 24 + (index % 3) * 4, -34 - index * 8);
  cloud.scale.setScalar(1.4 + (index % 2) * 0.25);
  clouds.push(cloud);
  scene.add(cloud);
}

const keys = new Set<string>();
const clock = new THREE.Clock();
const playerVelocity = new THREE.Vector3();
const cameraOffset = new THREE.Vector3(0, 7.2, 13);

window.addEventListener("keydown", (event) => {
  keys.add(event.key.toLowerCase());
});

window.addEventListener("keyup", (event) => {
  keys.delete(event.key.toLowerCase());
});

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

const animate = () => {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  playerVelocity.set(0, 0, 0);
  if (keys.has("w")) playerVelocity.z -= 1;
  if (keys.has("s")) playerVelocity.z += 1;
  if (keys.has("a")) playerVelocity.x -= 1;
  if (keys.has("d")) playerVelocity.x += 1;

  if (playerVelocity.lengthSq() > 0) {
    playerVelocity.normalize().multiplyScalar(10 * delta);
    hero.position.add(playerVelocity);
    hero.position.x = THREE.MathUtils.clamp(hero.position.x, -78, 78);
    hero.position.z = THREE.MathUtils.clamp(hero.position.z, -84, 62);
    hero.rotation.y = Math.atan2(playerVelocity.x, playerVelocity.z);
  }

  hero.position.y = 0.18 + Math.sin(elapsed * 5.2) * 0.035;
  heroHat.rotation.z = Math.sin(elapsed * 3.2) * 0.05;

  const desiredCamera = hero.position.clone().add(cameraOffset);
  camera.position.lerp(desiredCamera, 0.075);
  camera.lookAt(hero.position.x, hero.position.y + 1.2, hero.position.z);

  clouds.forEach((cloud, index) => {
    cloud.position.x += delta * (0.5 + index * 0.04);
    if (cloud.position.x > 72) {
      cloud.position.x = -72;
    }
  });

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
