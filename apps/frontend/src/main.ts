import * as THREE from "three";
import { createBall } from "./ball/createBall";
import { updateFollowCamera } from "./camera/followCamera";
import { bindResize, createCamera, createRenderer } from "./core/renderer";
import { createKeyboardInput } from "./input/keyboard";
import { createPlayer } from "./player/createPlayer";
import { createPlayerController } from "./player/playerController";
import { createAimIndicator } from "./ui/aimIndicator";
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
const { player, leftLeg, rightLeg, leftArm, rightArm } = createPlayer();
const playerController = createPlayerController({
  player,
  leftLeg,
  rightLeg,
  leftArm,
  rightArm,
});
const ball = createBall();
const aimIndicator = createAimIndicator();
let score = 0;

addWorldLighting(scene);
player.position.set(0, 0, 22);
player.rotation.y = Math.PI;
scene.add(pitch, stadium, player, ball.mesh, aimIndicator.group);

const goalDirection = new THREE.Vector3(0, 0, -1);
const shotDirection = new THREE.Vector3();
const dribbleDirection = new THREE.Vector3();

const getShotVector = (movement: ReturnType<typeof input.getMovement>) => {
  shotDirection.set(0, 0, 0);
  if (movement.aimForward) shotDirection.z -= 1;
  if (movement.aimBackward) shotDirection.z += 1;
  if (movement.aimLeft) shotDirection.x -= 1;
  if (movement.aimRight) shotDirection.x += 1;

  return shotDirection.lengthSq() > 0 ? shotDirection.normalize() : null;
};

const getDribbleVector = (movement: ReturnType<typeof input.getMovement>) => {
  dribbleDirection.set(0, 0, 0);
  if (movement.forward) dribbleDirection.z -= 1;
  if (movement.backward) dribbleDirection.z += 1;
  if (movement.left) dribbleDirection.x -= 1;
  if (movement.right) dribbleDirection.x += 1;

  return dribbleDirection.lengthSq() > 0 ? dribbleDirection.normalize() : null;
};

const animate = () => {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;
  const movement = input.getMovement();

  playerController.update(movement, delta, elapsed);
  const facingDirection = playerController.getFacingDirection();
  const directionalShot = getShotVector(movement);
  const directionalDribble = getDribbleVector(movement);
  setShotPower(movement.shotPower);
  aimIndicator.update(ball.mesh.position, directionalShot, movement.shotPower);

  if (ball.isNear(player.position)) {
    ball.dribbleTo(
      player.position,
      directionalDribble ?? facingDirection,
      delta,
      playerController.getSpeed(),
    );
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
