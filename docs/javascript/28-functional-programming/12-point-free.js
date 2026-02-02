/**
 * FUNCTIONAL PROGRAMMING: 12 - Point-Free Style
 *
 * ONE CONCEPT: Define functions without explicitly mentioning their arguments
 */


// =============================================================================
// WHAT IS POINT-FREE?
// =============================================================================

console.log('=== Point-Free Style ===\n');

/**
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  POINT-FREE (Tacit Programming)                                     │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  "Point" = argument/data                                             │
 *   │  "Point-free" = no mention of data                                   │
 *   │                                                                      │
 *   │  POINTED:                                                            │
 *   │  const getLength = (str) => str.length;                              │
 *   │  const doubled = numbers.map(x => double(x));                        │
 *   │                     ↑ explicit argument                              │
 *   │                                                                      │
 *   │  POINT-FREE:                                                         │
 *   │  const getLength = prop('length');                                    │
 *   │  const doubled = numbers.map(double);                                │
 *   │                     ↑ no argument mentioned                          │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// =============================================================================
// BASIC EXAMPLES
// =============================================================================

console.log('=== Basic Point-Free ===\n');

// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 1: map/filter with named functions
// ─────────────────────────────────────────────────────────────────────────────

const double = x => x * 2;
const isEven = x => x % 2 === 0;
const numbers = [1, 2, 3, 4, 5];

// Pointed (redundant wrapper)
const doubledPointed = numbers.map(x => double(x));

// Point-free (just pass the function)
const doubledPointFree = numbers.map(double);

console.log('Pointed:', doubledPointed);
console.log('Point-free:', doubledPointFree);


// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 2: Boolean coercion
// ─────────────────────────────────────────────────────────────────────────────

const mixed = [0, 'hello', '', null, 42, undefined, 'world'];

// Pointed
const truthyPointed = mixed.filter(x => Boolean(x));

// Point-free
const truthyPointFree = mixed.filter(Boolean);

console.log('\nTruthy pointed:', truthyPointed);
console.log('Truthy point-free:', truthyPointFree);


// ─────────────────────────────────────────────────────────────────────────────
// EXAMPLE 3: parseInt
// ─────────────────────────────────────────────────────────────────────────────

const strings = ['1', '2', '3'];

// WRONG point-free (gotcha!)
// parseInt takes (string, radix), map passes (value, index)
const wrongParse = strings.map(parseInt);  // [1, NaN, NaN]!

// CORRECT
const correctParse = strings.map(Number);  // [1, 2, 3]
const alsoParse = strings.map(s => parseInt(s, 10));

console.log('\nWRONG parseInt:', wrongParse);
console.log('CORRECT Number:', correctParse);


// =============================================================================
// UTILITY FUNCTIONS FOR POINT-FREE
// =============================================================================

console.log('\n=== Utility Functions ===\n');

// prop - get a property
const prop = key => obj => obj[key];

// not - negate a predicate
const not = fn => (...args) => !fn(...args);

// compose / pipe
const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);
const compose = (...fns) => x => fns.reduceRight((v, f) => f(v), x);

// curry helper
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) return fn(...args);
    return (...more) => curried(...args, ...more);
  };
}

// map/filter as curried functions
const map = curry((fn, arr) => arr.map(fn));
const filter = curry((fn, arr) => arr.filter(fn));
const reduce = curry((fn, init, arr) => arr.reduce(fn, init));
const join = curry((sep, arr) => arr.join(sep));
const split = curry((sep, str) => str.split(sep));
const toLowerCase = str => str.toLowerCase();
const trim = str => str.trim();


// =============================================================================
// POINT-FREE WITH PIPE
// =============================================================================

console.log('=== Point-Free with Pipe ===\n');

const users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 17, active: false },
  { name: 'Charlie', age: 35, active: true },
  { name: 'Diana', age: 15, active: true }
];

// ─────────────────────────────────────────────────────────────────────────────
// POINTED VERSION
// ─────────────────────────────────────────────────────────────────────────────

const getActiveAdultNamesPointed = (users) => {
  return users
    .filter(u => u.active)
    .filter(u => u.age >= 18)
    .map(u => u.name)
    .join(', ');
};

// ─────────────────────────────────────────────────────────────────────────────
// POINT-FREE VERSION
// ─────────────────────────────────────────────────────────────────────────────

const isActive = prop('active');
const isAdult = user => user.age >= 18;
const getName = prop('name');

const getActiveAdultNames = pipe(
  filter(isActive),
  filter(isAdult),
  map(getName),
  join(', ')
);

console.log('Pointed:', getActiveAdultNamesPointed(users));
console.log('Point-free:', getActiveAdultNames(users));


// =============================================================================
// MORE POINT-FREE PATTERNS
// =============================================================================

console.log('\n=== More Patterns ===\n');

// String processing
const createSlug = pipe(
  trim,
  toLowerCase,
  split(' '),
  join('-')
);

console.log('Slug:', createSlug('  Hello World  '));

// Negation
const isOdd = not(isEven);
console.log('Odd numbers:', [1, 2, 3, 4, 5].filter(isOdd));

// Sorting
const sortBy = curry((fn, arr) => [...arr].sort((a, b) => {
  const va = fn(a), vb = fn(b);
  return va < vb ? -1 : va > vb ? 1 : 0;
}));

const sortByAge = sortBy(prop('age'));
const sortByName = sortBy(prop('name'));

console.log('\nSort by age:', sortByAge(users).map(getName));
console.log('Sort by name:', sortByName(users).map(getName));


// =============================================================================
// WHEN POINT-FREE HELPS vs HURTS
// =============================================================================

console.log('\n=== When to Use Point-Free ===\n');

/**
 *   ┌─────────────────────────────────────────────────────────────────────┐
 *   │  GOOD POINT-FREE                   BAD POINT-FREE                  │
 *   ├─────────────────────────────────────────────────────────────────────┤
 *   │                                                                     │
 *   │  ✓ Simple transformations:         ✗ Complex logic:                 │
 *   │    names.map(toUpper)                compose(                       │
 *   │    nums.filter(isPositive)             flip(reduce(concat)),        │
 *   │    items.filter(Boolean)               ap(map(add)),               │
 *   │                                       chain(of)                    │
 *   │                                     )                               │
 *   │  ✓ Clear function names:                                            │
 *   │    pipe(                            ✗ When you need multiple args:  │
 *   │      filterActive,                   arr.map(x => x + offset)      │
 *   │      sortByDate,                     ← offset is from closure       │
 *   │      takeFirst(10)                                                  │
 *   │    )                                ✗ When readability suffers:     │
 *   │                                       (too many intermediate fns)   │
 *   │                                                                     │
 *   └─────────────────────────────────────────────────────────────────────┘
 *
 */

