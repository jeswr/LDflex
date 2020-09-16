import { order as orderEnum } from '../types/order';
/**
 * Returns a function that creates a new path with the same values,
 * but sorted on the given property.
 * The function accepts multiple properties to sort on a deeper path.
 *
 * Requires:
 *  - a predicate on the path proxy
 *  - a sort function on the path proxy (for multi-property sorting)
 */
export default class SortHandler {
    private order;
    constructor(order?: orderEnum);
    handle(pathData: any, pathProxy: any): (...properties: any[]) => any;
}
