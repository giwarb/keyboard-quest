import Phaser from "phaser";
import "./styles/main.css";
import { ArcadeAudio } from "./audio";
import { normalizeTypedKey } from "./game/input/keyboard";
import { createGameState, handleTypedChar, startRun, updateClock } from "./game/simulation/state";
import { loadRecords, saveRecord, ScoreRecord } from "./game/simulation/storage";
import { emitGameEvent } from "./phaser/adapters/eventBus";
import { BootScene } from "./phaser/scenes/BootScene";
import { GameScene } from "./phaser/scenes/GameScene";
import { renderHud } from "./ui/render";

const app = document.querySelector<HTMLDivElement>("#app");
if (!app) throw new Error("Missing #app");
const root = app;

let state = createGameState(Date.now() % 1000);
let records: ScoreRecord[] = loadRecords();
let savedThisRun = false;
const audio = new ArcadeAudio();
let phaserGame: Phaser.Game | undefined;

render();

phaserGame = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "phaser-root",
  width: 1024,
  height: 768,
  backgroundColor: "#10284a",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  scene: [BootScene, GameScene]
});

window.addEventListener("keydown", (event) => {
  if (event.repeat) return;
  if (["Space", "Enter"].includes(event.code)) event.preventDefault();
  audio.start();

  if (state.phase === "ready" && event.code === "Space") {
    state = startRun(createGameState(Date.now() % 1000), performance.now());
    savedThisRun = false;
    emitGameEvent({ type: "restart" });
    render();
    return;
  }

  if (state.phase === "ended" && event.code === "Enter") {
    state = startRun(createGameState(Date.now() % 1000), performance.now());
    savedThisRun = false;
    emitGameEvent({ type: "restart" });
    render();
    return;
  }

  const typed = normalizeTypedKey(event.key);
  const next = handleTypedChar(state, typed, performance.now());
  if (next !== state && next.lastEvent) {
    if (next.lastEvent.type === "correct") {
      audio.correct();
      if (next.lastEvent.wordCompleted) audio.wordClear();
      if (next.lastEvent.targetDefeated) audio.defeat();
    } else {
      audio.wrong();
    }
    emitGameEvent({ type: "typing", event: next.lastEvent, state: next });
  }
  state = next;
  render();
});

window.setInterval(() => {
  const previousPhase = state.phase;
  state = updateClock(state, performance.now());
  if (state.phase === "ended" && previousPhase !== "ended" && !savedThisRun) {
    records = saveRecord(state);
    savedThisRun = true;
    audio.stop();
  }
  emitGameEvent({ type: "state", state });
  render();
}, 120);

function render(): void {
  renderHud(root, state, records, performance.now());
  const host = document.querySelector("#phaser-root");
  if (host && phaserGame?.canvas && !host.contains(phaserGame.canvas)) {
    host.appendChild(phaserGame.canvas);
  }
  emitGameEvent({ type: "state", state });
}
