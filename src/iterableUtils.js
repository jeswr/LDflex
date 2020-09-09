
Object.defineProperty(exports, '__esModule', { value: true });
exports.iteratorFor = exports.getFirstItem = exports.iterableToArray = void 0;
const done = {};

/**
 * Returns the elements of the iterable as an array
 */
async function iterableToArray(iterable) {
  const items = [];
  for await (const item of iterable)
    items.push(item);
  return items;
}
exports.iterableToArray = iterableToArray;

/**
 * Gets the first element of the iterable.
 */
function getFirstItem(iterable) {
  const iterator = iterable[Symbol.asyncIterator]();
  return iterator.next().then(item => item.value);
}
exports.getFirstItem = getFirstItem;

/**
 * Creates an async iterator with the item as only element.
 */
function iteratorFor(item) {
  return {
    async next() {
      if (item !== done) {
        const value = await item;
        item = done;
        return { value };
      }
      return { done: true };
    },
  };
}
exports.iteratorFor = iteratorFor;
