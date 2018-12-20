const { part1 } = require('./day-20');

describe('Day 20 - Part 1', () => {
  const tests = [
    {
      input: ['^WNE$'],
      expect: 3,
    },
    {
      input: ['^ENWWW(NEEE|SSE(EE|N))$'],
      expect: 10,
    },
    {
      input: ['^ENNWSWW(NEWS|)SSSEEN(WNSE|)EE(SWEN|)NNN$'],
      expect: 18,
    },
    {
      input: ['^ESSWWN(E|NNENN(EESS(WNSE|)SSS|WWWSSSSE(SW|NNNE)))$'],
      expect: 23,
    },
    {
      input: [
        '^WSSEESWWWNW(S|NENNEEEENN(ESSSSW(NWSW|SSEN)|WSWWN(E|WWS(E|SS))))$',
      ],
      expect: 31,
    },
  ];
  for (const test of tests) {
    it(`gets correct distance for input "${test.input}"`, () => {
      expect(part1(test.input)).toBe(test.expect);
    });
  }
});
