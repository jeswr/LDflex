"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const promiseUtils_1 = require("./promiseUtils");
const iterableUtils_1 = require("./iterableUtils");
/**
 * Thenable handler that resolves to either the subject
 * of the first item of the results.
 *
 * Requires:
 *  - (optional) a subject on the path data
 *  - (optional) a subject on the path proxy
 *  - (optional) results on the path proxy
 */
class ThenHandler {
    handle({ subject }, pathProxy) {
        // Resolve to either the subject (zero-length path) or the first result
        return subject ?
            // If the subject is not a promise, it has already been resolved;
            // consumers should not resolve it, but access its properties directly.
            // This avoids infinite `then` chains when `await`ing this path.
            subject.then && promiseUtils_1.getThen(() => pathProxy.subject) :
            // Otherwise, return the first result of this path
            promiseUtils_1.getThen(() => iterableUtils_1.getFirstItem(pathProxy.results));
    }
}
exports.default = ThenHandler;
