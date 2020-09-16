export declare type MaybePromise<T> = Promise<T> | T;
export declare type MaybeFunction<T> = T | (() => T);
export declare type MaybeArray<T> = T | T[];
export declare type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
