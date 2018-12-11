function Grid(serialNumber) {
  function getCellPower(x, y) {
    const rackId = x + 10;
    let powerLevel = (rackId * y + serialNumber) * rackId;
    powerLevel =
      (powerLevel - (powerLevel % 100) - Math.floor(powerLevel / 1000) * 1000) /
      100;
    return powerLevel - 5;
  }

  function calculatePowerLevels(grid) {
    return grid.map((line, y) => {
      return line.map((_, x) => getCellPower(x, y));
    });
  }

  const grid = calculatePowerLevels(
    Array.from({ length: 300 }).map(() => Array.from({ length: 300 }))
  );

  function getSquarePowerLevel(x, y, squareLength) {
    let sum = 0;
    for (let i = 0; i < squareLength; i++) {
      for (let j = 0; j < squareLength; j++) {
        sum += grid[y + i][x + j];
      }
    }
    return sum;
  }

  function getLargestTotalPowerSquare(squareLength = 3) {
    let largest = { x: 0, y: 0, totalPower: -1000, squareLength };
    for (let y = 0; y < 300 - squareLength; y++) {
      for (let x = 0; x < 300 - squareLength; x++) {
        const totalPower = getSquarePowerLevel(x, y, squareLength);
        if (totalPower > largest.totalPower) {
          largest = { x, y, totalPower, squareLength };
        }
      }
    }
    return largest;
  }

  function getLargestPowerForAnySquareLength() {
    let largest = null;
    for (let squareLength = 3; squareLength <= 300; squareLength++) {
      const bestSquare = getLargestTotalPowerSquare(squareLength);
      if (largest === null || bestSquare.totalPower > largest.totalPower)
        largest = bestSquare;
      // No need to check further
      if (bestSquare.totalPower < largest.totalPower) break;
    }
    return largest;
  }

  return {
    getLargestTotalPowerSquare,
    getLargestPowerForAnySquareLength,
  };
}

module.exports = {
  part1: inputLines => {
    const grid = Grid(parseInt(inputLines[0], 10));
    const square = grid.getLargestTotalPowerSquare();
    return `${square.x},${square.y}`;
  },
  part2: inputLines => {
    const grid = Grid(parseInt(inputLines[0], 10));
    const square = grid.getLargestPowerForAnySquareLength();
    return `${square.x},${square.y},${square.squareLength}`;
  },
};
