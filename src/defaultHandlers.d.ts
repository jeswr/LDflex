import { LDflexHandler } from '../types';
import AsyncIteratorHandler from './AsyncIteratorHandler';
import DataHandler from './DataHandler';
import DeleteFunctionHandler from './DeleteFunctionHandler';
import ExecuteQueryHandler from './ExecuteQueryHandler';
import GetHandler from './GetFunctionHandler';
import InsertFunctionHandler from './InsertFunctionHandler';
import MutationExpressionsHandler from './MutationExpressionsHandler';
import PathExpressionHandler from './PathExpressionHandler';
import PredicateHandler from './PredicateHandler';
import PredicatesHandler from './PredicatesHandler';
import PreloadHandler from './PreloadHandler';
import PropertiesHandler from './PropertiesHandler';
import ReplaceFunctionHandler from './ReplaceFunctionHandler';
import SetFunctionHandler from './SetFunctionHandler';
import SortHandler from './SortHandler';
import SparqlHandler from './SparqlHandler';
import StringToLDflexHandler from './StringToLDflexHandler';
import SubjectHandler from './SubjectHandler';
import SubjectsHandler from './SubjectsHandler';
import ThenHandler from './ThenHandler';
import ToArrayHandler from './ToArrayHandler';
declare const _default: {
    __esModule: () => undefined;
    then: ThenHandler;
    [Symbol.asyncIterator]: AsyncIteratorHandler;
    get: GetHandler;
    subject: SubjectHandler;
    predicate: PredicateHandler;
    properties: PropertiesHandler;
    predicates: PredicatesHandler;
    pathExpression: PathExpressionHandler;
    sparql: SparqlHandler;
    subjects: SubjectsHandler;
    results: ExecuteQueryHandler;
    sort: SortHandler;
    sortDesc: SortHandler;
    preload: PreloadHandler;
    mutationExpressions: MutationExpressionsHandler;
    add: InsertFunctionHandler;
    set: SetFunctionHandler;
    replace: ReplaceFunctionHandler;
    delete: DeleteFunctionHandler;
    termType: LDflexHandler;
    value: LDflexHandler;
    datatype: LDflexHandler;
    language: LDflexHandler;
    canonical: LDflexHandler;
    equals: DataHandler;
    toString: DataHandler;
    valueOf: LDflexHandler;
    toPrimitive: LDflexHandler;
    prefix: LDflexHandler;
    namespace: LDflexHandler;
    fragment: LDflexHandler;
    toArray: ToArrayHandler;
    termTypes: LDflexHandler;
    values: LDflexHandler;
    datatypes: LDflexHandler;
    languages: LDflexHandler;
    prefixes: LDflexHandler;
    namespaces: LDflexHandler;
    fragments: LDflexHandler;
    every: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    find: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    forEach: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    map: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    reduce: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    reduceRight: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    reject: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    some: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    transform: {
        handle(pathData: any, path: any): (parameterFunction: Function, memo?: any) => any;
    };
    resolve: StringToLDflexHandler;
};
/**
 * A map with default property handlers.
 */
export default _default;
