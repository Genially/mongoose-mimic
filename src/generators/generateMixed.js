const faker = require('faker');

/**
 * Generates a random object
 */
module.exports = () => {
  const mixed = {};
  const firstCity = faker.random.locale();
  const secondCity = faker.random.locale();
  mixed[firstCity] = faker.helpers.createCard();
  mixed[secondCity] = faker.helpers.createCard();
  return mixed;
};
