'use strict';

const faker = require('faker');

/**
 * Generates a random number
 */
module.exports = max => faker.random.number(max || 80);
