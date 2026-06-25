import * as THREE from "three";
import { updateFollowCamera } from "./camera/followCamera";
import { bindResize, createCamera, createRenderer } from "./core/renderer";
import { createKeyboardInput } from "./input/keyboard";
import { createPlayer } from "./player/createPlayer";
import { createPlayerController } from "./player/playerController";
import { mountHud } from "./ui/hud";
import { createClouds } from "./world/clouds";
import { addLandmarks } from "./world/landmarks";
import { addWorldLighting } from "./world/lighting";
import { createTerrain } from "./world/terrain";
import "./style.css";

const app = document.querySelector<HTMLDivElement>("#app");

if (!app) {
  throw new Error("App root was not found.");
}

mountHud(app);

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x99c8e8);
scene.fog = new THREE.Fog(0x99c8e8, 42, 155);

const camera = createCamera();
const renderer = createRenderer(app);
const disposeResize = bindResize(renderer, camera);
const clock = new THREE.Clock();
const input = createKeyboardInput();
const { ground, path } = createTerrain();
const { player, hat } = createPlayer();
const playerController = createPlayerController({ player, hat });
const clouds = createClouds(scene);

addWorldLighting(scene);
scene.add(ground, path, player);
addLandmarks(scene);

const animate = () => {
  const delta = clock.getDelta();
  const elapsed = clock.elapsedTime;

  playerController.update(input.getMovement(), delta, elapsed);
  updateFollowCamera(camera, player);
  clouds.update(delta);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

window.addEventListener("beforeunload", () => {
  disposeResize();
  input.dispose();
});
