import { JsonLdContext } from "jsonld-context-parser";

export interface LDflexSettings { 
    // @ts-ignore
    handlers?: { [handler: string] : handlerObject };
    resolvers?: any;
    context: JsonLdContext;
    parsedContext?: {};
    // @ts-ignore
    queryEngine : queryEngine 
}