import { namedNode } from '@rdfjs/data-model'
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
    return async (f : ((value: any, index?: number) => any) = item => item) => {
      // const fn = await (typeof f === 'object' && 'handle' in f ? f.handle : f)
      // return undefined
      return Promise.all((await map(path, async item => item)).map(async (v, i) => f(await v, i)))
    }
  }
}
