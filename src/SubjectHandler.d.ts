import { Data } from "../types";
/**
 * Returns a new path starting from the subject of the current path.
 *
 * Requires:
 * - (optional) a subject property on the path data
 * - (optional) a parent property on the path data
 */
export default class SubjectHandler {
    handle(pathData: Data): Promise<Data> | undefined;
}
