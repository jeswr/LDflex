/**
 * Expresses a path or mutation as a SPARQL query.
 *
 * Requires:
 * - a mutationExpressions or pathExpression property on the path proxy
 */
export default class SparqlHandler {
    handle(pathData: any, path: any): Promise<string>;
    pathExpressionToQuery(pathData: any, path: any, pathExpression: any): Promise<string>;
    mutationExpressionToQuery({ mutationType, conditions, predicateObjects }: {
        mutationType: any;
        conditions: any;
        predicateObjects: any;
    }): string;
    expressionToTriplePatterns([root, ...pathExpression]: [any, ...any[]], lastVar: any, scope?: {}): {
        queryVar: string;
        sorts: any[];
        clauses: any[];
    };
    createVar(suggestion: string, scope: any): string;
    termToString(term: any): string;
    triplePatterns(subjectString: any, predicateTerm: any, objectStrings: any, reverse?: boolean): string[];
}
