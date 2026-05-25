export type WordCard = {
  kana: string;
  roman: string;
  meaning: string;
  level: number;
};

export const WORD_BANK: WordCard[] = [
  { kana: "あい", roman: "ai", meaning: "アイ", level: 1 },
  { kana: "いえ", roman: "ie", meaning: "家", level: 1 },
  { kana: "うみ", roman: "umi", meaning: "海", level: 1 },
  { kana: "えき", roman: "eki", meaning: "駅", level: 1 },
  { kana: "おと", roman: "oto", meaning: "音", level: 1 },
  { kana: "かさ", roman: "kasa", meaning: "傘", level: 2 },
  { kana: "すし", roman: "sushi", meaning: "寿司", level: 2 },
  { kana: "ねこ", roman: "neko", meaning: "猫", level: 2 },
  { kana: "ほし", roman: "hoshi", meaning: "星", level: 2 },
  { kana: "まほう", roman: "mahou", meaning: "魔法", level: 3 },
  { kana: "つよい", roman: "tsuyoi", meaning: "強い", level: 3 },
  { kana: "ゆうき", roman: "yuuki", meaning: "勇気", level: 3 },
  { kana: "しょうり", roman: "shouri", meaning: "勝利", level: 4 },
  { kana: "たんけん", roman: "tanken", meaning: "探検", level: 4 },
  { kana: "きらめき", roman: "kirameki", meaning: "きらめき", level: 4 },
  { kana: "じょうず", roman: "jouzu", meaning: "上手", level: 5 },
  { kana: "だいぼうけん", roman: "daibouken", meaning: "大冒険", level: 5 },
  { kana: "タイピング", roman: "taipingu", meaning: "タイピング", level: 5 }
];

export function wordsForLevel(level: number): WordCard[] {
  return WORD_BANK.filter((word) => word.level <= level);
}
