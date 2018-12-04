function count(array, filterFn) {
  if (!array) return 0;
  return array.filter(filterFn).length;
}

module.exports = {
  count,
};
