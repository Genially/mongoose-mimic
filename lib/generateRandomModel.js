const faker = require('faker');
const flat = require('flat');
const unflatten = flat.unflatten;
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.ObjectId;
const createCustomGenerator = require('./createCustomGenerator');

const generateRandomModel = (paths, opts) => {
  let generated = {};

  if (!opts) {
    opts = {};
  }

  if (!opts.applyFilter) {
    opts.applyFilter = true;
  }

  let hasCustom = false;
  let customGenerators = {};

  if (opts.custom) {
    /* Check for custom fields */
    hasCustom = true;

    /* Create custom generators for each custom field*/
    for (let field in opts.custom) {
      let customField = opts.custom[field];
      customGenerators[field] = createCustomGenerator(customField);
    }
  }

  for (let field in paths) {
    /* Loop over paths and generated data */
    const mustIgnore =
      opts.ignore &&
      opts.ignore.findIndex(p => {
        if (typeof p === 'string') return field === p;
        else return p.test(field);
      }) !== -1;

    if (mustIgnore) {
      /* Ignore paths in opts.ignore */
      continue;
    }

    let desc = paths[field];
    if (desc.isEnum) {
      /* Handle enumerations paths */
      let randomIndex = Math.round(Math.random() * (desc.enum.length - 1));
      generated[field] = desc.enum[randomIndex];
    } else {
      let type = desc.type.toLowerCase();
      let customGenerator = customGenerators[field];
      if (hasCustom && customGenerator) {
        generated[field] = customGenerator();
        continue;
      }

      if (type === 'string') {
        generated[
          field
        ] = faker.internet.userName(); /* Default string generation */

        if (opts.applyFilter && desc.lowercase) {
          /* Handle lowercase filter */
          generated[field] = generated[field].toLowerCase();
        }
        if (opts.applyFilter && desc.uppercase) {
          /* Handle uppercase filter */
          generated[field] = generated[field].toUpperrCase();
        }
        if (opts.applyFilter && desc.trim) {
          /* Handle trim filter */
          generated[field] = generated[field].trim();
        }
      } else if (type === 'number') {
        /* Default number generation*/
        generated[field] = faker.random.number(desc.max || 80);
      } else if (type === 'date') {
        generated[field] = faker.date.recent();
        if (!opts.returnDate) {
          generated[field] = generated[field].toString();
        }
      } else if (type === 'boolean') {
        generated[field] = Math.random() < 0.5 ? false : true;
      } else if (type === 'mixed') {
        /* Handle mixed objects */
        generated[field] = {};
        let firstCity = faker.random.locale();
        let secondCity = faker.random.locale();
        generated[field][firstCity] = faker.helpers.createCard();
        generated[field][secondCity] = faker.helpers.createCard();
      } else if (type === 'objectid') {
        /* Handle ObjectId*/
        if (desc.ref) {
          generated[field] = mongoose.Types.ObjectId().toString();
        } else {
          generated[field] = mongoose.Types.ObjectId().toString();
        }
      } else if (type === 'array') {
        /*Handle array recursively */
        generated[field] = [];
        for (let i = 0; i < faker.random.number(15); i++) {
          let arrayDef = desc.arrayDefinition;
          if (arrayDef.isPathDef) {
            generated[field].push(
              generateRandomModel({ generate: desc.arrayDefinition }, opts)
                .generate
            ); /* Handle arrays with primitives */
          } else {
            generated[field].push(
              generateRandomModel(desc.arrayDefinition, opts)
            ); /* Handle arrays with defined objects */
          }
        }
      } else {
        throw 'Unsupported type ' + type;
      }
    }
  }
  return unflatten(generated); /* Unflatten dot notation */
};

module.exports = generateRandomModel;
