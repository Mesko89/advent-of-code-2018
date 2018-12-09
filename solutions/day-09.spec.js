const { part1 } = require('./day-09');

describe('Day 09 - Part 1', () => {
  const tests = [
    {
      input: ['7 players; last marble is worth 25 points'],
      expectedOutput: 32,
    },
    {
      input: ['10 players; last marble is worth 1618 points'],
      expectedOutput: 8317,
    },
    {
      input: ['13 players; last marble is worth 7999 points'],
      expectedOutput: 146373,
    },
    {
      input: ['17 players; last marble is worth 1104 points'],
      expectedOutput: 2764,
    },
    {
      input: ['21 players; last marble is worth 6111 points'],
      expectedOutput: 54718,
    },
    {
      input: ['30 players; last marble is worth 5807 points'],
      expectedOutput: 37305,
    },
  ];
  for (const test of tests) {
    it(`gets correct high score for "${test.input}"`, () => {
      expect(part1(test.input)).toBe(test.expectedOutput);
    });
  }
});
