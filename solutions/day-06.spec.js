const { part1, part2 } = require('./day-06');

describe('Day 06 - Part 1', () => {
  it(`gets size of largest non-infinite area #1`, () => {
    const input = ['1, 1', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9'];
    expect(part1(input)).toBe(17);
  });
  it(`gets size of largest non-infinite area #2`, () => {
    const input = ['1, 2', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9'];
    expect(part1(input)).toBe(6);
  });
});

describe('Day 06 - Part 2', () => {
  it(`gets total area of sum of distances lower than 32`, () => {
    const input = ['1, 1', '1, 6', '8, 3', '3, 4', '5, 5', '8, 9'];
    expect(part2(input, 32)).toBe(16);
  });
});
