function parseNanobots(inputLines) {
  return inputLines.map(line => {
    const [_, x, y, z, r] = line
      .match(/pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(-?\d+)/)
      .map(v => parseInt(v, 10));
    return { x, y, z, r };
  });
}

function manhattanDistance({ x: x1, y: y1, z: z1 }, { x: x2, y: y2, z: z2 }) {
  return Math.abs(x2 - x1) + Math.abs(y2 - y1) + Math.abs(z2 - z1);
}

function findStrongestNanobot(nanobots) {
  return nanobots.reduce((strongest, nanobot) => {
    if (strongest.r < nanobot.r) return nanobot;
    return strongest;
  }, nanobots[0]);
}

function getNanobotsInRange(fromNanobot, nanobots) {
  return nanobots.filter(
    nanobot => manhattanDistance(nanobot, fromNanobot) <= fromNanobot.r
  );
}

function getPositionWithMostNanobots(nanobots) {
  const xPositions = nanobots.map(n => n.x);
  const yPositions = nanobots.map(n => n.y);
  const zPositions = nanobots.map(n => n.z);

  let ranges = {
    x: { min: Math.min(...xPositions), max: Math.max(...xPositions) },
    y: { min: Math.min(...yPositions), max: Math.max(...yPositions) },
    z: { min: Math.min(...zPositions), max: Math.max(...zPositions) },
  };

  let distance = 1;
  while (distance < ranges.x.max - ranges.x.min) distance *= 2;

  let bestPosition = null;
  do {
    let maxTotalNanobotsInRange = 0;
    let currentBestPosition = {
      x: Number.MAX_SAFE_INTEGER,
      y: Number.MAX_SAFE_INTEGER,
      z: Number.MAX_SAFE_INTEGER,
    };
    for (let x = ranges.x.min; x <= ranges.x.max + 1; x += distance) {
      for (let y = ranges.y.min; y <= ranges.y.max + 1; y += distance) {
        for (let z = ranges.z.min; z <= ranges.z.max + 1; z += distance) {
          const nanobotsInRange = nanobots.filter(
            nanobot =>
              (manhattanDistance(nanobot, { x, y, z }) - nanobot.r) /
                distance <=
              0
          ).length;
          if (nanobotsInRange > maxTotalNanobotsInRange) {
            maxTotalNanobotsInRange = nanobotsInRange;
            currentBestPosition = { x, y, z };
          } else if (nanobotsInRange === maxTotalNanobotsInRange) {
            const distA = Math.abs(x) + Math.abs(y) + Math.abs(z);
            const distB =
              Math.abs(currentBestPosition.x) +
              Math.abs(currentBestPosition.y) +
              Math.abs(currentBestPosition.z);
            if (distA < distB) {
              currentBestPosition = { x, y, z };
            }
          }
        }
      }
    }

    ranges = {
      x: {
        min: currentBestPosition.x - distance,
        max: currentBestPosition.x + distance,
      },
      y: {
        min: currentBestPosition.y - distance,
        max: currentBestPosition.y + distance,
      },
      z: {
        min: currentBestPosition.z - distance,
        max: currentBestPosition.z + distance,
      },
    };
    distance /= 2;
    bestPosition = currentBestPosition;
  } while (distance >= 1);

  return bestPosition;
}

module.exports = {
  part1: inputLines => {
    const nanobots = parseNanobots(inputLines);
    const strongestNanobot = findStrongestNanobot(nanobots);
    return getNanobotsInRange(strongestNanobot, nanobots).length;
  },
  part2: inputLines => {
    const nanobots = parseNanobots(inputLines);
    return manhattanDistance(
      { x: 0, y: 0, z: 0 },
      getPositionWithMostNanobots(nanobots)
    );
  },
};
