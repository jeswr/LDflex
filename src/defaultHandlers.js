"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const order_1 = require("../types/order");
const AsyncIteratorHandler_1 = __importDefault(require("./AsyncIteratorHandler"));
const DataHandler_1 = __importDefault(require("./DataHandler"));
const DeleteFunctionHandler_1 = __importDefault(require("./DeleteFunctionHandler"));
const ExecuteQueryHandler_1 = __importDefault(require("./ExecuteQueryHandler"));
const GetFunctionHandler_1 = __importDefault(require("./GetFunctionHandler"));
const InsertFunctionHandler_1 = __importDefault(require("./InsertFunctionHandler"));
const IterableMethods = __importStar(require("./IterableMethodsHandler"));
const MutationExpressionsHandler_1 = __importDefault(require("./MutationExpressionsHandler"));
const PathExpressionHandler_1 = __importDefault(require("./PathExpressionHandler"));
const PredicateHandler_1 = __importDefault(require("./PredicateHandler"));
const PredicatesHandler_1 = __importDefault(require("./PredicatesHandler"));
const PreloadHandler_1 = __importDefault(require("./PreloadHandler"));
const PropertiesHandler_1 = __importDefault(require("./PropertiesHandler"));
const ReplaceFunctionHandler_1 = __importDefault(require("./ReplaceFunctionHandler"));
const SetFunctionHandler_1 = __importDefault(require("./SetFunctionHandler"));
const SortHandler_1 = __importDefault(require("./SortHandler"));
const SparqlHandler_1 = __importDefault(require("./SparqlHandler"));
const StringToLDflexHandler_1 = __importDefault(require("./StringToLDflexHandler"));
const SubjectHandler_1 = __importDefault(require("./SubjectHandler"));
const SubjectsHandler_1 = __importDefault(require("./SubjectsHandler"));
const ThenHandler_1 = __importDefault(require("./ThenHandler"));
const ToArrayHandler_1 = __importDefault(require("./ToArrayHandler"));
const valueUtils_1 = require("./valueUtils");
class PredicatesOf {
    constructor(normal = true, inverse = false) {
        this.normal = normal;
        this.inverse = inverse;
    }
    handle(pathData) {
        console.log("----------------------------------------------------------", pathData.subject);
        return pathData.extendPath({
            distinct: true,
            select: '?predicate',
            finalClause: async (queryVar) => [await pathData.subject, 'predicate', 'object'],
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
exports.default = {
    // Flag to loaders that exported paths are not ES6 modules
    __esModule: () => undefined,
    // Add thenable and async iterable behavior
    then: new ThenHandler_1.default(),
    [Symbol.asyncIterator]: new AsyncIteratorHandler_1.default(),
    // Add read and query functionality
    get: new GetFunctionHandler_1.default(),
    subject: new SubjectHandler_1.default(),
    predicate: new PredicateHandler_1.default(),
    properties: new PropertiesHandler_1.default(),
    predicates: new PredicatesHandler_1.default(),
    pathExpression: new PathExpressionHandler_1.default(),
    sparql: new SparqlHandler_1.default(),
    subjects: new SubjectsHandler_1.default(),
    results: new ExecuteQueryHandler_1.default(),
    sort: new SortHandler_1.default(order_1.order.ASC),
    sortDesc: new SortHandler_1.default(order_1.order.DESC),
    preload: new PreloadHandler_1.default(),
    // Add write functionality
    mutationExpressions: new MutationExpressionsHandler_1.default(),
    add: new InsertFunctionHandler_1.default(),
    set: new SetFunctionHandler_1.default(),
    replace: new ReplaceFunctionHandler_1.default(),
    delete: new DeleteFunctionHandler_1.default(),
    // Add RDFJS term handling
    termType: termPropertyHandler('termType'),
    value: termPropertyHandler('value'),
    datatype: termPropertyHandler('datatype'),
    language: termPropertyHandler('language'),
    canonical: termPropertyHandler('canonical'),
    equals: DataHandler_1.default.sync('subject', 'equals'),
    toString: DataHandler_1.default.syncFunction('subject', 'value'),
    valueOf: subjectToPrimitiveHandler(),
    toPrimitive: subjectToPrimitiveHandler(),
    toRDFPrimitive: subjectToPrimitiveHandler_4(),
    list: subjectToPrimitiveHandler_2(),
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
    toArray: new ToArrayHandler_1.default(),
    termTypes: handler((_, path) => path.toArray((term) => term.termType)),
    values: handler((_, path) => path.toArray((term) => term.value)),
    datatypes: handler((_, path) => path.toArray((term) => term.datatype)),
    languages: handler((_, path) => path.toArray((term) => term.language)),
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
    filter: new IterableMethods.filter(),
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
    resolve: new StringToLDflexHandler_1.default(),
};
// Creates a handler from the given function
function handler(handle) {
    return { handle };
}
// Creates a handler for the given RDF/JS Term property
function termPropertyHandler(property) {
    // If a resolved subject is present,
    // behave as an RDF/JS term and synchronously expose the property;
    // otherwise, return a promise to the property value
    console.log(property);
    return handler(({ subject }, path) => 
    // @ts-ignore
    (subject && (property in subject)) ? subject[property] :
        // @ts-ignore
        path?.then((term) => term?.[property]));
}
function subjectToComponentsHandler(component) {
    return handler(async ({ subject, prefixes = {} }, path) => {
        if (subject?.termType === 'NamedNode') {
            if (component === 'namespace') {
                return /^[^]*[#\/]/.exec(subject.value)?.[0];
            }
            else if (component === 'fragment') {
                return /(?![\/#])[^\/#]*$/.exec(subject.value)?.[0];
            }
            else if (component === 'prefix') {
                const ns = /^[^]*[#\/]/.exec(subject.value)?.[0];
                const pref = ns ? prefixes[ns] : undefined;
                try {
                    // TODO: Get prefixes from the engines first (if possible)
                    const prefix = pref ?? /[a-z]*$/i.exec((await fetch(`http://prefix.cc/reverse?uri=${ns}`)).url)?.[0] ?? undefined;
                    ns && prefix && (prefixes[ns] = prefix);
                    return prefix;
                }
                catch {
                    return undefined;
                }
            }
        }
        else
            return undefined;
    });
}
// Creates a handler that converts the subject into a primitive
function subjectToPrimitiveHandler() {
    return handler(({ subject }) => () => typeof subject?.termType !== 'string' ?
        undefined : valueUtils_1.termToPrimitive(subject));
}
// TODO MAKE PR WITH THIS
function subjectToPrimitiveHandler_2() {
    return handler(async ({ subject }, path) => {
        console.log('inside handler 2');
        let list = [];
        while (path != "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil") {
            list.push(path["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"]);
            path = await path["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"];
        }
        return Promise.all(list);
        // typeof subject?.termType !== 'string' ?
        // undefined : termToPrimitive(subject)
    });
}
async function subjectToListHandler() {
    console.log('list');
    return handler(async ({ subject }) => {
        console.log('inside list handler');
        let list = [];
        while (subject != "http://www.w3.org/1999/02/22-rdf-syntax-ns#nil") {
            list.push(subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#first"]);
            subject = await subject["http://www.w3.org/1999/02/22-rdf-syntax-ns#rest"];
        }
        return Promise.all(list);
    });
}
function subjectToPrimitiveHandler_3(set) {
    return handler(async ({ subject }, path) => {
        console.log('inside handler 3');
        let container = [];
        let elem;
        let count = 0;
        while (elem = await path[`http://www.w3.org/1999/02/22-rdf-syntax-ns#_${++count}`]) {
            container.push(elem);
        }
        return set ? new Set(container) : container;
    });
}
function subjectToPrimitiveHandler_4(set) {
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
        }
    });
}
async function subjectToContainerHandler(set) {
    return handler(async ({ subject }, path) => {
        let container = [];
        let count = 1;
        let elem;
        while (elem = await path["http://www.w3.org/1999/02/22-rdf-syntax-ns#_" + count]) {
            container.push(elem);
        }
        return set ? new Set(container) : container;
    });
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
    });
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
