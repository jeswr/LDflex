/**
 * Returns a function that deletes the given value
 * for the path, and then adds the given values to the path.
 *
 * Requires:
 * - a delete function on the path proxy.
 * - an add function on the path proxy.
 */
export default class ReplaceFunctionHandler {
    handle(pathData: any, path: any): (oldValue: any, ...newValues: any[]) => any;
}
