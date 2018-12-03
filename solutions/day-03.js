const patchRx = /#(\d+) @ (\d+),(\d+): (\d+)x(\d+)/;
function parsePatches(inputLines) {
  return inputLines.map(line => {
    const [_, id, x, y, width, height] = line
      .match(patchRx)
      .map(v => parseInt(v, 10));
    return { id, x, y, width, height };
  });
}

function Fabric(patches) {
  const claimed = {};
  const neverOverlaps = new Set();
  const overlaps = new Set();

  let totalOverlappedArea = 0;

  function claim(x, y, id) {
    const key = `${x},${y}`;
    if (!(key in claimed)) {
      claimed[key] = [];
    }

    claimed[key].push(id);

    if (claimed[key].length > 1) {
      claimed[key].forEach(id => {
        neverOverlaps.delete(id);
        overlaps.add(id);
      });
      if (claimed[key].length === 2) {
        totalOverlappedArea++;
      }
    } else if (claimed[key].length === 1) {
      if (!overlaps.has(id)) {
        neverOverlaps.add(id);
      }
    }
  }

  function analyze() {
    for (const patch of patches) {
      for (let x = patch.x; x < patch.x + patch.width; x++) {
        for (let y = patch.y; y < patch.y + patch.height; y++) {
          claim(x, y, patch.id);
        }
      }
    }
  }

  function getTotalOverlappingArea() {
    return totalOverlappedArea;
  }

  function getNonOverlappingId() {
    return Array.from(neverOverlaps.values())[0];
  }

  analyze();

  return {
    getTotalOverlappingArea,
    getNonOverlappingId,
  };
}

module.exports = {
  part1: inputLines =>
    Fabric(parsePatches(inputLines)).getTotalOverlappingArea(),
  part2: inputLines => Fabric(parsePatches(inputLines)).getNonOverlappingId(),
};
