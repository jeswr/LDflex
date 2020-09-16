import { LDflexProxyHandlers } from "../types/handler";
import { Data } from "../types/data";
import { Resolver } from "../types/Resolver";
/**
 * A PathProxy creates path expressions,
 * to which functionality can be attached.
 *
 * To users, these paths act as regular JavaScript objects
 * (such as `path.foo.bar.prop`) thanks to Proxy.
 * Behind the scenes, they carry around internal data
 * that can be used to influence their functionality.
 *
 * A path's functionality is realized by:
 * - handlers, which handle a specific named property
 * - resolvers, which can handle arbitrary properties
 * Only handlers and resolvers see the internal data.
 *
 * A path can have arbitrary internal data fields, but these are reserved:
 * - settings, an object that is passed on as-is to child paths
 * - proxy, a reference to the proxied object the user sees
 * - parent, a reference to the parent path
 * - apply, a function the will be invoked when the path is called as a function
 * - extendPath, a method to create a child path with this path as parent
 */
export default class PathProxy {
    private _handlers;
    private _resolvers;
    constructor({ handlers, resolvers }?: {
        handlers?: LDflexProxyHandlers;
        resolvers?: Resolver[];
    });
    /**
     * Creates a path Proxy with the given settings and internal data fields.
     */
    createPath(settings: {} | undefined, data: Data): {
        [x: string]: any;
        property: string | undefined;
        resultsCache?: Data | undefined;
        results: Data;
        parent?: null | undefined;
        subject?: import("rdf-js").NamedNode | import("rdf-js").BlankNode | import("rdf-js").Variable | undefined;
        sparql?: string | undefined;
        predicate?: import("rdf-js").NamedNode | import("rdf-js").Variable | undefined;
        proxy?: {
            readonly [x: string]: import("../types/handler").LDflexHandler;
            readonly [Symbol.asyncIterator]: AsyncIterableIterator<any>;
        } | {
            readonly __esModule: () => undefined;
        } | undefined;
        settings: import("../types").LDflexSettings;
        extendPath(pathData: Data, path?: Data | undefined): Data;
        finalClause?(v: string): [string, string, string];
    };
    /**
     * Handles access to a property
     */
    get(pathData: Data, property: string): any;
}
