const { part1, part2 } = require('./day-22');

describe('Day 22 - Part 1', () => {
  it(`gets total risk level`, () => {
    const input = ['depth: 510', 'target: 10,10'];
    expect(part1(input)).toBe(114);
  });
});

describe('Day 22 - Part 2', () => {
  it(`gets total minimum number of minutes required to save`, () => {
    const input = ['depth: 510', 'target: 10,10'];
    expect(part2(input)).toBe(45);
  });
});
