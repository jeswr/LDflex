/**
 * Traverses a path to collect links and nodes into an expression.
 */
export default class PathExpressionHandler {
    handle(pathData: any): Promise<({
        predicate: any;
        reverse: any;
        sort: any;
        values: any;
        subject?: undefined;
    } | {
        subject: any;
        predicate?: undefined;
        reverse?: undefined;
        sort?: undefined;
        values?: undefined;
    })[]>;
}
