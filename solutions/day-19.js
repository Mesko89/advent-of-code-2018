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
  [...registers]
) {
  const increaseOP = () => (registers[operationPointerRegister] += 1);
  const getOP = () => registers[operationPointerRegister];

  const isPart2 = registers[0] === 1;

  let op = getOP();
  while (op >= 0 && op < instructions.length) {
    const { opName, args } = instructions[op];
    operations[opName](...args, registers);
    increaseOP();
    op = getOP();

    if (op === 1 && isPart2) {
      let sumOfFactors = 0;
      for (let i = 1; i <= registers[3] / 2; i++)
        if (registers[3] % i === 0) sumOfFactors += i;
      registers[0] = sumOfFactors + registers[3];
      return registers;
    }
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
    return registers[0];
  },
  part2: inputLines => {
    const program = compileProgram(inputLines);
    const registers = runInstructions(
      program.instructions,
      program.opRegister,
      [1, 0, 0, 0, 0, 0]
    );
    return registers[0];
  },
};
