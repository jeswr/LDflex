import { Data } from '../types';
import { iteratorFor } from './iterableUtils';

/**
 * AsyncIterator handler that yields either the subject or all results.
 *
 * Requires:
 *  - (optional) a subject on the path data
 *  - (optional) a subject on the path proxy
 *  - (optional) results on the path proxy
 */
export default class AsyncIteratorHandler {
  handle(pathData: Data, pathProxy: Data) {
    // @ts-ignore
    const { select, subject } = pathData
    // Return a one-item iterator of the subject if present;
    // otherwise, return all results of this path
    
    // If there is a select statement, then we are iterating
    // over query results. Otherwise we iterate over the predicats
    // of the subject
    // if (select && !subject) {
      return subject ?
      () => iteratorFor(pathProxy.subject) :
      // @ts-ignore
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
