/**
 * GENERATORS & ITERATORS: 00 - Iterator Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ An ITERATOR is an object with a next() method that returns:                ║
 * ║   { value: <any>, done: <boolean> }                                        ║
 * ║                                                                            ║
 * ║ An ITERABLE is any object with Symbol.iterator method that returns         ║
 * ║ an iterator. Arrays, strings, Maps, Sets are all iterable.                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY ITERATORS MATTER - Real World Justification                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. UNIFIED ITERATION PROTOCOL                                               │
 * │    → for...of works with ANY iterable                                       │
 * │    → [...spread] works with ANY iterable                                    │
 * │    → Array.from() works with ANY iterable                                   │
 * │                                                                             │
 * │ 2. LAZY EVALUATION                                                          │
 * │    → Don't load entire dataset into memory                                  │
 * │    → Process millions of records one at a time                              │
 * │    → Handle infinite sequences                                              │
 * │                                                                             │
 * │ 3. CUSTOM DATA STRUCTURES                                                   │
 * │    → Make your objects work with for...of                                   │
 * │    → LinkedLists, Trees, Graphs can be iterable                             │
 * │                                                                             │
 * │ 4. ASYNC DATA STREAMS                                                       │
 * │    → Async iterators for paginated APIs                                     │
 * │    → Process streaming data chunk by chunk                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHAT IS AN ITERATOR?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: How Iterators Work                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const arr = ['a', 'b', 'c'];                                              │
 * │   const iter = arr[Symbol.iterator]();  // Get iterator                     │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │ Iterator State                                                  │       │
 * │   │                                                                 │       │
 * │   │   ['a', 'b', 'c']                                               │       │
 * │   │     ↑                                                           │       │
 * │   │     └── Current position                                        │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   iter.next()  →  { value: 'a', done: false }                               │
 * │                                                                             │
 * │   ┌─────────────────────────────────────────────────────────────────┐       │
 * │   │   ['a', 'b', 'c']                                               │       │
 * │   │          ↑                                                      │       │
 * │   │          └── Moved forward                                      │       │
 * │   └─────────────────────────────────────────────────────────────────┘       │
 * │                                                                             │
 * │   iter.next()  →  { value: 'b', done: false }                               │
 * │   iter.next()  →  { value: 'c', done: false }                               │
 * │   iter.next()  →  { value: undefined, done: true }  ← Exhausted!            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Manual iterator usage
const arr = ['a', 'b', 'c'];
const iterator = arr[Symbol.iterator]();  // Get iterator from array

console.log('A:', iterator.next());  // { value: 'a', done: false }
console.log('B:', iterator.next());  // { value: 'b', done: false }
console.log('C:', iterator.next());  // { value: 'c', done: false }
console.log('D:', iterator.next());  // { value: undefined, done: true }
console.log('E:', iterator.next());  // { value: undefined, done: true } - stays done

/**
 * OUTPUT:
 *   A: { value: 'a', done: false }
 *   B: { value: 'b', done: false }
 *   C: { value: 'c', done: false }
 *   D: { value: undefined, done: true }
 *   E: { value: undefined, done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BUILT-IN ITERABLES
// ═══════════════════════════════════════════════════════════════════════════════

// Arrays are iterable
const fruits = ['apple', 'banana'];
for (const fruit of fruits) {
  console.log('F:', fruit);
}

// Strings are iterable (character by character)
const str = 'Hi';
for (const char of str) {
  console.log('G:', char);
}

// Maps are iterable (key-value pairs)
const map = new Map([['a', 1], ['b', 2]]);
for (const [key, value] of map) {
  console.log('H:', key, value);
}

// Sets are iterable
const set = new Set([1, 2, 3]);
for (const num of set) {
  console.log('I:', num);
}

/**
 * OUTPUT:
 *   F: apple
 *   F: banana
 *   G: H
 *   G: i
 *   H: a 1
 *   H: b 2
 *   I: 1
 *   I: 2
 *   I: 3
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CREATING A CUSTOM ITERATOR
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO CREATE CUSTOM ITERATORS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Custom data structures (LinkedList, Tree, Graph)                         │
 * │ 2. Lazy sequences (infinite ranges, fibonacci, etc.)                        │
 * │ 3. Combining multiple data sources                                          │
 * │ 4. Filtered/transformed views of data                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Manual iterator object
function createRangeIterator(start, end) {
  let current = start;

  return {
    next() {
      if (current <= end) {
        return { value: current++, done: false };
      }
      return { value: undefined, done: true };
    }
  };
}

const range = createRangeIterator(1, 3);

console.log('J:', range.next());  // { value: 1, done: false }
console.log('K:', range.next());  // { value: 2, done: false }
console.log('L:', range.next());  // { value: 3, done: false }
console.log('M:', range.next());  // { value: undefined, done: true }

/**
 * OUTPUT:
 *   J: { value: 1, done: false }
 *   K: { value: 2, done: false }
 *   L: { value: 3, done: false }
 *   M: { value: undefined, done: true }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MAKING AN OBJECT ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

// Add Symbol.iterator to make object work with for...of
const rangeIterable = {
  start: 1,
  end: 5,

  // This method returns an iterator
  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        }
        return { value: undefined, done: true };
      }
    };
  }
};

// Now we can use for...of!
console.log('N: Iterating rangeIterable:');
for (const num of rangeIterable) {
  console.log('  ', num);
}

// And spread!
console.log('O:', [...rangeIterable]);  // [1, 2, 3, 4, 5]

// And Array.from!
console.log('P:', Array.from(rangeIterable));  // [1, 2, 3, 4, 5]

/**
 * OUTPUT:
 *   N: Iterating rangeIterable:
 *      1
 *      2
 *      3
 *      4
 *      5
 *   O: [ 1, 2, 3, 4, 5 ]
 *   P: [ 1, 2, 3, 4, 5 ]
 */


