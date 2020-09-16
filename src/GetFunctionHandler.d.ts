/**
 * Returns a function that requests the values of multiple properties.
 * You can use this function to access properties as follows:
 * - fn() returns []
 * - fn(p1) returns [path[p1]]
 * - fn(p1, p2) returns [path[p1], path[p2]]
 * - fn([p1, p2]) returns [path[p1], path[p2]]
 * - fn(asyncIterable) returns [path[p1], path[p2]]
 * - fn({ p1: null, p2: null }) returns { p1: path[p1], p2: path[p2] }
 * Combinations of the above are possible by passing them in arrays.
 */
export default class GetFunctionHandler {
    handle(pathData: any, path: any): (...args: any[]) => any;
    readProperties(path: any, properties: any, wrapSingleValues?: boolean): any;
}
