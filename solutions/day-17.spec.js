const { part1, part2 } = require('./day-17');

describe('Day 17 - Part 1', () => {
  it(`gets correct number of water tiles`, () => {
    const input = [
      'x=495, y=2..7',
      'y=7, x=495..501',
      'x=501, y=3..7',
      'x=498, y=2..4',
      'x=506, y=1..2',
      'x=498, y=10..13',
      'x=504, y=10..13',
      'y=13, x=498..504',
    ];
    expect(part1(input)).toBe(57);
  });

  it(`gets correct number of water tiles with square`, () => {
    const input = [
      'x=493, y=3..8',
      'x=501, y=4..8',
      'x=496, y=4..6',
      'x=498, y=4..6',
      'y=8, x=493..501',
      'y=4, x=496..498',
      'y=6, x=496..498',
    ];
    expect(part1(input)).toBe(33);
  });
});

describe('Day 17 - Part 2', () => {
  it(`gets correct number of water tiles`, () => {
    const input = [
      'x=495, y=2..7',
      'y=7, x=495..501',
      'x=501, y=3..7',
      'x=498, y=2..4',
      'x=506, y=1..2',
      'x=498, y=10..13',
      'x=504, y=10..13',
      'y=13, x=498..504',
    ];
    expect(part2(input)).toBe(29);
  });

  it(`gets correct number of water tiles with square`, () => {
    const input = [
      'x=493, y=3..8',
      'x=501, y=4..8',
      'x=496, y=4..6',
      'x=498, y=4..6',
      'y=8, x=493..501',
      'y=4, x=496..498',
      'y=6, x=496..498',
    ];
    expect(part2(input)).toBe(19);
  });
});
