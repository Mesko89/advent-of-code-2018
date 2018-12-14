const { part1, part2 } = require('./day-14');

describe('Day 14 - Part 1', () => {
  const tests = [
    {
      input: ['5'],
      expectedOutput: '0124515891',
    },
    {
      input: ['9'],
      expectedOutput: '5158916779',
    },
    {
      input: ['18'],
      expectedOutput: '9251071085',
    },
    {
      input: ['2018'],
      expectedOutput: '5941429882',
    },
  ];
  for (const test of tests) {
    it(`gets next 10 recipes for input "${test.input}"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});

describe('Day 14 - Part 2', () => {
  const tests = [
    {
      input: ['01245'],
      expectedOutput: 5,
    },
    {
      input: ['51589'],
      expectedOutput: 9,
    },
    {
      input: ['92510'],
      expectedOutput: 18,
    },
    {
      input: ['59414'],
      expectedOutput: 2018,
    },
  ];
  for (const test of tests) {
    it(`gets total number of recipes until following sequence starts: "${
      test.input
    }"`, () => {
      expect(part2(test.input)).toBe(test.expectedOutput);
    });
  }
});
