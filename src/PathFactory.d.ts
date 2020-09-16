import JSONLDResolver from './JSONLDResolver';
import { LDflexHandleFunction, LDflexHandler, LDflexProxyHandlers } from '../types/handler';
import { Data } from '../types/data';
import { LDflexSettings } from '../types';
import { Resolver } from '../types/Resolver';
/**
 * A PathFactory creates paths with default settings.
 */
export default class PathFactory {
    private _pathProxy;
    private _settings;
    private _data;
    static defaultHandlers: LDflexProxyHandlers;
    constructor(settings: LDflexSettings, data?: Data);
    /**
     * Creates a path with the given (optional) settings and data.
     */
    create(settings?: {}, data?: Data): {
        [x: string]: any;
        property: string | undefined;
        resultsCache?: Data | undefined;
        results: Data;
        parent?: null | undefined;
        subject?: import("rdf-js").NamedNode | import("rdf-js").BlankNode | import("rdf-js").Variable | undefined;
        sparql?: string | undefined;
        predicate?: import("rdf-js").NamedNode | import("rdf-js").Variable | undefined;
        proxy?: {
            readonly [x: string]: LDflexHandler;
            readonly [Symbol.asyncIterator]: AsyncIterableIterator<any>;
        } | {
            readonly __esModule: () => undefined;
        } | undefined;
        settings: LDflexSettings;
        extendPath(pathData: Data, path?: Data | undefined): Data;
        finalClause?(v: string): [string, string, string];
    };
}
/**
 * Converts a handler function into a handler object.
 */
export declare function toHandler(handle: LDflexHandler | LDflexHandleFunction): LDflexHandler;
/**
 * Converts a resolver function into a catch-all resolver object.
 */
export declare function toResolver(resolve: JSONLDResolver | JSONLDResolver['resolve']): Resolver;
