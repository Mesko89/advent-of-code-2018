const { part1, part2 } = require('./day-02');

describe('Day 02 - Part 1', () => {
  it(`gets correct checksum`, () => {
    const input = [
      'abcdef',
      'bababc',
      'abbcde',
      'abcccd',
      'aabcdd',
      'abcdee',
      'ababab',
    ];
    expect(part1(input)).toBe(12);
  });
});

describe('Day 02 - Part 2', () => {
  it(`gets correct common letters of correct boxes`, () => {
    const input = [
      'abcde',
      'fghij',
      'klmno',
      'pqrst',
      'fguij',
      'axcye',
      'wvxyz',
    ];
    expect(part2(input)).toBe('fgij');
  });
});
