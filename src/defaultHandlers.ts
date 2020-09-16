import * as RDF from 'rdf-js';
import { Data, LDflexHandleFunction, LDflexHandler } from '../types';
import { order } from '../types/order';
import AsyncIteratorHandler from './AsyncIteratorHandler';
import DataHandler from './DataHandler';
import DeleteFunctionHandler from './DeleteFunctionHandler';
import ExecuteQueryHandler from './ExecuteQueryHandler';
import GetHandler from './GetFunctionHandler';
import InsertFunctionHandler from './InsertFunctionHandler';
import * as IterableMethods from './IterableMethodsHandler';
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
import { termToPrimitive } from './valueUtils';
/**
 * A map with default property handlers.
 */
export default {
  // Flag to loaders that exported paths are not ES6 modules
  __esModule: () => undefined,

  // Add thenable and async iterable behavior
  then: new ThenHandler(),
  [Symbol.asyncIterator]: new AsyncIteratorHandler(),

  // Add read and query functionality
  get: new GetHandler(),
  subject: new SubjectHandler(),
  predicate: new PredicateHandler(),
  properties: new PropertiesHandler(),
  predicates: new PredicatesHandler(),
  pathExpression: new PathExpressionHandler(),
  sparql: new SparqlHandler(),
  subjects: new SubjectsHandler(),
  results: new ExecuteQueryHandler(),
  sort: new SortHandler(order.ASC),
  sortDesc: new SortHandler(order.DESC),
  preload: new PreloadHandler(),

  // Add write functionality
  mutationExpressions: new MutationExpressionsHandler(),
  add: new InsertFunctionHandler(),
  set: new SetFunctionHandler(),
  replace: new ReplaceFunctionHandler(),
  delete: new DeleteFunctionHandler(),

  // Add RDFJS term handling
  termType: termPropertyHandler('termType'),
  value: termPropertyHandler('value'),
  datatype: termPropertyHandler('datatype'),
  language: termPropertyHandler('language'),
  canonical: termPropertyHandler('canonical'),
  equals: DataHandler.sync('subject', 'equals'),
  toString: DataHandler.syncFunction('subject', 'value'),
  valueOf: subjectToPrimitiveHandler(),
  toPrimitive: subjectToPrimitiveHandler(),

  // TODO: unit tests
  // URI Handlers
  prefix: subjectToComponentsHandler('prefix'),
  namespace: subjectToComponentsHandler('namespace'),
  fragment: subjectToComponentsHandler('fragment'),

  // Add iteration helpers
  toArray: new ToArrayHandler(),
  termTypes: handler((_, path) => path.toArray((term: RDF.Term) => term.termType)),
  values: handler((_, path) => path.toArray((term: RDF.Term) => term.value)),
  datatypes: handler((_, path) => path.toArray((term: RDF.Literal) => term.datatype)),
  languages: handler((_, path) => path.toArray((term: RDF.Literal) => term.language)),

  // Add more iteration helpers
  prefixes: handler((_, path) => path.toArray(subjectToComponentsHandler('prefix'))),
  namespaces: handler((_, path) => path.toArray(subjectToComponentsHandler('namespace'))),
  fragments: handler((_, path) => path.toArray(subjectToComponentsHandler('fragment'))),

  // Further async/iteration helpers
  every: new IterableMethods.every(),
  find: new IterableMethods.find(),
  forEach: new IterableMethods.forEach(),
  map: new IterableMethods.map(),
  reduce: new IterableMethods.reduce(),
  reduceRight: new IterableMethods.reduceRight(),
  reject: new IterableMethods.reject(),
  some: new IterableMethods.some(),
  transform: new IterableMethods.transform(),

  // Parse a string into an LDflex object
  resolve: new StringToLDflexHandler(),
};

// Creates a handler from the given function
function handler(handle: LDflexHandleFunction): LDflexHandler {
  return { handle };
}



// Creates a handler for the given RDF/JS Term property
function termPropertyHandler(property: 'termType' | 'value' | 'language' | 'datatype' | 'canonical') {
  // If a resolved subject is present,
  // behave as an RDF/JS term and synchronously expose the property;
  // otherwise, return a promise to the property value
  return handler(({ subject }: Data, path) =>
  // @ts-ignore
    (subject && (property in subject)) ? subject[property] :
    // @ts-ignore
      path?.then((term: RDF.Term) => term?.[property]));
}

function subjectToComponentsHandler(component: 'namespace' | 'fragment' | 'prefix') {

  return handler(async ({ subject, prefixes = {} }: Data, path): Promise<string | undefined> => {
    if (subject?.termType === 'NamedNode') {
      if (component === 'namespace') {
        return /^[^]*[#\/]/.exec(subject.value)?.[0]
      } else if (component === 'fragment') {
        return /(?![\/#])[^\/#]*$/.exec(subject.value)?.[0]
      } else if (component === 'prefix') {
        const ns = /^[^]*[#\/]/.exec(subject.value)?.[0]
        const pref = ns ? prefixes[ns] : undefined
        try {
          // TODO: Get prefixes from the engines first (if possible)
          const prefix =  pref ?? /[a-z]*$/i.exec((await fetch(`http://prefix.cc/reverse?uri=${ns}`)).url)?.[0] ?? undefined;
          ns && prefix &&  (prefixes[ns] = prefix);
          return prefix
        } catch {
          return undefined
        }
      }
    } else
      return undefined
  })

}

// Creates a handler that converts the subject into a primitive
function subjectToPrimitiveHandler() {
  return handler(({ subject }) => () =>
    typeof subject?.termType !== 'string' ?
      undefined : termToPrimitive(subject));
}
