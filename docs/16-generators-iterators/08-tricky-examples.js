/**
 * GENERATORS & ITERATORS: 08 - Tricky Interview Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMMON INTERVIEW GOTCHAS FOR GENERATORS & ITERATORS                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Most questions test:                                                       ║
 * ║   1. Understanding yield/return difference                                 ║
 * ║   2. How values flow with next(value)                                      ║
 * ║   3. Generator exhaustion                                                  ║
 * ║   4. for...of vs for...in                                                  ║
 * ║   5. What is and isn't iterable                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: First next() Value is Ignored
// ═══════════════════════════════════════════════════════════════════════════════

function* echo() {
  const received = yield 'ready';
  return `You said: ${received}`;
}

const gen1 = echo();

console.log('A:', gen1.next('IGNORED'));  // ?
console.log('B:', gen1.next('Hello'));    // ?

/**
 * OUTPUT:
 *   A: { value: 'ready', done: false }
 *   B: { value: 'You said: Hello', done: true }
 *
 * WHY: First next() starts generator until first yield.
 * There's no yield to receive the value yet, so it's ignored!
 * Second next('Hello') resumes, and 'Hello' becomes the yield result.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: return Value Not Included in for...of
// ═══════════════════════════════════════════════════════════════════════════════

function* generator() {
  yield 1;
  yield 2;
  return 3;
}

console.log('C: for...of result:', [...generator()]);  // ?

const gen2 = generator();
console.log('D:', gen2.next());  // ?
console.log('E:', gen2.next());  // ?
console.log('F:', gen2.next());  // ?

/**
 * OUTPUT:
 *   C: for...of result: [1, 2]  // NO 3!
 *   D: { value: 1, done: false }
 *   E: { value: 2, done: false }
 *   F: { value: 3, done: true }  // 3 is here but with done: true
 *
 * WHY: for...of stops when done: true and doesn't include that value.
 * Manual iteration with next() shows the return value.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Generator Exhaustion
// ═══════════════════════════════════════════════════════════════════════════════

function* oneTwoThree() {
  yield 1;
  yield 2;
  yield 3;
}

const gen3 = oneTwoThree();

console.log('G: First iteration:', [...gen3]);   // ?
console.log('H: Second iteration:', [...gen3]);  // ?

/**
 * OUTPUT:
 *   G: First iteration: [1, 2, 3]
 *   H: Second iteration: []  // Empty!
 *
 * WHY: Generators are ONE-TIME USE. Once exhausted, they're done forever.
 * You need a new generator instance to iterate again.
 */

// Fix: Use a function that returns new generator
const getNumbers = () => oneTwoThree();
console.log('I: Fresh generator:', [...getNumbers()]);
console.log('J: Another fresh:', [...getNumbers()]);


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: yield* vs yield with Arrays
// ═══════════════════════════════════════════════════════════════════════════════

function* withYield() {
  yield [1, 2, 3];
}

function* withYieldStar() {
  yield* [1, 2, 3];
}

console.log('K: yield array:', [...withYield()]);      // ?
console.log('L: yield* array:', [...withYieldStar()]); // ?

