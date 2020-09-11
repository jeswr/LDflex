import PathProxy from './PathProxy';
import JSONLDResolver from './JSONLDResolver';
import defaultHandlers from './defaultHandlers';
import { ContextParser } from 'jsonld-context-parser';
import { LDflexHandleFunction, LDflexHandler, LDflexProxyHandlers } from '../types/handler';
import { Data } from '../types/data';
import { LDflexSettings } from '../types';
import { Resolver } from '../types/Resolver';


/**
 * A PathFactory creates paths with default settings.
 */
export default class PathFactory {
  private _pathProxy: PathProxy;
  private _settings: LDflexSettings;
  private _data: Data;
  static defaultHandlers: LDflexProxyHandlers = defaultHandlers;
  constructor(settings: LDflexSettings, data?: Data) {
    // Store settings and data
    this._settings = settings = { ...settings };
    this._data = data = { ...data };

    // Prepare the handlers
    const handlers = settings.handlers ?? defaultHandlers;
    for (const key in handlers)
      handlers[key] = toHandler(handlers[key]);
    for (const key of Object.getOwnPropertySymbols(handlers))
      handlers[key] = toHandler(handlers[key]);

    // Prepare the resolvers
    const resolvers = (settings.resolvers || []).map(toResolver);
    if (settings.context) {
      resolvers.push(new JSONLDResolver(settings.context));
      settings.parsedContext = new ContextParser().parse(settings.context)
        .then(context => context.getContextRaw());
    } else {
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
  create(settings = {}, data?: Data) {
    // Apply defaults on settings and data
    return this._pathProxy.createPath(
      Object.assign(Object.create(null), this._settings, data ? settings : null),
      Object.assign(Object.create(null), this._data, data ?? settings));
  }
}

/**
 * Converts a handler function into a handler object.
 */
export function toHandler(handle: LDflexHandler | LDflexHandleFunction): LDflexHandler {
  return 'handle' in handle ? handle : { handle };
}

/**
 * Converts a resolver function into a catch-all resolver object.
 */
export function toResolver(resolve: JSONLDResolver | JSONLDResolver['resolve']): Resolver {
  return 'resolve' in resolve ? resolve : { supports, resolve }
}

// Catch-all resolvers support everything
function supports() {
  return true;
}
