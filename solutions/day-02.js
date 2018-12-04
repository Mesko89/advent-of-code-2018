const { count } = require('./utils');

function toArray(any) {
  return Array.from(any);
}

function isSameCharacter(char) {
  return character => char === character;
}

function hasNSameLetters(N) {
  return array =>
    array.some(character => count(array, isSameCharacter(character)) === N);
}

function calculateChecksum(boxIdList) {
  boxIdList = boxIdList.map(toArray);
  const hasTwoSameLetters = hasNSameLetters(2);
  const hasThreeSameLetters = hasNSameLetters(3);

  return (
    count(boxIdList, hasTwoSameLetters) * count(boxIdList, hasThreeSameLetters)
  );
}

function areCorrect(boxId1, boxId2) {
  return count(boxId1, (character, index) => boxId2[index] !== character) === 1;
}

function findCorrectBoxId(boxIdList) {
  boxIdList = boxIdList.map(toArray);
  boxIdList = boxIdList.filter(boxId1 =>
    boxIdList.some(boxId2 => areCorrect(boxId1, boxId2))
  );
  const [boxId1, boxId2] = boxIdList;
  return boxId1
    .filter((character, index) => boxId2[index] === character)
    .join('');
}

module.exports = {
  part1: inputLines => calculateChecksum(inputLines),
  part2: inputLines => findCorrectBoxId(inputLines),
};
