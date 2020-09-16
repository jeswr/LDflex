import { Data } from "../types";
/**
 * Returns a new path starting from the predicate of the current path.
 *
 * Requires:
 * - (optional) a predicate property on the path data
 */
export default class PredicateHandler {
    handle(pathData: Data): Promise<Data> | undefined;
}
