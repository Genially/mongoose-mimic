/**
 * Creates a random data generator from the given field definition
 *
 * @param definition the field definition
 * @returns {function}
 * a random data generator, or undefined if there are no generators that meet the field definition
 */
module.exports = definition => {
  let generator = undefined;
  const type = definition.type.toLowerCase();

  switch (type) {
    case 'string':
      generator = () => require('./generateString')(definition);
      break;
    case 'number':
      generator = () => require('./generateNumber')(definition);
      break;
    case 'boolean':
      generator = () => require('./generateBoolean')(definition);
      break;
    case 'date':
      generator = () => require('./generateDate')(definition);
      break;
    case 'mixed':
      generator = () => require('./generateMixed')(definition);
      break;
    case 'objectid':
      generator = () => require('./generateObjectId')(definition);
      break;
  }

  return generator;
};
