export const mountHud = (root: HTMLElement) => {
  root.insertAdjacentHTML(
    "beforeend",
    `
      <section class="hud" aria-label="World status">
        <h1>JinVibe Field</h1>
        <p>Wind-swept grasslands, rolling hills, and an ancient tower mark the first playable prototype.</p>
      </section>
      <div class="status" aria-label="Controls">
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
        <span>move</span>
      </div>
    `,
  );
};
