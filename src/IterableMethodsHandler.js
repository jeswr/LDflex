"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transform = exports.someSeries = exports.someLimit = exports.some = exports.rejectSeries = exports.rejectLimit = exports.reject = exports.reduceRight = exports.reduce = exports.mapSeries = exports.mapLimit = exports.map = exports.filterSeries = exports.filterLimit = exports.filter = exports.everySeries = exports.everyLimit = exports.every = exports.forEachOfSeries = exports.forEachOfLimit = exports.forEachOf = exports.forEachSeries = exports.forEachLimit = exports.forEach = exports.findSeries = exports.findLimit = exports.find = void 0;
const async = __importStar(require("async"));
function IterableMethodsFactory(asyncFunction) {
    return class {
        handle(pathData, path) {
            return (parameterFunction, memo) => asyncFunction(path, memo ?? (async (item) => parameterFunction(item)), memo);
        }
    };
}
function IterableLimitMethodsFactory(asyncFunction) {
    return class {
        handle(pathData, path) {
            return (parameterFunction, limit = 5) => asyncFunction(path, limit, async (item) => parameterFunction(item));
        }
    };
}
exports.find = IterableMethodsFactory(async.detect);
exports.findLimit = IterableLimitMethodsFactory(async.detectLimit);
exports.findSeries = IterableMethodsFactory(async.detectSeries);
// TODO: ADD TESTS FOR BELOW FUNCTIONS
exports.forEach = IterableMethodsFactory(async.each);
exports.forEachLimit = IterableLimitMethodsFactory(async.eachLimit);
exports.forEachSeries = IterableLimitMethodsFactory(async.eachSeries);
exports.forEachOf = IterableMethodsFactory(async.eachOf);
exports.forEachOfLimit = IterableLimitMethodsFactory(async.eachOfLimit);
exports.forEachOfSeries = IterableMethodsFactory(async.eachOfSeries);
exports.every = IterableMethodsFactory(async.every);
exports.everyLimit = IterableLimitMethodsFactory(async.everyLimit);
exports.everySeries = IterableMethodsFactory(async.everySeries);
exports.filter = IterableMethodsFactory(async.filter);
exports.filterLimit = IterableLimitMethodsFactory(async.filterLimit);
exports.filterSeries = IterableMethodsFactory(async.filterSeries);
exports.map = IterableMethodsFactory(async.map);
exports.mapLimit = IterableLimitMethodsFactory(async.mapLimit);
exports.mapSeries = IterableMethodsFactory(async.mapSeries);
exports.reduce = IterableMethodsFactory(async.reduce);
exports.reduceRight = IterableMethodsFactory(async.reduceRight);
exports.reject = IterableMethodsFactory(async.reject);
exports.rejectLimit = IterableLimitMethodsFactory(async.rejectLimit);
exports.rejectSeries = IterableMethodsFactory(async.rejectSeries);
exports.some = IterableMethodsFactory(async.some);
exports.someLimit = IterableLimitMethodsFactory(async.someLimit);
exports.someSeries = IterableMethodsFactory(async.someSeries);
// May be some issues because of the 2nd arg accumulartor
exports.transform = IterableMethodsFactory(async.transform);
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
