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
  { kana: "あお", roman: "ao", meaning: "青", level: 1 },
  { kana: "いぬ", roman: "inu", meaning: "犬", level: 1 },
  { kana: "うた", roman: "uta", meaning: "歌", level: 1 },
  { kana: "おに", roman: "oni", meaning: "鬼", level: 1 },
  { kana: "かき", roman: "kaki", meaning: "柿", level: 1 },
  { kana: "かさ", roman: "kasa", meaning: "傘", level: 2 },
  { kana: "すし", roman: "sushi", meaning: "寿司", level: 2 },
  { kana: "ねこ", roman: "neko", meaning: "猫", level: 2 },
  { kana: "ほし", roman: "hoshi", meaning: "星", level: 2 },
  { kana: "みず", roman: "mizu", meaning: "水", level: 2 },
  { kana: "そら", roman: "sora", meaning: "空", level: 2 },
  { kana: "やま", roman: "yama", meaning: "山", level: 2 },
  { kana: "くも", roman: "kumo", meaning: "雲", level: 2 },
  { kana: "つき", roman: "tsuki", meaning: "月", level: 2 },
  { kana: "はな", roman: "hana", meaning: "花", level: 2 },
  { kana: "まほう", roman: "mahou", meaning: "魔法", level: 3 },
  { kana: "つよい", roman: "tsuyoi", meaning: "強い", level: 3 },
  { kana: "ゆうき", roman: "yuuki", meaning: "勇気", level: 3 },
  { kana: "ひかり", roman: "hikari", meaning: "光", level: 3 },
  { kana: "げんき", roman: "genki", meaning: "元気", level: 3 },
  { kana: "きょうりゅう", roman: "kyouryuu", meaning: "恐竜", level: 3 },
  { kana: "ロケット", roman: "roketto", meaning: "ロケット", level: 3 },
  { kana: "ともだち", roman: "tomodachi", meaning: "友達", level: 3 },
  { kana: "たからばこ", roman: "takarabako", meaning: "宝箱", level: 3 },
  { kana: "にじいろ", roman: "nijiiro", meaning: "虹色", level: 3 },
  { kana: "しょうり", roman: "shouri", meaning: "勝利", level: 4 },
  { kana: "たんけん", roman: "tanken", meaning: "探検", level: 4 },
  { kana: "きらめき", roman: "kirameki", meaning: "きらめき", level: 4 },
  { kana: "スピード", roman: "supiido", meaning: "スピード", level: 4 },
  { kana: "チャレンジ", roman: "charenji", meaning: "チャレンジ", level: 4 },
  { kana: "ひみつきち", roman: "himitsukichi", meaning: "秘密基地", level: 4 },
  { kana: "ゆめのせかい", roman: "yumenosekai", meaning: "夢の世界", level: 4 },
  { kana: "まもりのたて", roman: "mamorinotate", meaning: "守りの盾", level: 4 },
  { kana: "ほうせきばこ", roman: "housekibako", meaning: "宝石箱", level: 4 },
  { kana: "じょうず", roman: "jouzu", meaning: "上手", level: 5 },
  { kana: "だいぼうけん", roman: "daibouken", meaning: "大冒険", level: 5 },
  { kana: "タイピング", roman: "taipingu", meaning: "タイピング", level: 5 },
  { kana: "キーボードマスター", roman: "kiiboodomasutaa", meaning: "キーボードマスター", level: 5 },
  { kana: "まほうのじゅもん", roman: "mahounojumon", meaning: "魔法の呪文", level: 5 },
  { kana: "さいこうきろく", roman: "saikoukiroku", meaning: "最高記録", level: 5 },
  { kana: "ゆうしゃのしょうり", roman: "yuushanoshouri", meaning: "勇者の勝利", level: 5 },
  { kana: "みんなでれんしゅう", roman: "minnaderenshuu", meaning: "みんなで練習", level: 5 }
];

export function wordsForLevel(level: number): WordCard[] {
  return WORD_BANK.filter((word) => word.level <= level);
}
