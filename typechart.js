
import prompt from 'prompt';
import { table } from 'table';

import {
  classicTypes, classicTypeIndexes, classicTypeColours, classicTypeEffectivenessChart,
  newTypes, newTypeIndexes, newTypeColours, newTypeEffectivenessChart
} from './constants.js';

const properties = [
  {
    name: 'classicChart',
    type: 'boolean',
    description: 'Use classic chart?',
    warning: 'Answer must be true or false',
    default: true,
  },
  {
    name: 'shallowRankings',
    type: 'boolean',
    description: 'Use a shallow (non-recursive) ranking system?',
    default: true,
  },
  {
    name: 'sortBy',
    type: 'string',
    validator: /(SCORES)|(o?d?(x0)|(x025)|(x05)|(x1)|(x2)|(x4))|(OFF)|(DEF)/,
    description: 'Sort by SCORES, OFF, DEF, or individual effectiveness <(o|d| )x0|x025|x05|x1|x2|x4>?',
    default: 'SCORES',
  },
  {
    name: 'type1',
    type: 'string',
    description: 'Enter the first TYPE (or MYSTERY to calc rankings)',
    before: function (value) { return value.toUpperCase(); },
    default: 'MYSTERY',
  },
  {
    name: 'type2',
    type: 'string',
    description: 'Enter the second TYPE',
    before: function (value) { return value.toUpperCase(); },
    default: 'MYSTERY',
  }
];

let typeColours, types, typeIndexes, typeEffectivenessChart, shallowRankings, sortBy;

prompt.start();

prompt.get(properties, function (err, result) {
  if (err) {
    return onErr(err);
  }

  if (result.classicChart) {
    typeColours = classicTypeColours;
    types = classicTypes;
    typeIndexes = classicTypeIndexes;
    typeEffectivenessChart = classicTypeEffectivenessChart;
  } else {
    typeColours = newTypeColours;
    types = newTypes;
    typeIndexes = newTypeIndexes;
    typeEffectivenessChart = newTypeEffectivenessChart;
  }

  // console.log();
  // console.log('Type Effectiveness Chart:');
  // console.table(typeEffectivenessChart);

  shallowRankings = result.shallowRankings;
  sortBy = result.sortBy;

  if (result.type1 === 'MYSTERY') {
    if (shallowRankings) {
      calculateAllCharts();
    } else {
      let percentageDifference, previousTypeRankings = null, loops = 0, scoresChart;

      do {
        const results = calculateAllCharts(previousTypeRankings, false);
        percentageDifference = results.percentageDifference;
        previousTypeRankings = results.typeRankings;
        scoresChart = results.scoresChart;
        loops++;
      }
      while (loops <= 100 && percentageDifference > 0);

      const sortedTypeRankings = Object.entries(previousTypeRankings).sort((typeARankings, typeBRankings) => {
        return typeARankings[1] - typeBRankings[1];
      });

      console.log();
      console.log('Type Combo Rankings:');
      scoresChart.forEach((scores, index) => {
        const rankStr = index + 1;
        const typesStr = `${typeColours[scores.type1](scores.type1)} ${typeColours[scores.type2](scores.type2)}`;
        console.log(`  #${rankStr.toString().padStart(3)}: ${typesStr.padEnd(50)}\tOffence: ${scores.offence.toPrecision(3)}\tDefence: ${scores.defence.toPrecision(3)}`);
      });

      console.log();
      console.log('Type Rankings:');
      sortedTypeRankings.forEach((typeRanking, index) => {
        const type = typeRanking[0];
        const rankings = typeRanking[1];
        console.log(`  #${index + 1}: ${typeColours[type](type)} (${rankings})`);
      });

      console.log(`DONE! That took ${loops} loops!`);
    }
  } else {
    calculateCharts(result.type1, result.type2);
  }
});

function onErr(err) {
  console.log(err);
  return 1;
}

