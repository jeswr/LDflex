import { JsonLdContext, JsonLdContextNormalized } from "jsonld-context-parser";
import { LDflexProxyHandlers, MaybePromise } from ".";
import { JSONLDResolver } from "../src";
import { queryEngine } from './queryEngine'

export interface LDflexSettings {
    context: JsonLdContext,
    handlers?: LDflexProxyHandlers,
    parsedContext?: MaybePromise<JsonLdContextNormalized['contextRaw']>,
    resolvers?: JSONLDResolver[], // May also have to hold invalid resolvers
    queryEngine: queryEngine
  }