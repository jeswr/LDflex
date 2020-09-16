/**
 * Returns the elements of the iterable as an array
 */
export declare function iterableToArray<T>(iterable: Iterable<T>): Promise<T[]>;
/**
 * Gets the first element of the iterable.
 */
export declare function getFirstItem<T>(iterable: Iterable<T>): T;
/**
 * Creates an async iterator with the item as only element.
 */
export declare function iteratorFor<T>(item: any): {
    next(): Promise<{
        value: any;
        done?: undefined;
    } | {
        done: boolean;
        value?: undefined;
    }>;
};
