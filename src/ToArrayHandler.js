"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
/**
 * Converts an asynchronously iterable path into an array.
 * This operation is parallelized
 *
 * Requires:
 * - (optional) an iterable path
 */
class ToArrayHandler {
    handle(pathData, path) {
        return async (f = item => item) => Promise.all((await async_1.map(path, async (item) => item)).map(async (v, i) => f(await v, i)));
    }
}
exports.default = ToArrayHandler;
