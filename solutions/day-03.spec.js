const { part1, part2 } = require('./day-03');

describe('Day 03 - Part 1', () => {
  it(`gets correct total overlapped patch area`, () => {
    const input = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'];
    expect(part1(input)).toBe(4);
  });
});

describe('Day 02 - Part 2', () => {
  it(`gets correct patch id that does not overlap`, () => {
    const input = ['#1 @ 1,3: 4x4', '#2 @ 3,1: 4x4', '#3 @ 5,5: 2x2'];
    expect(part2(input)).toBe(3);
  });
});
