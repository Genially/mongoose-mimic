const faker = require('faker');

/**
 * Generates a random string
 */
module.exports = ({ uppercase, lowercase, trim }) => {
  let randomString = faker.internet.userName();

  if (lowercase) {
    randomString = randomString.toLowerCase();
  }

  if (uppercase) {
    randomString = randomString.toUpperCase();
  }

  if (trim) {
    randomString = randomString.trim();
  }

  return randomString;
};
