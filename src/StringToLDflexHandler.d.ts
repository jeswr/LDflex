import { Data } from "../types";
/**
 * Yields a function that interprets a string expression as an LDflex path.
 */
export default class StringToLDflexHandler {
    handle(pathData: Data, path: Data): (expression?: string, ldflex?: Data) => any;
}
