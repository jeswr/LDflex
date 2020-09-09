
Object.defineProperty(exports, '__esModule', { value: true });

/**
 * Queries for all subjects of a document
 */
class SubjectsHandler {
  handle(pathData) {
    return pathData.extendPath({
      distinct: true,
      select: '?subject',
      finalClause: () => '?subject ?predicate ?object.',
      property: pathData.property,
    });
  }
}
exports.default = SubjectsHandler;
