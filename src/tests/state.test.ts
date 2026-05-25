import { describe, expect, it } from "vitest";
import { createGameState, expectedChar, handleTypedChar, startRun, updateClock } from "../game/simulation/state";

describe("typing simulation", () => {
  it("starts with a playable target and advances on correct keys", () => {
    let state = startRun(createGameState(1), 0);
    const first = expectedChar(state);
    state = handleTypedChar(state, first, 100);

    expect(state.hits).toBe(1);
    expect(state.combo).toBe(1);
    expect(state.score).toBeGreaterThan(0);
    expect(state.lastEvent?.type).toBe("correct");
  });

  it("resets combo and records wrong keys without advancing progress", () => {
    let state = startRun(createGameState(2), 0);
    state = handleTypedChar(state, expectedChar(state), 100);
    const progress = state.target.progress;
    state = handleTypedChar(state, "!", 200);

    expect(state.combo).toBe(0);
    expect(state.misses).toBe(1);
    expect(state.target.progress).toBe(progress);
    expect(state.lastEvent?.type).toBe("wrong");
  });

  it("ends after the configured duration", () => {
    const state = startRun(createGameState(3, 1000), 0);
    const ended = updateClock(state, 1001);
    expect(ended.phase).toBe("ended");
  });

  it("increases level after enough defeats", () => {
    let state = startRun(createGameState(4), 0);
    for (let i = 0; i < 40; i += 1) {
      state = handleTypedChar(state, expectedChar(state), i * 100);
    }
    expect(state.defeated).toBeGreaterThan(2);
    expect(state.level).toBeGreaterThan(1);
  });
});
