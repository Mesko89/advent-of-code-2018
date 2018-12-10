function parseStars(inputLines) {
  return inputLines.map(line => {
    const [_, x, y, vx, vy] = line
      .match(
        /position=<\s*(-?\d+),\s*(-?\d+)> velocity=<\s*(-?\d+),\s*(-?\d+)>/
      )
      .map(v => parseInt(v, 10));
    return { x, y, vx, vy };
  });
}

function StarSystem(stars) {
  function newBounds() {
    return {
      x1: Number.MAX_SAFE_INTEGER,
      x2: Number.MIN_SAFE_INTEGER,
      y1: Number.MAX_SAFE_INTEGER,
      y2: Number.MIN_SAFE_INTEGER,
    };
  }

  function correctBounds(star, bounds) {
    if (star.x < bounds.x1) bounds.x1 = star.x;
    if (star.x > bounds.x2) bounds.x2 = star.x;
    if (star.y < bounds.y1) bounds.y1 = star.y;
    if (star.y > bounds.y2) bounds.y2 = star.y;
    return bounds;
  }

  let bounds = newBounds();

  for (const star of stars) {
    bounds = correctBounds(star, bounds);
  }

  let ticks = 0;

  return {
    get stars() {
      return stars;
    },
    get bounds() {
      return bounds;
    },
    get height() {
      return bounds.y2 - bounds.y1;
    },
    get totalTicks() {
      return ticks;
    },
    untick() {
      bounds = newBounds();
      for (const star of stars) {
        star.x -= star.vx;
        star.y -= star.vy;
        bounds = correctBounds(star, bounds);
      }
      ticks--;
    },
    tick() {
      bounds = newBounds();
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        bounds = correctBounds(star, bounds);
      }
      ticks++;
    },
  };
}

function getMessageState(starSystem) {
  let height = Number.MAX_SAFE_INTEGER;
  do {
    height = starSystem.height;
    starSystem.tick();
  } while (height > starSystem.height);
  starSystem.untick();
  return starSystem;
}

function printMessage(starSystem) {
  const starLocations = new Set(
    starSystem.stars.map(({ x, y }) => `${x},${y}`)
  );
  let output = '\n';
  for (let y = 0; y <= starSystem.bounds.y2 - starSystem.bounds.y1; y++) {
    for (let x = 0; x <= starSystem.bounds.x2 - starSystem.bounds.x1; x++) {
      output += starLocations.has(
        `${x + starSystem.bounds.x1},${y + starSystem.bounds.y1}`
      )
        ? '#'
        : '.';
    }
    output += '\n';
  }
  return output;
}

module.exports = {
  part1: inputLines => {
    const stars = parseStars(inputLines);
    const starSystem = StarSystem(stars);
    const starSystemStateWithMessage = getMessageState(starSystem);
    return printMessage(starSystemStateWithMessage);
  },
  part2: inputLines => {
    const stars = parseStars(inputLines);
    const starSystem = StarSystem(stars);
    const starSystemStateWithMessage = getMessageState(starSystem);
    return starSystemStateWithMessage.totalTicks;
  },
};
