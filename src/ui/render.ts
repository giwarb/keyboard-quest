import { KEY_ROWS, getKeyHint, getSpaceHint, KeyHint } from "../game/input/keyboard";
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
  const trainer = root.querySelector<HTMLElement>("#trainer-root");
  if (!uiLayer || !trainer) return;

  uiLayer.innerHTML = `
    <div class="hud" aria-live="polite">
      <div class="stat"><span>TIME</span><strong>${seconds}</strong></div>
      <div class="stat"><span>SCORE</span><strong>${state.score}</strong></div>
      <div class="stat"><span>BEST</span><strong>${best}</strong></div>
      <div class="stat"><span>COMBO</span><strong>${state.combo}</strong></div>
      <div class="stat"><span>LV</span><strong>${state.level}</strong></div>
    </div>
    <div class="word-panel ${state.target.isBoss ? "boss" : ""}">
      <div class="target-title">${state.target.title}</div>
      <div class="kana">${state.target.word.kana}</div>
      <div class="meaning">${state.target.word.meaning}</div>
      <div class="roman"><span>${typed}</span>${rest}</div>
      <div class="hp"><i style="width:${Math.round((state.target.hp / state.target.maxHp) * 100)}%"></i></div>
    </div>
    ${state.phase === "ready" ? readyPanel(best) : ""}
    ${state.phase === "ended" ? resultPanel(state, records) : ""}
  `;

  trainer.innerHTML = `
    <div class="trainer-word">
      <div class="mini-card muted">${typed.slice(-1) || " "}</div>
      <div class="mini-card current">
        <span>${expected.kana}</span>
        <strong>${expected.label}</strong>
        <em>${expected.finger}</em>
      </div>
      <div class="mini-card muted">${rest[1]?.toUpperCase() ?? " "}</div>
    </div>
    <div class="practice-strip">
      <div class="kana">${state.target.word.kana}</div>
      <div class="roman"><span>${typed}</span><b>${rest[0] ?? ""}</b>${rest.slice(1)}</div>
      <small>${state.target.isBoss ? `あと ${state.target.hp} 問でボス撃破` : "単語を最後まで打つと攻撃"}</small>
    </div>
    <div class="keyboard-stage" style="--active-x:${expected.x}%; --active-y:${expected.y}%">
      ${handSvg(expected.fingerId)}
      <div class="keyboard">
        ${KEY_ROWS.map((row) => `<div class="key-row">${row.map((key) => keyButton(key, expected, wrong)).join("")}</div>`).join("")}
        <div class="key-row">${keyButton(getSpaceHint(), expected, wrong, true)}</div>
      </div>
      <div class="legend">
        <span class="finger-left-pinky">左小</span>
        <span class="finger-left-ring">左薬</span>
        <span class="finger-left-middle">左中</span>
        <span class="finger-left-index">左人</span>
        <span class="finger-right-index">右人</span>
        <span class="finger-right-middle">右中</span>
        <span class="finger-right-ring">右薬</span>
        <span class="finger-right-pinky">右小</span>
      </div>
    </div>
  `;
}

function ensureLayout(root: HTMLElement): void {
  if (root.querySelector(".shell")) return;
  root.innerHTML = `
    <main class="shell">
      <section class="game-wrap">
        <div id="phaser-root" class="canvas-host"></div>
        <div id="ui-layer"></div>
      </section>
      <section id="trainer-root" class="trainer"></section>
    </main>
  `;
}

function keyButton(key: KeyHint, expected: KeyHint, wrong: string, space = false): string {
  const classes = ["key", `finger-${key.fingerId}`];
  if (space) classes.push("space");
  if (key.char === expected.char) classes.push("target");
  if (key.char === wrong) classes.push("wrong");
  if (key.home) classes.push("home");
  return `
    <div class="${classes.join(" ")}">
      <span class="key-kana">${key.kana}</span>
      <strong>${key.label}</strong>
    </div>
  `;
}

function readyPanel(best: number): string {
  return `
    <div class="overlay">
      <h1>Keyboard Quest</h1>
      <p>スペースキーではじめる</p>
      <small>単語を最後まで打つと攻撃。5体ごとにボスが出ます。マウスなしで遊べます。</small>
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

function handSvg(activeFinger: string): string {
  return `
    <svg class="hands active-${activeFinger}" viewBox="0 0 760 360" aria-label="手とキーボードの指ガイド">
      <path class="hand left-hand" d="M44 348 C75 285 88 222 102 160 C109 129 129 123 137 154 L149 208 C152 153 158 109 169 75 C178 47 199 50 202 82 L207 200 C211 143 221 93 235 61 C247 35 268 43 266 76 L258 202 C271 147 286 111 303 91 C322 70 339 84 330 112 L292 236 C281 270 280 306 288 348" />
      <path class="hand right-hand" d="M716 348 C685 285 672 222 658 160 C651 129 631 123 623 154 L611 208 C608 153 602 109 591 75 C582 47 561 50 558 82 L553 200 C549 143 539 93 525 61 C513 35 492 43 494 76 L502 202 C489 147 474 111 457 91 C438 70 421 84 430 112 L468 236 C479 270 480 306 472 348" />
      <circle class="tip left-pinky" cx="132" cy="154" r="15" />
      <circle class="tip left-ring" cx="198" cy="82" r="15" />
      <circle class="tip left-middle" cx="264" cy="76" r="15" />
      <circle class="tip left-index" cx="327" cy="110" r="15" />
      <circle class="tip right-index" cx="433" cy="110" r="15" />
      <circle class="tip right-middle" cx="496" cy="76" r="15" />
      <circle class="tip right-ring" cx="562" cy="82" r="15" />
      <circle class="tip right-pinky" cx="628" cy="154" r="15" />
      <circle class="tip thumb" cx="380" cy="286" r="15" />
    </svg>
  `;
}
