import { KEY_ROWS, getKeyHint, KeyHint } from "../game/input/keyboard";
import { accuracy, GameState, rankForScore, remainingMs } from "../game/simulation/state";
import { ScoreRecord } from "../game/simulation/storage";

export function renderHud(root: HTMLElement, state: GameState, records: ScoreRecord[], now: number): void {
  ensureLayout(root);
  const activeChar = state.phase === "running" ? state.target.word.roman[state.target.progress] : " ";
  const expected = getKeyHint(activeChar);
  const wrong = state.lastEvent?.type === "wrong" ? state.lastEvent.actual : "";
  const typed = state.target.word.roman.slice(0, state.target.progress);
  const rest = state.target.word.roman.slice(state.target.progress);
  const best = records[0]?.score ?? 0;
  const seconds = Math.ceil(remainingMs(state, now) / 1000);
  const uiLayer = root.querySelector<HTMLElement>("#ui-layer");
  const keyboardLayer = root.querySelector<HTMLElement>("#keyboard-layer");
  if (!uiLayer || !keyboardLayer) return;

  uiLayer.innerHTML = `
    <div class="top-bars">
      <div class="quest-meter"><i style="width:${Math.max(6, Math.round((state.defeated % 10) * 10))}%"></i></div>
      <strong>${Math.min(10, (state.defeated % 10) + 1)}/10</strong>
      <div class="boss-name">${state.target.isBoss ? "ボス" : "ゴーレム"}</div>
      <div class="enemy-hp"><span>HP</span><i style="width:${Math.round((state.target.hp / state.target.maxHp) * 100)}%"></i></div>
    </div>
    <div class="battle-card ${state.target.isBoss ? "boss" : ""}">
      <div class="kana">${state.target.word.kana}</div>
      <div class="reading"><span>${typed}</span><b>${rest[0] ?? ""}</b>${rest.slice(1)}</div>
      <div class="roman"><span>${typed.toUpperCase()}</span><b>${(rest[0] ?? "").toUpperCase()}</b>${rest.slice(1).toUpperCase()}</div>
      <small>${expected.kana} / ${expected.label} / ${expected.finger}</small>
    </div>
    <div class="floating-stats">
      <span>SCORE ${state.score}</span>
      <span>BEST ${best}</span>
      <span>COMBO ${state.combo}</span>
      <span>TIME ${seconds}</span>
    </div>
    ${state.phase === "ready" ? readyPanel(best) : ""}
    ${state.phase === "ended" ? resultPanel(state, records) : ""}
  `;

  keyboardLayer.innerHTML = `
    <div class="hand-layer hand-${expected.fingerId}">
      ${handMarkup(expected.fingerId)}
    </div>
    <div class="keyboard-board">
      ${KEY_ROWS.map((row) => `<div class="key-row">${row.map((key) => keyButton(key, expected, wrong)).join("")}</div>`).join("")}
    </div>
  `;
}

function ensureLayout(root: HTMLElement): void {
  if (root.querySelector(".game-stage")) return;
  root.innerHTML = `
    <main class="game-stage">
      <div id="phaser-root" class="canvas-host"></div>
      <div id="ui-layer" class="ui-layer"></div>
      <div id="keyboard-layer" class="keyboard-layer"></div>
    </main>
  `;
}

function keyButton(key: KeyHint, expected: KeyHint, wrong: string): string {
  const classes = ["key", `finger-${key.fingerId}`];
  if (!key.active) classes.push("utility");
  if (key.char === expected.char) classes.push("target");
  if (key.char === wrong) classes.push("wrong");
  if (key.home) classes.push("home");
  const width = key.width ? ` style="--w:${key.width}"` : "";
  return `
    <div class="${classes.join(" ")}"${width}>
      <span>${key.kana}</span>
      <strong>${key.label}</strong>
    </div>
  `;
}

function readyPanel(best: number): string {
  return `
    <div class="overlay">
      <h1>Keyboard Quest</h1>
      <p>スペースキーではじめる</p>
      <small>光るキーと指を見て、単語を最後まで打つと攻撃。ボスは何問もクリアして倒そう。</small>
      <b>BEST ${best}</b>
    </div>
  `;
}

function resultPanel(state: GameState, records: ScoreRecord[]): string {
  const best = records[0]?.score === state.score;
  return `
    <div class="overlay">
      <h1>${best ? "NEW BEST!" : "RESULT"}</h1>
      <p>${state.score}点 / ランク ${rankForScore(state.score)}</p>
      <small>たおした数 ${state.defeated}・最高コンボ ${state.maxCombo}・正確さ ${Math.round(accuracy(state) * 100)}%</small>
      <b>Enterでもう一回</b>
    </div>
  `;
}

function handMarkup(activeFinger: string): string {
  const leftShift = activeFinger.startsWith("left") ? poseOffset(activeFinger) : 0;
  const rightShift = activeFinger.startsWith("right") ? poseOffset(activeFinger) : 0;
  return `
    <svg class="hands" viewBox="0 0 1024 360" aria-label="手とキーボードのガイド">
      <g class="left-hand" transform="translate(${leftShift} 0)">
        <path d="M42 338 C70 274 91 224 108 164 C116 132 139 128 147 160 L156 216 C158 154 166 104 180 70 C191 43 213 49 213 82 L214 218 C222 148 236 94 254 62 C268 37 288 49 284 82 L270 220 C289 158 309 119 329 98 C349 78 366 94 354 122 L306 248 C294 280 294 314 303 350" />
        <circle class="tip left-pinky" cx="140" cy="154" r="18" />
        <circle class="tip left-ring" cx="208" cy="84" r="18" />
        <circle class="tip left-middle" cx="280" cy="82" r="18" />
        <circle class="tip left-index" cx="354" cy="118" r="18" />
      </g>
      <g class="right-hand" transform="translate(${rightShift} 0)">
        <path d="M982 338 C954 274 933 224 916 164 C908 132 885 128 877 160 L868 216 C866 154 858 104 844 70 C833 43 811 49 811 82 L810 218 C802 148 788 94 770 62 C756 37 736 49 740 82 L754 220 C735 158 715 119 695 98 C675 78 658 94 670 122 L718 248 C730 280 730 314 721 350" />
        <circle class="tip right-index" cx="670" cy="118" r="18" />
        <circle class="tip right-middle" cx="744" cy="82" r="18" />
        <circle class="tip right-ring" cx="816" cy="84" r="18" />
        <circle class="tip right-pinky" cx="884" cy="154" r="18" />
      </g>
      <circle class="tip thumb" cx="512" cy="306" r="20" />
    </svg>
  `;
}

function poseOffset(finger: string): number {
  const offsets: Record<string, number> = {
    "left-pinky": -10,
    "left-ring": -4,
    "left-middle": 2,
    "left-index": 10,
    "right-index": -10,
    "right-middle": -2,
    "right-ring": 4,
    "right-pinky": 10
  };
  return offsets[finger] ?? 0;
}
