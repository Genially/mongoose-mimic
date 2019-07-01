'use strict';

const flat = require('flat');
const unflatten = flat.unflatten;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const createCustomGenerator = require('./createCustomGenerator');
const createBasicGenerator = require('./generators');

/**
 * Creates the corresponding data generators from the given custom fields options
 *
 * @param {object} customOpts the custom fields options
 * @returns {object}
 * an object with the custom generator of each field, with the following format:
 * {
 *   <field name>: <custom generator>
 * }
 */
const createCustomGenerators = (customOpts = {}) => {
  const customGenerators = {};

  for (let field in customOpts) {
    let customField = customOpts[field];
    customGenerators[field] = createCustomGenerator(customField);
  }

  return customGenerators;
};

/**
 * Checks if the given field must be ignored
 *
 * @param {string} field the field name
 * @param {object} ignoreOpts the ignore options
 * @returns {boolean}
 * true if the field must be ignored, false otherwise
 */
const fieldMustBeIgnored = (field, ignoreOpts = []) =>
  ignoreOpts.findIndex(element => {
    if (typeof element === 'string') return field === element;
    else return element.test(field);
  }) !== -1;

/**
 * Returns a random value from the given enum
 *
 * @param {string[]} enumDefinition array that contains all enum values
 * @returns {string}
 * an enum value
 */
const selectRandomEnum = enumDefinition => {
  const randomIndex = Math.round(Math.random() * (enumDefinition.length - 1));
  return enumDefinition[randomIndex];
};

/**
 * Generates a document with random values (or custom values), as a spread
 *
 * @param {*} paths the schema paths definitions
 * @param {*} opts the configuration options
 * @returns {object}
 * a random document, as a spread
 */
const generateRandomDoc = (paths, opts = {}) => {
  opts.applyFilter = opts.applyFilter || true;
  opts.returnDate = opts.returnDate || true;
  const customGenerators = createCustomGenerators(opts.custom);

  const generatedDoc = {};
  for (let field in paths) {
    if (fieldMustBeIgnored(field, opts.ignore)) {
      continue;
    }

    let definition = paths[field];

    if (definition.isEnum) {
      generatedDoc[field] = selectRandomEnum(definition.enum);
      continue;
    }

    let generateCustomValue = customGenerators[field];
    if (generateCustomValue) {
      generatedDoc[field] = generateCustomValue();
      continue;
    }

    let generateRandomValue = createBasicGenerator(definition);
    let type = definition.type.toLowerCase();

    if (generateRandomValue) {
      generatedDoc[field] = generateRandomValue();

      if (type === 'date' && !opts.returnDate) {
        generatedDoc[field] = generatedDoc[field].toString();
      }

      continue;
    }

    if (type === 'array') {
      generatedDoc[field] = [];
      let arrayLength = Math.floor(Math.random() * 15 + 1);

      for (let i = 0; i < arrayLength; i++) {
        let arrayDef = definition.arrayDefinition;
        if (arrayDef.isPathDef) {
          generatedDoc[field].push(
            generateRandomDoc({ generate: definition.arrayDefinition }, opts)
          ).generate; /* Handle arrays with primitives */
        } else {
          generatedDoc[field].push(
            generateRandomDoc(definition.arrayDefinition, opts)
          ); /* Handle arrays with defined objects */
        }
      }
    }
  }

  return unflatten(generatedDoc); /* Unflatten dot notation */
};

module.exports = generateRandomDoc;
