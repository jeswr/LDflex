import { Algebra } from "sparqlalgebrajs";
import { bindings } from "./bindings";

export interface queryEngine {
    execute(query: string | Algebra.Operation): Iterable<bindings>
}