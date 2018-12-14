function simulateRecipes(onTick) {
  let elvesIndexes = [0, 1];
  const recipes = [3, 7];

  do {
    const nextRecipe = elvesIndexes.reduce(
      (quality, index) => recipes[index] + quality,
      0
    );

    if (nextRecipe >= 10) {
      recipes.push(1);
      recipes.push(nextRecipe % 10);
    } else {
      recipes.push(nextRecipe);
    }

    elvesIndexes = elvesIndexes.map(index => {
      index += 1 + recipes[index];
      return (index + recipes.length) % recipes.length;
    });
  } while (onTick(recipes));

  return recipes;
}

function getIndexOfArrayInArray(sequence, array) {
  function haveSameElements(arr1, arr2) {
    return arr1.every((v, i) => v === arr2[i]);
  }

  const tailOfArray = array.slice(array.length - sequence.length - 1);

  if (haveSameElements(sequence, tailOfArray.slice(0, sequence.length))) {
    return array.length - sequence.length - 1;
  } else if (haveSameElements(sequence, tailOfArray.slice(1))) {
    return array.length - sequence.length;
  }
  return -1;
}

module.exports = {
  part1: inputLines => {
    const totalRecipes = parseInt(inputLines[0], 10) + 10;
    const recipes = simulateRecipes(recipes => recipes.length < totalRecipes);
    return recipes
      .slice(
        totalRecipes - 10,
        recipes.length - (recipes.length - totalRecipes)
      )
      .join('');
  },
  part2: inputLines => {
    const recipeSequence = inputLines[0].split('').map(v => parseInt(v, 10));
    const recipes = simulateRecipes(
      recipes => getIndexOfArrayInArray(recipeSequence, recipes) === -1
    );
    return getIndexOfArrayInArray(recipeSequence, recipes);
  },
};
