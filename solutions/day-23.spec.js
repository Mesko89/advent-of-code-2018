const { part1, part2 } = require('./day-23');

describe('Day 23 - Part 1', () => {
  it(`gets number of nanobots in range of most powerfull one`, () => {
    const input = [
      'pos=<0,0,0>, r=4',
      'pos=<1,0,0>, r=1',
      'pos=<4,0,0>, r=3',
      'pos=<0,2,0>, r=1',
      'pos=<0,5,0>, r=3',
      'pos=<0,0,3>, r=1',
      'pos=<1,1,1>, r=1',
      'pos=<1,1,2>, r=1',
      'pos=<1,3,1>, r=1',
    ];
    expect(part1(input)).toBe(7);
  });
});

describe('Day 23 - Part 2', () => {
  it(`gets shortest manhattan distance between 0,0,0 and point with most nanobots reachable`, () => {
    const input = [
      'pos=<10,12,12>, r=2',
      'pos=<12,14,12>, r=2',
      'pos=<16,12,12>, r=4',
      'pos=<14,14,14>, r=6',
      'pos=<50,50,50>, r=200',
      'pos=<10,10,10>, r=5',
    ];
    expect(part2(input)).toBe(36);
  });
});
