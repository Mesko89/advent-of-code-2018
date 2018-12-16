const { part1, part2 } = require('./day-16');

describe('Day 16 - Part 1', () => {
  const tests = [
    {
      input: ['Before: [3, 2, 1, 1]', '9 2 1 2', 'After:  [3, 2, 2, 1]'],
      expectedOutput: 1,
    },
    {
      input: ['Before: [3, 2, 1, 1]', '9 2 1 2', 'After:  [3, 2, 2, 3]'],
      expectedOutput: 0,
    },
  ];
  for (const test of tests) {
    it(`gets number of samples that behave like 3 or more opcodes for input "${
      test.input
    }"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});
