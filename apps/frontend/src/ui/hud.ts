export const mountHud = (root: HTMLElement) => {
  root.insertAdjacentHTML(
    "beforeend",
    `
      <section class="hud" aria-label="Match status">
        <span class="eyebrow">Half Court Shot Lab</span>
        <h1>JinVibe FC</h1>
        <p>Move with WASD. Hold Space, aim with arrows, then release to shoot.</p>
        <strong class="score" id="score">Goals 0</strong>
        <div class="power" aria-label="Shot power">
          <span id="power-fill"></span>
        </div>
      </section>
      <div class="status" aria-label="Controls">
        <kbd>W</kbd><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
        <span>move</span>
        <kbd>Arrows</kbd>
        <span>aim</span>
        <kbd>Space</kbd>
        <span>hold / release shot</span>
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

export const setShotPower = (power: number) => {
  const powerElement = document.querySelector<HTMLSpanElement>("#power-fill");
  if (powerElement) {
    powerElement.style.transform = `scaleX(${power.toFixed(3)})`;
  }
};
