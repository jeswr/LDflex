/**
 * Traverses a path to collect mutationExpressions into an expression.
 * This is needed because mutations can be chained.
 *
 * Requires:
 * - a mutationExpressions property on the path proxy
 */
export default class MutationExpressionsHandler {
    handle(pathData: any): Promise<any[]>;
}
