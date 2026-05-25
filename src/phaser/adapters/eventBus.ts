import { GameState, TypingEvent } from "../../game/simulation/state";

export type GameUiEvent =
  | { type: "state"; state: GameState }
  | { type: "typing"; event: TypingEvent; state: GameState }
  | { type: "restart" };

type Listener = (event: GameUiEvent) => void;

const listeners = new Set<Listener>();

export function emitGameEvent(event: GameUiEvent): void {
  listeners.forEach((listener) => listener(event));
}

export function onGameEvent(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
