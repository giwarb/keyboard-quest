import { WORD_BANK, WordCard, wordsForLevel } from "../content/words";

export type EnemyKind = "slime" | "star" | "pencil" | "book" | "clock" | "mimic";

export type Target = {
  id: number;
  word: WordCard;
  progress: number;
  hp: number;
  maxHp: number;
  enemyKind: EnemyKind;
  defeated: boolean;
};

export type TypingEvent =
  | { type: "correct"; char: string; targetDefeated: boolean; damage: number }
  | { type: "wrong"; expected: string; actual: string };

export type GamePhase = "ready" | "running" | "ended";

export type GameState = {
  phase: GamePhase;
  seed: number;
  target: Target;
  score: number;
  combo: number;
  maxCombo: number;
  hits: number;
  misses: number;
  defeated: number;
  level: number;
  startedAt: number;
  durationMs: number;
  lastEvent?: TypingEvent;
};

const ENEMY_KINDS: EnemyKind[] = ["slime", "star", "pencil", "book", "clock", "mimic"];

export function createGameState(seed = 7, durationMs = 60_000): GameState {
  const initial = createTarget(1, 1, seed);
  return {
    phase: "ready",
    seed,
    target: initial,
    score: 0,
    combo: 0,
    maxCombo: 0,
    hits: 0,
    misses: 0,
    defeated: 0,
    level: 1,
    startedAt: 0,
    durationMs
  };
}

export function startRun(state: GameState, now: number): GameState {
  return {
    ...state,
    phase: "running",
    startedAt: now,
    lastEvent: undefined
  };
}

export function remainingMs(state: GameState, now: number): number {
  if (state.phase === "ready") return state.durationMs;
  return Math.max(0, state.durationMs - (now - state.startedAt));
}

export function updateClock(state: GameState, now: number): GameState {
  if (state.phase !== "running" || remainingMs(state, now) > 0) return state;
  return { ...state, phase: "ended", combo: 0 };
}

export function expectedChar(state: GameState): string {
  return state.target.word.roman[state.target.progress] ?? "";
}

export function handleTypedChar(state: GameState, typed: string, now: number): GameState {
  const clocked = updateClock(state, now);
  if (clocked.phase !== "running" || !typed) return clocked;

  const expected = expectedChar(clocked);
  if (typed !== expected) {
    return {
      ...clocked,
      combo: 0,
      misses: clocked.misses + 1,
      lastEvent: { type: "wrong", expected, actual: typed }
    };
  }

  const nextCombo = clocked.combo + 1;
  const nextProgress = clocked.target.progress + 1;
  const damage = 1 + Math.floor(nextCombo / 12);
  const nextHp = Math.max(0, clocked.target.hp - damage);
  const wordDone = nextProgress >= clocked.target.word.roman.length;
  const targetDefeated = wordDone || nextHp <= 0;
  const scoreGain = 10 + Math.min(40, nextCombo * 2) + clocked.level * 3;
  const defeated = clocked.defeated + (targetDefeated ? 1 : 0);
  const level = Math.min(5, 1 + Math.floor(defeated / 3) + Math.floor((now - clocked.startedAt) / 15_000));

  return {
    ...clocked,
    score: clocked.score + scoreGain,
    combo: nextCombo,
    maxCombo: Math.max(clocked.maxCombo, nextCombo),
    hits: clocked.hits + 1,
    defeated,
    level,
    target: targetDefeated
      ? createTarget(defeated + 1, level, clocked.seed + defeated * 13)
      : { ...clocked.target, progress: nextProgress, hp: nextHp },
    lastEvent: { type: "correct", char: typed, targetDefeated, damage }
  };
}

export function accuracy(state: GameState): number {
  const total = state.hits + state.misses;
  return total === 0 ? 1 : state.hits / total;
}

export function rankForScore(score: number): string {
  if (score >= 3500) return "S";
  if (score >= 2500) return "A";
  if (score >= 1600) return "B";
  if (score >= 900) return "C";
  return "D";
}

function createTarget(id: number, level: number, seed: number): Target {
  const options = wordsForLevel(level);
  const word = pickWord(options.length ? options : WORD_BANK, seed + id * 31);
  const maxHp = Math.max(2, Math.ceil(word.roman.length / 2) + level);
  return {
    id,
    word,
    progress: 0,
    hp: maxHp,
    maxHp,
    enemyKind: ENEMY_KINDS[(seed + id) % ENEMY_KINDS.length],
    defeated: false
  };
}

function pickWord(words: WordCard[], seed: number): WordCard {
  const value = Math.abs(Math.sin(seed * 999)) * words.length;
  return words[Math.floor(value) % words.length];
}
