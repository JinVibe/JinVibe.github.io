import * as THREE from "three";
import { createBall } from "./ball/createBall";
import { updateFollowCamera } from "./camera/followCamera";
import { bindResize, createCamera, createRenderer } from "./core/renderer";
import { createKeyboardInput } from "./input/keyboard";
import { createPlayer } from "./player/createPlayer";
import { createPlayerController } from "./player/playerController";
import { mountHud, setScore, setShotPower } from "./ui/hud";
import { addWorldLighting } from "./world/lighting";
import { createPitch } from "./world/pitch";
import { createStadium } from "./world/stadium";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

mountHud(app);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xaec7d8);
scene.fog = new THREE.Fog(0xaec7d8, 58, 145);

const camera = createCamera();
const renderer = createRenderer(app);
const disposeResize = bindResize(renderer, camera);
const clock = new THREE.Clock();
const input = createKeyboardInput();
const pitch = createPitch();
const stadium = createStadium();
const { player, leftLeg, rightLeg } = createPlayer();
const playerController = createPlayerController({ player, leftLeg, rightLeg });
const ball = createBall();
let score = 0;

addWorldLighting(scene);
player.position.set(0, 0, 22);
player.rotation.y = Math.PI;
scene.add(pitch, stadium, player, ball.mesh);

const goalDirection = new THREE.Vector3(0, 0, -1);
const shotDirection = new THREE.Vector3();

const getDirectionalVector = (movement: ReturnType<typeof input.getMovement>) => {
  shotDirection.set(0, 0, 0);
  if (movement.forward) shotDirection.z -= 1;
  if (movement.backward) shotDirection.z += 1;
  if (movement.left) shotDirection.x -= 1;
  if (movement.right) shotDirection.x += 1;

  return shotDirection.lengthSq() > 0 ? shotDirection.normalize() : null;
};

const animate = () => {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;
  const movement = input.getMovement();

  playerController.update(movement, delta, elapsed);
  const facingDirection = playerController.getFacingDirection();
  const directionalShot = getDirectionalVector(movement);
  setShotPower(movement.shotPower);

  if (ball.isNear(player.position)) {
    ball.dribbleTo(player.position, directionalShot ?? facingDirection, delta);
  }

  if (movement.shootReleased && ball.isNear(player.position, 2.35)) {
    const aimedDirection =
      directionalShot ?? (facingDirection.z < -0.2 ? facingDirection : goalDirection);
    ball.kick(aimedDirection, Math.max(0.16, movement.shotPower));
  }

  const ballState = ball.update(delta);
  if (ballState.scored) {
    score += 1;
    setScore(score);
    ball.reset();
    player.position.set(0, 0, 22);
    player.rotation.y = Math.PI;
  }

  updateFollowCamera(camera, player);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

window.addEventListener("beforeunload", () => {
  disposeResize();
  input.dispose();
});
