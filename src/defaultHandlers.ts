import { namedNode } from '@rdfjs/data-model';
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

class PredicatesOf { // TOFO PROPERLy
  constructor(
    private normal: boolean = true,
    private inverse: boolean = false
  ) { }
  handle(pathData: Data) {
    console.log("----------------------------------------------------------", pathData.subject)
    return pathData.extendPath({
      distinct: true,
      select: '?predicate',
      // @ts-ignore
      finalClause: async queryVar => [await pathData.subject, 'predicate', 'object'],
      property: pathData.property,
    });
  }
}

/**
 * Allows users to execute their own query
 * through the query engine
//  */
// class QueryHandler {
//   constructor() {

//   }
//   handle(pathData: Data)   {
//     return pathData.extendPath({

//     })
//   }
// }

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
  toRDFPrimitive: subjectToPrimitiveHandler_4(),
  list: subjectToPrimitiveHandler_2(),//subjectToListHandler(),
  container: subjectToPrimitiveHandler_3(false),
  containerAsSet: subjectToPrimitiveHandler_3(true),

  // Further utils
  predicatesOf: new PredicatesOf(),

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
  // @ts-ignore
  prefixes: handler((_, path) => path.toArray(subject => subjectToComponentsHandler('prefix').handle({ subject }))),
  // @ts-ignore
  namespaces: handler((_, path) => path.toArray(subject => subjectToComponentsHandler('namespace').handle({ subject }))),
  // @ts-ignore
  fragments: handler((_, path) => path.toArray(subject => subjectToComponentsHandler('fragment').handle({ subject }))),

  // Further async/iteration helpers
  every: new IterableMethods.every(),
  everyLimit: new IterableMethods.everyLimit(),
  everySeries: new IterableMethods.everySeries(),

  filter: new IterableMethods.filter(), // TODO: Improve this by handling as much as possible in sparql query
  filterLimit: new IterableMethods.filterLimit(),
  filterSeries: new IterableMethods.filterSeries(),

  find: new IterableMethods.find(),
  findLimit: new IterableMethods.filterLimit(),
  findSeries: new IterableMethods.filterSeries(),

  forEach: new IterableMethods.forEach(),
  forEachLimit: new IterableMethods.forEachLimit(),
  forEachSeries: new IterableMethods.forEachSeries(),

  map: new IterableMethods.map(),
  mapLimit: new IterableMethods.mapLimit(),
  mapSeries: new IterableMethods.mapSeries(),

  reduce: new IterableMethods.reduce(),
  reduceRight: new IterableMethods.reduceRight(),

  reject: new IterableMethods.reject(),
  rejectLimit: new IterableMethods.rejectLimit(),
  rejectSeries: new IterableMethods.rejectSeries(),

  some: new IterableMethods.some(),
  someLimit: new IterableMethods.someLimit(),
  someSeries: new IterableMethods.someSeries(),

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
  console.log(property)
  return handler(({ subject }: Data, path) =>
    // @ts-ignore
    (subject && (property in subject)) ? subject[property] :
      // @ts-ignore
      path?.then((term: RDF.Term) => term?.[property]));
}

function subjectToComponentsHandler(component: 'namespace' | 'fragment' | 'prefix') {

  return handler(async ({ subject, prefixes = {} }: Data, path?): Promise<string | undefined> => {
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
          const prefix = pref ?? /[a-z]*$/i.exec((await fetch(`http://prefix.cc/reverse?uri=${ns}`)).url)?.[0] ?? undefined;
          ns && prefix && (prefixes[ns] = prefix);
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

// TODO MAKE PR WITH THIS
function subjectToPrimitiveHandler_2() {
  return handler(async ({ subject }, path) => {
    console.log('inside handler 2')
    let list = [];
    while (path != "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil") {
      list.push(path["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"]);
      path = await path["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"];
    }
    return Promise.all(list);
    // typeof subject?.termType !== 'string' ?
    // undefined : termToPrimitive(subject)
  })
}

async function subjectToListHandler() {
  console.log('list')
  return handler(async ({ subject }) => {
    console.log('inside list handler')
    let list = [];
    while (subject != "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil") {
      list.push(subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"]);
      subject = await subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"];
    }
    return Promise.all(list);
  })
}

function subjectToPrimitiveHandler_3(set?: boolean) {
  return handler(async ({ subject }, path) => {
    console.log('inside handler 3')
    let container = [];
    let elem;
    let count = 0;
    while (elem = await path[`http://www.w3.org/1999/02/22-rdf-syntax-ns#_${++count}`]) {
      container.push(elem);
    }
    return set ? new Set(container) : container;
  })
}

// TODO: Discuass handling of setting values
function subjectToPrimitiveHandler_4(set?: boolean) {
  return handler(async ({ subject }, path) => {
    switch (`${await path["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]}`) {
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#List":
        return await path.list;
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag":
        return await path.containerAsSet;
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt":
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq":
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Container":
        return await path.container;
      default:
        // In this case none of the appropriate containers apply
        return subject;
    }
  })
}

async function subjectToContainerHandler<T>(set?: boolean) {
  return handler(async ({ subject }, path) => {
    let container = [];
    let count = 1;
    let elem;
    while (elem = await path["http://www.w3.org/1999/02/22-rdf-syntax-ns#_" + count]) {
      container.push(elem);
    }
    return set ? new Set(container) : container;
  })
}

// TODO: Check and include handling of rdf:value;
async function subjectToRDFPrimitiveHandler() {
  return handler(async ({ subject }) => {
    switch (`${await subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#type"]}`) {
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#List":
        return await subject.list;
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Bag":
        return await subject.containerAsSet;
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Alt":
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Seq":
      case "http://www.w3.org/1999/02/22-rdf-syntax-ns#Container":
        return await subject.container;
    }
  })
}



// async function getContainerElem({ subject }) {
//   let container = [];
//   let count = 1;
//   let elem;
//   while (elem = await subject[`http://www.w3.org/1999/02/22-rdf-syntax-ns#_${++count}`]) {
//     container.push(elem);
//   }
//   return container
// }