function calculateAllCharts(previousTypeRankings = null, print = true) {
  const results = {};
  const scoresChart = [];

  for (let i = 0; i < types.length; i++) {
    for (let j = i + 1; j < types.length; j++) {
      const {
        offensiveTypeEffectiveness,
        defensiveTypeEffectiveness,
      } = calculateCharts(types[i], types[j], false);

      // console.log(`Calculate scores for ${typeColours[types[i]](types[i])} ${typeColours[types[j]](types[j])}`);
      const scores = {
        type1: types[i],
        type2: types[j],
        offensiveChart: pushAllTypesToChart({ typeEffectivenessChart: offensiveTypeEffectiveness }),
        defensiveChart: pushAllTypesToChart({ typeEffectivenessChart: defensiveTypeEffectiveness }),
        offence: calculateChartScore({ typeEffectivenessChart: offensiveTypeEffectiveness, previousTypeRankings, offence: true }),
        defence: calculateChartScore({ typeEffectivenessChart: defensiveTypeEffectiveness, previousTypeRankings, offence: false }),
      };
      scoresChart.push(scores);
    }
  }

  scoresChart.sort((typeAScores, typeBScores) => {
    if (sortBy === 'SCORES') return (typeBScores.offence + typeBScores.defence) - (typeAScores.offence + typeAScores.defence);
    else if (sortBy === 'OFF') return typeBScores.offence - typeAScores.offence;
    else if (sortBy === 'DEF') return typeBScores.defence - typeAScores.defence;
    else if (sortBy[0] === 'o') return typeBScores.offensiveChart[sortBy.substring(1)].length - typeAScores.offensiveChart[sortBy.substring(1)].length;
    else if (sortBy[0] === 'd') return typeBScores.defensiveChart[sortBy.substring(1)].length - typeAScores.defensiveChart[sortBy.substring(1)].length;
    else return (typeBScores.offensiveChart[sortBy].length + typeBScores.defensiveChart[sortBy].length) - (typeAScores.offensiveChart[sortBy].length + typeAScores.defensiveChart[sortBy].length);
  });

  results.scoresChart = scoresChart;

  const typeRankings = types.reduce((obj, key) => {
    return { ...obj, [key]: 0 };
  }, {});

  if (print) {
    console.log();
    console.log('Type Combo Rankings:');
    scoresChart.forEach((scores, index) => {
      const rankStr = index + 1;
      const typesStr = `${typeColours[scores.type1](scores.type1.padEnd(10))} ${typeColours[scores.type2](scores.type2.padEnd(10))}`;
      console.log(`  #${rankStr.toString().padStart(3)}: ${typesStr}\tOffence: ${scores.offence.toPrecision(3)}\tDefence: ${scores.defence.toPrecision(3)}`);

      typeRankings[scores.type1] += index;
      typeRankings[scores.type2] += index;
    });
  } else {
    scoresChart.forEach((scores, index) => {
      typeRankings[scores.type1] += index;
      typeRankings[scores.type2] += index;
    });
  }

  const sortedTypeRankings = Object.entries(typeRankings).sort((typeARankings, typeBRankings) => {
    return typeARankings[1] - typeBRankings[1];
  });

  if (print) {
    console.log();
    console.log('Type Rankings:');
    sortedTypeRankings.forEach((typeRanking, index) => {
      const type = typeRanking[0];
      const rankings = typeRanking[1];
      console.log(`  #${index + 1}: ${typeColours[type](type)} (${rankings})`);
    });
  }

  if (!shallowRankings) {
    if (previousTypeRankings) {
      const previousSortedTypeRankings = Object.entries(previousTypeRankings).sort((typeARankings, typeBRankings) => {
        return typeARankings[1] - typeBRankings[1];
      });

      results.percentageDifference = calculatePercentageDifference(previousSortedTypeRankings, sortedTypeRankings);
      results.typeRankings = typeRankings;
    } else {

      results.percentageDifference = 100;
      results.typeRankings = typeRankings;
    }
  }

  return results;
}

