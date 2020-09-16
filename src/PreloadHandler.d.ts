import { Data } from "../types";
/**
 * Returns a function that preloads and caches
 * certain properties of results on the current path.
 *
 * Requires:
 * - a predicate handler on the path proxy
 * - a queryEngine property in the path settings
 *
 * Creates:
 * - a resultsCache property on the path data
 */
export default class PreloadHandler {
    /**
     * Creates a preload function.
     */
    handle(pathData: Data, pathProxy: any): (...properties: string[]) => Promise<any>;
    /**
     * Creates a cache for the results of
     * resolving the given predicates against the path.
     */
    createResultsCache(predicates: string[], pathData: Data, path: Data): Promise<unknown[]>;
    /**
     * Creates the query for preloading the given predicates on the path
     */
    createQuery(predicates: any, path: any): Promise<{
        query: any;
        vars: any;
        resultVar: string;
    }>;
}
