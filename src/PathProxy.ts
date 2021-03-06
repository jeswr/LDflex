import { LDflexProxyHandlers } from "../types/handler";
import { Data } from "../types/data";
import { Resolver } from "../types/Resolver";

const EMPTY = Object.create(null);

/**
 * A PathProxy creates path expressions,
 * to which functionality can be attached.
 *
 * To users, these paths act as regular JavaScript objects
 * (such as `path.foo.bar.prop`) thanks to Proxy.
 * Behind the scenes, they carry around internal data
 * that can be used to influence their functionality.
 *
 * A path's functionality is realized by:
 * - handlers, which handle a specific named property
 * - resolvers, which can handle arbitrary properties
 * Only handlers and resolvers see the internal data.
 *
 * A path can have arbitrary internal data fields, but these are reserved:
 * - settings, an object that is passed on as-is to child paths
 * - proxy, a reference to the proxied object the user sees
 * - parent, a reference to the parent path
 * - apply, a function the will be invoked when the path is called as a function
 * - extendPath, a method to create a child path with this path as parent
 */
export default class PathProxy {
  private _handlers: LDflexProxyHandlers
  private _resolvers: Resolver[]
  constructor({ handlers = EMPTY, resolvers = [] } : {
    handlers?: LDflexProxyHandlers, resolvers?: Resolver[]
  } = {}) {
    // console.log('pathproxy constructor called')
    this._handlers = handlers;
    this._resolvers = resolvers;
  }

  /**
   * Creates a path Proxy with the given settings and internal data fields.
   */
  createPath(settings = {}, data: Data) {
    // console.log('create path called')
    // The settings parameter is optional
    if (data === undefined)
      [data, settings] = [settings, {}];

    // Create the path's internal data object and the proxy that wraps it
    // @ts-ignore
    const { apply, ...rawData } = data;
    const path = apply ? Object.assign(callPathFunction, rawData) : rawData;
    const proxy = new Proxy(path, this);
    path.proxy = proxy;
    path.settings = settings;
    function callPathFunction(...args) {
      return apply(args, path, proxy);
    }

    // Add an extendPath method to create child paths
    if (!path.extendPath) {
      const pathProxy = this;
      path.extendPath = function extendPath(newData, parent = this) {
        return pathProxy.createPath(settings, { parent, extendPath, ...newData });
      };
    }

    // Return the proxied path
    return proxy;
  }

  /**
   * Handles access to a property
   */
  get(pathData: Data, property: string) {
    // console.log('--- get has been called ---', property, pathData)
    // console.log(pathData)
    // console.log('---')
    // console.log(property)
    // console.log('---')
    // Handlers provide functionality for a specific property,
    // so check if we find a handler first
    const handler = this._handlers[property];
    if (handler && typeof handler.handle === 'function')
      return handler.handle(pathData, pathData.proxy);
    console.log('after handle if thing')
    // Resolvers provide functionality for arbitrary properties,
    // so find a resolver that can handle this property
    for (const resolver of this._resolvers) {
      if (resolver.supports(property))
        return resolver.resolve(property, pathData, pathData.proxy);
    }
    // Otherwise, the property does not exist
    return undefined;
  }
}
