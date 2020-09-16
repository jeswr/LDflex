import { Data } from "../types";
import { bindings } from "../types/bindings";
/**
 * Executes the query represented by a path.
 *
 * Requires:
 * - a queryEngine property in the path settings
 * - a sparql property on the path proxy
 * - (optional) a resultsCache property on the path data
 */
export default class ExecuteQueryHandler {
    handle(pathData: Data, path: Data): AsyncGenerator<any, void, unknown>;
    /**
     * Extracts the first term from a query result binding as a new path.
     */
    extractTerm(binding: bindings, pathData: Data): Data;
}
