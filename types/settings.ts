import { JsonLdContext } from "jsonld-context-parser";

export interface LDflexSettings { 
    handlers?: { [handler: string] : handlerObject };
    resolvers?: any;
    context: JsonLdContext;
    parsedContext?: {};
    queryEngine : queryEngine 
}