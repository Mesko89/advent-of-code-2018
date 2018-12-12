function parsePots([initialState, ...mappings]) {
  initialState = initialState
    .replace('initial state: ', '')
    .split('')
    .reduce((state, v, index) => {
      state[index] = v;
      return state;
    }, {});
  mappings = mappings.reduce((map, v) => {
    const [pattern, result] = v.split(' => ');
    map[pattern] = result;
    return map;
  }, {});
  return { initialState, mappings };
}

function PotsState(state, lowerBound, upperBound) {
  if (typeof lowerBound === 'undefined') {
    lowerBound = Math.min(...Object.keys(state).map(v => parseInt(v, 10)));
  }
  if (!upperBound) {
    upperBound = Math.max(...Object.keys(state).map(v => parseInt(v, 10)));
  }

  const potsState = {
    get lowerBound() {
      return lowerBound;
    },
    get upperBound() {
      return upperBound;
    },
    getAtIndex(index) {
      return state[index] || '.';
    },
    setAtIndex(index, value) {
      if (state[index] === undefined && value === '.') return potsState;
      if (state[index] === value) return potsState;
      state[index] = value;
      lowerBound = index < lowerBound ? index : lowerBound;
      upperBound = index > upperBound ? index : upperBound;
      return potsState;
    },
    clone() {
      return PotsState({ ...state }, lowerBound, upperBound);
    },
  };
  return potsState;
}

function Pots(state, mappings) {
  let currentState = PotsState(state);

  function getWindow(state, atIndex) {
    let window = '';
    for (let i = atIndex - 2; i <= atIndex + 2; i++) {
      window += state.getAtIndex(i);
    }
    return window;
  }

  function tick() {
    let newState = currentState.clone();
    for (
      let i = currentState.lowerBound - 2;
      i <= currentState.upperBound + 2;
      i++
    ) {
      const window = getWindow(currentState, i);
      const newValue = mappings[window] || '.';
      newState = newState.setAtIndex(i, newValue);
    }
    currentState = newState;
  }

  return {
    get formattedState() {
      let output = '';
      for (let i = currentState.lowerBound; i <= currentState.upperBound; i++) {
        output += currentState.getAtIndex(i);
      }
      return output;
    },
    tick,
    reduce(fn, state) {
      for (let i = currentState.lowerBound; i <= currentState.upperBound; i++) {
        state = fn(state, currentState.getAtIndex(i), i);
      }
      return state;
    },
  };
}

function part1(inputLines, totalGenerations = 20) {
  const { initialState, mappings } = parsePots(inputLines);
  const pots = Pots(initialState, mappings);
  while (totalGenerations--) pots.tick();
  return pots.reduce(
    (total, value, index) => (value === '#' ? total + index : total),
    0
  );
}

function diffsAreDifferent(diffs, howMany = 5) {
  if (diffs.length < howMany) return true;
  const [firstDiff, ...otherDiffs] = diffs.slice(diffs.length - howMany);
  return otherDiffs.some(v => v !== firstDiff);
}

module.exports = {
  part1,
  part2: inputLines => {
    /*
      Calculate differences until differences are not changing anymore.
    */
    let previous = 0;
    let current = part1(inputLines, 0);
    let diffs = [current - previous];
    let i = 1;
    do {
      previous = current;
      current = part1(inputLines, i++);
      diffs.push(current - previous);
    } while (diffsAreDifferent(diffs));

    // Non changing diff has been found. Use following equation to find correct value
    return (50000000000 - i + 1) * diffs[diffs.length - 1] + current;
  },
};
