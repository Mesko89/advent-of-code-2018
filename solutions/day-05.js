/**
 * @param {string} polymer
 */
function reactPolymer(polymer) {
  function react(polymer) {
    for (let i = 0; i < polymer.length - 1; i++) {
      if (
        polymer[i] !== polymer[i + 1] &&
        polymer[i].toLowerCase() === polymer[i + 1].toLowerCase()
      ) {
        polymer = polymer.substring(0, i) + polymer.substring(i + 2);
        return polymer;
      }
    }
    return polymer;
  }

  let previousLength = polymer.length;
  let currentLength = polymer.length;
  do {
    previousLength = currentLength;
    polymer = react(polymer);
    currentLength = polymer.length;
  } while (previousLength !== currentLength);
  return polymer;
}

function getMostCollapsedPolymerVariant(polymer) {
  const uniqueUnits = Array.from(new Set(Array.from(polymer.toLowerCase())));
  let bestPolymer = polymer;
  for (const unit of uniqueUnits) {
    const polymerCandidate = reactPolymer(
      polymer.replace(new RegExp(unit, 'ig'), '')
    );
    if (bestPolymer.length > polymerCandidate.length) {
      bestPolymer = polymerCandidate;
    }
  }
  return bestPolymer;
}

module.exports = {
  part1: inputLines => reactPolymer(inputLines[0]).length,
  part2: inputLines =>
    getMostCollapsedPolymerVariant(reactPolymer(inputLines[0])).length,
};
