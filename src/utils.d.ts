export declare function hashCode(str: string): number;
export declare function asArray<T>(obj: T): (T & any[]) | T[];
/**
 * Take the n-ary cross product of each arguement
 * If an arguement is not an array it is converted
 * to an array with a single element to begin.
 */
export declare function xprods<T>(...args: any[]): any[];
