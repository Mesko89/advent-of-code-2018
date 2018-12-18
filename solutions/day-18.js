const OPEN = '.';
const TREE = '|';
const LUMBERYARD = '#';

function parseGrid(input) {
  return input.map(l => l.split(''));
}

function count(grid, values) {
  return grid.reduce(
    (total, line) =>
      total + line.reduce((t, v) => (values === v ? t + 1 : t), 0),
    0
  );
}

function print(grid) {
  console.log(grid.map(line => line.join('')).join('\r\n'));
}

function simulate(grid, steps = 10) {
  function getAdjecentAcres(x, y) {
    return [
      { x: x - 1, y: y - 1 },
      { x: x, y: y - 1 },
      { x: x + 1, y: y - 1 },
      { x: x - 1, y: y },
      { x: x + 1, y: y },
      { x: x - 1, y: y + 1 },
      { x: x, y: y + 1 },
      { x: x + 1, y: y + 1 },
    ]
      .filter(
        ({ x, y }) => y >= 0 && y < grid.length && x >= 0 && x < grid[0].length
      )
      .map(({ x, y }) => grid[y][x]);
  }

  while (steps--) {
    grid = grid.map((line, y) =>
      line.map((value, x) => {
        if (value === OPEN) {
          if (getAdjecentAcres(x, y).filter(v => v === TREE).length >= 3) {
            return TREE;
          }
        } else if (value === TREE) {
          if (
            getAdjecentAcres(x, y).filter(v => v === LUMBERYARD).length >= 3
          ) {
            return LUMBERYARD;
          }
        } else if (value === LUMBERYARD) {
          const adjecentAcres = getAdjecentAcres(x, y);
          const totalTrees = adjecentAcres.filter(v => v === TREE).length;
          const totalLumberyards = adjecentAcres.filter(v => v === LUMBERYARD)
            .length;
          if (totalTrees >= 1 && totalLumberyards >= 1) {
            return LUMBERYARD;
          } else {
            return OPEN;
          }
        }
        return value;
      })
    );
  }

  return grid;
}

module.exports = {
  part1: inputLines => {
    let grid = parseGrid(inputLines);
    grid = simulate(grid);
    return count(grid, TREE) * count(grid, LUMBERYARD);
  },
  part2: inputLines => {
    const getTotalResourceValue = grid =>
      count(grid, TREE) * count(grid, LUMBERYARD);
    let grid = parseGrid(inputLines);
    let values = [getTotalResourceValue(grid)];
    let historyRepeated = [];

    let steps = 500; // At around this step resource values should start repeating soon
    while (steps++) {
      let grid2 = simulate(grid, steps);

      let resourceValue = getTotalResourceValue(grid2);
      let lastResultStep = values.lastIndexOf(resourceValue);

      if (lastResultStep === -1) historyRepeated = [];
      else if (historyRepeated.find(c => c.value === resourceValue)) break;
      else
        historyRepeated.push({
          step: lastResultStep + 500,
          value: resourceValue,
        });
      values.push(resourceValue);
    }

    return historyRepeated[
      (1000000000 - historyRepeated[0].step) % historyRepeated.length
    ].value;
  },
};