// GOOD: Clear and readable
console.log('Good point-free:');
console.log('  [1,2,3].map(double) ✓');
console.log('  pipe(trim, toLowerCase, createSlug) ✓');
console.log('  items.filter(Boolean) ✓');

// BAD: Obscures intent
console.log('\nBad point-free:');
console.log('  Deeply composed with no clear names ✗');
console.log('  When closure variables are needed ✗');


// =============================================================================
// GOTCHAS
// =============================================================================

console.log('\n=== Gotchas ===\n');

// 1. Methods that take multiple arguments
console.log('--- Method argument mismatch ---');
console.log(['1', '2', '3'].map(parseInt));    // [1, NaN, NaN]!
console.log(['1', '2', '3'].map(Number));      // [1, 2, 3] ✓

// 2. `this` context
console.log('\n--- this context ---');
const obj = {
  values: [1, 2, 3],
  double() {
    // this.values.map(this.multiply)  // Error! `this` lost
    return this.values.map(x => x * 2);
  }
};
console.log('With arrow:', obj.double());

// 3. Unary wrapper for safety
const unary = fn => x => fn(x);
console.log('\nSafe parseInt:', ['1', '2', '3'].map(unary(parseInt)));


// =============================================================================
// INTERVIEW: What to Say
// =============================================================================

/**
 * "Point-free style means defining functions without explicitly mentioning
 * their arguments. Instead of writing x => double(x), you just pass double
 * directly to map.
 *
 * It works well with curried functions and pipe/compose. For example,
 * pipe(filter(isActive), map(getName), join(', ')) creates a complete
 * data pipeline without ever naming the data.
 *
 * The benefit is cleaner, more declarative code. But it can hurt
 * readability if overdone. I use it for simple cases like array.filter(Boolean)
 * or array.map(toUpperCase), and for compose/pipe pipelines with
 * well-named functions.
 *
 * The main gotcha is argument count mismatch. ['1','2','3'].map(parseInt)
 * gives [1, NaN, NaN] because map passes (value, index, array) and
 * parseInt interprets the index as a radix. Use Number instead, or
 * wrap with a unary function."
 */


// RUN: node docs/28-functional-programming/12-point-free.js
