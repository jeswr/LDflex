import * as async from 'async'

function IterableMethodsFactory (asyncFunction: Function) {
  return class {
    handle(pathData, path) {
      return (parameterFunction: Function, memo?: any) =>
        asyncFunction(path, memo ?? (async item => parameterFunction(item)), memo)
    }
  }
}

function IterableLimitMethodsFactory (asyncFunction: Function) {
  return class {
    handle(pathData, path) {
      return (parameterFunction: Function, limit: number = 5) =>
        asyncFunction(path, limit, async item => parameterFunction(item))
    }
  }
}

export const find = IterableMethodsFactory(async.detect)
export const findLimit = IterableLimitMethodsFactory(async.detectLimit)
export const findSeries = IterableMethodsFactory(async.detectSeries)

// TODO: ADD TESTS FOR BELOW FUNCTIONS
export const forEach = IterableMethodsFactory(async.each)
export const forEachLimit = IterableLimitMethodsFactory(async.eachLimit)
export const forEachSeries = IterableLimitMethodsFactory(async.eachSeries)

export const forEachOf = IterableMethodsFactory(async.eachOf)
export const forEachOfLimit = IterableLimitMethodsFactory(async.eachOfLimit)
export const forEachOfSeries = IterableMethodsFactory(async.eachOfSeries)

export const every = IterableMethodsFactory(async.every)
export const everyLimit = IterableLimitMethodsFactory(async.everyLimit)
export const everySeries = IterableMethodsFactory(async.everySeries)

export const filter = IterableMethodsFactory(async.filter)
export const filterLimit = IterableLimitMethodsFactory(async.filterLimit)
export const filterSeries = IterableMethodsFactory(async.filterSeries)

export const map = IterableMethodsFactory(async.map)
export const mapLimit = IterableLimitMethodsFactory(async.mapLimit)
export const mapSeries = IterableMethodsFactory(async.mapSeries)

export const reduce = IterableMethodsFactory(async.reduce)
export const reduceRight = IterableMethodsFactory(async.reduceRight)

export const reject = IterableMethodsFactory(async.reject)
export const rejectLimit = IterableLimitMethodsFactory(async.rejectLimit)
export const rejectSeries = IterableMethodsFactory(async.rejectSeries)

export const some = IterableMethodsFactory(async.some)
export const someLimit = IterableLimitMethodsFactory(async.someLimit)
export const someSeries = IterableMethodsFactory(async.someSeries)
// May be some issues because of the 2nd arg accumulartor
export const transform = IterableMethodsFactory(async.transform)

// transform : asAsyncMethod(asy.transform),
// applyEach : asAsyncMethod(asy.applyEach),
// applyEachSeries : asAsyncMethod(asy.applyEachSeries),
// auto : asAsyncMethod(asy.auto),
// autoInject : asAsyncMethod(asy.autoInject),
// doUntil : asAsyncMethod(asy.doUntil),
// doWhilst : asAsyncMethod(asy.doWhilst),
// forever : asAsyncMethod(asy.forever),
// parallel : asAsyncMethod(asy.parallel),
// parallelLimit : asAsyncMethod(asy.parallelLimit),
// priorityQueue : asAsyncMethod(asy.priorityQueue),
// queue : asAsyncMethod(asy.queue),
// race : asAsyncMethod(asy.race),
// retry : asAsyncMethod(asy.retry),
// retryable : asAsyncMethod(asy.retryable),
// seq : asAsyncMethod(asy.seq),
// series : asAsyncMethod(asy.series),
// times : asAsyncMethod(asy.times), // Posiion 2
// timesLimit : asAsyncMethod(asy.timesLimit), // Po2
// timesSeries : asAsyncMethod(asy.timesSeries), // Po1
// // tryEach : asAsyncMethod(asy.tryEach),
// until : asAsyncMethod(asy.until),
// whilst : asAsyncMethod(asy.whilst),