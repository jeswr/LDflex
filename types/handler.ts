export type LDflexHandleFunction = (pathData: any, path: any) => any; 

export interface LDflexHandler {
    handle : LDflexHandleFunction
}

export type LDflexProxyHandler = {
    __esModule?: () => undefined;
    // @ts-ignore
    [Symbol.asyncIterator]: AsyncIterableIterator<>; // TODO FIX
    //[handler extends AllowedHandlerNames]: LDflexHandler // TODO : Fix type definition
} & {
    [handler: string]: LDflexHandler
}

// export type LDflexProxyHandler = {
//     [handler in keyof Omit<string, '_esModule'>]: LDflexHandler;
// } & {
//     _esModule(): undefined;
// };

// const x : LDflexProxyHandler = {
//     _esModule : () => undefined
// }

// console.log(x)

//ProxyHandler<LDflexHandler>