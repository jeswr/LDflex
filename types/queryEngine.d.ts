import { NamedNode, Store, Term } from "n3";
import { Algebra } from "sparqlalgebrajs";
declare type RawSources = URL | NamedNode | Store | string;
export interface queryEngine {
    execute(query: string | Algebra.Operation, sources?: Promise<RawSources> | RawSources | undefined): AsyncGenerator<Term | any, void, undefined>;
}
export {};
