import * as RDF from 'rdf-js';
import { LDflexSettings } from './settings';
import { LDflexProxyHandlers } from './handler';
export interface Data {
    property: string | undefined;
    resultsCache?: Data;
    results: Data;
    parent?: null;
    subject?: RDF.Quad_Subject;
    sparql?: string;
    predicate?: RDF.Quad_Predicate;
    proxy?: LDflexProxyHandlers;
    settings: LDflexSettings;
    extendPath(pathData: Data, path?: Data): Data;
    [Symbol.asyncIterator]?: AsyncIterableIterator<any>;
    finalClause?(v: string): [string, string, string];
    [x: string]: any;
}
