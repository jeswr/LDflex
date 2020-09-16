export declare type LDflexHandleFunction = (pathData: any, path: any) => any;
export interface LDflexHandler {
    handle: LDflexHandleFunction;
}
export declare type LDflexProxyHandlers = {
    readonly [x: string]: LDflexHandler;
    readonly [Symbol.asyncIterator]: AsyncIterableIterator<any>;
} | {
    readonly __esModule: () => undefined;
};
