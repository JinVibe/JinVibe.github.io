export type MovementInput = {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
};

export const createKeyboardInput = () => {
  const keys = new Set<string>();
  let shootPressed = false;

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
      if (!event.repeat) {
        shootPressed = true;
      }
    }
    keys.add(event.key.toLowerCase());
  };

  const handleKeyUp = (event: KeyboardEvent) => {
    if (event.code === "Space") {
      event.preventDefault();
    }
    keys.delete(event.key.toLowerCase());
  };

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);

  return {
    getMovement(): MovementInput {
      const movement = {
        forward: keys.has("w") || keys.has("arrowup"),
        backward: keys.has("s") || keys.has("arrowdown"),
        left: keys.has("a") || keys.has("arrowleft"),
        right: keys.has("d") || keys.has("arrowright"),
        shoot: shootPressed,
      };
      shootPressed = false;

      return movement;
    },
    dispose() {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    },
  };
};
