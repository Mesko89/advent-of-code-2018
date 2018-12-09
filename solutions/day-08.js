/*
2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2
A----------------------------------
    B----------- C-----------
                     D-----
*/

function parseTree(input) {
  let numbers = input
    .split(/\s/)
    .map(v => parseInt(v, 10))
    .reverse();
  function getNode(parentNode) {
    const totalChildren = numbers.pop();
    const totalMetadata = numbers.pop();
    const node = { parentNode, children: [], metadata: [] };
    for (let i = 0; i < totalChildren; i++) node.children.push(getNode(node));
    for (let i = 0; i < totalMetadata; i++) node.metadata.push(numbers.pop());
    return node;
  }
  return getNode(null);
}

function getMetadataSum(node) {
  return (
    node.metadata.reduce((a, b) => a + b, 0) +
    node.children.reduce((total, child) => total + getMetadataSum(child), 0)
  );
}

function getNodeValue(node) {
  if (node.children.length > 0) {
    return node.metadata.reduce((total, childIndex) => {
      childIndex -= 1; // correct it to 0-index
      if (node.children[childIndex]) {
        return total + getNodeValue(node.children[childIndex]);
      }
      return total;
    }, 0);
  } else {
    return getMetadataSum(node);
  }
}

module.exports = {
  part1: inputLines => {
    const tree = parseTree(inputLines[0]);
    return getMetadataSum(tree);
  },
  part2: inputLines => {
    const tree = parseTree(inputLines[0]);
    return getNodeValue(tree);
  },
};