// ═══════════════════════════════════════════════════════════════════════════════
// INFINITE ITERATOR (Lazy Evaluation)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY LAZY EVALUATION MATTERS                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Without lazy evaluation (eager):                                            │
 * │   const allNumbers = generateAllNumbers();  // Memory explodes!             │
 * │   const firstTen = allNumbers.slice(0, 10);                                 │
 * │                                                                             │
 * │ With lazy evaluation (iterator):                                            │
 * │   const numbersIterator = createNumbersIterator();                          │
 * │   // Nothing happens until we ask for values                                │
 * │   numbersIterator.next();  // Generate ONLY what we need                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const infiniteCounter = {
  [Symbol.iterator]() {
    let count = 0;
    return {
      next() {
        return { value: count++, done: false };  // Never done!
      }
    };
  }
};

// Take only first 5 (don't use for...of directly - infinite loop!)
const iter = infiniteCounter[Symbol.iterator]();
const first5 = [];
for (let i = 0; i < 5; i++) {
  first5.push(iter.next().value);
}
console.log('Q:', first5);  // [0, 1, 2, 3, 4]


// Fibonacci iterator
const fibonacci = {
  [Symbol.iterator]() {
    let a = 0, b = 1;
    return {
      next() {
        const value = a;
        [a, b] = [b, a + b];
        return { value, done: false };
      }
    };
  }
};

const fibIter = fibonacci[Symbol.iterator]();
const first10Fib = [];
for (let i = 0; i < 10; i++) {
  first10Fib.push(fibIter.next().value);
}
console.log('R:', first10Fib);  // [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]

/**
 * OUTPUT:
 *   Q: [ 0, 1, 2, 3, 4 ]
 *   R: [ 0, 1, 1, 2, 3, 5, 8, 13, 21, 34 ]
 */


// ═══════════════════════════════════════════════════════════════════════════════
// ITERATOR METHODS: return() and throw()
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ OPTIONAL ITERATOR METHODS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ return(value) - Called when iteration ends early (break, return, throw)     │
 * │                 Useful for cleanup (close file, release resource)           │
 * │                                                                             │
 * │ throw(error) - Signals an error to the iterator                             │
 * │                Used mainly with generators                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const iterableWithCleanup = {
  [Symbol.iterator]() {
    let count = 0;
    console.log('  Iterator created');

    return {
      next() {
        count++;
        console.log(`  next() called, count: ${count}`);
        return {
          value: count,
          done: count > 5
        };
      },
      return() {
        console.log('  return() called - cleanup!');
        return { done: true };
      }
    };
  }
};

console.log('S: Iterating with early break:');
for (const num of iterableWithCleanup) {
  if (num === 3) {
    console.log('  Breaking at 3');
    break;  // Triggers return()
  }
  console.log(`  Value: ${num}`);
}

/**
 * OUTPUT:
 *   S: Iterating with early break:
 *     Iterator created
 *     next() called, count: 1
 *     Value: 1
 *     next() called, count: 2
 *     Value: 2
 *     next() called, count: 3
 *     Breaking at 3
 *     return() called - cleanup!
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CHECKING IF SOMETHING IS ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

function isIterable(obj) {
  return obj != null && typeof obj[Symbol.iterator] === 'function';
}

console.log('T:', isIterable([1, 2, 3]));     // true (Array)
console.log('U:', isIterable('hello'));       // true (String)
console.log('V:', isIterable(new Map()));     // true (Map)
console.log('W:', isIterable(new Set()));     // true (Set)
console.log('X:', isIterable({ a: 1 }));      // false (plain object)
console.log('Y:', isIterable(123));           // false (number)
console.log('Z:', isIterable(rangeIterable)); // true (our custom)

/**
 * OUTPUT:
 *   T: true
 *   U: true
 *   V: true
 *   W: true
 *   X: false
 *   Y: false
 *   Z: true
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "An ITERATOR is an object with a next() method that returns                 │
 * │ { value, done } objects. It represents a sequence you can step through.     │
 * │                                                                             │
 * │ An ITERABLE is any object with Symbol.iterator that returns an iterator.    │
 * │ Built-in iterables: Array, String, Map, Set, NodeList                       │
 * │                                                                             │
 * │ The iteration protocol enables:                                             │
 * │ - for...of loops                                                            │
 * │ - Spread operator [...iterable]                                             │
 * │ - Array.from(iterable)                                                      │
 * │ - Destructuring [a, b] = iterable                                           │
 * │                                                                             │
 * │ Key advantages:                                                             │
 * │ 1. Lazy evaluation - generate values on demand                              │
 * │ 2. Infinite sequences - process without memory issues                       │
 * │ 3. Custom data structures - make anything iterable                          │
 * │ 4. Unified interface - one protocol for all collections                     │
 * │                                                                             │
 * │ Note: Plain objects {} are NOT iterable by default.                         │
 * │ You must add Symbol.iterator to make them iterable."                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/00-iterator-basics.js
 */
