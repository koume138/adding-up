'use strict';
const fs = require('fs'); /*requireでNode.jsのモジュールを呼び出している*/
const readline = require('readline');
const rs = fs.createReadStream('./popu-pref.csv'); /**fs.readFileで読むよりメモリ消費が少なく処理も速い */
const rl = readline.createInterface({ input: rs, output: {} });
const prefectureDataMap = new Map(); // key: 都道府県 value: 集計データのオブジェクト

rl.on('line', lineString => {
  /* console.log(lineString); 一行分*/
  const columns = lineString.split(','); /**カンマ区切りで切り出す  */
  const year = parseInt(columns[0]);
  const prefecture = columns[1];
  const popu = parseInt(columns[3]);

  if (year === 2010 || year === 2015) {
    let value = prefectureDataMap.get(prefecture); /**keyであるprefectureが空なら */
    if (!value) {
      value = {
        popu10: 0,
        popu15: 0,
        change: null
      };
    }
    if (year === 2010) {
      value.popu10 = popu;
    }
    if (year === 2015) {
      value.popu15 = popu;
    }
    prefectureDataMap.set(prefecture, value);
  }
});

rl.on('close', () => {
  for (let [key, value] of prefectureDataMap) {
    /**for-of構文でMapやArrayの中身をof以前で与えられた変数に代入してforループと同じことをしている */
    value.change = value.popu15 / value.popu10;
  }
  const rankingArray = Array.from(prefectureDataMap).sort((pair1, pair2) => {
    /**連想配列を普通の配列に変換して、ソート */
    return pair2[1].change - pair1[1].change;
  });
  const rankingStrings = rankingArray.map(([key, value]) => {
    return (` ${key}: ${value.popu10} => ${value.popu15}  変化率: ${value.change}`);
  });
  console.log(rankingStrings);
});