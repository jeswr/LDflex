import * as R from 'ramda'
export function hashCode(str : string): number {
    return str.split('').reduce((prevHash, currVal) =>
      // eslint-disable-line
      (((prevHash << 5) - prevHash) + currVal.charCodeAt(0))|0, 0);
}

export function asArray<T>(obj:  T): (T & any[]) | T[] {
  return Array.isArray(obj) ? obj : [ obj ]
}

/**
 * Take the n-ary cross product of each arguement
 * If an arguement is not an array it is converted
 * to an array with a single element to begin.
 */
export function xprods<T>(...args: any[]): any[] {
  return args.reduce((t, x) => R.xprod(t, asArray(x)).map(a => a.flat()))
}