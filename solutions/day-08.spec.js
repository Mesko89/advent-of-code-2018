const { part1, part2 } = require('./day-08');

describe('Day 08 - Part 1', () => {
  it(`gets sum of all metadata entries`, () => {
    const input = ['2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'];
    expect(part1(input)).toBe(138);
  });
});

describe('Day 08 - Part 2', () => {
  it(`gets root node value`, () => {
    const input = ['2 3 0 3 10 11 12 1 1 0 1 99 2 1 1 2'];
    expect(part2(input)).toBe(66);
  });
});
