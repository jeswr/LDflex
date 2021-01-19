import JSONLDResolver from './JSONLDResolver';
import { LDflexHandleFunction, LDflexHandler, LDflexProxyHandlers } from '../types/handler';
import { Data } from '../types/data';
import { LDflexSettings } from '../types';
import { Resolver } from '../types/Resolver';
/**
 * A PathFactory creates paths with default settings.
 */
export default class PathFactory {
    subjects: any;
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
        property: string;
        resultsCache?: Data;
        results: Data;
        parent?: null;
        subject?: import("rdf-js").Quad_Subject;
        sparql?: string;
        predicate?: import("rdf-js").Quad_Predicate;
        proxy?: LDflexProxyHandlers;
        settings: LDflexSettings;
        extendPath(pathData: Data, path?: Data): Data;
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
