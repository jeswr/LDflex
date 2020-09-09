import PathProxy from './PathProxy';
import JSONLDResolver from './JSONLDResolver';
import defaultHandlers from './defaultHandlers';
import { ContextParser, JsonLdContext, JsonLdContextNormalized } from 'jsonld-context-parser';
import { LDflexProxyHandler } from '../types/handler';
import { MaybePromise } from '../types/util';
import { Data } from '../types/data';

interface PathFactorySettings {
  context: JsonLdContext,
  handlers?: LDflexProxyHandler,
  parsedContext?: MaybePromise<JsonLdContextNormalized['contextRaw']>,
  resolvers?: JSONLDResolver[], // May also have to hold invalid resolvers
  queryEngine: {
    execute: Function // TODO MAKE DEFINITION SPECIFIC
  }
}

/**
 * A PathFactory creates paths with default settings.
 */
export default class PathFactory {
  private _pathProxy: PathProxy;
  private _settings: PathFactorySettings;
  private _data: Data;
  static defaultHandlers: LDflexProxyHandler = defaultHandlers
  constructor(settings, data) {
    // Store settings and data
    this._settings = settings = { ...settings };
    this._data = data = { ...data };

    // Prepare the handlers
    const handlers = settings.handlers || defaultHandlers;
    for (const key in handlers)
      handlers[key] = toHandler(handlers[key]);
    for (const key of Object.getOwnPropertySymbols(handlers))
      handlers[key] = toHandler(handlers[key]);

    // Prepare the resolvers
    const resolvers = (settings.resolvers || []).map(toResolver);
    if (settings.context) {
      resolvers.push(new JSONLDResolver(settings.context));
      settings.parsedContext = new ContextParser().parse(settings.context)
        .then(({ contextRaw }) => contextRaw);
    }
    else {
      settings.context = settings.parsedContext = {};
    }

    // Instantiate PathProxy that will create the paths
    this._pathProxy = new PathProxy({ handlers, resolvers });

    // Remove PathProxy settings from the settings object
    delete settings.handlers;
    delete settings.resolvers;
  }

  /**
   * Creates a path with the given (optional) settings and data.
   */
  create(settings = {}, data) {
    // Apply defaults on settings and data
    return this._pathProxy.createPath(
      Object.assign(Object.create(null), this._settings, data ? settings : null),
      Object.assign(Object.create(null), this._data, data ?? settings));
  }
}

/**
 * Converts a handler function into a handler object.
 */
export function toHandler(handle) {
  return typeof handle.handle === 'function' ? handle : { handle };
}

/**
 * Converts a resolver function into a catch-all resolver object.
 */
export function toResolver(resolve) {
  return typeof resolve.resolve === 'function' ? resolve : { supports, resolve };
}

// Catch-all resolvers support everything
function supports() {
  return true;
}
