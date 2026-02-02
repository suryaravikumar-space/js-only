/**
 * GENERATORS & ITERATORS: 01 - for...of Loop
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ for...of iterates over VALUES of iterables (arrays, strings, maps, sets)   ║
 * ║ for...in iterates over KEYS/INDICES of objects (including inherited)       ║
 * ║                                                                            ║
 * ║   for (const value of [1, 2, 3]) { }   // 1, 2, 3 (values)                  ║
 * ║   for (const key in { a: 1, b: 2 }) { }  // 'a', 'b' (keys)                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE EACH - Decision Guide                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ for...of - USE FOR:                                                         │
 * │ ✓ Arrays, Strings, Maps, Sets (all iterables)                               │
 * │ ✓ When you need VALUES                                                      │
 * │ ✓ When you want to use break/continue                                       │
 * │ ✓ When order matters                                                        │
 * │                                                                             │
 * │ for...in - USE FOR:                                                         │
 * │ ✓ Plain objects (when you need keys)                                        │
 * │ ✗ AVOID for arrays (includes inherited, wrong order possible)               │
 * │                                                                             │
 * │ forEach - USE FOR:                                                          │
 * │ ✓ Arrays when you don't need break/continue                                 │
 * │ ✗ Cannot break out of forEach                                               │
 * │                                                                             │
 * │ Object.keys/values/entries - USE FOR:                                       │
 * │ ✓ Objects when you want to iterate with array methods                       │
 * │ ✓ Only own properties (not inherited)                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// for...of vs for...in - THE KEY DIFFERENCE
// ═══════════════════════════════════════════════════════════════════════════════

const arr = ['a', 'b', 'c'];

console.log('for...of (VALUES):');
for (const value of arr) {
  console.log('A:', value);  // 'a', 'b', 'c'
}

console.log('\nfor...in (INDICES):');
for (const index in arr) {
  console.log('B:', index);  // '0', '1', '2' (strings!)
}

/**
 * OUTPUT:
 *   for...of (VALUES):
 *   A: a
 *   A: b
 *   A: c
 *
 *   for...in (INDICES):
 *   B: 0
 *   B: 1
 *   B: 2
 */


// ═══════════════════════════════════════════════════════════════════════════════
// DANGER: for...in WITH ARRAYS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY NEVER USE for...in WITH ARRAYS                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Iterates over ALL enumerable properties (not just indices)               │
 * │ 2. Includes inherited properties                                            │
 * │ 3. Order is not guaranteed                                                  │
 * │ 4. Indices are strings, not numbers                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const arr2 = ['x', 'y'];
arr2.custom = 'oops';  // Non-index property

console.log('C: for...in includes non-index properties:');
for (const key in arr2) {
  console.log(`  ${key}: ${arr2[key]}`);
}

console.log('\nD: for...of only gets values:');
for (const value of arr2) {
  console.log(`  ${value}`);
}

/**
 * OUTPUT:
 *   C: for...in includes non-index properties:
 *     0: x
 *     1: y
 *     custom: oops  ← PROBLEM!
 *
 *   D: for...of only gets values:
 *     x
 *     y
 */


// ═══════════════════════════════════════════════════════════════════════════════
// for...of WITH DIFFERENT ITERABLES
// ═══════════════════════════════════════════════════════════════════════════════

// STRINGS - character by character
console.log('E: Iterating string:');
for (const char of 'Hello') {
  console.log(`  '${char}'`);
}

// MAPS - [key, value] pairs (with destructuring)
const userMap = new Map([
  ['alice', 30],
  ['bob', 25]
]);

console.log('\nF: Iterating Map:');
for (const [name, age] of userMap) {
  console.log(`  ${name} is ${age}`);
}

// SETS - unique values
const uniqueNums = new Set([1, 2, 2, 3, 3, 3]);

console.log('\nG: Iterating Set:');
for (const num of uniqueNums) {
  console.log(`  ${num}`);
}

// NodeList (in browser) - would work the same
// const divs = document.querySelectorAll('div');
// for (const div of divs) { ... }

/**
 * OUTPUT:
 *   E: Iterating string:
 *     'H'
 *     'e'
 *     'l'
 *     'l'
 *     'o'
 *
 *   F: Iterating Map:
 *     alice is 30
 *     bob is 25
 *
 *   G: Iterating Set:
 *     1
 *     2
 *     3
 */


// ═══════════════════════════════════════════════════════════════════════════════
// for...of WITH INDEX (using entries())
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN YOU NEED BOTH INDEX AND VALUE                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Option 1: entries() method                                                  │
 * │   for (const [index, value] of arr.entries()) { }                           │
 * │                                                                             │
 * │ Option 2: forEach with index                                                │
 * │   arr.forEach((value, index) => { })                                        │
 * │                                                                             │
 * │ Option 3: Classic for loop                                                  │
 * │   for (let i = 0; i < arr.length; i++) { }                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fruits = ['apple', 'banana', 'cherry'];

console.log('H: for...of with entries():');
for (const [index, fruit] of fruits.entries()) {
  console.log(`  ${index}: ${fruit}`);
}

/**
 * OUTPUT:
 *   H: for...of with entries():
 *     0: apple
 *     1: banana
 *     2: cherry
 */