function calculateCharts(type1, type2, print = true) {
  if (print) {
    console.log(`Types: ${typeColours[type1](type1)} ${typeColours[type2](type2)}`);
  }

  const type1Index = typeIndexes[type1];
  const type2Index = typeIndexes[type2];

  const offensiveTypeEffectiveness = [...Array(types.length)].map(e => Array(types.length));
  const defensiveTypeEffectiveness = [...Array(types.length)].map(e => Array(types.length));

  for (let i = 0; i < types.length; i++) {
    const type1AgainstTypeA = typeEffectivenessChart[type1Index][i];
    const type2AgainstTypeA = typeEffectivenessChart[type2Index][i];
    const typeAAgainstType1 = typeEffectivenessChart[i][type1Index];
    const typeAAgainstType2 = typeEffectivenessChart[i][type2Index];

    for (let j = i + 1; j < types.length; j++) {
      const type1AgainstTypeB = typeEffectivenessChart[type1Index][j];
      const type2AgainstTypeB = typeEffectivenessChart[type2Index][j];
      const typeBAgainstType1 = typeEffectivenessChart[j][type1Index];
      const typeBAgainstType2 = typeEffectivenessChart[j][type2Index];

      const typeA = types[i];
      const typeB = types[j];

      const type1Effectiveness = type1 === 'MYSTERY' ? 0 : type1AgainstTypeA * type1AgainstTypeB;
      const type2Effectiveness = type2 === 'MYSTERY' ? 0 : type2AgainstTypeA * type2AgainstTypeB;
      const typeAEffectiveness = typeA === 'MYSTERY' ? 0 : typeAAgainstType1 * typeAAgainstType2;
      const typeBEffectiveness = typeB === 'MYSTERY' ? 0 : typeBAgainstType1 * typeBAgainstType2;

      offensiveTypeEffectiveness[i][j] = Math.max(type1Effectiveness, type2Effectiveness);
      defensiveTypeEffectiveness[i][j] = Math.max(typeAEffectiveness, typeBEffectiveness);

      // console.log(`${typeColours[typeA](typeA.padEnd(10))} ${typeColours[typeB](typeB.padEnd(10))}\tOffence: ${offensiveTypeEffectiveness[i][j].toString().padEnd(3)}\tDefence: ${defensiveTypeEffectiveness[i][j].toString().padEnd(3)}`);

      // console.log();
      // console.log(`Offence: ${typeColours[type1](type1)} ${typeColours[type2](type2)} -> ${typeColours[typeA](typeA)} ${typeColours[typeB](typeB)} = ${offensiveTypeEffectiveness[i][j]}`);
      // console.log(`  ${typeColours[type1](type1)} -> ${typeColours[typeA](typeA)} = ${type1AgainstTypeA}`);
      // console.log(`  ${typeColours[type1](type1)} -> ${typeColours[typeB](typeB)} = ${type1AgainstTypeB}`);
      // console.log(`  ${typeColours[type2](type2)} -> ${typeColours[typeA](typeA)} = ${type2AgainstTypeA}`);
      // console.log(`  ${typeColours[type2](type2)} -> ${typeColours[typeB](typeB)} = ${type2AgainstTypeB}`);

      // console.log();
      // console.log(`Defence: ${typeColours[typeA](typeA)} ${typeColours[typeB](typeB)} -> ${typeColours[type1](type1)} ${typeColours[type2](type2)} = ${defensiveTypeEffectiveness[i][j]}`);
      // console.log(`  ${typeColours[typeA](typeA)} -> ${typeColours[type1](type1)} = ${typeAAgainstType1}`);
      // console.log(`  ${typeColours[typeA](typeA)} -> ${typeColours[type2](type2)} = ${typeAAgainstType2}`);
      // console.log(`  ${typeColours[typeB](typeB)} -> ${typeColours[type1](type1)} = ${typeBAgainstType1}`);
      // console.log(`  ${typeColours[typeB](typeB)} -> ${typeColours[type2](type2)} = ${typeBAgainstType2}`);
    }
  }

  if (print) {
    const offensiveChart = {
      x4: [],
      x2: [],
      x1: [],
      x05: [],
      x025: [],
      x0: [],
    };
    const defensiveChart = {
      x4: [],
      x2: [],
      x1: [],
      x05: [],
      x025: [],
      x0: [],
    };

    pushAllTypesToChart({ typeEffectivenessChart: offensiveTypeEffectiveness, overallChart: offensiveChart });
    pushAllTypesToChart({ typeEffectivenessChart: defensiveTypeEffectiveness, overallChart: defensiveChart });

    const config = {
      columns: [
        { alignment: 'right', width: 6 },
        { alignment: 'center', width: 5 },
        { alignment: 'center', width: process.stdout.columns - 28 },
      ],
    };

    console.log(`Offensive Chart (${calculateChartScore({ typeEffectivenessChart: offensiveTypeEffectiveness, offence: true }).toPrecision(3)}):`);
    console.log(table([
      ['Mltplr', 'Count', 'Type Combinations'],
      ['4 x', offensiveChart.x4.length, typesArrayToString(offensiveChart.x4)],
      ['2 x', offensiveChart.x2.length, typesArrayToString(offensiveChart.x2)],
      ['1 x', offensiveChart.x1.length, typesArrayToString(offensiveChart.x1)],
      ['0.5 x', offensiveChart.x05.length, typesArrayToString(offensiveChart.x05)],
      ['0.25 x', offensiveChart.x025.length, typesArrayToString(offensiveChart.x025)],
      ['0 x', offensiveChart.x0.length, typesArrayToString(offensiveChart.x0)],
    ], config));

    console.log(`Defensive Chart (${calculateChartScore({ typeEffectivenessChart: defensiveTypeEffectiveness, offence: false }).toPrecision(3)}):`);
    console.log(table([
      ['Mltplr', 'Count', 'Type Combinations'],
      ['4 x', defensiveChart.x4.length, typesArrayToString(defensiveChart.x4)],
      ['2 x', defensiveChart.x2.length, typesArrayToString(defensiveChart.x2)],
      ['1 x', defensiveChart.x1.length, typesArrayToString(defensiveChart.x1)],
      ['0.5 x', defensiveChart.x05.length, typesArrayToString(defensiveChart.x05)],
      ['0.25 x', defensiveChart.x025.length, typesArrayToString(defensiveChart.x025)],
      ['0 x', defensiveChart.x0.length, typesArrayToString(defensiveChart.x0)],
    ], config));
  }

  return {
    offensiveTypeEffectiveness,
    defensiveTypeEffectiveness,
  }
}

