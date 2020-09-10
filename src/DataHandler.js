"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handlerFactory = (settings) => (...dataProperties) => new DataHandler(settings, ...dataProperties);
/**
 * Resolves to the given item in the path data.
 * For example, new DataHandler({}, 'foo', 'bar')
 * will return pathData.foo.bar.
 *
 * Resolution can optionally be async,
 * and/or be behind a function call.
 */
class DataHandler {
    constructor(options, ...dataProperties) {
        this._isAsync = options.async;
        this._isFunction = options.function ?? false;
        this._dataProperties = dataProperties;
    }
    // Resolves the data path, or returns a function that does so
    handle(pathData) {
        return !this._isFunction ?
            this._resolveDataPath(pathData) :
            () => this._resolveDataPath(pathData);
    }
    // Resolves the data path
    _resolveDataPath(data) {
        return this._isAsync ?
            this._resolveAsyncDataPath(data) :
            this._resolveSyncDataPath(data);
    }
    // Resolves synchronous property access
    _resolveSyncDataPath(data) {
        for (const property of this._dataProperties)
            data = data && data[property];
        return data;
    }
    // Resolves asynchronous property access
    async _resolveAsyncDataPath(data) {
        for (const property of this._dataProperties)
            data = data && await data[property];
        return data;
    }
}
exports.default = DataHandler;
DataHandler.sync = handlerFactory({ async: false });
DataHandler.syncFunction = handlerFactory({ async: false, function: true });
DataHandler.async = handlerFactory({ async: true });
DataHandler.asyncFunction = handlerFactory({ async: true, function: true });
