function parseGameInfo(input) {
  const [_, totalPlayers, totalMarbles] = input
    .match(/(\d+) players; last marble is worth (\d+) points/)
    .map(v => parseInt(v, 10));
  return {
    totalPlayers,
    totalMarbles,
  };
}

function roundRobinIndex(newIndex, length) {
  return (newIndex + length) % length;
}

function RoundRobinLinkedList() {
  let currentNode = { value: 0, next: null, prev: null };
  currentNode.next = currentNode;
  currentNode.prev = currentNode;
  return {
    goClockwise(steps = 1) {
      while (steps--) currentNode = currentNode.next;
    },
    goCounterClockwise(steps = 1) {
      while (steps--) currentNode = currentNode.prev;
    },
    insert(value) {
      const node = { value, next: currentNode.next, prev: currentNode };
      currentNode.next.prev = node;
      currentNode.next = node;
      currentNode = node;
    },
    remove() {
      currentNode.next.prev = currentNode.prev;
      currentNode.prev.next = currentNode.next;
      const value = currentNode.value;
      currentNode = currentNode.next;
      return value;
    },
  };
}

function getHighScore({ totalPlayers, totalMarbles }) {
  const marbles = RoundRobinLinkedList();
  marbles.insert(1);
  let players = Array.from({ length: totalPlayers }).map(() => 0);
  let currentPlayerIndex = roundRobinIndex(1, totalPlayers);
  let currentMarble = 1;
  while (currentMarble < totalMarbles) {
    currentPlayerIndex = roundRobinIndex(currentPlayerIndex + 1, totalPlayers);
    currentMarble++;
    if (currentMarble % 23 === 0) {
      players[currentPlayerIndex] += currentMarble;
      marbles.goCounterClockwise(7);
      players[currentPlayerIndex] += marbles.remove();
    } else {
      marbles.goClockwise();
      marbles.insert(currentMarble);
    }
  }
  return Math.max(...players);
}

module.exports = {
  part1: inputLines => {
    const gameInfo = parseGameInfo(inputLines[0]);
    return getHighScore(gameInfo);
  },
  part2: inputLines => {
    const gameInfo = parseGameInfo(inputLines[0]);
    gameInfo.totalMarbles *= 100;
    return getHighScore(gameInfo);
  },
};
