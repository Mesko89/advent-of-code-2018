const { part1, part2 } = require('./day-13');

describe('Day 13 - Part 1', () => {
  it(`gets coordinate of first crash`, () => {
    const input = [
      '/->-\\        ',
      '|   |  /----\\',
      '| /-+--+-\\  |',
      '| | |  | v  |',
      '\\-+-/  \\-+--/',
      '  \\------/   ',
    ];
    expect(part1(input)).toBe('7,3');
  });
});

describe('Day 13 - Part 2', () => {
  it(`gets coordinate of last standing cart`, () => {
    const input = [
      '/>-<\\  ',
      '|   |  ',
      '| /<+-\\',
      '| | | v',
      '\\>+</ |',
      '  |   ^',
      '  \\<->/',
    ];
    expect(part2(input)).toBe('6,4');
  });
});
