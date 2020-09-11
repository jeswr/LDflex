export type MaybePromise<T> = Promise<T> | T
export type MaybeFunction<T> = T | (() => T)
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;