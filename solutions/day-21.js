const { operations } = require('./cpu');

function compileProgram(inputLines) {
  const [opRegisterMeta, ...program] = inputLines;
  const [_, opRegister] = opRegisterMeta.split(' ').map(v => parseInt(v, 10));
  const instructions = program.map(line => {
    const [opName, ...args] = line.split(/\s+/);
    return {
      opName,
      args: args.map(v => parseInt(v, 10)),
    };
  });
  return {
    opRegister,
    instructions,
  };
}

function runInstructions(
  instructions,
  operationPointerRegister,
  [...registers],
  isPart2
) {
  const increaseOP = () => (registers[operationPointerRegister] += 1);
  const getOP = () => registers[operationPointerRegister];

  let op = getOP();
  let seen = new Set();
  while (op >= 0 && op < instructions.length) {
    if (op === 28) {
      if (!isPart2) return registers;
      if (seen.has(registers[5])) return last;
      seen.add(registers[5]);
      last = [...registers];
    }
    const { opName, args } = instructions[op];
    operations[opName](...args, registers);
    increaseOP();
    op = getOP();
  }
  return registers;
}

module.exports = {
  part1: inputLines => {
    const program = compileProgram(inputLines);
    const registers = runInstructions(
      program.instructions,
      program.opRegister,
      [0, 0, 0, 0, 0, 0]
    );
    return registers[5];
  },
  part2: inputLines => {
    const program = compileProgram(inputLines);
    const registers = runInstructions(
      program.instructions,
      program.opRegister,
      [0, 0, 0, 0, 0, 0],
      true
    );
    return registers[5];
  },
};