function pushMonoTypesToChart({ typeEffectivenessChart, overallChart }) {
  for (let i = 0; i < typeIndexes.MYSTERY; i++) {
    const rowIndex = i;
    const columnIndex = types.length - 1 - i;

    pushToChart({ typeEffectiveness: typeEffectivenessChart[rowIndex][typeIndexes.MYSTERY], overallChart, type: types[rowIndex] });
    pushToChart({ typeEffectiveness: typeEffectivenessChart[typeIndexes.MYSTERY][columnIndex], overallChart, type: types[columnIndex] });
  }
}

function pushAllTypesToChart({ typeEffectivenessChart, overallChart = null }) {
  if (!overallChart) {
    overallChart = {
      x4: [],
      x2: [],
      x1: [],
      x05: [],
      x025: [],
      x0: [],
    };
  }
  for (let i = 0; i < types.length; i++) {
    for (let j = i + 1; j < types.length; j++) {
      pushToChart({ typeEffectiveness: typeEffectivenessChart[i][j], overallChart, type: [types[i],types[j]] });
    }
  }

  return overallChart;
}

function pushToChart({ typeEffectiveness, overallChart, type }) {
  switch (typeEffectiveness) {
    case 4.0:
      overallChart.x4.push(type);
      break;
    case 2.0:
      overallChart.x2.push(type);
      break;
    case 1.0:
      overallChart.x1.push(type);
      break;
    case 0.5:
      overallChart.x05.push(type);
      break;
    case 0.25:
      overallChart.x025.push(type);
      break;
    case 0.0:
      overallChart.x0.push(type);
      break;
  }
}

