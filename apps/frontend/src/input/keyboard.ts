export type MovementInput = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  shootHeld: boolean;
  shootReleased: boolean;
  shotPower: number;
};

export const createKeyboardInput = () => {
  const keys = new Set<string>();
  let shootStart = 0;
  let shootReleasePower = 0;
  let shootReleased = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (!event.repeat && shootStart === 0) {
        shootStart = performance.now();
      }
    }
    keys.add(event.key.toLowerCase());
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (shootStart > 0) {
        shootReleasePower = Math.min((performance.now() - shootStart) / 1200, 1);
        shootReleased = true;
        shootStart = 0;
      }
    }
    keys.delete(event.key.toLowerCase());
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return {
    getMovement(): MovementInput {
      const heldPower =
        shootStart > 0 ? Math.min((performance.now() - shootStart) / 1200, 1) : 0;
      const movement = {
        forward: keys.has("w") || keys.has("arrowup"),
        backward: keys.has("s") || keys.has("arrowdown"),
        left: keys.has("a") || keys.has("arrowleft"),
        right: keys.has("d") || keys.has("arrowright"),
        shootHeld: shootStart > 0,
        shootReleased,
        shotPower: shootReleased ? shootReleasePower : heldPower,
      };
      shootReleased = false;
      shootReleasePower = 0;

      return movement;
    },
    dispose() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    },
  };
};
