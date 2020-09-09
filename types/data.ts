import { Quad_Subject } from 'rdf-js'
import { LDflexSettings } from './settings';
import { LDflexProxyHandler } from './handler';

// TODO: CHECK DEFINITION
export interface Data {
    parent?: null,
    subject?: Quad_Subject,
    proxy?: LDflexProxyHandler, // TODO: Check
    settings?: LDflexSettings
}