function effectivenessScoreMultiplier({ typeEffectiveness, offence }) {
  switch (typeEffectiveness) {
    case 4.0:
      return offence ? 2 : -2;
    case 2.0:
      return offence ? 1 : -1;
    case 1.0:
      return offence ? 0 : 0; // Not relevant
    case 0.5:
      return offence ? -1 : 2;
    case 0.25:
      return offence ? -2 : 4;
    case 0.0:
      return offence ? -2.5 : 5;
  }
}

function typesArrayToString(chartTypes) {
  let colouredString = '';
  chartTypes.forEach((type, index) => {
    if (Array.isArray(type)) {
      const typeA = type[0];
      const typeB = type[1];
      if (typeA === 'MYSTERY') colouredString += typeColours[typeB](typeB);
      else if (typeB === 'MYSTERY') colouredString += typeColours[typeA](typeA);
      else colouredString += `${typeColours[typeA](typeA.slice(0, 3))}/${typeColours[typeB](typeB.slice(0, 3))}`;
    } else {
      colouredString += typeColours[type](type);
    }
    if (index < chartTypes.length - 1) colouredString += '  ';
  });
  return colouredString;
}

function calculateChartScore({ typeEffectivenessChart, previousTypeRankings, offence }) {
  let score = 0.0;
  if (previousTypeRankings) {
    // Multiply score between 0.5-2x (newMan - newMax) depending on previousTypeRankings
    // newValue = (((oldValue - oldMin) * (newMax - newMin)) / (oldMax - oldMin)) + newMin
    // --> newValue = (((oldValue - oldMin) * 2)) / (oldMax - oldMin)) + 1
    const numberOfRankingsPerType = types.length - 1;
    const oldRankMin = types.length * numberOfRankingsPerType / 2; // The sum of numbers 1 to n-1, i.e. n(n-1)/2. Equivalent to the total number of unique combination of n values
    const oldRankMax = oldRankMin * (numberOfRankingsPerType - 1); // The sum of numbers x-n to x, where n = types.length and x = last rank
    const oldRange = oldRankMax - oldRankMin; // OldMax - OldMin

    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const typeEffectiveness = typeEffectivenessChart[i][j];
        const oldType1RankValue = oldRankMax + oldRankMin - previousTypeRankings[types[i]]; // oldRankMin -> 2, oldRankMax -> 1. Since larger vs smaller is inverted, we have to invert the rank too
        const oldType2RankValue = oldRankMax + oldRankMin - previousTypeRankings[types[j]];
        const newType1RankValue = (((oldType1RankValue - oldRankMin) * 1.5) / oldRange) + 0.5; // NewValue = (((OldValue - OldMin) * (NewMax - NewMin)) / (OldMax - OldMin)) + NewMin
        const newType2RankValue = (((oldType2RankValue - oldRankMin) * 1.5) / oldRange) + 0.5;
        
        score += effectivenessScoreMultiplier({ typeEffectiveness, offence }) * newType1RankValue * newType2RankValue;
        // console.log(`  type: ${typeColours[type](type)}  score: ${score}  newRankValue:  ${newRankValue}`);
      }
    }
  } else {
    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const typeEffectiveness = typeEffectivenessChart[i][j];
        score += effectivenessScoreMultiplier({ typeEffectiveness, offence });
        // console.log(`  type: ${typeColours[type](type)}  score: ${score.toPrecision(3)}`);
      }
    }
  }

  return score;
}

function calculatePercentageDifference(previousSortedTypeRankings, currentSortedTypeRankings) {
  let sameRank = 0;

  previousSortedTypeRankings.forEach((typeRanking, index) => {
    // console.log(`rank:${index + 1}  oldType: ${typeRanking}  newType: ${currentSortedTypeRankings[index]}  sameRank: ${sameRank}`)
    if (typeRanking[0] === currentSortedTypeRankings[index][0]) {
      sameRank = sameRank + 1;
    }
  });

  return (types.length - sameRank) / ((types.length + sameRank) / 2) * 100; // Absolute difference divided by average then times 100
}