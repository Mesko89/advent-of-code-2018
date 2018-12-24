const INFECTION = 'infection';
const IMMUNE_SYSTEM = 'immune-system';

const groupRx = /(\d+) units each with (\d+) hit points (?:\((.*)\) )?with an attack that does (\d+) (\w+) damage at initiative (\d+)/;

let immuneId = 1;
let infectionId = 1;
function parseGroups(inputLines) {
  let groupType = IMMUNE_SYSTEM;
  const groups = [];
  for (const line of inputLines) {
    if (line.includes('Immune System:')) {
      groupType = IMMUNE_SYSTEM;
    } else if (line.includes('Infection:')) {
      groupType = INFECTION;
    } else {
      const matches = line.match(groupRx);
      const group = {
        id:
          groupType === INFECTION
            ? `${INFECTION}-${infectionId++}`
            : `${IMMUNE_SYSTEM}-${immuneId++}`,
        type: groupType,
        totalUnits: parseInt(matches[1], 10),
        hp: parseInt(matches[2], 10),
        immuneTo: [],
        weakTo: [],
        damage: parseInt(matches[4]),
        damageType: matches[5],
        initiative: parseInt(matches[6]),
      };

      if (matches[3]) {
        const parts = matches[3].split('; ');
        for (const part of parts) {
          if (part.includes('immune to')) {
            group.immuneTo = part.replace('immune to ', '').split(', ');
          } else if (part.includes('weak to')) {
            group.weakTo = part.replace('weak to ', '').split(', ');
          }
        }
      }

      group.effectivePower = group.totalUnits * group.damage;

      groups.push(group);
    }
  }
  return groups;
}

function byPowerAndInitiative(a, b) {
  if (a.effectivePower === b.effectivePower) {
    return b.initiative - a.initiative;
  }
  return b.effectivePower - a.effectivePower;
}

function byInitiative(a, b) {
  return b.initiative - a.initiative;
}

function calculateDamage(attacker, defender) {
  if (defender.immuneTo.includes(attacker.damageType)) return 0;
  const damage = attacker.damage * attacker.totalUnits;
  return defender.weakTo.includes(attacker.damageType) ? damage * 2 : damage;
}

function applyDamage(defender, damage) {
  const totalKilled = Math.floor(damage / defender.hp);
  defender.totalUnits -= totalKilled;
  defender.effectivePower = defender.totalUnits * defender.damage;
  return defender;
}

function selectTarget(attacker, groups, attackSelection) {
  const chosenTargets = Object.values(attackSelection);
  let best = null;
  let bestDamage = 0;
  for (const group of groups) {
    if (group.id === attacker.id) continue;
    if (group.type === attacker.type) continue;
    const damage = calculateDamage(attacker, group);
    if (bestDamage < damage && !chosenTargets.includes(group)) {
      best = group;
      bestDamage = damage;
    }
  }
  return best;
}

function getTotalUnits(groups) {
  return groups.reduce((totalUnits, g) => totalUnits + g.totalUnits, 0);
}

function fight(groups) {
  let totalInfectionGroups = groups.filter(g => g.type === INFECTION).length;
  let totalImmuneSystemGroups = groups.filter(g => g.type === IMMUNE_SYSTEM)
    .length;
  let unitsDied = true;
  while (totalImmuneSystemGroups > 0 && totalInfectionGroups > 0 && unitsDied) {
    didAttack = false;
    groups = groups.sort(byPowerAndInitiative);
    const totalUnits = getTotalUnits(groups);

    let attackSelection = {};

    for (const group of groups) {
      attackSelection[group.id] = selectTarget(group, groups, attackSelection);
    }

    groups = groups.sort(byInitiative);

    for (const group of groups) {
      if (group.totalUnits <= 0) continue;
      let target = attackSelection[group.id];
      if (target) {
        const damage = calculateDamage(group, target);
        target = applyDamage(target, damage);
      }
    }

    groups = groups.filter(g => g.totalUnits > 0);

    totalInfectionGroups = groups.filter(g => g.type === INFECTION).length;
    totalImmuneSystemGroups = groups.filter(g => g.type === IMMUNE_SYSTEM)
      .length;
    unitsDied = totalUnits !== getTotalUnits(groups);
  }

  if (!unitsDied) return [];

  return groups;
}

module.exports = {
  part1: inputLines => {
    let groups = parseGroups(inputLines);
    groups = fight(groups);
    return groups.reduce((totalUnits, group) => {
      return totalUnits + group.totalUnits;
    }, 0);
  },
  part2: inputLines => {
    const originalGroups = parseGroups(inputLines);
    let boost = 0;
    let totalUnits = 0;
    while (totalUnits <= 0) {
      boost++;
      let groups = originalGroups.map(g => {
        g = { ...g };
        if (g.type === IMMUNE_SYSTEM) {
          g.damage += boost;
          g.effectivePower = g.totalUnits * g.damage;
        }
        return g;
      });
      groups = fight(groups);
      totalUnits = groups
        .filter(g => g.type === IMMUNE_SYSTEM)
        .reduce((totalPower, group) => {
          return totalPower + group.totalUnits;
        }, 0);
    }
    return totalUnits;
  },
};
