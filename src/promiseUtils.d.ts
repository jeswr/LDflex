/**
 * Returns a lazy thenable to the created promise.
 */
export declare function lazyThenable(createPromise: any): {
    then: (onResolved: any, onRejected: any) => any;
};
/**
 * Lazily returns the `then` function of the created promise.
 */
export declare function getThen(createPromise: any): (onResolved: any, onRejected: any) => any;
/**
 * Returns an iterable that is also a promise to the first element.
 */
export declare function toIterablePromise(iterable: any): {
    [Symbol.asyncIterator](): any;
    readonly then: (onResolved: any, onRejected: any) => any;
    catch(onRejected: any): any;
    finally(callback: any): any;
};
/**
 * Returns a memoized version of the iterable
 * that can be iterated over as many times as needed.
 */
export declare function memoizeIterable(iterable: any): {
    [Symbol.asyncIterator](): {
        next(): Promise<any>;
    };
};
