const { part1, part2 } = require('./day-24');
const input = [
  'Immune System:',
  '17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2',
  '989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3',
  'Infection:',
  '801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1',
  '4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4',
];

describe('Day 24 - Part 1', () => {
  it(`gets number units of winning army`, () => {
    expect(part1(input)).toBe(5216);
  });
});

describe('Day 24 - Part 2', () => {
  it(`gets minimum number of units of immune system after a smallest boost`, () => {
    expect(part2(input)).toBe(51);
  });
});
