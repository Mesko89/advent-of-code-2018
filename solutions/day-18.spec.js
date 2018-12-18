const { part1 } = require('./day-18');

describe('Day 18 - Part 1', () => {
  it(`gets total resource value`, () => {
    const input = [
      '.#.#...|#.',
      '.....#|##|',
      '.|..|...#.',
      '..|#.....#',
      '#.#|||#|#|',
      '...#.||...',
      '.|....|...',
      '||...#|.#|',
      '|.||||..|.',
      '...#.|..|.',
    ];
    expect(part1(input)).toBe(1147);
  });
});
