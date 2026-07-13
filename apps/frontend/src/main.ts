import * as THREE from "three";
import { createBall } from "./ball/createBall";
import { updateFollowCamera } from "./camera/followCamera";
import { bindResize, createCamera, createRenderer } from "./core/renderer";
import { createKeyboardInput } from "./input/keyboard";
import { createPlayer } from "./player/createPlayer";
import { createPlayerController } from "./player/playerController";
import { mountHud, setScore } from "./ui/hud";
import { addWorldLighting } from "./world/lighting";
import { createPitch } from "./world/pitch";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

mountHud(app);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x7fc4ee);
scene.fog = new THREE.Fog(0x7fc4ee, 55, 130);

const camera = createCamera();
const renderer = createRenderer(app);
const disposeResize = bindResize(renderer, camera);
const clock = new THREE.Clock();
const input = createKeyboardInput();
const pitch = createPitch();
const { player, leftLeg, rightLeg } = createPlayer();
const playerController = createPlayerController({ player, leftLeg, rightLeg });
const ball = createBall();
let score = 0;

addWorldLighting(scene);
player.position.set(0, 0, 22);
player.rotation.y = Math.PI;
scene.add(pitch, player, ball.mesh);

const goalDirection = new THREE.Vector3(0, 0, -1);

const animate = () => {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;
  const movement = input.getMovement();

  playerController.update(movement, delta, elapsed);
  const facingDirection = playerController.getFacingDirection();

  if (ball.isNear(player.position)) {
    ball.nudge(facingDirection, delta);
  }

  if (movement.shoot && ball.isNear(player.position, 2.2)) {
    const aimedDirection = facingDirection.z < -0.2 ? facingDirection : goalDirection;
    ball.kick(aimedDirection);
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
