export const TREE_POINTS = [
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
] as const;

export const TOWER_POSITION = {
  x: 16,
  z: -58,
  radius: 3.4,
} as const;

export const OBSTACLES = [
  ...TREE_POINTS.map(([x, z, scale]) => ({
    x,
    z,
    radius: 0.85 * scale,
  })),
  TOWER_POSITION,
] as const;
