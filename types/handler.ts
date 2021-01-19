export type LDflexHandleFunction = (pathData: any, path: any) => any; 

export interface LDflexHandler {
    handle : LDflexHandleFunction
}

export type LDflexProxyHandlers = {
    // @ts-ignore
    readonly [x: string]: LDflexHandler;
    readonly [Symbol.asyncIterator]: AsyncIterableIterator<any>;
} | {
    // @ts-ignore
    readonly __esModule: () => undefined;
};


// export type LDflexProxyHandlers = {
//     [handler in keyof Omit<keyof string, '__esModule'>]: LDflexHandler;
// } & {
//     __esModule: () => undefined;
//     [Symbol.asyncIterator]: any;
// };

// const myPropertyHandler: LDflexProxyHandlers = {
//     __esModule(): undefined {
//         return undefined
//     },
//     [Symbol.asyncIterator]: 4
// }

// console.log(myPropertyHandler)




// export type LDflexProxyHandler = {
//     __esModule?: () => undefined;
//     // @ts-ignore
//     [Symbol.asyncIterator]: AsyncIterableIterator<>; // TODO FIX
//     //[handler extends AllowedHandlerNames]: LDflexHandler // TODO : Fix type definition
// } & {
//     [handler: string]: LDflexHandler
// }

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