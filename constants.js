
import chalk from 'chalk';

//#region Pokemon Gen 7 types
export const classicTypes = [
  'NORMAL',
  'FIRE',
  'WATER',
  'ELECTRIC',
  'GRASS',
  'ICE',
  'FIGHTING',
  'POISON',
  'GROUND',
  'MYSTERY',
  'FLYING',
  'PSYCHIC',
  'BUG',
  'ROCK',
  'GHOST',
  'DRAGON',
  'DARK',
  'STEEL',
  'FAIRY',
];

export const classicTypeIndexes = {
  'NORMAL': 0,
  'FIRE': 1,
  'WATER': 2,
  'ELECTRIC': 3,
  'GRASS': 4,
  'ICE': 5,
  'FIGHTING': 6,
  'POISON': 7,
  'GROUND': 8,
  'MYSTERY': 9,
  'FLYING': 10,
  'PSYCHIC': 11,
  'BUG': 12,
  'ROCK': 13,
  'GHOST': 14,
  'DRAGON': 15,
  'DARK': 16,
  'STEEL': 17,
  'FAIRY': 18,
};

export const classicTypeColours = {
  'NORMAL': chalk.hex('aaaa99'),
  'FIRE': chalk.hex('ff4422'),
  'WATER': chalk.hex('3399ff'),
  'ELECTRIC': chalk.hex('ffcc33'),
  'GRASS': chalk.hex('77cc55'),
  'ICE': chalk.hex('66ccff'),
  'FIGHTING': chalk.hex('bb5544'),
  'POISON': chalk.hex('aa5599'),
  'GROUND': chalk.hex('ddbb55'),
  'MYSTERY': chalk.hex('ffffff'),
  'FLYING': chalk.hex('8899ff'),
  'PSYCHIC': chalk.hex('ff5599'),
  'BUG': chalk.hex('aabb22'),
  'ROCK': chalk.hex('bbaa66'),
  'GHOST': chalk.hex('6666bb'),
  'DRAGON': chalk.hex('7766ee'),
  'DARK': chalk.hex('775544'),
  'STEEL': chalk.hex('aaaabb'),
  'FAIRY': chalk.hex('ee99ee'),
};

export const classicTypeEffectivenessChart = [
// nor  fir  wat  ele  gra  ice  fig  poi  gro  mys  fly  psy  bug  roc  gho  dra  dar  ste  fai
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 0.0, 1.0, 1.0, 0.5, 1.0], // normal
  [1.0, 0.5, 0.5, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 2.0, 1.0], // fire
  [1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0, 1.0], // water
  [1.0, 1.0, 2.0, 0.5, 0.5, 1.0, 1.0, 1.0, 0.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0], // electric
  [1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 0.5, 2.0, 1.0, 0.5, 1.0, 0.5, 1.0], // grass
  [1.0, 0.5, 0.5, 1.0, 2.0, 0.5, 1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0], // ice
  [2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0, 0.5, 0.5, 0.5, 2.0, 0.0, 1.0, 2.0, 2.0, 0.5], // fighting
  [1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 1.0, 1.0, 0.5, 0.5, 1.0, 1.0, 0.0, 2.0], // poison
  [1.0, 2.0, 1.0, 2.0, 0.5, 1.0, 1.0, 2.0, 1.0, 1.0, 0.0, 1.0, 0.5, 2.0, 1.0, 1.0, 1.0, 2.0, 1.0], // ground
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], // mystery
  [1.0, 1.0, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0], // flying
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.0, 0.5, 1.0], // psychic
  [1.0, 0.5, 1.0, 1.0, 2.0, 1.0, 0.5, 0.5, 1.0, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 1.0, 2.0, 0.5, 0.5], // bug
  [1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0], // rock
  [0.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 1.0], // ghost
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 0.0], // dragon
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 2.0, 1.0, 0.5, 1.0, 0.5], // dark
  [1.0, 0.5, 0.5, 0.5, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 0.5, 2.0], // steel
  [1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 2.0, 2.0, 0.5, 1.0], // fairy
];
//#endregion

