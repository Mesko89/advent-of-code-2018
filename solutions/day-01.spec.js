const { part1, part2 } = require('./day-01');

describe('Day 01 - Part 1', () => {
  const tests = [
    { input: ['+1', '+1', '+1'], expectedOutput: 3 },
    { input: ['+1', '+1', '-2'], expectedOutput: 0 },
    { input: ['-1', '-2', '-3'], expectedOutput: -6 },
  ];
  for (const test of tests) {
    it(`sums frequency changes for "${test.input}"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});

describe('Day 01 - Part 2', () => {
  const tests = [
    { input: ['+1', '-1'], expectedOutput: 0 },
    { input: ['+3', '+3', '+4', '-2', '-4'], expectedOutput: 10 },
    { input: ['-6', '+3', '+8', '+5', '-6'], expectedOutput: 5 },
    { input: ['+7', '+7', '-2', '-7', '-4'], expectedOutput: 14 },
  ];

  for (const test of tests) {
    it(`finds first duplicated frequency for "${test.input}"`, () => {
      expect(part2(test.input)).toBe(test.expectedOutput);
    });
  }
});
