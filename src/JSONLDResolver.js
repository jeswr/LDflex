"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonld_context_parser_1 = require("jsonld-context-parser");
const data_model_1 = require("@rdfjs/data-model");
const promiseUtils_1 = require("./promiseUtils");
const valueUtils_1 = require("./valueUtils");
/**
 * Resolves property names of a path
 * to their corresponding IRIs through a JSON-LD context.
 */
class JSONLDResolver {
    /**
     * Creates a new resolver for the given context(s).
     */
    constructor(...contexts) {
        this._context = Promise.resolve({});
        this.extendContext(...contexts);
    }
    /**
     * The JSON-LD resolver supports all string properties.
     */
    supports(property) {
        return typeof property === 'string';
    }
    /**
     * When resolving a JSON-LD property,
     * we create a new chainable path segment corresponding to the predicate.
     *
     * Example usage: person.friends.firstName
     */
    resolve(property, pathData) {
        const predicate = promiseUtils_1.lazyThenable(() => this.expandProperty(property));
        const reverse = promiseUtils_1.lazyThenable(() => this._context.then(({ contextRaw }) => contextRaw[property]?.['@reverse']));
        const resultsCache = this.getResultsCache(pathData, predicate, reverse);
        const newData = { property, predicate, resultsCache, reverse, apply: this.apply };
        return pathData.extendPath(newData);
    }
    /**
     * When the property is called as a function,
     * it adds property-object constraints to the path.
     *
     * Example usage: person.friends.location(place).firstName
     */
    apply(args, pathData, path) {
        if (args.length === 0) {
            const { property } = pathData;
            throw new Error(`Specify at least one term when calling .${property}() on a path`);
        }
        // With the property constraint added, continue from the previous path
        pathData.values = args.map(valueUtils_1.valueToTerm);
        return path;
    }
    /**
     * Expands a JSON property key into a full IRI.
     */
    async expandProperty(property) {
        // JavaScript requires keys containing colons to be quoted,
        // so prefixed names would need to written as path['foaf:knows'].
        // We thus allow writing path.foaf_knows or path.foaf$knows instead.
        property = property.replace(/^([a-z][a-z0-9]*)[_$]/i, '$1:');
        // Expand the property to a full IRI
        const context = await this._context;
        // @ts-ignore
        const expandedProperty = context.expandTerm(property, true);
        if (!jsonld_context_parser_1.Util.isValidIri(expandedProperty))
            throw new Error(`The JSON-LD context cannot expand the '${property}' property`);
        return data_model_1.namedNode(expandedProperty);
    }
    /**
     * Extends the current JSON-LD context with the given context(s).
     */
    async extendContext(...contexts) {
        // @ts-ignore
        await (this._context = this._context.then(({ contextRaw }) => new jsonld_context_parser_1.ContextParser().parse([contextRaw, ...contexts])));
    }
    /**
     * Gets the results cache for the given predicate.
     */
    getResultsCache(pathData, predicate, reverse) {
        let { propertyCache } = pathData;
        return propertyCache && promiseUtils_1.lazyThenable(async () => {
            // Preloading does not work with reversed predicates
            propertyCache = !(await reverse) && await propertyCache;
            return propertyCache && propertyCache[(await predicate).value];
        });
    }
}
exports.default = JSONLDResolver;
