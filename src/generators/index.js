const generateString = require('./generateString');
const generateNumber = require('./generateNumber');
const generateBoolean = require('./generateBoolean');
const generateDate = require('./generateDate');
const generateMixed = require('./generateMixed');
const generateObjectId = require('./generateObjectId');

/**
 * Creates a random data generator from the given field definition
 *
 * @param definition the field definition
 * @returns {function}
 * a random data generator, or undefined if there are no generators that meet the field definition
 */
module.exports = (definition) => {
  let generator;
  const type = definition.type.toLowerCase();

  switch (type) {
    case 'string':
      generator = () => generateString(definition);
      break;
    case 'number':
      generator = () => generateNumber(definition);
      break;
    case 'boolean':
      generator = () => generateBoolean(definition);
      break;
    case 'date':
      generator = () => generateDate(definition);
      break;
    case 'mixed':
      generator = () => generateMixed(definition);
      break;
    case 'objectid':
      generator = () => generateObjectId(definition);
      break;
    default:
      throw new Error(`Invalid definition type: ${type}`);
  }

  return generator;
};
