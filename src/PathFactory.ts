import PathProxy from './PathProxy';
import JSONLDResolver from './JSONLDResolver';
import defaultHandlers from './defaultHandlers';
import { ContextParser } from 'jsonld-context-parser';
import { LDflexHandleFunction, LDflexHandler, LDflexProxyHandlers } from '../types/handler';
import { Data } from '../types/data';
import { LDflexSettings } from '../types';
import { Resolver } from '../types/Resolver';
import { namedNode } from '@rdfjs/data-model';
import { Path } from 'ramda';

function mapObjects<T extends {}>(object : T, map: ((value: any) => any)): T {
  for (const key in object)
    object[key] = map(object[key]);
  for (const key of Object.getOwnPropertySymbols(object))
    // TODO: Fix this error caused by 'no implicit any' checks
    // @ts-ignore
    object[key] = map(object[key])
  return object
}

/**
 * A PathFactory creates paths with default settings.
 */



export default class PathFactory {
  // TODO FIX
  public subjects!: any;
  //
  private _pathProxy: PathProxy;
  private _settings: LDflexSettings;
  private _data: Data;
  static defaultHandlers: LDflexProxyHandlers = defaultHandlers;
  constructor(settings: LDflexSettings, data?: Data) {
    // Store settings and data
    this._settings = settings = { ...settings };
    this._data = data = { ...data };

    // Prepare the handlers
    const handlers = mapObjects(settings.handlers ?? defaultHandlers ?? {}, toHandler)

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
    // @ts-ignore
    this._pathProxy = new PathProxy({ handlers, resolvers });

    // Remove PathProxy settings from the settings object
    delete settings.handlers;
    delete settings.resolvers;

    // In some cases, such as when we call 'subjects' we
    // dont need to call the 'create' method first.
    // TODO: Add test for this
    // return this

    // interface P {
    //   [x: keyof handlers]
    // }
    
    return new Proxy(this, {
      get(target, prop, reciever) {
        // @ts-ignore
        return target[prop] ?? target.create({ subject: namedNode('') })[prop]


        return target.create(reciever)
        if (prop === 'create') {
          return target.create
        } else {
          // TODO - do this in a less hacky way - ie remove unecessary 'requires root' errors elsewhere
          return target.create({ subject: namedNode('') })
        }
      }
    })
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
