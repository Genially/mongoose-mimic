'use strict';

/**
 * Generates the definition from the given mongoose schema path
 *
 * @param {*} path the mongoose schema path
 * @return {object}
 *  an object with the information of the given schema path in the following format:
 * {
 *  type: String <type name>,
 *  required: Boolean <this path is required>,
 *  validators: Array <defined validation functions>,
 *  default: Mixed <default path value>,
 *  isEnum: Boolean <if path only accepts enumerations>,
 *  enum: Array <path enumration if isEnum>,
 *  isPathDef: Boolean <if it is a path definition object>,
 *  lowercase: Boolean <lowercase filter>,
 *  uppercase: Boolean <uppercase filter>,
 *  trim: Boolean <trim text filter>,
 *  max: Number <Maximum value if has maximum>,
 *  min: Number <Minimum value if has minimum>,
 *  isArray: Boolean <if the path is an array>
 *  arrayDefinition: Object <Path Definition Object for array element>
 *  ref: String <Referenced object if has reference>
 * }
 */
const generateDefinition = path => {
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

/**
 * Extracts all schema path definitions from the given moongose model
 *
 * @param {*} model mongoose model object
 * @returns {object}
 * an object with the definition of each schema path with the following format:
 * {
 *   <path name>: <path definition>
 * }
 */
const extractSchemaPaths = model => {
  const schemaPaths = {};
  const schema = model.schema || model;

  schema.eachPath(pathName => {
    const path = schema.path(pathName);

    if (path) {
      schemaPaths[pathName] = generateDefinition(path);
    }
  });

  return schemaPaths;
};

module.exports = extractSchemaPaths;
