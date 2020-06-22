/**
 * @function Count
 *
 * @param {number} input - Number to count its bits on its bit representation.
 * @returns {array} Containing the amount of bits found on the first index, followed by the index of each bit.
 */
function Count(input) {
  if (input < 0) {
    throw new RangeError("Cannot be a negative number");
  }
  const bitRepresentation = input
    .toString(2)
    .split("")
    .reduce((reversed, character) => character + reversed, "");

  return getIndexes(bitRepresentation);
}

/**
 * @function getIndexes
 *
 * @param {string} bitRepresentation
 * @returns {array} Containing the amount of bits found on the first index, followed by the index of each bit.
 */
function getIndexes(bitRepresentation) {
  let indexes = [];
  for (let i = 0; i < bitRepresentation.length; i++) {
    if (bitRepresentation[i] === "1") {
      indexes = [...indexes, i];
    }
  }
  return [indexes.length, ...indexes];
}

module.exports = { Count };
