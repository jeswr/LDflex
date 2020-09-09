
Object.defineProperty(exports, '__esModule', { value: true });
exports.termToPrimitive = exports.valueToTerm = exports.joinArrays = exports.ensureArray = exports.hasPlainObjectArgs = exports.isPlainObject = exports.isAsyncIterable = void 0;
const data_model_1 = require('@rdfjs/data-model');
const xsd = 'http://www.w3.org/2001/XMLSchema#';
const xsdBoolean = `${xsd}boolean`;
const xsdDateTime = `${xsd}dateTime`;
const xsdDecimal = `${xsd}decimal`;
const xsdDouble = `${xsd}double`;
const xsdFloat = `${xsd}float`;
const xsdInteger = `${xsd}integer`;
const xsdBooleanTerm = data_model_1.namedNode(xsdBoolean);
const xsdDateTimeTerm = data_model_1.namedNode(xsdDateTime);
const xsdDecimalTerm = data_model_1.namedNode(xsdDecimal);
const xsdDoubleTerm = data_model_1.namedNode(xsdDouble);
const xsdIntegerTerm = data_model_1.namedNode(xsdInteger);
const xsdTrue = data_model_1.literal('true', xsdBooleanTerm);
const xsdFalse = data_model_1.literal('false', xsdBooleanTerm);
const xsdNaN = data_model_1.literal('NaN', xsdDoubleTerm);
const xsdInf = data_model_1.literal('INF', xsdDoubleTerm);
const xsdMinusInf = data_model_1.literal('-INF', xsdDoubleTerm);
const xsdPrimitives = {
  NaN,
  'INF': Infinity,
  '-INF': -Infinity,
};
// Checks whether the value is asynchronously iterable
function isAsyncIterable(value) {
  return value && typeof value[Symbol.asyncIterator] === 'function';
}
exports.isAsyncIterable = isAsyncIterable;
// Checks whether the value is an object without special meaning to LDflex
function isPlainObject(value) {
  return value !== null &&
        // Ignore non-objects
        typeof value === 'object' &&
        // Ignore arrays
        !Array.isArray(value) &&
        // Ignore dates
        !(value instanceof Date) &&
        // Ignore Promise instances
        typeof value.then !== 'function' &&
        // Ignore RDF/JS Term instances
        typeof value.termType !== 'string' &&
        // Ignore LDflex paths
        !isAsyncIterable(value);
}
exports.isPlainObject = isPlainObject;
// Checks whether the arguments consist of exactly one plain object
function hasPlainObjectArgs(args, allowMultiple = false) {
  const hasPlainObject = args.some(isPlainObject);
  if (hasPlainObject && !allowMultiple && args.length !== 1)
    throw new Error(`Expected only 1 plain object, but got ${args.length} arguments`);
  return hasPlainObject;
}
exports.hasPlainObjectArgs = hasPlainObjectArgs;
// Ensures that the value is an array
function ensureArray(value) {
  if (Array.isArray(value))
    return value;
  return value ? [value] : [];
}
exports.ensureArray = ensureArray;
// Joins the arrays into a single array
function joinArrays(arrays) {
  return [].concat(...arrays);
}
exports.joinArrays = joinArrays;
// Ensures the value is an RDF/JS term
function valueToTerm(value) {
  switch (typeof value) {
  // strings
  case 'string':
    return data_model_1.literal(value);
    // booleans
  case 'boolean':
    return value ? xsdTrue : xsdFalse;
    // numbers
  case 'number':
    if (Number.isInteger(value))
      return data_model_1.literal(value.toString(), xsdIntegerTerm);
    else if (Number.isFinite(value))
      return data_model_1.literal(value.toString(), xsdDecimalTerm);
    else if (value === Infinity)
      return xsdInf;
    else if (value === -Infinity)
      return xsdMinusInf;
    return xsdNaN;
    // other objects
  default:
    if (value) {
      // RDF/JS Term
      if (typeof value.termType === 'string')
        return value;
      // Date
      if (value instanceof Date)
        return data_model_1.literal(value.toISOString(), xsdDateTimeTerm);
    }
  }
  // invalid objects
  throw new Error(`Invalid object: ${value}`);
}
exports.valueToTerm = valueToTerm;
// Converts the term into a primitive value
function termToPrimitive(term) {
  const { termType, value } = term;
  // Some literals convert into specific primitive values
  if (termType === 'Literal') {
    const datatype = term.datatype.value;
    if (datatype.startsWith(xsd)) {
      switch (datatype) {
      case xsdBoolean:
        return value === 'true' || value === '1';
      case xsdInteger:
        return Number.parseInt(value, 10);
      case xsdDecimal:
        return Number.parseFloat(value);
      case xsdDouble:
      case xsdFloat:
        if (value in xsdPrimitives)
          return xsdPrimitives[value];
        return Number.parseFloat(value);
      case xsdDateTime:
        return new Date(Date.parse(value));
      default:
      }
    }
  }
  // All other nodes convert to their value
  return value;
}
exports.termToPrimitive = termToPrimitive;
