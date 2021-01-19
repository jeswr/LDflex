import { JsonLdContext } from 'jsonld-context-parser';
import { Data } from '../types';
/**
 * Resolves property names of a path
 * to their corresponding IRIs through a JSON-LD context.
 */
export default class JSONLDResolver {
    _context: Promise<{}>;
    /**
     * Creates a new resolver for the given context(s).
     */
    constructor(...contexts: JsonLdContext[]);
    /**
     * The JSON-LD resolver supports all string properties.
     */
    supports(property: any): boolean;
    /**
     * When resolving a JSON-LD property,
     * we create a new chainable path segment corresponding to the predicate.
     *
     * Example usage: person.friends.firstName
     */
    resolve(property: string, pathData: Data): Data;
    /**
     * When the property is called as a function,
     * it adds property-object constraints to the path.
     *
     * Example usage: person.friends.location(place).firstName
     */
    apply(args: any, pathData: any, path: any): any;
    /**
     * Expands a JSON property key into a full IRI.
     */
    expandProperty(property: any): Promise<string | import("rdf-js").NamedNode>;
    /**
     * Extends the current JSON-LD context with the given context(s).
     */
    extendContext(...contexts: any[]): Promise<void>;
    /**
     * Gets the results cache for the given predicate.
     */
    getResultsCache(pathData: any, predicate: any, reverse: any): {
        then: (onResolved: any, onRejected: any) => any;
    };
}
