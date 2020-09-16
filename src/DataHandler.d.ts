import { Data, MaybeFunction, MaybePromise } from "../types";
/**
 * Resolves to the given item in the path data.
 * For example, new DataHandler({}, 'foo', 'bar')
 * will return pathData.foo.bar.
 *
 * Resolution can optionally be async,
 * and/or be behind a function call.
 */
export default class DataHandler {
    private _isAsync;
    private _isFunction;
    private _dataProperties;
    constructor(options: {
        async: boolean;
        function?: boolean;
    }, ...dataProperties: string[]);
    static sync: (...dataProperties: string[]) => DataHandler;
    static syncFunction: (...dataProperties: string[]) => DataHandler;
    static async: (...dataProperties: string[]) => DataHandler;
    static asyncFunction: (...dataProperties: string[]) => DataHandler;
    handle(pathData: Data): MaybeFunction<MaybePromise<Data>>;
    _resolveDataPath(data: Data): MaybePromise<Data>;
    _resolveSyncDataPath(data: Data): Data;
    _resolveAsyncDataPath(data: Data): Promise<Data>;
}
