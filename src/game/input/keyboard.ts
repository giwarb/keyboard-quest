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
  label: string;
  kana: string;
  finger: string;
  fingerId: FingerId;
  width?: number;
  home?: boolean;
  active?: boolean;
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

type KeySpec = [char: string, label: string, kana: string, finger: FingerId, width?: number];

const specs: KeySpec[][] = [
  [
    ["", "半/全", "", "left-pinky", 1.2],
    ["1", "1", "ぬ", "left-pinky"],
    ["2", "2", "ふ", "left-ring"],
    ["3", "3", "あ", "left-middle"],
    ["4", "4", "う", "left-index"],
    ["5", "5", "え", "left-index"],
    ["6", "6", "お", "right-index"],
    ["7", "7", "や", "right-index"],
    ["8", "8", "ゆ", "right-middle"],
    ["9", "9", "よ", "right-ring"],
    ["0", "0", "わ", "right-pinky"],
    ["-", "-", "ほ", "right-pinky"],
    ["^", "^", "へ", "right-pinky"],
    ["¥", "¥", "ー", "right-pinky"]
  ],
  [
    ["", "tab", "", "left-pinky", 1.5],
    ["q", "Q", "た", "left-pinky"],
    ["w", "W", "て", "left-ring"],
    ["e", "E", "い", "left-middle"],
    ["r", "R", "す", "left-index"],
    ["t", "T", "か", "left-index"],
    ["y", "Y", "ん", "right-index"],
    ["u", "U", "な", "right-index"],
    ["i", "I", "に", "right-middle"],
    ["o", "O", "ら", "right-ring"],
    ["p", "P", "せ", "right-pinky"],
    ["@", "@", "゛", "right-pinky"],
    ["[", "[", "゜", "right-pinky"]
  ],
  [
    ["", "caps", "", "left-pinky", 1.8],
    ["a", "A", "ち", "left-pinky"],
    ["s", "S", "と", "left-ring"],
    ["d", "D", "し", "left-middle"],
    ["f", "F", "は", "left-index"],
    ["g", "G", "き", "left-index"],
    ["h", "H", "く", "right-index"],
    ["j", "J", "ま", "right-index"],
    ["k", "K", "の", "right-middle"],
    ["l", "L", "り", "right-ring"],
    [";", ";", "れ", "right-pinky"],
    ["]", "]", "む", "right-pinky"]
  ],
  [
    ["", "shift", "", "left-pinky", 2.2],
    ["z", "Z", "つ", "left-pinky"],
    ["x", "X", "さ", "left-ring"],
    ["c", "C", "そ", "left-middle"],
    ["v", "V", "ひ", "left-index"],
    ["b", "B", "こ", "left-index"],
    ["n", "N", "み", "right-index"],
    ["m", "M", "も", "right-index"],
    [",", ",", "ね", "right-middle"],
    [".", ".", "る", "right-ring"],
    ["/", "/", "め", "right-pinky"],
    ["", "shift", "", "right-pinky", 2.0]
  ],
  [
    ["", "ctrl", "", "left-pinky", 1.3],
    ["", "Fn", "", "left-ring", 1.1],
    ["", "win", "", "left-middle", 1.1],
    ["", "alt", "", "left-index", 1.1],
    [" ", "SPACE", "空白", "thumb", 6.8],
    ["", "alt", "", "right-index", 1.1],
    ["", "Fn", "", "right-middle", 1.1],
    ["", "ctrl", "", "right-pinky", 1.3]
  ]
];

export const KEY_ROWS: KeyHint[][] = specs.map((row) =>
  row.map(([char, label, kana, fingerId, width]) => ({
    char,
    label,
    kana,
    fingerId,
    finger: FINGER_LABELS[fingerId],
    width,
    active: Boolean(char),
    home: ["a", "s", "d", "f", "j", "k", "l"].includes(char)
  }))
);

const KEY_HINTS = Object.fromEntries(KEY_ROWS.flat().filter((key) => key.char).map((key) => [key.char, key]));

export function getKeyHint(char: string): KeyHint {
  return KEY_HINTS[char.toLowerCase()] ?? KEY_HINTS.k;
}

export function normalizeTypedKey(key: string): string {
  return key.length === 1 ? key.toLowerCase() : "";
}
