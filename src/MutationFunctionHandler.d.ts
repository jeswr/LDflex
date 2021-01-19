import { mutation } from '../types/mutation';
/**
 * Returns a function that, when called with arguments,
 * extends the path with mutationExpressions.
 *
 * Mutation functions can be called in two equivalent ways:
 * - path.property.set(object, object)
 * - path.set({ property: [object, object] })
 * Objects can be strings, terms, or path expressions.
 * The second syntax allows setting multiple properties at once.
 * It also has `null` and `undefined` as shortcuts for the empty array,
 * and a direct value as shortcut for a single-valued array.
 *
 * Requires:
 * - a pathExpression property on the path proxy and all non-raw arguments.
 */
export default class MutationFunctionHandler {
    private _mutationType;
    private _allowZeroArgs;
    constructor(_mutationType?: mutation, // TODO: Check if this is a valid default
    _allowZeroArgs?: boolean);
    handle(pathData: any, path: any): (...args: any[]) => any;
    createMutationExpressions(pathData: any, path: any, args: any): Promise<({
        mutationType?: undefined;
        conditions?: undefined;
        predicateObjects?: undefined;
    } | {
        mutationType: mutation;
        conditions: any[];
        predicateObjects: {
            predicate: any;
            reverse: any;
            objects: any[];
        }[];
    })[] | {}[]>;
    createMutationExpression(pathData: any, path: any, values: any): Promise<{
        mutationType?: undefined;
        conditions?: undefined;
        predicateObjects?: undefined;
    } | {
        mutationType: mutation;
        conditions: any[];
        predicateObjects: {
            predicate: any;
            reverse: any;
            objects: any[];
        }[];
    }>;
    extractObjects(pathData: any, path: any, values: any): Promise<any[]>;
}
