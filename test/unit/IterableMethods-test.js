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
const IterableMethods = __importStar(require("../../src/IterableMethodsHandler"));
describe('find method handlers', () => {
    let handler, nullPath, objectPath, arrayPath, emptyIteratorPath, filledArray, emptyClass;
    beforeAll(() => {
        nullPath = null;
        objectPath = {};
        arrayPath = [];
        emptyIteratorPath = asyncIteratorOf([]);
        filledArray = [1, 2, 3];
        emptyClass = [
            nullPath,
            objectPath,
            arrayPath,
            emptyIteratorPath
        ];
        handler = new IterableMethods.find();
    });
    describe('check behavior on normal array', () => {
        it('finds element greater than 2.5', async () => {
            const find = handler.handle(null, filledArray);
            expect(await find(x => x > 2.5)).toEqual(3);
        });
    });
    describe('check behavior on array with promised & non-promised elements', () => {
        it('works on a normal with non-promised elements', async () => {
            const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
            expect(await find(x => x == 'c')).toEqual('c');
        });
    });
    describe('check behavior on array with promised elements', () => {
        it('works on a normal with promised elements', async () => {
            const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
            expect(await find(x => x == 'b')).toEqual('b');
        });
    });
    describe('check behavior on empty iterators', () => {
        it('works on empty iterators', async () => {
            for (const emtpyPath of emptyClass) {
                const find = handler.handle(null, emtpyPath);
                // TODO: Make test stricter
                expect(await find(() => true)).toBeFalsy();
            }
        });
    });
});
describe('findSeries method handlers', () => {
    let handler, nullPath, objectPath, arrayPath, emptyIteratorPath, filledArray, emptyClass;
    beforeAll(() => {
        nullPath = null;
        objectPath = {};
        arrayPath = [];
        emptyIteratorPath = asyncIteratorOf([]);
        filledArray = [1, 2, 3];
        emptyClass = [
            nullPath,
            objectPath,
            arrayPath,
            emptyIteratorPath
        ];
        handler = new IterableMethods.findSeries();
    });
    describe('check behavior on normal array', () => {
        it('finds element greater than 2.5', async () => {
            const find = handler.handle(null, filledArray);
            expect(await find(x => x > 2.5)).toEqual(3);
        });
    });
    describe('check behavior on array with promised & non-promised elements', () => {
        it('works on a normal with non-promised elements', async () => {
            const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
            expect(await find(x => x === 'c')).toEqual('c');
        });
    });
    describe('check behavior on array with promised elements', () => {
        it('works on a normal with promised elements', async () => {
            const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
            expect(await find(x => x === 'b')).toEqual('b');
        });
    });
    describe('check behavior on empty iterators', () => {
        it('works on empty iterators', async () => {
            for (const emtpyPath of emptyClass) {
                const find = handler.handle(null, emtpyPath);
                // TODO: Make test stricter
                expect(await find(() => true)).toBeFalsy();
            }
        });
    });
});
describe('findLimit method handlers', () => {
    let handler, nullPath, objectPath, arrayPath, emptyIteratorPath, filledArray, emptyClass;
    beforeAll(() => {
        nullPath = null;
        objectPath = {};
        arrayPath = [];
        emptyIteratorPath = asyncIteratorOf([]);
        filledArray = [1, 2, 3];
        emptyClass = [
            nullPath,
            objectPath,
            arrayPath,
            emptyIteratorPath
        ];
        handler = new IterableMethods.findLimit();
    });
    describe('check behavior on normal array', () => {
        it('finds element greater than 2.5', async () => {
            const find = handler.handle(null, filledArray);
            expect(await find(x => x > 2.5)).toEqual(3);
        });
    });
    describe('check behavior on array with promised & non-promised elements', () => {
        it('works on a normal with non-promised elements', async () => {
            const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
            expect(await find(x => x === 'c')).toEqual('c');
        });
    });
    describe('check behavior on array with promised elements', () => {
        it('works on a normal with promised elements', async () => {
            const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']));
            expect(await find(x => x === 'b')).toEqual('b');
        });
    });
    describe('check behavior on empty iterators', () => {
        it('works on empty iterators', async () => {
            for (const emtpyPath of emptyClass) {
                const find = handler.handle(null, emtpyPath);
                // TODO: Make test stricter
                expect(await find(() => true)).toBeFalsy();
            }
        });
    });
});
async function* asyncIteratorOf(items) {
    for (const item of items)
        yield item;
}
