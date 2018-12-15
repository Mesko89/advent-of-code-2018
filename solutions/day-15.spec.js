const { part1, part2 } = require('./day-15');

describe('Day 15 - Part 1', () => {
  const tests = [
    {
      input: [
        '#######',
        '#.G...#',
        '#...EG#',
        '#.#.#G#',
        '#..G#E#',
        '#.....#',
        '#######',
      ],
      expectedOutput: 47 * 590,
    },
    {
      input: [
        '#######',
        '#G..#E#',
        '#E#E.E#',
        '#G.##.#',
        '#...#E#',
        '#...E.#',
        '#######',
      ],
      expectedOutput: 37 * 982,
    },
    {
      input: [
        '#######',
        '#E..EG#',
        '#.#G.E#',
        '#E.##E#',
        '#G..#.#',
        '#..E#.#',
        '#######',
      ],
      expectedOutput: 46 * 859,
    },
    {
      input: [
        '#######',
        '#E.G#.#',
        '#.#G..#',
        '#G.#.G#',
        '#G..#.#',
        '#...E.#',
        '#######',
      ],
      expectedOutput: 35 * 793,
    },
    {
      input: [
        '#######',
        '#.E...#',
        '#.#..G#',
        '#.###.#',
        '#E#G#G#',
        '#...#G#',
        '#######',
      ],
      expectedOutput: 54 * 536,
    },
    {
      input: [
        '#########',
        '#G......#',
        '#.E.#...#',
        '#..##..G#',
        '#...##..#',
        '#...#...#',
        '#.G...G.#',
        '#.....G.#',
        '#########',
      ],
      expectedOutput: 20 * 937,
    },
  ];
  for (const test of tests) {
    it(`gets battle outcome for input "${test.input}"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});

describe('Day 15 - Part 2', () => {
  const tests = [
    {
      input: [
        '#######',
        '#.G...#',
        '#...EG#',
        '#.#.#G#',
        '#..G#E#',
        '#.....#',
        '#######',
      ],
      expectedOutput: 29 * 172,
    },
    {
      input: [
        '#######',
        '#E..EG#',
        '#.#G.E#',
        '#E.##E#',
        '#G..#.#',
        '#..E#.#',
        '#######',
      ],
      expectedOutput: 33 * 948,
    },
    {
      input: [
        '#######',
        '#E.G#.#',
        '#.#G..#',
        '#G.#.G#',
        '#G..#.#',
        '#...E.#',
        '#######',
      ],
      expectedOutput: 37 * 94,
    },
    {
      input: [
        '#######',
        '#.E...#',
        '#.#..G#',
        '#.###.#',
        '#E#G#G#',
        '#...#G#',
        '#######',
      ],
      expectedOutput: 39 * 166,
    },
    {
      input: [
        '#########',
        '#G......#',
        '#.E.#...#',
        '#..##..G#',
        '#...##..#',
        '#...#...#',
        '#.G...G.#',
        '#.....G.#',
        '#########',
      ],
      expectedOutput: 30 * 38,
    },
  ];
  for (const test of tests) {
    it(`gets battle outcome for input "${test.input}"`, () => {
      expect(part2(test.input)).toBe(test.expectedOutput);
    });
  }
});
