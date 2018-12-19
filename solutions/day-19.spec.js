const { part1 } = require('./day-19');

describe('Day 19 - Part 1', () => {
  it(`gets correct value of register #0 when it halts`, () => {
    const input = [
      '#ip 0',
      'seti 5 0 1',
      'seti 6 0 2',
      'addi 0 1 0',
      'addr 1 2 3',
      'setr 1 0 0',
      'seti 8 0 4',
      'seti 9 0 5',
    ];
    expect(part1(input)).toBe(7);
  });
});
