const aStar = require('a-star');

const ELF = 'E';
const GOBLIN = 'G';
const WALL = '#';
const FREE = '.';

function manhattanDistance(pa, pb) {
  return Math.abs(pb.y - pa.y) + Math.abs(pb.x - pa.x);
}

function byReadingOrder({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  if (y1 === y2) {
    return x1 - x2;
  } else {
    return y1 - y2;
  }
}

function getNeighborPoints({ x, y }) {
  return [{ x, y: y - 1 }, { x: x - 1, y }, { x: x + 1, y }, { x, y: y + 1 }];
}

function findShortest(state, from, to) {
  var foundPath = aStar({
    start: from,
    isEnd: point => to.x === point.x && to.y === point.y,
    distance: manhattanDistance,
    heuristic: point => manhattanDistance(point, to),
    hash: ({ x, y }) => `${x},${y}`,
    neighbor: ({ x, y }) => {
      return getNeighborPoints({ x, y }).filter(
        point => state[point.y][point.x] === FREE
      );
    },
  });

  if (foundPath.status === 'success') {
    return {
      distance: foundPath.path.length,
      path: foundPath.path,
    };
  }
  return {
    distance: -1,
    path: [],
  };
}

function HotChocolateFight(state) {
  let actors = [];

  function get(x, y) {
    if (x < 0 || y < 0) return WALL;
    if (x > state.length || y > state[0].length) return WALL;
    return state[y][x];
  }

  function set(x, y, value) {
    state[y][x] = value;
  }

  function parseActors(elvesAttackPower) {
    state.forEach((line, y) => {
      line.forEach((value, x) => {
        if (value === GOBLIN || value === ELF) {
          actors.push({
            type: value,
            position: { x, y },
            hp: 200,
            ap: value === ELF ? elvesAttackPower : 3,
          });
        }
      });
    });
  }

  function getEnemiesOf(actor) {
    return actors.filter(({ type }) => type !== actor.type);
  }

  function getPossibleGotoPointsFromEnemies(enemies) {
    return enemies.reduce((gotoPoints, { position: { x, y } }) => {
      getNeighborPoints({ x, y }).forEach(point => {
        if (get(point.x, point.y) === FREE) {
          gotoPoints.push(point);
        }
      });
      return gotoPoints;
    }, []);
  }

  function getMoveToPoint(from, toPoints) {
    const fromPoints = getNeighborPoints(from).filter(
      ({ x, y }) => get(x, y) === FREE
    );
    const paths = fromPoints
      .reduce((paths, from) => {
        return [...paths, ...toPoints.map(to => findShortest(state, from, to))];
      }, [])
      .filter(p => p.distance >= 0);
    if (paths.length === 0) return null;
    const minPath = Math.min(...paths.map(p => p.distance));
    return paths
      .filter(p => p.distance === minPath)
      .sort((a, b) => byReadingOrder(a.path[0], b.path[0]))[0].path[0];
  }

  function print() {
    console.log('\n' + state.map(line => line.join('')).join('\n') + '\n');
    console.log(actors);
  }

  function canAttack(actor) {
    const neighborPoints = getNeighborPoints(actor.position);
    return enemy =>
      neighborPoints.some(
        ({ x, y }) => enemy.position.x === x && enemy.position.y === y
      );
  }

  function attack(actor, enemy) {
    enemy.hp -= actor.ap;
    if (enemy.hp <= 0) {
      enemy.isDead = true;
      actors = actors.filter(
        a =>
          a.position.x !== enemy.position.x || a.position.y !== enemy.position.y
      );
      set(enemy.position.x, enemy.position.y, FREE);
    }
  }

  const hotChocolateFight = {
    print,
    get elves() {
      return actors.filter(({ type }) => type === ELF);
    },
    ready(elvesAttackPower = 3) {
      parseActors(elvesAttackPower);
      return hotChocolateFight;
    },
    set() {
      return hotChocolateFight;
    },
    fight() {
      const isGoblin = ({ type }) => type === GOBLIN;
      const isElf = ({ type }) => type === ELF;
      const isDone = () =>
        actors.filter(isGoblin).length === 0 ||
        actors.filter(isElf).length === 0;

      let turns = 0;
      while (!isDone()) {
        actors.sort((a, b) => byReadingOrder(a.position, b.position));
        let doBreak = false;

        actors.forEach((actor, index, arr) => {
          if (actor.isDead) return;
          const enemies = getEnemiesOf(actor);
          let canAttackEnemies = enemies.filter(canAttack(actor));
          if (canAttackEnemies.length === 0) {
            const moveTo = getMoveToPoint(
              actor.position,
              getPossibleGotoPointsFromEnemies(enemies)
            );
            if (moveTo !== null) {
              set(actor.position.x, actor.position.y, FREE);
              actor.position = moveTo;
              set(actor.position.x, actor.position.y, actor.type);
              canAttackEnemies = canAttackEnemies = enemies.filter(
                canAttack(actor)
              );
            }
          }

          if (canAttackEnemies.length > 0) {
            canAttackEnemies.sort((a, b) => a.hp - b.hp);
            const selectedEnemy = canAttackEnemies[0];
            attack(actor, selectedEnemy);
          }

          if (!doBreak && index !== arr.length - 1 && isDone()) {
            doBreak = true;
          }
        });

        if (!doBreak) turns++;
      }
      return turns * actors.reduce((sum, actor) => sum + actor.hp, 0);
    },
  };
  return hotChocolateFight;
}

module.exports = {
  part1: inputLines => {
    const initialState = inputLines.map(line => line.split(''));
    const hotChocolateFight = HotChocolateFight(initialState);
    return hotChocolateFight
      .ready()
      .set()
      .fight();
  },
  part2: inputLines => {
    const newInputLines = () => [...inputLines.map(line => line.split(''))];
    let elfAttack = 3;
    let battleScore = 0;
    while (elfAttack < 50) {
      const hotChocolateFight = HotChocolateFight(newInputLines()).ready(
        elfAttack++
      );
      const startElves = hotChocolateFight.elves.length;
      battleScore = hotChocolateFight.set().fight();
      if (hotChocolateFight.elves.length === startElves) break;
    }
    return battleScore;
  },
};
