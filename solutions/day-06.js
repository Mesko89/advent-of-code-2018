function parsePoints(inputLines) {
  let nextId = 0;
  return inputLines
    .map(line => line.split(',').map(v => parseInt(v.trim(), 10)))
    .map(([x, y]) => ({ x, y, id: nextId++ }));
}

function getBounds(points) {
  return points.reduce(
    (bounds, point) => {
      if (point.x > bounds.maxX) bounds.maxX = point.x;
      if (point.x < bounds.minX) bounds.minX = point.x;
      if (point.y > bounds.maxY) bounds.maxY = point.y;
      if (point.y < bounds.minY) bounds.minY = point.y;
      return bounds;
    },
    {
      minX: Number.MAX_SAFE_INTEGER,
      maxX: Number.MIN_SAFE_INTEGER,
      minY: Number.MAX_SAFE_INTEGER,
      maxY: Number.MIN_SAFE_INTEGER,
    }
  );
}

function manhattanDistance(point1, point2) {
  return Math.abs(point2.x - point1.x) + Math.abs(point2.y - point1.y);
}

function getDistances(fromPoint, points, getDistance) {
  return points.map(point => ({
    distance: getDistance(fromPoint, point),
    point,
  }));
}

function getAreaSizes(points, getDistance = manhattanDistance) {
  const bounds = getBounds(points);
  const sizes = {};

  function getMinDistances(distances) {
    const minDistance = Math.min(...distances.map(d => d.distance));
    return distances.filter(d => d.distance === minDistance);
  }

  function isBorderPoint(point) {
    return (
      point.x === bounds.minX ||
      point.x === bounds.maxX ||
      point.y === bounds.minY ||
      point.y === bounds.maxY
    );
  }

  const borderIds = new Set();

  for (let x = bounds.minX; x <= bounds.maxX; x++) {
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      const distances = getDistances({ x, y }, points, getDistance);
      const minDistances = getMinDistances(distances);
      if (minDistances.length === 1) {
        const point = minDistances[0].point;
        if (!isBorderPoint({ x, y })) {
          sizes[point.id] = sizes[point.id] ? sizes[point.id] + 1 : 1;
        } else {
          borderIds.add(point.id);
        }
      }
    }
  }

  for (const borderId of borderIds) {
    delete sizes[borderId];
  }

  return sizes;
}

function getAreaSizeOfDistanceSumLowerThan(
  points,
  highestSumDistance,
  getDistance = manhattanDistance
) {
  const bounds = getBounds(points);

  function sumDistances(distances) {
    return distances.reduce((s, d) => s + d.distance, 0);
  }

  let area = 0;
  for (let x = bounds.minX; x <= bounds.maxX; x++) {
    for (let y = bounds.minY; y <= bounds.maxY; y++) {
      const distances = getDistances({ x, y }, points, getDistance);
      const sumOfDistances = sumDistances(distances);
      if (sumOfDistances < highestSumDistance) {
        area++;
      }
    }
  }
  return area;
}

module.exports = {
  part1: inputLines => {
    const points = parsePoints(inputLines);
    const areaSizes = getAreaSizes(points);
    const maxArea = Math.max(...Object.values(areaSizes));
    return maxArea;
  },
  part2: (inputLines, highestDistanceSum = 10000) => {
    const points = parsePoints(inputLines);
    const areaSize = getAreaSizeOfDistanceSumLowerThan(
      points,
      highestDistanceSum
    );
    return areaSize;
  },
};
