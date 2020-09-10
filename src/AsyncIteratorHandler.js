"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const iterableUtils_1 = require("./iterableUtils");
/**
 * AsyncIterator handler that yields either the subject or all results.
 *
 * Requires:
 *  - (optional) a subject on the path data
 *  - (optional) a subject on the path proxy
 *  - (optional) results on the path proxy
 */
class AsyncIteratorHandler {
    handle({ subject }, pathProxy) {
        // Return a one-item iterator of the subject if present;
        // otherwise, return all results of this path
        return subject ?
            () => iterableUtils_1.iteratorFor(pathProxy.subject) :
            () => pathProxy.results[Symbol.asyncIterator]();
    }
}
exports.default = AsyncIteratorHandler;
