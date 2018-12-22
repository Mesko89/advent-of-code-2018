const aStar = require('a-star');

const ROCKY = 0;
const WET = 1;
const NARROW = 2;

const TORCH = 'torch';
const CLIMBING_GEAR = 'climbing-gear';
const NEITHER = 'neither';

function getDepth(input) {
  return parseInt(input.replace('depth: ', ''), 10);
}

function getTarget(input) {
  const [x, y] = input
    .replace('target: ', '')
    .split(',')
    .map(v => parseInt(v, 10));
  return { x, y };
}

function Cave(depth, target) {
  const getKey = (x, y) => `${x},${y}`;
  const nodes = {};
  function getNode(x, y) {
    const key = getKey(x, y);
    let node = nodes[key];
    if (!node) {
      node = {};
      nodes[key] = node;
    }
    return node;
  }

  function getGeologicIndex(x, y) {
    const node = getNode(x, y);
    if ('geologicalIndex' in node) return node.geologicalIndex;

    node.geologicalIndex = (function() {
      if (x === 0 && y === 0) return 0;
      if (y === 0) return x * 16807;
      if (x === 0) return y * 48271;
      if (x === target.x && y === target.y) return 0;
      else return getErosionLevel(x - 1, y) * getErosionLevel(x, y - 1);
    })();

    return node.geologicalIndex;
  }

  function getErosionLevel(x, y) {
    const node = getNode(x, y);
    if ('erosionLevel' in node) return node.erosionLevel;
    const geologicalIndex = getGeologicIndex(x, y);
    node.erosionLevel = (geologicalIndex + depth) % 20183;
    return node.erosionLevel;
  }

  function getType(x, y) {
    const erosionLevel = getErosionLevel(x, y);
    return erosionLevel % 3;
  }

  function getNeighborNodes(x, y) {
    return [{ x: x - 1, y }, { x, y: y - 1 }, { x: x + 1, y }, { x, y: y + 1 }]
      .filter(({ x, y }) => x >= 0 && y >= 0)
      .map(({ x, y }) => ({ x, y, type: getType(x, y) }));
  }

  return { getGeologicIndex, getErosionLevel, getType, getNeighborNodes };
}

function findShortest(cave, from, to) {
  const manhattanDistance = ({ x: x1, y: y1 }, { x: x2, y: y2 }) =>
    Math.abs(x2 - x1) + Math.abs(y2 - y1);
  const timeRequired = (
    { type, tool: ftool },
    { x: tx, y: ty, tool: ttool }
  ) => {
    if (to.x === tx && to.y === ty) {
      if (ftool === ttool && ttool === TORCH) return 1;
      if (ftool === ttool && ttool !== TORCH) return 8;
      if (ttool !== TORCH) return 15;
      return 8;
    }
    return ftool === ttool ? 1 : 8;
  };
  const foundPath = aStar({
    start: from,
    isEnd: node => to.x === node.x && to.y === node.y,
    distance: timeRequired,
    heuristic: node => manhattanDistance(node, to),
    hash: ({ x, y, tool }) => `${x},${y},${tool}`,
    neighbor: ({ x, y, type }) => {
      const neighborPoints = cave.getNeighborNodes(x, y);
      const nodes = [];
      for (const neighbor of neighborPoints) {
        if (neighbor.type === ROCKY) {
          if (type !== NARROW) nodes.push({ ...neighbor, tool: CLIMBING_GEAR });
          if (type !== WET) nodes.push({ ...neighbor, tool: TORCH });
        } else if (neighbor.type === WET) {
          if (type !== NARROW) nodes.push({ ...neighbor, tool: CLIMBING_GEAR });
          if (type !== ROCKY) nodes.push({ ...neighbor, tool: NEITHER });
        } else if (neighbor.type === NARROW) {
          if (type !== WET) nodes.push({ ...neighbor, tool: TORCH });
          if (type !== ROCKY) nodes.push({ ...neighbor, tool: NEITHER });
        }
      }
      return nodes;
    },
  });

  return foundPath.cost;
}

module.exports = {
  part1: inputLines => {
    const depth = getDepth(inputLines[0]);
    const target = getTarget(inputLines[1]);
    const cave = Cave(depth, target);

    let totalRiskLevel = 0;
    for (let y = 0; y <= target.y; y++) {
      for (let x = 0; x <= target.x; x++) {
        totalRiskLevel += cave.getType(x, y);
      }
    }
    return totalRiskLevel;
  },
  part2: inputLines => {
    const depth = getDepth(inputLines[0]);
    const target = getTarget(inputLines[1]);
    const cave = Cave(depth, target);
    return findShortest(
      cave,
      { x: 0, y: 0, type: cave.getType(0, 0), tool: TORCH },
      target
    );
  },
};
