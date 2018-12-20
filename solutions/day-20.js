const N = 'N';
const E = 'E';
const S = 'S';
const W = 'W';

const goNorth = ({ x, y }) => ({ x, y: y - 1 });
const goEast = ({ x, y }) => ({ x: x + 1, y });
const goSouth = ({ x, y }) => ({ x, y: y + 1 });
const goWest = ({ x, y }) => ({ x: x - 1, y });

function getNextPosition(position, direction) {
  if (direction === N) return goNorth(position);
  if (direction === E) return goEast(position);
  if (direction === S) return goSouth(position);
  if (direction === W) return goWest(position);
  throw new Error(`Unknown direction: ${direction}`);
}

function parseMaze(regex) {
  const getKey = node => `${node.x},${node.y}`;

  function connectNodes(fromNode, toNode, direction) {
    if (direction === N) {
      fromNode.n = toNode;
      toNode.s = fromNode;
    } else if (direction === E) {
      fromNode.e = toNode;
      toNode.w = fromNode;
    } else if (direction === S) {
      fromNode.s = toNode;
      toNode.n = fromNode;
    } else if (direction === W) {
      fromNode.w = toNode;
      toNode.s = fromNode;
    } else {
      throw new Error(`Unknown direction: ${direction}`);
    }

    if (fromNode.d < toNode.d - 1) {
      toNode.d = fromNode.d + 1;
    }
  }

  function extractGroup(regex, fromIndex) {
    if (regex[fromIndex] !== '(')
      throw new Error(`${regex[fromIndex]} is no "("`);
    let level = 1;
    let i = fromIndex;
    while (level !== 0) {
      i++;
      if (regex[i] === ')') level--;
      if (regex[i] === '(') level++;
    }
    return regex.substring(fromIndex + 1, i);
  }

  function splitGroup(regex) {
    const parts = [];
    let level = 0;
    let from = 0;
    for (let i = 0; i < regex.length; i++) {
      if (regex[i] === '|' && level === 0) {
        parts.push(regex.substring(from, i));
        from = i + 1;
      } else if (regex[i] === '(') {
        level++;
      } else if (regex[i] === ')') {
        level--;
      }
    }
    parts.push(regex.substring(from));
    return parts;
  }

  regex = regex.slice(1, regex.length - 1);

  const maze = {
    start: { x: 0, y: 0, n: null, e: null, s: null, w: null, d: 0 },
  };
  maze[getKey(maze.start)] = maze.start;

  (function traverse(options, node) {
    for (const option of options) {
      let fromNode = node;
      for (let i = 0; i < option.length; i++) {
        if (option[i] === '(') {
          const regexGroup = extractGroup(option, i);
          traverse(splitGroup(regexGroup), fromNode);
          i += regexGroup.length + 1;
        } else {
          let nodePosition = getNextPosition(
            { x: fromNode.x, y: fromNode.y },
            option[i]
          );
          const nodeKey = getKey(nodePosition);
          if (!(nodeKey in maze)) {
            maze[nodeKey] = {
              ...nodePosition,
              n: null,
              e: null,
              s: null,
              w: null,
              d: fromNode.d + 1,
            };
          }
          connectNodes(fromNode, maze[nodeKey], option[i]);
          fromNode = maze[nodeKey];
        }
      }
    }
  })([regex], maze.start);

  return maze;
}

module.exports = {
  part1: inputLines => {
    const maze = parseMaze(inputLines[0]);
    return Object.values(maze).reduce((max, node) => {
      if (node.d > max) return node.d;
      return max;
    }, 0);
  },
  part2: inputLines => {
    const maze = parseMaze(inputLines[0]);
    return Object.values(maze).filter(node => node.d >= 1000).length;
  },
};
