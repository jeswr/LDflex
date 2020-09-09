
Object.defineProperty(exports, '__esModule', { value: true });
const valueUtils_1 = require('./valueUtils');

/**
 * Converts an asynchronously iterable path into an array.
 *
 * Requires:
 * - (optional) an iterable path
 */
class ToArrayHandler {
  handle(pathData, path) {
    // console.log('path', path)
    // return async f => map(path, f ?? (async item => await item))
    return async map => {
      const items = [];
      if (valueUtils_1.isAsyncIterable(path)) {
        // Ensure the mapping function is valid
        if (typeof map !== 'function')
          map = item => item;
        // Retrieve and map all elements
        let index = 0;
        for await (const item of path)
          items.push(await map(item, index++));
      }
      return items;
    };
  }
}
exports.default = ToArrayHandler;
