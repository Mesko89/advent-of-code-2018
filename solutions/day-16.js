const { operations } = require('./cpu');

function getSamples(inputLines) {
  const samples = [];

  function getRegisters(line) {
    const [_, ...registers] = line
      .match(/\[\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*]/)
      .map(v => parseInt(v, 10));
    return registers;
  }

  function getInstruction(line) {
    const [_, ...instruction] = line
      .match(/(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/)
      .map(v => parseInt(v, 10));
    return instruction;
  }

  for (let i = 0; i < inputLines.length; i++) {
    if (inputLines[i].includes('Before: ')) {
      samples.push({
        before: getRegisters(inputLines[i]),
        instruction: getInstruction(inputLines[i + 1]),
        after: getRegisters(inputLines[i + 2]),
      });
      i += 2;
    }
  }

  return samples;
}

function getInstructions(inputLines) {
  for (let i = inputLines.length - 1; i >= 0; i--) {
    if (inputLines[i].includes('After:')) {
      inputLines = inputLines.slice(i + 1);
      break;
    }
  }

  return inputLines.map(line => line.split(/\s+/).map(v => parseInt(v, 10)));
}

function getPossibleOpNames(before, [_, ...args], after) {
  const operationNames = Object.keys(operations);
  return operationNames.filter(operationName => {
    const registers = [...before];
    operations[operationName](...args, registers);
    return registers.every((v, i) => v === after[i]);
  });
}

function analyzeSamples(samples) {
  return samples.map(({ before, instruction, after }) => {
    return {
      sample: { before, instruction, after },
      possibleOpNames: getPossibleOpNames(before, instruction, after),
    };
  });
}

function getMapOfOpCodesAndNames(analyzedSamples) {
  function toPossibleOpCodesForNames(analyzedSamples) {
    return analyzedSamples.reduce(
      (
        opCodesForOperationName,
        {
          sample: {
            instruction: [opCode],
          },
          possibleOpNames,
        }
      ) => {
        possibleOpNames.forEach(opName => {
          if (!(opName in opCodesForOperationName)) {
            opCodesForOperationName[opName] = [];
          }
          if (!opCodesForOperationName[opName].includes(opCode)) {
            opCodesForOperationName[opName].push(opCode);
          }
        });
        return opCodesForOperationName;
      },
      {}
    );
  }
  const possibleOpCodesForNames = toPossibleOpCodesForNames(analyzedSamples);

  const opCodeForOpName = {};
  const opNames = Object.keys(operations);

  while (opNames.some(opName => possibleOpCodesForNames[opName].length === 1)) {
    const opName = opNames.find(
      opName => possibleOpCodesForNames[opName].length === 1
    );
    opCodeForOpName[opName] = possibleOpCodesForNames[opName].pop();
    opNames.forEach(
      name =>
        (possibleOpCodesForNames[name] = possibleOpCodesForNames[name].filter(
          v => v !== opCodeForOpName[opName]
        ))
    );
  }

  return Object.entries(opCodeForOpName).reduce(
    (opCodeToOpNameMap, [opName, opCode]) => {
      opCodeToOpNameMap[opCode] = opName;
      return opCodeToOpNameMap;
    },
    {}
  );
}

function runInstructions(instructions, registry, opCodesToNames) {
  instructions = instructions.reverse();
  while (instructions.length) {
    const [opCode, ...args] = instructions.pop();
    operations[opCodesToNames[opCode]](...args, registry);
  }
  return registry;
}

module.exports = {
  part1: inputLines => {
    const samples = getSamples(inputLines);
    const analyzedSamples = analyzeSamples(samples);
    return analyzedSamples.filter(s => s.possibleOpNames.length >= 3).length;
  },
  part2: inputLines => {
    const samples = getSamples(inputLines);
    const analyzedSamples = analyzeSamples(samples);
    const opCodesToNames = getMapOfOpCodesAndNames(analyzedSamples);
    const instructions = getInstructions(inputLines);
    const registry = runInstructions(
      instructions,
      [0, 0, 0, 0],
      opCodesToNames
    );
    return registry[0];
  },
};
