const { part1, part2 } = require('./day-05');

describe('Day 05 - Part 1', () => {
  const tests = [
    { input: ['aA'], expectedOutput: 0 },
    { input: ['abBA'], expectedOutput: 0 },
    { input: ['abAB'], expectedOutput: 4 },
    { input: ['aabAAB'], expectedOutput: 6 },
    { input: ['dabAcCaCBAcCcaDA'], expectedOutput: 10 },
  ];
  for (const test of tests) {
    it(`correctly reacts "${test.input}"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});

describe('Day 05 - Part 2', () => {
  const tests = [{ input: ['dabAcCaCBAcCcaDA'], expectedOutput: 4 }];
  for (const test of tests) {
    it(`corrects polymer "${test.input}"`, () => {
      expect(part2(test.input)).toBe(test.expectedOutput);
    });
  }
});
