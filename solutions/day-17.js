const SAND = '.';
const CLAY = '#';
const ACTIVE_WATER = '|';
const STABLE_WATER = '~';

function parseScanResult(inputLines) {
  const sparseState = {
    boundaries: {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    },
  };

  sparseState.get = (x, y) => sparseState[`${x},${y}`] || SAND;
  sparseState.set = (x, y, value) => {
    sparseState[`${x},${y}`] = value;
    if (value === CLAY) {
      if (x - 1 < sparseState.boundaries.minX) {
        sparseState.boundaries.minX = x - 1;
      }
      if (x + 1 > sparseState.boundaries.maxX) {
        sparseState.boundaries.maxX = x + 1;
      }
      if (y - 1 < sparseState.boundaries.minY) {
        sparseState.boundaries.minY = y - 1;
      }
      if (y + 1 > sparseState.boundaries.maxY) {
        sparseState.boundaries.maxY = y + 1;
      }
    }
  };

  sparseState.print = () => {
    const { minX, minY, maxX, maxY } = sparseState.boundaries;
    let output = '\r\n';
    for (let y = minY; y <= maxY; y++) {
      for (let x = minX; x <= maxX; x++) {
        output += sparseState.get(x, y);
      }
      output += '\r\n';
    }
    console.log(output);
  };

  sparseState.countWater = () => {
    return Object.entries(sparseState).reduce((totalWater, [key, value]) => {
      const [_, y] = key.split(',').map(v => parseInt(v));
      if (
        y - 1 < sparseState.boundaries.minY ||
        y + 1 > sparseState.boundaries.maxY
      )
        return totalWater;
      if (value === ACTIVE_WATER || value === STABLE_WATER)
        return totalWater + 1;
      return totalWater;
    }, 0);
  };

  sparseState.countStableWater = () => {
    return Object.entries(sparseState).reduce((totalWater, [key, value]) => {
      const [_, y] = key.split(',').map(v => parseInt(v));
      if (
        y - 1 < sparseState.boundaries.minY ||
        y + 1 > sparseState.boundaries.maxY
      )
        return totalWater;
      if (value === STABLE_WATER) return totalWater + 1;
      return totalWater;
    }, 0);
  };

  for (const line of inputLines) {
    const [_, first, firstValue, __, secondFrom, secondTo] = line
      .match(/(x|y)=(\d+), (x|y)=(\d+)\.\.(\d+)/)
      .map(v => (v !== 'x' && v !== 'y' ? parseInt(v, 10) : v));
    if (first === 'x') {
      for (let y = secondFrom; y <= secondTo; y++) {
        sparseState.set(firstValue, y, CLAY);
      }
    } else {
      for (let x = secondFrom; x <= secondTo; x++) {
        sparseState.set(x, firstValue, CLAY);
      }
    }
  }
  return sparseState;
}

function simulateWater(state, { x, y }) {
  const activeWater = [{ x: x, y: y + 1 }];
  state.set(x, y + 1, ACTIVE_WATER);
  while (activeWater.length) {
    const currentWater = activeWater[activeWater.length - 1];
    const fieldUnder = state.get(currentWater.x, currentWater.y + 1);

    if (
      currentWater.y >= state.boundaries.maxY - 1 ||
      fieldUnder === ACTIVE_WATER
    ) {
      activeWater.pop();
      continue;
    }

    if (fieldUnder === SAND) {
      activeWater.push({ x: currentWater.x, y: currentWater.y + 1 });
      state.set(currentWater.x, currentWater.y + 1, ACTIVE_WATER);
    } else if (fieldUnder === CLAY || fieldUnder === STABLE_WATER) {
      state.set(currentWater.x, currentWater.y, STABLE_WATER);
      let pos = { ...currentWater };
      let leftBoundary = null;
      let rightBoundary = null;

      activeWater.pop();
      do {
        state.set(pos.x, pos.y, ACTIVE_WATER);
        pos = { x: pos.x - 1, y: pos.y };
      } while (
        state.get(pos.x, pos.y) !== CLAY &&
        (state.get(pos.x, pos.y + 1) === CLAY ||
          state.get(pos.x, pos.y + 1) === STABLE_WATER)
      );

      if (state.get(pos.x, pos.y) !== CLAY) {
        state.set(pos.x, pos.y, ACTIVE_WATER);
        activeWater.push(pos);
      } else {
        leftBoundary = pos;
      }

      pos = { ...currentWater };
      do {
        state.set(pos.x, pos.y, ACTIVE_WATER);
        pos = { x: pos.x + 1, y: pos.y };
      } while (
        state.get(pos.x, pos.y) !== CLAY &&
        (state.get(pos.x, pos.y + 1) === CLAY ||
          state.get(pos.x, pos.y + 1) === STABLE_WATER)
      );
      if (state.get(pos.x, pos.y) !== CLAY) {
        state.set(pos.x, pos.y, ACTIVE_WATER);
        activeWater.push(pos);
      } else {
        rightBoundary = pos;
      }

      if (leftBoundary && rightBoundary) {
        for (let x = leftBoundary.x + 1; x <= rightBoundary.x - 1; x++) {
          state.set(x, leftBoundary.y, STABLE_WATER);
        }
      }
    }
  }
  return state;
}

module.exports = {
  part1: inputLines => {
    const state = parseScanResult(inputLines);
    simulateWater(state, { x: 500, y: 0 });
    return state.countWater();
  },
  part2: inputLines => {
    const state = parseScanResult(inputLines);
    simulateWater(state, { x: 500, y: 0 });
    return state.countStableWater();
  },
};
