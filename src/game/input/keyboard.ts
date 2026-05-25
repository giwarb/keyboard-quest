export type Finger =
  | "左小指"
  | "左薬指"
  | "左中指"
  | "左人差し指"
  | "右人差し指"
  | "右中指"
  | "右薬指"
  | "右小指"
  | "親指";

export type KeyHint = {
  char: string;
  code: string;
  label: string;
  finger: Finger;
  hand: "left" | "right" | "thumb";
};

const KEY_HINTS: Record<string, KeyHint> = {
  a: { char: "a", code: "KeyA", label: "A", finger: "左小指", hand: "left" },
  b: { char: "b", code: "KeyB", label: "B", finger: "左人差し指", hand: "left" },
  c: { char: "c", code: "KeyC", label: "C", finger: "左中指", hand: "left" },
  d: { char: "d", code: "KeyD", label: "D", finger: "左中指", hand: "left" },
  e: { char: "e", code: "KeyE", label: "E", finger: "左中指", hand: "left" },
  f: { char: "f", code: "KeyF", label: "F", finger: "左人差し指", hand: "left" },
  g: { char: "g", code: "KeyG", label: "G", finger: "左人差し指", hand: "left" },
  h: { char: "h", code: "KeyH", label: "H", finger: "右人差し指", hand: "right" },
  i: { char: "i", code: "KeyI", label: "I", finger: "右中指", hand: "right" },
  j: { char: "j", code: "KeyJ", label: "J", finger: "右人差し指", hand: "right" },
  k: { char: "k", code: "KeyK", label: "K", finger: "右中指", hand: "right" },
  l: { char: "l", code: "KeyL", label: "L", finger: "右薬指", hand: "right" },
  m: { char: "m", code: "KeyM", label: "M", finger: "右人差し指", hand: "right" },
  n: { char: "n", code: "KeyN", label: "N", finger: "右人差し指", hand: "right" },
  o: { char: "o", code: "KeyO", label: "O", finger: "右薬指", hand: "right" },
  p: { char: "p", code: "KeyP", label: "P", finger: "右小指", hand: "right" },
  q: { char: "q", code: "KeyQ", label: "Q", finger: "左小指", hand: "left" },
  r: { char: "r", code: "KeyR", label: "R", finger: "左人差し指", hand: "left" },
  s: { char: "s", code: "KeyS", label: "S", finger: "左薬指", hand: "left" },
  t: { char: "t", code: "KeyT", label: "T", finger: "左人差し指", hand: "left" },
  u: { char: "u", code: "KeyU", label: "U", finger: "右人差し指", hand: "right" },
  v: { char: "v", code: "KeyV", label: "V", finger: "左人差し指", hand: "left" },
  w: { char: "w", code: "KeyW", label: "W", finger: "左薬指", hand: "left" },
  x: { char: "x", code: "KeyX", label: "X", finger: "左薬指", hand: "left" },
  y: { char: "y", code: "KeyY", label: "Y", finger: "右人差し指", hand: "right" },
  z: { char: "z", code: "KeyZ", label: "Z", finger: "左小指", hand: "left" },
  " ": { char: " ", code: "Space", label: "SPACE", finger: "親指", hand: "thumb" }
};

export const KEY_ROWS = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"]
];

export function getKeyHint(char: string): KeyHint {
  return KEY_HINTS[char.toLowerCase()] ?? {
    char,
    code: "",
    label: char.toUpperCase(),
    finger: "右小指",
    hand: "right"
  };
}

export function normalizeTypedKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : "";
}
