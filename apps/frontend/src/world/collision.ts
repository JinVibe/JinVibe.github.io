import { OBSTACLES } from "./worldData";

const PLAYER_RADIUS = 0.65;

export const isPositionBlocked = (x: number, z: number) =>
  OBSTACLES.some((obstacle) => {
    const distanceX = x - obstacle.x;
    const distanceZ = z - obstacle.z;
    const allowedDistance = obstacle.radius + PLAYER_RADIUS;

    return distanceX * distanceX + distanceZ * distanceZ < allowedDistance * allowedDistance;
  });
