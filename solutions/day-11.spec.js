const { part1, part2 } = require('./day-11');

describe('Day 11 - Part 1', () => {
  const tests = [
    {
      input: ['18'],
      expectedOutput: '33,45',
    },
    {
      input: ['42'],
      expectedOutput: '21,61',
    },
  ];
  for (const test of tests) {
    it(`gets correct corner with 3x3 largest total power for "${
      test.input
    }"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});

describe('Day 11 - Part 2', () => {
  const tests = [
    {
      input: ['18'],
      expectedOutput: '90,269,16',
    },
    {
      input: ['42'],
      expectedOutput: '232,251,12',
    },
  ];
  for (const test of tests) {
    it(`gets correct corner with size for largest total power for "${
      test.input
    }"`, () => {
      expect(part2(test.input)).toBe(test.expectedOutput);
    });
  }
});
