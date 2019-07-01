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
 * Generates a random number of documents that meet the given array definition
 *
 * @param {object} arrayDefinition the array definition
 * @param {object} opts the configuration options
 * @returns {object[]}
 * an array that containts random documents
 */
const generateRandomArray = (arrayDefinition, opts) => {
  const array = [];
  const arrayLength = Math.floor(Math.random() * 15 + 1);

  for (let i = 0; i < arrayLength; i++) {
    if (arrayDefinition.isPathDef) {
      /* Handle arrays with primitives */
      array.push(
        generateRandomDoc({ generate: arrayDefinition }, opts).generate
      );
    } else {
      /* Handle arrays with defined objects */
      array.push(generateRandomDoc(arrayDefinition, opts));
    }
  }

  return array;
};

/**
 * Generates a document with random values (or custom values), as a spread
 *
 * @param {object} paths the schema paths definitions
 * @param {object} opts the configuration options
 * @returns {object}
 * a random document, as a spread
 */
const generateRandomDoc = (
  paths,
  opts = { applyFilter: true, returnDate: true }
) => {
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
      generatedDoc[field] = generateRandomArray(
        definition.arrayDefinition,
        opts
      );
    }
  }

  return unflatten(generatedDoc); /* Unflatten dot notation */
};

module.exports = generateRandomDoc;
