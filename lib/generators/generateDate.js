'use strict';

const faker = require('faker');

/**
 * Generates a random date
 */
module.exports = () => faker.date.recent();
