export type FingerId =
  | "left-pinky"
  | "left-ring"
  | "left-middle"
  | "left-index"
  | "right-index"
  | "right-middle"
  | "right-ring"
  | "right-pinky"
  | "thumb";

export type KeyHint = {
  char: string;
  code: string;
  label: string;
  kana: string;
  finger: string;
  fingerId: FingerId;
  home?: boolean;
  x: number;
  y: number;
};

const FINGER_LABELS: Record<FingerId, string> = {
  "left-pinky": "左小指",
  "left-ring": "左薬指",
  "left-middle": "左中指",
  "left-index": "左人差し指",
  "right-index": "右人差し指",
  "right-middle": "右中指",
  "right-ring": "右薬指",
  "right-pinky": "右小指",
  thumb: "親指"
};

const rows = [
  [
    ["q", "た", "left-pinky"],
    ["w", "て", "left-ring"],
    ["e", "い", "left-middle"],
    ["r", "す", "left-index"],
    ["t", "か", "left-index"],
    ["y", "ん", "right-index"],
    ["u", "な", "right-index"],
    ["i", "に", "right-middle"],
    ["o", "ら", "right-ring"],
    ["p", "せ", "right-pinky"]
  ],
  [
    ["a", "ち", "left-pinky"],
    ["s", "と", "left-ring"],
    ["d", "し", "left-middle"],
    ["f", "は", "left-index"],
    ["g", "き", "left-index"],
    ["h", "く", "right-index"],
    ["j", "ま", "right-index"],
    ["k", "の", "right-middle"],
    ["l", "り", "right-ring"]
  ],
  [
    ["z", "つ", "left-pinky"],
    ["x", "さ", "left-ring"],
    ["c", "そ", "left-middle"],
    ["v", "ひ", "left-index"],
    ["b", "こ", "left-index"],
    ["n", "み", "right-index"],
    ["m", "も", "right-index"]
  ]
] as const;

export const KEY_ROWS: KeyHint[][] = rows.map((row, rowIndex) => {
  const rowWidth = row.length;
  const start = 50 - (rowWidth * 8.6) / 2 + 4.3;
  return row.map(([char, kana, fingerId], columnIndex) => ({
    char,
    code: `Key${char.toUpperCase()}`,
    label: char.toUpperCase(),
    kana,
    fingerId,
    finger: FINGER_LABELS[fingerId],
    home: ["a", "s", "d", "f", "j", "k", "l"].includes(char),
    x: start + columnIndex * 8.6,
    y: 60 + rowIndex * 12
  }));
});

const SPACE_HINT: KeyHint = {
  char: " ",
  code: "Space",
  label: "SPACE",
  kana: "空白",
  fingerId: "thumb",
  finger: FINGER_LABELS.thumb,
  x: 50,
  y: 93
};

const KEY_HINTS = Object.fromEntries(KEY_ROWS.flat().map((key) => [key.char, key]));

export function getKeyHint(char: string): KeyHint {
  return char === " " ? SPACE_HINT : KEY_HINTS[char.toLowerCase()] ?? KEY_ROWS[1][8];
}

export function getSpaceHint(): KeyHint {
  return SPACE_HINT;
}

export function normalizeTypedKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : "";
}
