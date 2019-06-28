const extractSchemaPaths = model => {
  let res = {}; /* Final return element */
  let _generateReturnObj = (path, name, schema, context) => {
    /* Generate definition for a single path */
    let result = {
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
          result.max = val.max;
        }
        if (val.type === 'min') {
          result.min = val.min;
        }
      });
    }
    if (path.instance.toLowerCase() === 'array') {
      /* Recurse the function for array element definitions */
      result.isArray = true;
      if (!path.schema) {
        result.arrayDefinition = _generateReturnObj(path.caster);
      } else {
        result.arrayDefinition = extractSchemaPaths(path.schema);
      }
    }
    if (path.instance.toLowerCase() === 'objectid' && path.options.ref) {
      /* Add referenced object */
      result.ref = path.options.ref;
    }
    return result;
  };
  let _fillObject = function(name, schema, context) {
    /* Extract definition object from schema and path name */
    let path = schema.path(name);

    if (path) {
      return (context[name] = _generateReturnObj(path, name, schema, context));
    }
  };

  /* Loop over paths and extract definitions */
  if (model.schema) {
    model.schema.eachPath(function(path) {
      _fillObject(path, model.schema, res);
    });
  } else {
    model.eachPath(function(path) {
      _fillObject(path, model, res);
    });
  }

  return res;
};

module.exports = extractSchemaPaths;
