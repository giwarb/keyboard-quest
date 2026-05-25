import { accuracy, GameState, rankForScore } from "./state";

const STORAGE_KEY = "keyboard-quest-records-v1";

export type ScoreRecord = {
  score: number;
  defeated: number;
  maxCombo: number;
  accuracy: number;
  rank: string;
  playedAt: string;
};

export function loadRecords(storage: Storage = localStorage): ScoreRecord[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as ScoreRecord[]) : [];
  } catch {
    return [];
  }
}

export function saveRecord(state: GameState, storage: Storage = localStorage): ScoreRecord[] {
  const records = loadRecords(storage);
  const next: ScoreRecord = {
    score: state.score,
    defeated: state.defeated,
    maxCombo: state.maxCombo,
    accuracy: accuracy(state),
    rank: rankForScore(state.score),
    playedAt: new Date().toISOString()
  };
  const sorted = [next, ...records].sort((a, b) => b.score - a.score).slice(0, 10);
  storage.setItem(STORAGE_KEY, JSON.stringify(sorted));
  return sorted;
}
