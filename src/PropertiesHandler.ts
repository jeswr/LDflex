/**
 * Queries for all compacted predicates of a path subject
 */
import { JsonLdContextNormalized } from 'jsonld-context-parser';
import { Data } from '../types';
import { toIterablePromise } from './promiseUtils';

export default class PropertiesHandler {
  handle(pathData: Data, path) {
    return toIterablePromise(this._handle(pathData, path));
  }

  async* _handle(pathData: Data, path) {
    const contextRaw = (await pathData.settings.parsedContext) || {};
    const context = new JsonLdContextNormalized(contextRaw);
    for await (const predicate of path.predicates)
      yield context.compactIri(`${await predicate}`, true);
  }
}