//#region Pokemon Elements types
export const newTypes = [
  'WOOD',
  'FIRE',
  'WATER',
  'AIR',
  'EARTH',
  'ICE',
  'ELECTRIC',
  'POISON',
  'MYSTERY',
  'METAL',
  'NORMAL',
  'BODY',
  'MIND',
  'SPIRIT',
  'EVIL',
  'MAGIC',
  'MYTHICAL',
];

export const newTypeIndexes = {
  'WOOD': 0,
  'FIRE': 1,
  'WATER': 2,
  'AIR': 3,
  'EARTH': 4,
  'ICE': 5,
  'ELECTRIC': 6,
  'POISON': 7,
  'MYSTERY': 8,
  'METAL': 9,
  'NORMAL': 10,
  'BODY': 11,
  'MIND': 12,
  'SPIRIT': 13,
  'EVIL': 14,
  'MAGIC': 15,
  'MYTHICAL': 16,
};

export const newTypeColours = {
  'WOOD': chalk.hex('77cc55'),
  'FIRE': chalk.hex('ff4422'),
  'WATER': chalk.hex('3399ff'),
  'AIR': chalk.hex('8899ff'),
  'EARTH': chalk.hex('ddbb55'),
  'ICE': chalk.hex('66ccff'),
  'ELECTRIC': chalk.hex('ffcc33'),
  'POISON': chalk.hex('aa5599'),
  'MYSTERY': chalk.hex('ffffff'),
  'METAL': chalk.hex('aaaabb'),
  'NORMAL': chalk.hex('aaaa99'),
  'BODY': chalk.hex('bb5544'),
  'MIND': chalk.hex('ff5599'),
  'SPIRIT': chalk.hex('6666bb'),
  'EVIL': chalk.hex('775544'),
  'MAGIC': chalk.hex('ee99ee'),
  'MYTHICAL': chalk.hex('7766ee'),
};

export const newTypeEffectivenessChart = [
// wod  fir  wat  air  ear  ice  ele  poi  mys  mtl  nor  bod  mnd  spi  evl  mag  myt
  [0.5, 0.5, 2.0, 0.5, 2.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0], // wood
  [2.0, 0.5, 0.5, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5], // fire
  [0.5, 2.0, 0.5, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5], // water
  [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 2.0, 1.0, 2.0, 1.0, 1.0, 0.5], // air
  [0.5, 2.0, 1.0, 0.0, 1.0, 1.0, 2.0, 2.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5], // earth
  [1.0, 1.0, 1.0, 2.0, 1.0, 0.5, 2.0, 1.0, 1.0, 0.5, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0], // ice
  [0.5, 1.0, 2.0, 2.0, 0.0, 1.0, 0.5, 2.0, 1.0, 2.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], // electric
  [1.0, 0.5, 2.0, 2.0, 2.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 2.0, 1.0], // poison
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0], // mystery
  [2.0, 0.5, 0.5, 0.5, 2.0, 2.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 2.0, 1.0], // metal
  [1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 0.0, 1.0, 1.0, 1.0], // normal
  [1.0, 1.0, 0.5, 0.5, 1.0, 2.0, 1.0, 0.5, 1.0, 2.0, 2.0, 1.0, 0.5, 0.0, 2.0, 1.0, 1.0], // body
  [1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 2.0, 1.0, 1.0, 1.0, 2.0, 0.5, 1.0, 0.0, 2.0, 1.0], // mind
  [1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.0, 1.0, 2.0, 2.0, 0.5, 1.0, 1.0], // spirit
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0, 2.0, 0.5, 0.5, 1.0], // evil
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 0.5, 1.0, 2.0, 0.5, 1.0, 2.0, 1.0, 2.0], // magic
  [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.5, 1.0, 1.0, 1.0, 1.0, 0.5, 2.0], // mythical
];
//#endregion Pokemon Elements types
