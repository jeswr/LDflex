import * as RDF from 'rdf-js'
import { LDflexSettings } from './settings';
import { LDflexProxyHandlers } from './handler';

// TODO: CHECK DEFINITION
export interface Data {
    property: string | undefined;
    resultsCache?: Data; // TODO: Check - is this optional,
    results: Data; // TODO CHECK
    parent?: null,
    subject?: RDF.Quad_Subject,
    sparql?: string,
    predicate?: RDF.Quad_Predicate,
    proxy?: LDflexProxyHandlers, // TODO: Check
    settings: LDflexSettings,
    // TODO: Check below definition
    extendPath(pathData: Data, path?: Data): Data,
    [Symbol.asyncIterator]?: AsyncIterableIterator<any>, // TODO: CHECK - is this optional
    //[x: string]: any // TODO FIX - make better for path property access
    finalClause?(v: string): [string, string, string] // Generates the final clause for a sparql query
    [x: string]: any; // TODO make this stricter?
}