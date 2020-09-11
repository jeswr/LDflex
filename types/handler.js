"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
