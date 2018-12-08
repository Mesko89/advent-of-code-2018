const stepIds = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const stepRx = /Step (\w+) must be finished before step (\w+) can begin\./;
function parseSteps(inputLines, baseDuration = 0) {
  return inputLines.reduce((steps, line) => {
    const [_, prerequisiteStepId, stepId] = line.match(stepRx);

    let step = steps.find(s => s.id == stepId);
    let prerequisiteStep = steps.find(s => s.id === prerequisiteStepId);

    if (!prerequisiteStep) {
      const duration = baseDuration + stepIds.indexOf(prerequisiteStepId) + 1;
      prerequisiteStep = Step(prerequisiteStepId, [], duration);
      steps.push(prerequisiteStep);
    }

    if (!step) {
      const duration = baseDuration + stepIds.indexOf(stepId) + 1;
      step = Step(stepId, [prerequisiteStep], duration);
      steps.push(step);
    } else {
      step.addPrerequisite(prerequisiteStep);
    }

    return steps;
  }, []);
}

function Step(id, prerequisites, timeToComplete) {
  let ticks = 0;

  function addPrerequisite(step) {
    prerequisites.push(step);
  }

  function tick() {
    ticks++;
  }

  function isCompleted() {
    return ticks === timeToComplete;
  }

  return {
    id,
    prerequisites,
    addPrerequisite,
    tick,
    isCompleted,
  };
}

function byId(step1, step2) {
  return step1.id > step2.id ? 1 : step1.id < step2.id ? -1 : 0;
}

function getOrderToCompleteSteps([...steps]) {
  const order = [];

  function canBeRun(step) {
    return step.prerequisites.every(s => order.includes(s));
  }

  while (steps.length) {
    const stepIndex = steps.findIndex(canBeRun);
    const step = steps[stepIndex];
    order.push(step);
    steps = [...steps.slice(0, stepIndex), ...steps.slice(stepIndex + 1)];
  }
  return order;
}

function Worker(id) {
  let workingOnStep = null;
  function workOn(step) {
    workingOnStep = step;
  }

  function isWorking() {
    return workingOnStep !== null;
  }

  function work() {
    if (workingOnStep) {
      workingOnStep.tick();
    }
  }

  function hasCompleted() {
    return workingOnStep.isCompleted();
  }

  return {
    id,
    work,
    workOn,
    step() {
      return workingOnStep;
    },
    isWorking,
    hasCompleted,
  };
}

function runSteps([...steps], workers) {
  const completed = [];
  let workingOn = [];
  let seconds = 0;

  function getNextStep() {
    function canBeRun(step) {
      return step.prerequisites.every(s => completed.includes(s));
    }
    const step = steps.find(canBeRun);
    return step;
  }

  while (steps.length > 0 || workingOn.length > 0) {
    workers.forEach(worker => {
      if (worker.isWorking()) {
        worker.work();
        if (worker.hasCompleted()) {
          const step = worker.step();
          completed.push(step);
          workingOn = workingOn.filter(s => s.id !== step.id);
          worker.workOn(null);
        }
      }
    });
    workers.forEach(worker => {
      if (!worker.isWorking()) {
        const step = getNextStep();
        if (step) {
          steps = steps.filter(s => s.id !== step.id);
          worker.workOn(step);
          workingOn.push(step);
        }
      }
    });
    seconds++;
  }

  // Last second is just checking if work has been completed
  return seconds - 1;
}

module.exports = {
  part1: inputLines => {
    const steps = parseSteps(inputLines).sort(byId);
    return getOrderToCompleteSteps(steps)
      .map(s => s.id)
      .join('');
  },
  part2: (inputLines, totalWorkers = 5, baseDuration = 60) => {
    const steps = parseSteps(inputLines, baseDuration).sort(byId);
    const workers = Array.from({ length: totalWorkers }).map((_, i) =>
      Worker(i)
    );
    return runSteps(steps, workers);
  },
};
