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
