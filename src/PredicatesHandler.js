"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Queries for all predicates of a path subject
 */
class PredicatesHandler {
    handle(pathData) {
        return pathData.extendPath({
            distinct: true,
            select: '?predicate',
            finalClause: queryVar => `${queryVar} ?predicate ?object.`,
            property: pathData.property,
        });
    }
}
exports.default = PredicatesHandler;
