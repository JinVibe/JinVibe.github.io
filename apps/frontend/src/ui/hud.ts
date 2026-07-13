export const mountHud = (root: HTMLElement) => {
  root.insertAdjacentHTML(
    "beforeend",
    `
      <section class="hud" aria-label="Match status">
        <span class="eyebrow">Half Court Shot Lab</span>
        <h1>JinVibe FC</h1>
        <p>Carry the ball into space, face the goal, and strike with timing.</p>
        <strong class="score" id="score">Goals 0</strong>
      </section>
      <div class="status" aria-label="Controls">
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
        <span>move</span>
        <kbd>Space</kbd>
        <span>shoot</span>
      </div>
    `,
  );
};

export const setScore = (score: number) => {
  const scoreElement = document.querySelector<HTMLDivElement>("#score");
  if (scoreElement) {
    scoreElement.textContent = `Goals ${score}`;
  }
};
