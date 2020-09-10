import * as IterableMethods from '../../src/IterableMethodsHandler'

describe('find method handlers', () => {
  let handler, nullPath, objectPath, arrayPath,
    emptyIteratorPath, filledArray, elementIterator, emptyClass;

  beforeAll(() => {
    nullPath = null;
    objectPath = {};
    arrayPath = [];
    emptyIteratorPath = asyncIteratorOf([]);
    filledArray = [1, 2, 3];
    elementIterator = asyncIteratorOf(['a', Promise.resolve('b'), 'c'])

    emptyClass = [
      nullPath,
      objectPath,
      arrayPath,
      emptyIteratorPath
    ]
    handler = new IterableMethods.find()
  })

  describe('check behavior on normal array', () => {
    it('finds element greater than 2.5', async () => {
      const find = handler.handle(null, filledArray)
      expect(await find(x => x > 2.5)).toEqual(3)
    })
  })

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with non-promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']))
      expect(await find(x => x == 'c')).toEqual('c')
    })
  })

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']))
      expect(await find(x => x == 'b')).toEqual('b')
    })
  })

  describe('check behavior on empty iterators', () => {
    it('works on empty iterators', async () => {
      for (const emtpyPath of emptyClass) {
        const find = handler.handle(null, arrayPath)
        // TODO: Make test stricter
        expect(await find(x => true)).toBeFalsy()
      }
    })
  })
})

describe('find method handlers', () => {
  let handler, nullPath, objectPath, arrayPath,
    emptyIteratorPath, filledArray, elementIterator, emptyClass;

  beforeAll(() => {
    nullPath = null;
    objectPath = {};
    arrayPath = [];
    emptyIteratorPath = asyncIteratorOf([]);
    filledArray = [1, 2, 3];
    elementIterator = asyncIteratorOf(['a', Promise.resolve('b'), 'c'])

    emptyClass = [
      nullPath,
      objectPath,
      arrayPath,
      emptyIteratorPath
    ]
    handler = new IterableMethods.findSeries()
  })

  describe('check behavior on normal array', () => {
    it('finds element greater than 2.5', async () => {
      const find = handler.handle(null, filledArray)
      expect(await find(x => x > 2.5)).toEqual(3)
    })
  })

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with non-promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']))
      expect(await find(x => x == 'c')).toEqual('c')
    })
  })

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']))
      expect(await find(x => x == 'b')).toEqual('b')
    })
  })

  describe('check behavior on empty iterators', () => {
    it('works on empty iterators', async () => {
      for (const emtpyPath of emptyClass) {
        const find = handler.handle(null, arrayPath)
        // TODO: Make test stricter
        expect(await find(x => true)).toBeFalsy()
      }
    })
  })
})

describe('find method handlers', () => {
  let handler, nullPath, objectPath, arrayPath,
    emptyIteratorPath, filledArray, elementIterator, emptyClass;

  beforeAll(() => {
    nullPath = null;
    objectPath = {};
    arrayPath = [];
    emptyIteratorPath = asyncIteratorOf([]);
    filledArray = [1, 2, 3];
    elementIterator = asyncIteratorOf(['a', Promise.resolve('b'), 'c'])

    emptyClass = [
      nullPath,
      objectPath,
      arrayPath,
      emptyIteratorPath
    ]
    handler = new IterableMethods.findLimit()
  })

  describe('check behavior on normal array', () => {
    it('finds element greater than 2.5', async () => {
      const find = handler.handle(null, filledArray)
      expect(await find(x => x > 2.5)).toEqual(3)
    })
  })

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with non-promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']))
      expect(await find(x => x == 'c')).toEqual('c')
    })
  })

  describe('check behavior on array with promised elements', () => {
    it('works on a normal with promised elements', async () => {
      const find = handler.handle(null, asyncIteratorOf(['a', Promise.resolve('b'), 'c']))
      expect(await find(x => x == 'b')).toEqual('b')
    })
  })

  describe('check behavior on empty iterators', () => {
    it('works on empty iterators', async () => {
      for (const emtpyPath of emptyClass) {
        const find = handler.handle(null, arrayPath)
        // TODO: Make test stricter
        expect(await find(x => true)).toBeFalsy()
      }
    })
  })
})

async function* asyncIteratorOf(items) {
  for (const item of items)
    yield item;
}