function sumFrequencyChanges(frequencies) {
  return frequencies.reduce((a, b) => a + b, 0);
}

function findFirstRepeatedFrequency(frequencies) {
  const foundFrequencies = new Set();
  let currentFrequency = 0;
  let i = 0;
  do {
    foundFrequencies.add(currentFrequency);
    currentFrequency += frequencies[i];
    i = (i + 1) % frequencies.length;
  } while (!foundFrequencies.has(currentFrequency));
  return currentFrequency;
}

module.exports = {
  part1: inputLines =>
    sumFrequencyChanges(inputLines.map(v => parseInt(v, 10))),
  part2: inputLines =>
    findFirstRepeatedFrequency(inputLines.map(v => parseInt(v, 10))),
};
