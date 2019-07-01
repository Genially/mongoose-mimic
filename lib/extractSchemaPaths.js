'use strict';

const generateDefinition = (path, name, schema, context) => {
  const definition = {
    type: path.instance,
    required: !!path.isRequired,
    validators: path.validators,
    default: path.defaultValue,
    isEnum: Array.isArray(path.enumValues) && path.enumValues.length,
    enum: path.enumValues,
    isPathDef: true,
    lowercase: !!path.options.lowercase,
    uppercase: !!path.options.uppercase,
    trim: !!path.options.trim
  };

  if (Array.isArray(path.validators)) {
    path.validators.forEach(val => {
      if (val.type === 'max') {
        definition.max = val.max;
      }
      if (val.type === 'min') {
        definition.min = val.min;
      }
    });
  }

  if (path.instance.toLowerCase() === 'array') {
    /* Recurse the function for array element definitions */
    definition.isArray = true;
    if (!path.schema) {
      definition.arrayDefinition = generateDefinition(path.caster);
    } else {
      definition.arrayDefinition = extractSchemaPaths(path.schema);
    }
  }

  if (path.instance.toLowerCase() === 'objectid' && path.options.ref) {
    /* Add referenced object */
    definition.ref = path.options.ref;
  }

  return definition;
};

const fillSchemePaths = function(name, schema, schemePaths) {
  /* Extract definition object from schema and path name */
  const path = schema.path(name);

  if (path) {
    return (schemePaths[name] = generateDefinition(
      path,
      name,
      schema,
      schemePaths
    ));
  }
};

const extractSchemaPaths = model => {
  const schemePaths = {};

  /* Loop over paths and extract definitions */
  if (model.schema) {
    model.schema.eachPath(path => {
      fillSchemePaths(path, model.schema, schemePaths);
    });
  } else {
    model.eachPath(path => {
      fillSchemePaths(path, model, schemePaths);
    });
  }

  return schemePaths;
};

module.exports = extractSchemaPaths;
