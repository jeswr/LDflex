"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../types/order");
/**
 * Returns a function that creates a new path with the same values,
 * but sorted on the given property.
 * The function accepts multiple properties to sort on a deeper path.
 *
 * Requires:
 *  - a predicate on the path proxy
 *  - a sort function on the path proxy (for multi-property sorting)
 */
class SortHandler {
    constructor(order = order_1.order.ASC) {
        this.order = order;
    }
    handle(pathData, pathProxy) {
        return (...properties) => {
            // Do nothing if no sort properties were given
            if (properties.length === 0)
                return pathProxy;
            // Split off the first sort property and obtain its predicate
            const [property, ...rest] = properties;
            const { predicate } = pathProxy[property];
            // Sort on the first property, and create paths for the next one
            const childData = { property, predicate, sort: this.order };
            const childPath = pathData.extendPath(childData);
            return rest.length === 0 ? childPath : childPath.sort(...rest);
        };
    }
}
exports.default = SortHandler;
