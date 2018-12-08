const { part1, part2 } = require('./day-07');

describe('Day 07 - Part 1', () => {
  it(`gets order of tasks to complete`, () => {
    const input = [
      'Step C must be finished before step A can begin.',
      'Step C must be finished before step F can begin.',
      'Step A must be finished before step B can begin.',
      'Step A must be finished before step D can begin.',
      'Step B must be finished before step E can begin.',
      'Step D must be finished before step E can begin.',
      'Step F must be finished before step E can begin.',
    ];
    expect(part1(input)).toBe('CABDFE');
  });
});

describe('Day 07 - Part 2', () => {
  it(`gets total number of seconds to complete steps`, () => {
    const input = [
      'Step C must be finished before step A can begin.',
      'Step C must be finished before step F can begin.',
      'Step A must be finished before step B can begin.',
      'Step A must be finished before step D can begin.',
      'Step B must be finished before step E can begin.',
      'Step D must be finished before step E can begin.',
      'Step F must be finished before step E can begin.',
    ];
    expect(part2(input, 2, 0)).toBe(15);
  });
});
