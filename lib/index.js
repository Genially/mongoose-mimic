const extractSchemaPaths = require('./extractSchemaPaths');
const generateRandomModel = require('./generateRandomModel');

module.exports = (model, opts) => {
  let paths = extractSchemaPaths(model);
  return generateRandomModel(paths, opts);
};
