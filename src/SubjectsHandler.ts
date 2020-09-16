import { Data } from "../types";

/**
 * Queries for all subjects of a document
 */
export default class SubjectsHandler {
  handle(pathData: Data) {
    return pathData.extendPath({
      distinct: true,
      select: '?subject',
      finalClause: () => ['subject', 'predicate', 'object'],
      property: pathData.property,
    });
  }
}
