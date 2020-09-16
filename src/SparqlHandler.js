"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const data_model_1 = require("@rdfjs/data-model");
const NEEDS_ESCAPE = /["\\\t\n\r\b\f\u0000-\u0019\ud800-\udbff]/, ESCAPE_ALL = /["\\\t\n\r\b\f\u0000-\u0019]|[\ud800-\udbff][\udc00-\udfff]/g, ESCAPED_CHARS = {
    '\\': '\\\\', '"': '\\"', '\t': '\\t',
    '\n': '\\n', '\r': '\\r', '\b': '\\b', '\f': '\\f',
};
/**
 * Expresses a path or mutation as a SPARQL query.
 *
 * Requires:
 * - a mutationExpressions or pathExpression property on the path proxy
 */
class SparqlHandler {
    async handle(pathData, path) {
        // First check if we have a mutation expression
        const mutationExpressions = await path.mutationExpressions;
        if (Array.isArray(mutationExpressions) && mutationExpressions.length)
            // Remove empty results to prevent dangling semicolons
            return mutationExpressions.map(e => this.mutationExpressionToQuery(e)).filter(Boolean).join('\n;\n');
        // Otherwise, fall back to checking for a path expression
        const pathExpression = await path.pathExpression;
        if (!Array.isArray(pathExpression))
            throw new Error(`${pathData} has no pathExpression property`);
        return this.pathExpressionToQuery(pathData, path, pathExpression);
    }
    pathExpressionToQuery(pathData, path, pathExpression) {
        if (pathExpression.length < 2 && !pathData.finalClause) {
            console.log(pathData, path, pathExpression);
            throw new Error(`${pathData} should at least contain a subject and a predicate`);
        }
        // Create triple patterns
        let queryVar = '?subject', sorts = [], clauses = [];
        if (pathExpression.length > 1) {
            queryVar = this.createVar(pathData.property);
            ({ queryVar, sorts, clauses } = this.expressionToTriplePatterns(pathExpression, queryVar));
        }
        if (pathData.finalClause)
            clauses.push(pathData.finalClause(queryVar).map(x => data_model_1.variable(x)).map(x => '?' + x.value).join(' ').replace('??', '?') + '.');
        // Create SPARQL query body
        const distinct = pathData.distinct ? 'DISTINCT ' : '';
        const select = `SELECT ${distinct}${pathData.select ? pathData.select : queryVar}`;
        const where = ` WHERE {\n  ${clauses.join('\n  ')}\n}`;
        const orderClauses = sorts.map(({ order, variable }) => `${order}(${variable})`);
        const orderBy = orderClauses.length === 0 ? '' : `\nORDER BY ${orderClauses.join(' ')}`;
        return `${select}${where}${orderBy}`;
    }
    mutationExpressionToQuery({ mutationType, conditions, predicateObjects }) {
        // If there are no mutations, there is no query
        if (!mutationType || !conditions || predicateObjects && predicateObjects.length === 0)
            return '';
        // Create the WHERE clauses
        const scope = {};
        let subject, where;
        // If the only condition is a subject, we need no WHERE clause
        if (conditions.length === 1) {
            subject = this.termToString(conditions[0].subject);
            where = [];
        }
        // Otherwise, create a WHERE clause from all conditions
        else {
            const lastPredicate = conditions[conditions.length - 1].predicate;
            subject = this.createVar(lastPredicate.value, scope);
            ({ queryVar: subject, clauses: where } =
                this.expressionToTriplePatterns(conditions, subject, scope));
        }
        // Create the mutation clauses
        const mutations = [];
        for (const { predicate, reverse, objects } of predicateObjects) {
            // Mutate either only the specified objects, or all of them
            const objectStrings = objects ?
                objects.map(o => this.termToString(o)) :
                [this.createVar(predicate.value, scope)];
            // Generate a triple pattern for all subjects
            mutations.push(...this.triplePatterns(subject, predicate, objectStrings, reverse));
        }
        const mutationClauses = `{\n  ${mutations.join('\n  ')}\n}`;
        // Join clauses into a SPARQL query
        return where.length === 0 ?
            // If there are no WHERE clauses, just mutate raw data
            `${mutationType} DATA ${mutationClauses}` :
            // Otherwise, return a DELETE/INSERT ... WHERE ... query
            `${mutationType} ${mutationClauses} WHERE {\n  ${where.join('\n  ')}\n}`;
    }
    expressionToTriplePatterns([root, ...pathExpression], lastVar, scope = {}) {
        const lastIndex = pathExpression.length - 1;
        const clauses = [];
        const sorts = [];
        let object = this.termToString(skolemize(root.subject));
        let queryVar = object;
        let allowValues = false;
        pathExpression.forEach((segment, index) => {
            // Obtain components and generate triple pattern
            const subject = object;
            const { predicate, reverse, sort, values } = segment;
            // Use fixed object values values if they were specified
            let objects;
            if (values && values.length > 0) {
                if (!allowValues)
                    throw new Error('Specifying fixed values is not allowed here');
                objects = values.map(this.termToString);
                allowValues = false; // disallow subsequent fixed values for this predicate
            }
            // Otherwise, use a variable subject
            else {
                object = index < lastIndex ? this.createVar(`v${index}`, scope) : lastVar;
                objects = [object];
                allowValues = true;
            }
            clauses.push(...this.triplePatterns(subject, predicate, objects, reverse));
            // If the sort option was not set, use this object as a query variable
            if (!sort) {
                queryVar = object;
            }
            // If sort was set, use this object as a sorting variable
            else {
                // TODO: handle when an object is used for sorting, and later also for querying
                sorts.push({ variable: object, order: sort });
                // TODO: use a descriptive lastVar in case of sorting
                object = queryVar;
            }
        });
        return { queryVar, sorts, clauses };
    }
    // Creates a unique query variable within the given scope, based on the suggestion
    createVar(suggestion = '', scope) {
        let counter = 0;
        let label = `?${suggestion.match(/[a-z0-9]*$/i)[0] || 'result'}`;
        if (scope) {
            suggestion = label;
            while (scope[label])
                label = `${suggestion}_${counter++}`;
            scope[label] = true;
        }
        return label;
    }
    // Converts an RDFJS term to a string that we can use in a query
    termToString(term) {
        // Determine escaped value
        let { value } = term;
        if (NEEDS_ESCAPE.test(value))
            value = value.replace(ESCAPE_ALL, escapeCharacter);
        switch (term.termType) {
            case 'NamedNode':
                return `<${value}>`;
            case 'BlankNode':
                return `_:${value}`;
            case 'Literal':
                // Determine optional language or datatype
                let suffix = '';
                if (term.language)
                    suffix = `@${term.language}`;
                else if (term.datatype.value !== 'http://www.w3.org/2001/XMLSchema#string')
                    suffix = `^^<${term.datatype.value}>`;
                return `"${value}"${suffix}`;
            default:
                throw new Error(`Could not convert a term of type ${term.termType}`);
        }
    }
    // Creates triple patterns for the given subject, predicate, and objects
    triplePatterns(subjectString, predicateTerm, objectStrings, reverse = false) {
        let subjectStrings = [subjectString];
        if (reverse)
            [subjectStrings, objectStrings] = [objectStrings, subjectStrings];
        const objects = objectStrings.join(', ');
        return subjectStrings.map(s => `${s} <${predicateTerm.value}> ${objects}.`);
    }
}
exports.default = SparqlHandler;
// Replaces a character by its escaped version
// (borrowed from https://www.npmjs.com/package/n3)
function escapeCharacter(character) {
    // Replace a single character by its escaped version
    let result = ESCAPED_CHARS[character];
    if (result === undefined) {
        // Replace a single character with its 4-bit unicode escape sequence
        if (character.length === 1) {
            result = character.charCodeAt(0).toString(16);
            result = '\\u0000'.substr(0, 6 - result.length) + result;
        }
        // Replace a surrogate pair with its 8-bit unicode escape sequence
        else {
            result = ((character.charCodeAt(0) - 0xD800) * 0x400 +
                character.charCodeAt(1) + 0x2400).toString(16);
            result = '\\U00000000'.substr(0, 10 - result.length) + result;
        }
    }
    return result;
}
// Skolemizes the given term if it is a blank node
let skolemId = 0;
function skolemize(term) {
    if (term.termType !== 'BlankNode')
        return term;
    if (!term.skolemized)
        term.skolemized = data_model_1.namedNode(`urn:ldflex:sk${skolemId++}`);
    return term.skolemized;
}
// import { namedNode } from '@rdfjs/data-model';
// import { Data, fltr, MaybeArray, order } from '../types';
// import { variable } from '@rdfjs/data-model'
// import * as RDF from 'rdf-js'
// import { toSparql, Algebra, translate, Factory } from 'sparqlalgebrajs'
// import * as SPARQL from 'sparqljs'
// import { asArray, xprods } from './utils'
// import * as R from 'ramda'
// import { Filter } from 'sparqlalgebrajs/lib/algebra';
// // const factory = new Factory()
// // SPARQL.Wildcard
// function makeVariable(input: string | RDF.Variable): RDF.Variable
// function makeVariable(input: string | RDF.Term): RDF.Term {
//   return typeof input === 'string' ? variable(input) : input
// }
// // Algebra.types
// // enum filter {
// //   Algebra.Operation.
// // }
// // Skolemizes the given term if it is a blank node
// let skolemId = 0;
// class OperationBuilder {
//   private expressions: Algebra.Expression[] = [];
//   private filter: Algebra.Expression[] = []
//   private limit: number | undefined = undefined;
//   private offset: number = 0;
//   private patterns: Algebra.Pattern[] = []
//   private variables: RDF.Variable[] = []
//   private factory = new Factory()
//   private scope: { [label: string]: boolean } = {}
//   private focusVar: RDF.Variable;
//   distinct: boolean = false;
//   skolemize(term: RDF.Term): RDF.Term | RDF.Variable {
//     if (term.termType !== 'BlankNode')
//       return (this.focusVar = term);
//     // @ts-ignore TODO: FIX ONCE WE HAVE CAPTURING FOR BLANK NODES
//     if (!term.skolemized)
//       // @ts-ignore TODO: FIX ONCE WE HAVE CAPTURING FOR BLANK NODES
//       term.skolemized = namedNode(`urn:ldflex:sk${skolemId++}`);
//     // @ts-ignore TODO: FIX ONCE WE HAVE CAPTURING FOR BLANK NODES
//     return (this.focusVar = variable(label));
//   }
//   // Creates a unique query variable within the given scope, based on the suggestion
//   // TODO: FIX THIS TO WORK BASED ON OTHER VARIABLES IN OPERATION BUILDER
//   createVar(suggestion = '') {
//     let counter = 0;
//     let label = `?${suggestion.match(/[a-z0-9]*$/i)?.[0] ?? 'result'}`;
//     if (this.scope) {
//       suggestion = label;
//       while (this.scope[label])
//         label = `${suggestion}_${counter++}`;
//       this.scope[label] = true;
//     }
//     return (this.focusVar = variable(label));
//   }
//   setVar(variable: RDF.Variable) {
//     this.focusVar = variable
//   }
//   getVar() {
//     return this.focusVar
//   }
//   algebra(): Algebra.Operation {
//     const bgp = this.factory.createBgp(this.patterns)
//     let filter: Algebra.Operation = bgp
//     for (const f of this.filter)
//       filter = this.factory.createFilter(filter, f);
//     const project = this.factory.createProject(this.factory.createOrderBy(filter, this.expressions), this.variables)
//     const sliced = this.factory.createSlice(project, this.offset, this.limit)
//     const unNormalized = (this.distinct ? R.identity : this.factory.createDistinct)(sliced)
//     return translate(toSparql(unNormalized)) // Converting to sparql and then back to an algebra somewhat 'normalizes' the algebraic expression
//   }
//   sparql() {
//     return toSparql(this.algebra())
//   }
//   addPattern(subject: MaybeArray<RDF.Quad_Subject>, predicate: MaybeArray<RDF.Quad_Predicate>, object: MaybeArray<RDF.Quad_Object>, graph?: MaybeArray<RDF.Quad_Graph>, reverse: boolean = false) {
//     this.patterns.concat(
//       ...xprods(reverse ? object : subject, predicate, reverse ? subject : object, graph)
//         .map(
//           (quad: [RDF.Quad_Subject, RDF.Quad_Predicate, RDF.Quad_Object, RDF.Quad_Graph]) =>
//             this.factory.createPattern(...quad)
//         )
//     )
//   }
//   addVariable(variable: RDF.Variable | RDF.Variable[]) {
//     asArray(variable).forEach((v: RDF.Variable) => { this.variables.push(v) })
//   }
//   addOrderBy(variable: RDF.Variable, ordering: order = order.ASC) {
//     this.expressions.push(
//       ordering === order.DESC ?
//         this.factory.createOperatorExpression(ordering, [this.factory.createTermExpression(variable)]) :
//         this.factory.createTermExpression(variable)
//     )
//   }
//   addFilter(filterType: fltr.eq | fltr.neq | fltr.ge | fltr.geq | fltr.le | fltr.leq, variableTerm: RDF.Variable, compareTo?: number | RDF.Variable): void;
//   addFilter(filterType: fltr.regex, variableTerm: RDF.Variable, compareTo: string, flags: string): void;
//   addFilter(filterType: fltr.exists | fltr.notExists, variableTerm: Algebra.Pattern | Algebra.Pattern[]): void;
//   addFilter(filterType: fltr, variableTerm: RDF.Variable | RDF.Quad | Algebra.Pattern | Algebra.Pattern[], compareTo?: any, flags?: string): void {
//     this.filter.push(
//       filterType === fltr.exists || fltr.notExists ?
//         this.factory.createExistenceExpression(filterType === fltr.notExists, this.factory.createBgp(asArray(variableTerm) as Algebra.Pattern[])) :
//         this.factory.createOperatorExpression(filterType,
//           filterType === fltr.regex ?
//             [variableTerm, variable(compareTo), variable(flags as string)] :
//             [variableTerm, (typeof compareTo === 'number' || typeof compareTo === 'string') ? variable(compareTo.toString()) : compareTo]
//         )
//     )
//   }
//   setLimit(limit: number | undefined) {
//     this.limit = limit
//   }
//   setOffSet(offset: number) {
//     this.offset = offset
//   }
// }
// /**
//  * Expresses a path or mutation as a SPARQL query.
//  *
//  * Requires:
//  * - a mutationExpressions or pathExpression property on the path proxy
//  */
// export default class SparqlHandler {
//   async handle(pathData: Data, path: Data) {
//     // First check if we have a mutation expression
//     const mutationExpressions = await path.mutationExpressions;
//     if (Array.isArray(mutationExpressions) && mutationExpressions.length)
//       // Remove empty results to prevent dangling semicolons
//       return mutationExpressions.map(e => this.mutationExpressionToQuery(e)).filter(Boolean).join('\n;\n');
//     // Otherwise, fall back to checking for a path expression
//     const pathExpression = await path.pathExpression;
//     if (!Array.isArray(pathExpression))
//       throw new Error(`${pathData} has no pathExpression property`);
//     return this.pathExpressionToQuery(pathData, path, pathExpression);
//   }
//   addTriplesFromExpression([root, ...pathExpression], builder: OperationBuilder) {
//     let object = builder.skolemize(root.subject)
//     let allowValues = false
//   }
//   pathExpressionToQueryBuilder(pathData, path, pathExpression): OperationBuilder {
//     const builder = new OperationBuilder()
//     let object: RDF.Variable = variable('subject')
//     let allowValues = false;
//     pathExpression.forEach(({ predicate, reverse, sort, values }, index) => {
//       const subject = object;
//       if (allowValues = values?.length > 0) {
//         if (allowValues = !allowValues)
//           throw new Error('Specifying fixed values is not allowed here');
//         builder.addPattern(subject as RDF.Quad_Subject, predicate, values, undefined, reverse)
//       }
//       // Otherwise, use a variable subject
//       else {
//         allowValues = true;
//         builder.addPattern(subject as RDF.Quad_Subject, predicate, object = index < pathExpression.length - 1 ? builder.createVar(`v${index}`) : lastVar)
//       }
//     })
//     if (!sort)
//           queryVar = object;
//         // If sort was set, use this object as a sorting variable
//         else {
//           // TODO: handle when an object is used for sorting, and later also for querying
//           builder.addOrderBy(object as RDF.Variable, sort)
//           // TODO: use a descriptive lastVar in case of sorting
//           object = queryVar;
//         }
//     return builder
//   }
//   pathExpressionToQuery(pathData: Data, path: Data, pathExpression) {
//     let builder: OperationBuilder = new OperationBuilder()
//     if (pathExpression.length < 2 && !pathData.finalClause)
//       throw new Error(`${pathData} should at least contain a subject and a predicate`);
//     // Create triple patterns
//     if (pathExpression.length > 1)
//         builder = this.pathExpressionToQueryBuilder(pathData, path, pathExpression);
//     builder.addVariable(pathData.select ?? queryVar);
//     builder.distinct = pathData.distinct ?? false
//     if (pathData.finalClause) {
//       const [s, p, o] = pathData.finalClause(queryVar).map(variable)
//       builder.addPattern(s, p, o);
//     }
//     return builder.sparql()
//   }
//   mutationExpressionToQuery({ mutationType, conditions, predicateObjects }) {
//     // If there are no mutations, there is no query
//     if (!mutationType || !conditions || predicateObjects && predicateObjects.length === 0)
//       return '';
//     // Create the WHERE clauses
//     const scope = {};
//     let subject, where;
//     // If the only condition is a subject, we need no WHERE clause
//     if (conditions.length === 1) {
//       subject = this.termToString(conditions[0].subject);
//       where = [];
//     }
//     // Otherwise, create a WHERE clause from all conditions
//     else {
//       const lastPredicate = conditions[conditions.length - 1].predicate;
//       subject = this.createVar(lastPredicate.value, scope);
//       ({ queryVar: subject, clauses: where } =
//         this.expressionToTriplePatterns(conditions, subject, scope));
//     }
//     // Create the mutation clauses
//     const mutations = [];
//     for (const { predicate, reverse, objects } of predicateObjects) {
//       // Mutate either only the specified objects, or all of them
//       const objectStrings = objects ?
//         objects.map(o => this.termToString(o)) :
//         [this.createVar(predicate.value, scope)];
//       // Generate a triple pattern for all subjects
//       mutations.push(...this.triplePatterns(subject, predicate, objectStrings, reverse));
//     }
//     const mutationClauses = `{\n  ${mutations.join('\n  ')}\n}`;
//     // Join clauses into a SPARQL query
//     return where.length === 0 ?
//       // If there are no WHERE clauses, just mutate raw data
//       `${mutationType} DATA ${mutationClauses}` :
//       // Otherwise, return a DELETE/INSERT ... WHERE ... query
//       `${mutationType} ${mutationClauses} WHERE {\n  ${where.join('\n  ')}\n}`;
//   }
// }
