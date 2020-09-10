"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Queries for all compacted predicates of a path subject
 */
const jsonld_context_parser_1 = require("jsonld-context-parser");
const promiseUtils_1 = require("./promiseUtils");
class PropertiesHandler {
    handle(pathData, path) {
        return promiseUtils_1.toIterablePromise(this._handle(pathData, path));
    }
    async *_handle(pathData, path) {
        const contextRaw = (await pathData.settings.parsedContext) || {};
        const context = new jsonld_context_parser_1.JsonLdContextNormalized(contextRaw);
        for await (const predicate of path.predicates)
            yield context.compactIri(`${await predicate}`, true);
    }
}
exports.default = PropertiesHandler;
