import { map } from 'async'
import { Data } from '../types'

/**
 * Converts an asynchronously iterable path into an array.
 * This operation is parallelized
 * 
 * Requires:
 * - (optional) an iterable path
 */
export default class ToArrayHandler {
  handle(pathData: Data, path: Data) {
    return async (f : (value: any, index?: number) => any = item => item) => 
      Promise.all((await map(path, async item => item)).map(async (v, i) => f(await v, i)))
  }
}
