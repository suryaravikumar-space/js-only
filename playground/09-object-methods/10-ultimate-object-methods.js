// CHALLENGE 10: Ultimate Object Methods Challenge
//
// What prints for A, B, C, D, E?

// Challenge 1: Transform object with entries/fromEntries
var inventory = { apples: 5, bananas: 3, oranges: 8 };
var doubled = Object.fromEntries(
  Object.entries(inventory).map(([k, v]) => [k, v * 2])
);
console.log('A:', doubled.bananas);

// Challenge 2: Deep freeze check
var nested = { outer: { inner: { value: 1 } } };
Object.freeze(nested);
Object.freeze(nested.outer);
nested.outer.inner.value = 999;
console.log('B:', nested.outer.inner.value);

// Challenge 3: Combining all property methods
var complex = { a: 1 };
Object.defineProperty(complex, 'b', { value: 2, enumerable: false });
complex[Symbol('c')] = 3;

var keysCount = Object.keys(complex).length;
var namesCount = Object.getOwnPropertyNames(complex).length;
var symbolsCount = Object.getOwnPropertySymbols(complex).length;
var reflectCount = Reflect.ownKeys(complex).length;

console.log('C:', keysCount, namesCount, symbolsCount, reflectCount);

// Challenge 4: Object.is edge cases
var results = [
  Object.is(NaN, NaN),
  Object.is(0, -0),
  Object.is(null, undefined),
  Object.is([], [])
];
console.log('D:', results.filter(Boolean).length);

// Challenge 5: Seal vs Freeze behavior
var sealed = Object.seal({ count: 0, items: [] });
var frozen = Object.freeze({ count: 0, items: [] });

sealed.count = 10;
sealed.items.push('a');
frozen.count = 10;
frozen.items.push('b');

console.log('E:', sealed.count, sealed.items.length, frozen.count, frozen.items.length);
