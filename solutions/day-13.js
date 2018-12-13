const turns = {
  LEFT: 'left',
  FORWARD: 'forward',
  RIGHT: 'right',
};

const turnsOrder = [turns.LEFT, turns.FORWARD, turns.RIGHT];
const directions = {
  UP: '^',
  DOWN: 'v',
  LEFT: '<',
  RIGHT: '>',
};

const directionMaps = {
  [directions.UP]: {
    [turns.LEFT]: directions.LEFT,
    [turns.FORWARD]: directions.UP,
    [turns.RIGHT]: directions.RIGHT,
  },
  [directions.RIGHT]: {
    [turns.LEFT]: directions.UP,
    [turns.FORWARD]: directions.RIGHT,
    [turns.RIGHT]: directions.DOWN,
  },
  [directions.DOWN]: {
    [turns.LEFT]: directions.RIGHT,
    [turns.FORWARD]: directions.DOWN,
    [turns.RIGHT]: directions.LEFT,
  },
  [directions.LEFT]: {
    [turns.LEFT]: directions.DOWN,
    [turns.FORWARD]: directions.LEFT,
    [turns.RIGHT]: directions.UP,
  },
};

const positionChanges = {
  [directions.UP]: { x: 0, y: -1 },
  [directions.RIGHT]: { x: 1, y: 0 },
  [directions.DOWN]: { x: 0, y: 1 },
  [directions.LEFT]: { x: -1, y: 0 },
};

const mapCartSigns = {
  '^': '|',
  v: '|',
  '<': '-',
  '>': '-',
};

function sumPositions(...positions) {
  return positions.reduce(
    (position, { x, y }) => ({ x: position.x + x, y: position.y + y }),
    { x: 0, y: 0 }
  );
}

let cartId = 0;

function Grid(grid) {
  grid = grid.map(line => Array.from(line));
  const cartSigns = new Set(Object.values(directions));
  const get = (x, y) => grid[y][x];
  const set = (x, y, value) => (grid[y][x] = value);
  let carts = [];

  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      if (cartSigns.has(get(x, y))) {
        carts.push({
          id: cartId++,
          position: { x, y },
          direction: get(x, y),
          nextTurn: turnsOrder[0],
          isCrashed: false,
        });
        set(x, y, mapCartSigns[get(x, y)]);
      }
    }
  }

  function print() {
    let output = '\r\n';
    grid.forEach((line, y) => {
      line.forEach((sign, x) => {
        const cart = carts.find(c => c.position.x === x && c.position.y === y);
        if (cart) {
          output += cart.isCrashed ? 'X' : cart.direction;
        } else {
          output += sign;
        }
      });
      output += '\r\n';
    });
    console.log(output);
  }

  function tick() {
    carts.sort((a, b) => {
      if (a.position.y === b.position.y) {
        return a.position.x - b.position.x;
      }
      return a.position.y - b.position.y;
    });

    for (const cart of carts) {
      if (cart.isCrashed) continue;

      const sign = get(cart.position.x, cart.position.y);
      if (sign === '+') {
        cart.direction = directionMaps[cart.direction][cart.nextTurn];
        cart.nextTurn =
          turnsOrder[
            (turnsOrder.indexOf(cart.nextTurn) + 1 + turnsOrder.length) %
              turnsOrder.length
          ];
      } else if (sign === '/') {
        if (cart.direction === directions.UP) {
          cart.direction = directions.RIGHT;
        } else if (cart.direction === directions.LEFT) {
          cart.direction = directions.DOWN;
        } else if (cart.direction === directions.DOWN) {
          cart.direction = directions.LEFT;
        } else if (cart.direction === directions.RIGHT) {
          cart.direction = directions.UP;
        }
      } else if (sign === '\\') {
        if (cart.direction === directions.UP) {
          cart.direction = directions.LEFT;
        } else if (cart.direction === directions.LEFT) {
          cart.direction = directions.UP;
        } else if (cart.direction === directions.DOWN) {
          cart.direction = directions.RIGHT;
        } else if (cart.direction === directions.RIGHT) {
          cart.direction = directions.DOWN;
        }
      }

      cart.position = sumPositions(
        cart.position,
        positionChanges[cart.direction]
      );

      for (const c of carts) {
        if (c.isCrashed) continue;
        if (c.id === cart.id) continue;
        if (
          c.position.x === cart.position.x &&
          c.position.y === cart.position.y
        ) {
          cart.isCrashed = true;
          c.isCrashed = true;
          break;
        }
      }
    }
  }

  return {
    get nonCrashedCarts() {
      return carts.filter(c => !c.isCrashed);
    },
    get crashedCarts() {
      return carts.filter(c => c.isCrashed);
    },
    tick,
    print,
  };
}

module.exports = {
  part1: inputLines => {
    const grid = Grid(inputLines);
    while (grid.crashedCarts.length === 0) {
      grid.tick();
    }
    const {
      position: { x, y },
    } = grid.crashedCarts[0];
    return `${x},${y}`;
  },
  part2: inputLines => {
    const grid = Grid(inputLines);
    while (grid.nonCrashedCarts.length !== 1) {
      grid.tick();
    }
    const {
      position: { x, y },
    } = grid.nonCrashedCarts[0];
    return `${x},${y}`;
  },
};
