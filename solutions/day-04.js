const { getMinutes, getDayOfYear } = require('date-fns');

const guardStartsRx = /\[(.+)] Guard #(\d+)/i;
const guardStateChangesRx = /\[(.+)] (wakes|falls)/i;

function parseLog(inputLines) {
  return inputLines.sort().map(line => {
    if (guardStartsRx.test(line)) {
      const [_, dateFormat, guardId] = line.match(guardStartsRx);
      return {
        date: new Date(dateFormat),
        guardId: parseInt(guardId, 10),
      };
    } else {
      const [_, dateFormat, stateChange] = line.match(guardStateChangesRx);
      return {
        date: new Date(dateFormat),
        stateChange,
      };
    }
  });
}

function Guard(id) {
  const timesAsleep = Array.from({ length: 60 }).map(() => 0);
  function markAsleep(atMinute) {
    timesAsleep[atMinute]++;
  }
  return {
    id,
    timesAsleep,
    markAsleep,
  };
}

function processLog(logs) {
  const guards = {};

  function getGuard(id) {
    if (id in guards) return guards[id];
    return (guards[id] = Guard(id));
  }

  let currentGuard = null;
  let isAsleepAt = null;

  logs.forEach(log => {
    if (log.guardId) {
      currentGuard = getGuard(log.guardId);
      isAsleepAt = null;
    } else if (log.stateChange === 'falls') {
      isAsleepAt = log.date;
    } else if (log.stateChange === 'wakes') {
      if (getDayOfYear(isAsleepAt) === getDayOfYear(log.date)) {
        for (
          let minute = getMinutes(isAsleepAt);
          minute < getMinutes(log.date);
          minute++
        ) {
          currentGuard.markAsleep(minute);
        }
      }
      isAsleepAt = null;
    }
  });

  return Object.values(guards);
}

function getMostAsleepGuard(guards) {
  function getAsleepTime(guard) {
    return guard.timesAsleep.reduce((a, b) => a + b, 0);
  }
  let mostAsleepGuard = guards[0];
  let mostAsleepTime = getAsleepTime(guards[0]);

  for (const guard of guards) {
    const asleepTime = getAsleepTime(guard);
    if (asleepTime > mostAsleepTime) {
      mostAsleepGuard = guard;
      mostAsleepTime = asleepTime;
    }
  }
  return mostAsleepGuard;
}

function getMostFrequentlyAsleepGuard(guards) {
  function getHighestFrequency(guard) {
    return Math.max(...guard.timesAsleep);
  }
  let guardWithHighestFrequency = guards[0];
  let mostHighestFrequency = getHighestFrequency(guards[0]);

  for (const guard of guards) {
    const highestFrequency = getHighestFrequency(guard);
    if (highestFrequency > mostHighestFrequency) {
      guardWithHighestFrequency = guard;
      mostHighestFrequency = highestFrequency;
    }
  }
  return guardWithHighestFrequency;
}

module.exports = {
  part1: inputLines => {
    const guards = processLog(parseLog(inputLines));
    const mostAsleepGuard = getMostAsleepGuard(guards);
    const mostAsleepValue = Math.max(...mostAsleepGuard.timesAsleep);
    return (
      mostAsleepGuard.id * mostAsleepGuard.timesAsleep.indexOf(mostAsleepValue)
    );
  },
  part2: inputLines => {
    const guards = processLog(parseLog(inputLines));
    const mostAsleepGuard = getMostFrequentlyAsleepGuard(guards);
    const mostAsleepValue = Math.max(...mostAsleepGuard.timesAsleep);
    return (
      mostAsleepGuard.id * mostAsleepGuard.timesAsleep.indexOf(mostAsleepValue)
    );
  },
};
