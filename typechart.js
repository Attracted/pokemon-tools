
import prompt from 'prompt';

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
    name: 'type1',
    type: 'string',
    description: 'Enter the first TYPE',
    warning: 'TYPE 1 must be a valid type (ALL CAPS)',
    default: 'MYSTERY', 
  },
  {
    name: 'type2',
    type: 'string',
    description: 'Enter the second TYPE',
    warning: 'TYPE 2 must be a valid type (ALL CAPS)',
    default: 'MYSTERY', 
  }
];

let typeColours, types, typeIndexes, typeEffectivenessChart;

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

  console.log();

  if (result.type1 === 'MYSTERY') {
    calculateAllCharts();
  } else {
    calculateCharts(result.type1, result.type2);
  }
});

function onErr(err) {
  console.log(err);
  return 1;
}

function calculateAllCharts() {
  const scoresChart = [];

  for (let i = 0; i < types.length; i++) { 
    // if (i === typeIndexes['MYSTERY']) i++;
    for (let j = i+1; j < types.length; j++) {
      // if (j === typeIndexes['MYSTERY']) j++;
      const { 
        offensiveTypeEffectiveness,
        offensiveChart,
        defensiveTypeEffectiveness,
        defensiveChart,
      } = calculateCharts(types[i], types[j], false);

      const scores = {
        type1: types[i],
        type2: types[j],
        offence: calculateOffensiveChartScore(offensiveChart),
        defence: calculateDefensiveChartScore(defensiveChart),
      };
      scoresChart.push(scores);
    }
  }

  scoresChart.sort((typeAScores, typeBScores) => {
    return (typeBScores.offence + typeBScores.defence) - (typeAScores.offence + typeAScores.defence);
  });

  const typeRankings = types.reduce((obj, key) => {
    // if (key === 'MYSTERY') return { ...obj };
    return { ...obj, [key]: 0 };
  }, {});

  console.log();
  console.log('Type Combo Rankings:');
  scoresChart.forEach((scores, index) => {
    const rankStr = index + 1;
    const typesStr = `${typeColours[scores.type1](scores.type1)} ${typeColours[scores.type2](scores.type2)}`;
    console.log(`  #${rankStr.toString().padStart(3)}: ${typesStr.padEnd(50)}\tOffence: ${scores.offence.toPrecision(3)}\tDefence: ${scores.defence.toPrecision(3)}`);

    typeRankings[scores.type1] += index;
    typeRankings[scores.type2] += index;
  });

  const sortedTypeRankings = Object.entries(typeRankings).sort((typeARankings, typeBRankings) => {
    return typeARankings[1] - typeBRankings[1];
  });

  console.log();
  console.log('Type Rankings:');
  sortedTypeRankings.forEach((typeRanking, index) => {
    const type = typeRanking[0];
    const rankings = typeRanking[1];
    console.log(`  #${index + 1}: ${typeColours[type](type)} (${rankings})`);
  });

}

function calculateCharts(type1, type2, print = true) {
  if (print) {
    console.log(`Types: ${typeColours[type1](type1)} ${typeColours[type2](type2)}`);
  }

  const type1Index = typeIndexes[type1];
  const type2Index = typeIndexes[type2];

  const offensiveTypeEffectiveness = {};
  const offensiveChart = {
    x4: [],
    x2: [],
    x1: [],
    x05: [],
    x025: [],
    x0: [],
  };

  const defensiveTypeEffectiveness = {};
  const defensiveChart = {
    x4: [],
    x2: [],
    x1: [],
    x05: [],
    x025: [],
    x0: [],
  };

  if (type1 !== 'MYSTERY') { // MYSTERY doesn't make sense to count offensively
    for (let i = 0; i < types.length; i++) {
      const effectiveness = typeEffectivenessChart[type1Index][i];
      const type = types[i];
      offensiveTypeEffectiveness[type] = effectiveness;
    }
  }

  for (let i = 0; i < types.length; i++) {
    const effectiveness = typeEffectivenessChart[i][type1Index];
    const type = types[i];
    defensiveTypeEffectiveness[type] = effectiveness;
  }

  if (type2 !== 'MYSTERY') {  // MYSTERY doesn't make sense to count offensively
    for (let i = 0; i < types.length; i++) {
      const effectiveness = typeEffectivenessChart[type2Index][i];
      const type = types[i];
      offensiveTypeEffectiveness[type] = offensiveTypeEffectiveness[type] > effectiveness ? offensiveTypeEffectiveness[type] : effectiveness;
    }
  }

  for (let i = 0; i < types.length; i++) {
    const effectiveness = typeEffectivenessChart[i][type2Index];
    const type = types[i];
    defensiveTypeEffectiveness[type] *= effectiveness;
  }

  pushToChart(offensiveTypeEffectiveness, offensiveChart);
  pushToChart(defensiveTypeEffectiveness, defensiveChart);

  if (print) {
    console.log(`Offensive Chart (${calculateOffensiveChartScore(offensiveChart)}):`);
    console.log(`   4 x: ${typesArrayToString(offensiveChart.x4)}`);
    console.log(`   2 x: ${typesArrayToString(offensiveChart.x2)}`);
    console.log(`   1 x: ${typesArrayToString(offensiveChart.x1)}`);
    console.log(` 0.5 x: ${typesArrayToString(offensiveChart.x05)}`);
    console.log(`0.25 x: ${typesArrayToString(offensiveChart.x025)}`);
    console.log(`   0 x: ${typesArrayToString(offensiveChart.x0)}`);

    console.log(`Defensive Chart (${calculateDefensiveChartScore(defensiveChart)}):`);
    console.log(`   4 x: ${typesArrayToString(defensiveChart.x4)}`);
    console.log(`   2 x: ${typesArrayToString(defensiveChart.x2)}`);
    console.log(`   1 x: ${typesArrayToString(defensiveChart.x1)}`);
    console.log(` 0.5 x: ${typesArrayToString(defensiveChart.x05)}`);
    console.log(`0.25 x: ${typesArrayToString(defensiveChart.x025)}`);
    console.log(`   0 x: ${typesArrayToString(defensiveChart.x0)}`);
  }

  return {
    offensiveTypeEffectiveness,
    offensiveChart,
    defensiveTypeEffectiveness,
    defensiveChart,
  }
}

function pushToChart(effectivenessChart, overallChart) {
  types.forEach((type) => {
    // if (type === 'MYSTERY') return;
    switch (effectivenessChart[type]) {
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
  });
}

function typesArrayToString(chartTypes) {
  let colouredString = '';
  chartTypes.forEach((type, index) => {
    colouredString += typeColours[type](type);
    if (index < chartTypes.length - 1) colouredString += '  ';
  });
  return colouredString;
}

function calculateOffensiveChartScore(chart) {
  let score = 0;
  // score += 2 * chart.x4.length;
  score += 1 * chart.x2.length;
  score += -2 * chart.x05.length;
  // score += -2 * chart.x025.length;
  score += -4 * chart.x0.length;
  return score;
}

function calculateDefensiveChartScore(chart) {
  let score = 0;
  score += -4 * chart.x4.length;
  score += -2 * chart.x2.length;
  score += 1 * chart.x05.length;
  score += 2 * chart.x025.length;
  score += 2.5 * chart.x0.length;
  return score;
}