/**
 * OUTPUT:
 *   K: yield array: [[1, 2, 3]]  // Array inside array!
 *   L: yield* array: [1, 2, 3]   // Flat!
 *
 * WHY: yield yields the value AS-IS.
 * yield* iterates and yields EACH element.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: What is Iterable?
// ═══════════════════════════════════════════════════════════════════════════════

function testIterable(value, name) {
  try {
    console.log(`  ${name}:`, [...value]);
  } catch (e) {
    console.log(`  ${name}: NOT ITERABLE - ${e.message}`);
  }
}

console.log('M: Testing iterability:');
testIterable([1, 2, 3], 'Array');
testIterable('hello', 'String');
testIterable(new Map([['a', 1]]), 'Map');
testIterable(new Set([1, 2]), 'Set');
testIterable({ a: 1, b: 2 }, 'Object');
testIterable(123, 'Number');

/**
 * OUTPUT:
 *   M: Testing iterability:
 *     Array: [1, 2, 3]
 *     String: ['h', 'e', 'l', 'l', 'o']
 *     Map: [['a', 1]]
 *     Set: [1, 2]
 *     Object: NOT ITERABLE
 *     Number: NOT ITERABLE
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 6: for...of vs for...in with Arrays
// ═══════════════════════════════════════════════════════════════════════════════

const arr = ['a', 'b', 'c'];
arr.custom = 'extra';

console.log('N: for...of (values):');
for (const val of arr) {
  console.log(`  ${val}`);
}

console.log('O: for...in (keys):');
for (const key in arr) {
  console.log(`  ${key}: ${arr[key]}`);
}

/**
 * OUTPUT:
 *   N: for...of (values):
 *     a
 *     b
 *     c
 *   O: for...in (keys):
 *     0: a
 *     1: b
 *     2: c
 *     custom: extra  ← INCLUDES non-index properties!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 7: Generator Return Value with yield*
// ═══════════════════════════════════════════════════════════════════════════════

function* inner() {
  yield 'a';
  yield 'b';
  return 'inner done';
}

function* outer() {
  const result = yield* inner();
  yield `result: ${result}`;
}

console.log('P: yield* captures return:', [...outer()]);  // ?

/**
 * OUTPUT:
 *   P: yield* captures return: ['a', 'b', 'result: inner done']
 *
 * WHY: yield* returns the return value of the delegated generator,
 * which can be captured and used!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 8: throw() in Generator
// ═══════════════════════════════════════════════════════════════════════════════

function* catchDemo() {
  try {
    yield 1;
    yield 2;  // Error thrown here
    yield 3;
  } catch (e) {
    yield `caught: ${e.message}`;
  }
  yield 4;
}

const gen4 = catchDemo();
console.log('Q:', gen4.next());                    // ?
console.log('R:', gen4.throw(new Error('oops'))); // ?
console.log('S:', gen4.next());                    // ?

/**
 * OUTPUT:
 *   Q: { value: 1, done: false }
 *   R: { value: 'caught: oops', done: false }
 *   S: { value: 4, done: false }
 *
 * WHY: throw() injects error at yield point.
 * If caught inside generator, execution continues from catch block.
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 9: return() Triggers finally
// ═══════════════════════════════════════════════════════════════════════════════

function* withFinally() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } finally {
    console.log('  Finally runs!');
  }
}

const gen5 = withFinally();
console.log('T:', gen5.next());
console.log('U:', gen5.return('early'));
console.log('V:', gen5.next());

/**
 * OUTPUT:
 *   T: { value: 1, done: false }
 *     Finally runs!
 *   U: { value: 'early', done: true }
 *   V: { value: undefined, done: true }
 *
 * WHY: return() ends generator early but STILL runs finally block!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 10: Multiple Values Passed to next()
// ═══════════════════════════════════════════════════════════════════════════════

function* multipleYields() {
  const a = yield 'first';
  const b = yield 'second';
  const c = yield 'third';
  return `${a}-${b}-${c}`;
}

const gen6 = multipleYields();
console.log('W:', gen6.next());       // Start, gets 'first'
console.log('X:', gen6.next('A'));    // a = 'A', gets 'second'
console.log('Y:', gen6.next('B'));    // b = 'B', gets 'third'
console.log('Z:', gen6.next('C'));    // c = 'C', returns 'A-B-C'

/**
 * OUTPUT:
 *   W: { value: 'first', done: false }
 *   X: { value: 'second', done: false }
 *   Y: { value: 'third', done: false }
 *   Z: { value: 'A-B-C', done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 11: Nested Generators Execution Order
// ═══════════════════════════════════════════════════════════════════════════════

function* gen_a() {
  console.log('  a: before yield');
  yield 'A';
  console.log('  a: after yield');
}

function* gen_b() {
  console.log('  b: before yield*');
  yield* gen_a();
  console.log('  b: after yield*');
  yield 'B';
}

console.log('AA: Nested generator execution:');
const genNested = gen_b();
console.log(genNested.next());
console.log(genNested.next());
console.log(genNested.next());

/**
 * OUTPUT:
 *   AA: Nested generator execution:
 *     b: before yield*
 *     a: before yield
 *   { value: 'A', done: false }
 *     a: after yield
 *     b: after yield*
 *   { value: 'B', done: false }
 *   { value: undefined, done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 12: Iterator vs Generator
// ═══════════════════════════════════════════════════════════════════════════════

// Manual iterator
const manualIterator = {
  values: [1, 2, 3],
  index: 0,
  next() {
    if (this.index < this.values.length) {
      return { value: this.values[this.index++], done: false };
    }
    return { value: undefined, done: true };
  },
  [Symbol.iterator]() { return this; }
};

// Generator (much cleaner!)
function* generatorIterator() {
  yield* [1, 2, 3];
}

console.log('AB: Manual iterator:', [...manualIterator]);
console.log('AC: Generator:', [...generatorIterator()]);

/**
 * OUTPUT:
 *   AB: Manual iterator: [1, 2, 3]
 *   AC: Generator: [1, 2, 3]
 *
 * Same result, but generator is MUCH cleaner to write!
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER - Common Generator Gotchas                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Key gotchas to remember:                                                   │
 * │                                                                             │
 * │ 1. FIRST next() VALUE IS IGNORED                                            │
 * │    - Generator hasn't reached yield yet                                     │
 * │    - Value passed to first next() is lost                                   │
 * │                                                                             │
 * │ 2. return VALUE NOT IN for...of                                             │
 * │    - for...of stops at done: true, ignores that value                       │
 * │    - Use manual next() to get return value                                  │
 * │                                                                             │
 * │ 3. GENERATORS ARE ONE-TIME USE                                              │
 * │    - Once exhausted, always returns done: true                              │
 * │    - Create new instance to iterate again                                   │
 * │                                                                             │
 * │ 4. yield vs yield*                                                          │
 * │    - yield [1,2,3] → yields the array as one value                          │
 * │    - yield* [1,2,3] → yields 1, then 2, then 3                              │
 * │                                                                             │
 * │ 5. PLAIN OBJECTS NOT ITERABLE                                               │
 * │    - {} doesn't have Symbol.iterator                                        │
 * │    - Use Object.entries/keys/values with for...of                           │
 * │                                                                             │
 * │ 6. for...of vs for...in                                                     │
 * │    - for...of: iterates VALUES of iterables                                 │
 * │    - for...in: iterates KEYS including inherited properties                 │
 * │                                                                             │
 * │ 7. throw() and return() RESPECT finally                                     │
 * │    - finally block always runs, even with early termination"               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/08-tricky-examples.js
 */
