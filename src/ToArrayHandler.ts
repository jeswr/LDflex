import { map } from 'async'

/**
 * Converts an asynchronously iterable path into an array.
 *
 * Requires:
 * - (optional) an iterable path
 */
export default class ToArrayHandler {
  handle(pathData, path) {
    return async (f : (value: any, index?: number) => any = item => item) => 
      Promise.all((await map(path, async item => item)).map(async (v, i) => f(await v, i)))
  }
}
