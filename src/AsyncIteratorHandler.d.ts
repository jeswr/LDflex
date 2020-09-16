import { Data } from '../types';
/**
 * AsyncIterator handler that yields either the subject or all results.
 *
 * Requires:
 *  - (optional) a subject on the path data
 *  - (optional) a subject on the path proxy
 *  - (optional) results on the path proxy
 */
export default class AsyncIteratorHandler {
    handle(pathData: Data, pathProxy: Data): () => any;
}
