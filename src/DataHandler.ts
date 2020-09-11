import { Data, MaybeFunction, MaybePromise } from "../types";

const handlerFactory = (settings: { async: boolean; function?: boolean }) =>
  (...dataProperties : string[]) => new DataHandler(settings, ...dataProperties)

/**
 * Resolves to the given item in the path data.
 * For example, new DataHandler({}, 'foo', 'bar')
 * will return pathData.foo.bar.
 *
 * Resolution can optionally be async,
 * and/or be behind a function call.
 */
export default class DataHandler {
  private _isAsync: boolean;
  private _isFunction: boolean;
  private _dataProperties: string[];
  constructor(options: { async: boolean; function?: boolean; }, ...dataProperties: string[]) {
    this._isAsync = options.async;
    this._isFunction = options.function ?? false;
    this._dataProperties = dataProperties;
  }

  static sync = handlerFactory({ async: false })
  static syncFunction = handlerFactory({ async: false, function: true })
  static async = handlerFactory({ async: true })
  static asyncFunction = handlerFactory({ async: true, function: true })

  // Resolves the data path, or returns a function that does so
  handle(pathData: Data): MaybeFunction<MaybePromise<Data>> {
    return !this._isFunction ?
      this._resolveDataPath(pathData) :
      () => this._resolveDataPath(pathData);
  }

  // Resolves the data path
  _resolveDataPath(data: Data): MaybePromise<Data> {
    return this._isAsync ?
        this._resolveAsyncDataPath(data) :
        this._resolveSyncDataPath(data);
  }

  // Resolves synchronous property access
  _resolveSyncDataPath(data: Data): Data {
    for (const property of this._dataProperties)
      data &&= data[property];
    return data;
  }

  // Resolves asynchronous property access
  async _resolveAsyncDataPath(data: Data): Promise<Data> {
    for (const property of this._dataProperties)
      data &&= await data[property];
    return data;
  }
}