const faker = require('faker');

/**
 * Generates a random number
 */
module.exports = (max) => faker.datatype.number(max || 80);
