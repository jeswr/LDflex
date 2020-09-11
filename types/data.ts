import * as RDF from 'rdf-js'
import { LDflexSettings } from './settings';
import { LDflexProxyHandlers } from './handler';

// TODO: CHECK DEFINITION
export interface Data {
    parent?: null,
    subject?: RDF.Quad_Subject,
    predicate?: RDF.Quad_Predicate,
    proxy?: LDflexProxyHandlers, // TODO: Check
    settings?: LDflexSettings,
    extendPath?(pathData: Data, path)
}