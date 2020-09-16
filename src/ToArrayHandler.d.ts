import { Data } from '../types';
/**
 * Converts an asynchronously iterable path into an array.
 * This operation is parallelized
 *
 * Requires:
 * - (optional) an iterable path
 */
export default class ToArrayHandler {
    handle(pathData: Data, path: Data): (f?: (value: any, index?: number | undefined) => any) => Promise<any[]>;
}
