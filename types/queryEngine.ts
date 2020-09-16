import { NamedNode, Store, Term } from "n3";
import { Algebra } from "sparqlalgebrajs";
import { bindings } from "./bindings";

type RawSources = URL | NamedNode | Store | string
type RawSourcesString = RawSources | string
type AllSources = RawSourcesString | RawSourcesString[]

type Source = {
  value: string;
  type: string | null;
  match?: Function;
}

type Sources = Source[]

export interface queryEngine { // Async Generator definition is based on the type signature of execute in the communica engine
    execute(query: string | Algebra.Operation, sources?: Promise<RawSources> | RawSources | undefined): AsyncGenerator<Term | any, void, undefined>//Iterable<bindings>
}