// ═══════════════════════════════════════════════════════════════════════════════
// break AND continue WORK WITH for...of
// ═══════════════════════════════════════════════════════════════════════════════

const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

console.log('I: break example (stop at 5):');
for (const num of numbers) {
  if (num > 5) break;
  console.log(`  ${num}`);
}

console.log('\nJ: continue example (skip even):');
for (const num of numbers) {
  if (num % 2 === 0) continue;
  if (num > 7) break;
  console.log(`  ${num}`);
}

/**
 * OUTPUT:
 *   I: break example (stop at 5):
 *     1
 *     2
 *     3
 *     4
 *     5
 *
 *   J: continue example (skip even):
 *     1
 *     3
 *     5
 *     7
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PLAIN OBJECTS ARE NOT ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

const person = {
  name: 'Alice',
  age: 30,
  city: 'NYC'
};

// This would throw: TypeError: person is not iterable
// for (const value of person) { }

// SOLUTIONS:

// 1. Object.keys()
console.log('K: Object.keys():');
for (const key of Object.keys(person)) {
  console.log(`  ${key}: ${person[key]}`);
}

// 2. Object.values()
console.log('\nL: Object.values():');
for (const value of Object.values(person)) {
  console.log(`  ${value}`);
}

// 3. Object.entries()
console.log('\nM: Object.entries():');
for (const [key, value] of Object.entries(person)) {
  console.log(`  ${key}: ${value}`);
}

/**
 * OUTPUT:
 *   K: Object.keys():
 *     name: Alice
 *     age: 30
 *     city: NYC
 *
 *   L: Object.values():
 *     Alice
 *     30
 *     NYC
 *
 *   M: Object.entries():
 *     name: Alice
 *     age: 30
 *     city: NYC
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON: ALL LOOP METHODS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LOOP COMPARISON TABLE                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌───────────────┬──────────────┬─────────┬──────────┬───────────────────┐   │
 * │ │ Method        │ Works on     │ break?  │ await?   │ Gets              │   │
 * │ ├───────────────┼──────────────┼─────────┼──────────┼───────────────────┤   │
 * │ │ for...of      │ Iterables    │ Yes     │ Yes      │ Values            │   │
 * │ │ for...in      │ All objects  │ Yes     │ Yes      │ Keys (strings)    │   │
 * │ │ forEach       │ Arrays       │ No      │ No*      │ Value, index      │   │
 * │ │ for (;;)      │ Arrays       │ Yes     │ Yes      │ Index             │   │
 * │ │ .map/.filter  │ Arrays       │ No      │ No       │ Value             │   │
 * │ │ while         │ Anything     │ Yes     │ Yes      │ Anything          │   │
 * │ └───────────────┴──────────────┴─────────┴──────────┴───────────────────┘   │
 * │                                                                             │
 * │ * forEach doesn't wait for async callbacks - use for...of with await        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// forEach CANNOT break
console.log('N: forEach cannot break (iterates all):');
[1, 2, 3, 4, 5].forEach(num => {
  if (num === 3) return;  // return only skips THIS iteration, doesn't break
  console.log(`  ${num}`);
});

/**
 * OUTPUT:
 *   N: forEach cannot break (iterates all):
 *     1
 *     2
 *     4
 *     5
 */


// ═══════════════════════════════════════════════════════════════════════════════
// for...of WITH ASYNC/AWAIT
// ═══════════════════════════════════════════════════════════════════════════════

async function processItems(items) {
  console.log('O: for...of with await (sequential):');

  for (const item of items) {
    // Each await completes before next iteration
    await new Promise(resolve => setTimeout(resolve, 100));
    console.log(`  Processed: ${item}`);
  }

  console.log('  All done!');
}

// This is sequential - each item waits for previous
processItems(['item1', 'item2', 'item3']);

// Note: forEach with async doesn't work as expected!
// items.forEach(async (item) => {
//   await something(item);  // These run in parallel, not sequential!
// });

/**
 * OUTPUT:
 *   O: for...of with await (sequential):
 *     Processed: item1
 *     Processed: item2
 *     Processed: item3
 *     All done!
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "for...of and for...in serve different purposes:                            │
 * │                                                                             │
 * │ for...of:                                                                   │
 * │ - Iterates over VALUES of iterables (Array, String, Map, Set)               │
 * │ - Works with any object that has Symbol.iterator                            │
 * │ - Supports break, continue, and await                                       │
 * │ - Does NOT work with plain objects                                          │
 * │                                                                             │
 * │ for...in:                                                                   │
 * │ - Iterates over enumerable property KEYS                                    │
 * │ - Includes inherited properties                                             │
 * │ - Returns strings (even for array indices)                                  │
 * │ - AVOID for arrays - use for...of instead                                   │
 * │                                                                             │
 * │ Why avoid for...in with arrays?                                             │
 * │ 1. Includes non-index properties (arr.custom = 'x')                         │
 * │ 2. Includes inherited enumerable properties                                 │
 * │ 3. Order not guaranteed in all cases                                        │
 * │ 4. Indices are strings, not numbers                                         │
 * │                                                                             │
 * │ For objects, use Object.keys/values/entries() + for...of                    │
 * │ for (const [key, value] of Object.entries(obj)) { }                         │
 * │                                                                             │
 * │ For async iteration, use for...of (forEach doesn't wait for promises)."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/01-for-of-loop.js
 */
