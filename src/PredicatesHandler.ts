import { Data } from "../types";

/**
 * Queries for all predicates of a path subject
 */
export default class PredicatesHandler {
  handle(pathData: Data) {
    // @ts-ignore
    return pathData.extendPath({
      distinct: true,
      select: '?predicate',
      finalClause: queryVar => [queryVar, 'predicate', 'object'],
      property: pathData.property,
    });
  }
}
