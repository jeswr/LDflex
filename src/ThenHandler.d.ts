import { Data } from '../dist/ldflex-3/LDflex/types';
/**
 * Thenable handler that resolves to either the subject
 * of the first item of the results.
 *
 * Requires:
 *  - (optional) a subject on the path data
 *  - (optional) a subject on the path proxy
 *  - (optional) results on the path proxy
 */
export default class ThenHandler {
    handle({ subject }: Data, pathProxy: any): (onResolved: any, onRejected: any) => any;
}
