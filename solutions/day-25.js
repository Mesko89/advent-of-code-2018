function parsePoints(inputLines) {
  return inputLines.map(line =>
    line.split(',').map(v => parseInt(v.trim(), 10))
  );
}

function manhattanDistance(v1, v2) {
  return v1.map((v, i) => Math.abs(v - v2[i])).reduce((t, v) => t + v, 0);
}

function sameArray(a1, a2) {
  return a1.every((v, i) => v === a2[i]);
}

function getConstellations(points) {
  const connections = points.map(point => {
    const connectedTo = points.filter(
      p => p !== point && manhattanDistance(p, point) <= 3
    );
    return { point, connectedTo };
  });

  let constellations = [];
  for (const connection of connections) {
    let constellation = constellations.find(c =>
      c.some(points => sameArray(connection.point, points))
    );
    if (!constellation) {
      constellation = [connection.point];
      constellations.push(constellation);
    }
    for (const connectedPoint of connection.connectedTo) {
      const alreadyConnectedConstellation = constellations.find(c =>
        c.some(points => sameArray(connectedPoint, points))
      );
      if (
        alreadyConnectedConstellation &&
        alreadyConnectedConstellation !== constellation
      ) {
        constellations = constellations.filter(c => c !== constellation);
        constellation.forEach(p => alreadyConnectedConstellation.push(p));
        constellation = alreadyConnectedConstellation;
      } else {
        constellation.push(connectedPoint);
      }
    }
  }
  return constellations;
}

module.exports = {
  part1: inputLines => {
    const points = parsePoints(inputLines);
    const constellations = getConstellations(points);
    return constellations.length;
  },
  part2: inputLines => {
    return 'Happy Christmas!';
  },
};
