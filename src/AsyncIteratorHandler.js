"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterableUtils_1 = require("./iterableUtils");
/**
 * AsyncIterator handler that yields either the subject or all results.
 *
 * Requires:
 *  - (optional) a subject on the path data
 *  - (optional) a subject on the path proxy
 *  - (optional) results on the path proxy
 */
class AsyncIteratorHandler {
    handle(pathData, pathProxy) {
        const { select, subject } = pathData;
        // Return a one-item iterator of the subject if present;
        // otherwise, return all results of this path
        // If there is a select statement, then we are iterating
        // over query results. Otherwise we iterate over the predicats
        // of the subject
        // if (select && !subject) {
        return subject ?
            () => iterableUtils_1.iteratorFor(pathProxy.subject) :
            () => pathProxy.results[Symbol.asyncIterator]();
        // } else {
        //   return pathData.execute(`
        //   SELECT DISTINCT ?p WHERE { ?s ?p ?o }
        //   `)
        //   // TODO MAKE THIS WORK
        //   return () => pathProxy.extendPath({
        //     distinct: true,
        //     select: '?predicate',
        //     finalClause: () => [subject?.value, 'predicate', 'object'],
        //     property: pathProxy.property,
        //   });
        // }
    }
}
exports.default = AsyncIteratorHandler;
