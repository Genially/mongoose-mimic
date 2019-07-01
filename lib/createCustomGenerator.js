'use strict';

const faker = require('faker');

/**
 * Creates a custom generator from a custom value
 *
 * @param {*} value custom value
 * @returns {*}
 * a function that generates the given custom value.
 * If the custom value is a function, then the function is directly returned
 */
const createCustomGeneratorFromValue = value =>
  typeof value === 'function' ? value : () => value;

/**
 * Creates a custom generator from a data type
 *
 * @param {string} type data type (Example: internet.email)
 * @returns {function}
 * a function that generates values matching the given data type
 */
const createCustomGeneratorFromType = type => {
  if (typeof type === 'string') {
    const types = type.split('.');

    if (faker[types[0]]) {
      return faker[types[0]][types[1]];
    }
  }

  throw new Error(`Invalid data type: ${type}`);
};

/**
 * Creates a custom generator from a custom field configuration
 *
 * @param {*} customField custom field configuration
 * @returns {function}
 * a function that generates values according to the given custom field configuration,
 * or undefined if the custom field configuration is invalid
 */
const createCustomGenerator = customField => {
  let customGenerator = undefined;

  if (customField.value) {
    customGenerator = createCustomGeneratorFromValue(customField.value);
  } else if (customField.type) {
    customGenerator = createCustomGeneratorFromType(customField.type);
  }

  return customGenerator;
};

module.exports = createCustomGenerator;
