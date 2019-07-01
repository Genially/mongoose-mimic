const extractSchemaPaths = require('./extractSchemaPaths');
const generateRandomDoc = require('./generateRandomDoc');

module.exports = (model, opts) => {
  const paths = extractSchemaPaths(model);
  return generateRandomDoc(paths, opts);
};
