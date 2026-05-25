import { describe, expect, it } from "vitest";
import { createGameState, handleTypedChar, startRun, expectedChar } from "../game/simulation/state";
import { loadRecords, saveRecord } from "../game/simulation/storage";

describe("score storage", () => {
  it("stores best records sorted by score", () => {
    const storage = new MapStorage();
    let state = startRun(createGameState(8), 0);
    state = handleTypedChar(state, expectedChar(state), 10);
    saveRecord(state, storage);

    let better = startRun(createGameState(9), 0);
    for (let i = 0; i < 4; i += 1) better = handleTypedChar(better, expectedChar(better), 10 + i);
    saveRecord(better, storage);

    const records = loadRecords(storage);
    expect(records).toHaveLength(2);
    expect(records[0].score).toBeGreaterThanOrEqual(records[1].score);
  });
});

class MapStorage implements Storage {
  private values = new Map<string, string>();
  get length(): number {
    return this.values.size;
  }
  clear(): void {
    this.values.clear();
  }
  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }
  key(index: number): string | null {
    return [...this.values.keys()][index] ?? null;
  }
  removeItem(key: string): void {
    this.values.delete(key);
  }
  setItem(key: string, value: string): void {
    this.values.set(key, value);
  }
}
