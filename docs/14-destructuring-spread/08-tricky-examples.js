/**
 * CHALLENGE 08: Tricky Interview Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PREDICT THE OUTPUT - INTERVIEW FAVORITES                                   ║
 * ║ Try to solve each one before looking at the answer!                        ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 1: Basic destructuring order
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 1 ═══");

const [a, b] = [1, 2, 3];
console.log(a, b);

// ANSWER: 1 2
// WHY: Position-based. 3 is ignored because no variable for it.

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 2: Nested with default
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 2 ═══");

const { x: { y = 10 } = {} } = {};
console.log(y);

// ANSWER: 10
// WHY:
// - {} has no x, so default {} is used for x
// - {} has no y, so default 10 is used for y
// - Result: y = 10

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 3: Rest and spread together
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 3 ═══");

const [first, ...rest] = [1, 2, 3];
const result = [0, ...rest, 4];
console.log(result);

// ANSWER: [0, 2, 3, 4]
// WHY:
// - first = 1, rest = [2, 3]
// - result = [0, ...spread of [2, 3], 4] = [0, 2, 3, 4]

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 4: Object property shorthand with destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 4 ═══");

const name = 'John';
const age = 30;
const person = { name, age };
const { name: n, age: a2 } = person;
console.log(n, a2);

// ANSWER: John 30
// WHY:
// - { name, age } is shorthand for { name: name, age: age }
// - { name: n } renames 'name' property to variable 'n'

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 5: Spread creates new reference
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 5 ═══");

const arr1 = [1, 2, 3];
const arr2 = [...arr1];
arr2.push(4);
console.log(arr1.length, arr2.length);

// ANSWER: 3 4
// WHY: Spread creates new array. arr1 is unchanged.

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 6: But shallow copy!
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 6 ═══");

const arr3 = [{ x: 1 }];
const arr4 = [...arr3];
arr4[0].x = 99;
console.log(arr3[0].x);

// ANSWER: 99
// WHY: Shallow copy! Inner object is same reference.

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 7: Destructuring in function params
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 7 ═══");

function fn({ a, b } = { a: 1, b: 2 }) {
  console.log(a, b);
}

fn({ a: 10 });

// ANSWER: 10 undefined
// WHY:
// - Default { a: 1, b: 2 } is only used if NO argument is passed
// - { a: 10 } was passed, so defaults don't apply
// - { a: 10 } has no b, so b is undefined

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 8: Individual defaults
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 8 ═══");

function fn2({ a = 1, b = 2 } = {}) {
  console.log(a, b);
}

fn2({ a: 10 });

// ANSWER: 10 2
// WHY:
// - {} default prevents error when no argument
// - Individual defaults a=1, b=2 apply when property missing
// - { a: 10 } has a=10, b uses default 2

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 9: Swap
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 9 ═══");

let x2 = 1, y2 = 2;
[x2, y2] = [y2, x2];
console.log(x2, y2);

// ANSWER: 2 1
// WHY: Right side creates [2, 1], then destructures to x2=2, y2=1

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 10: Object.entries destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 10 ═══");

const obj = { a: 1, b: 2 };
const entries = Object.entries(obj);
for (const [key, value] of entries) {
  console.log(key, value);
}

// ANSWER:
// a 1
// b 2
// WHY: Object.entries returns [['a', 1], ['b', 2]], each entry destructured

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 11: Nested array
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 11 ═══");

const [[a3, b3], [c3, d3]] = [[1, 2], [3, 4]];
console.log(a3 + d3);

// ANSWER: 5
// WHY: a3=1, b3=2, c3=3, d3=4. 1+4=5

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 12: Tricky null
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 12 ═══");

const { foo = 'default' } = { foo: null };
console.log(foo);

// ANSWER: null
// WHY: Default only applies to undefined, not null!

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 13: Computed property names
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 13 ═══");

const key = 'name';
const { [key]: value } = { name: 'John' };
console.log(value);

// ANSWER: John
// WHY: [key] is computed to 'name', so it extracts name property

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 14: Array methods with destructuring
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 14 ═══");

const users = [
  { name: 'A', age: 20 },
  { name: 'B', age: 30 }
];

const names = users.map(({ name }) => name);
console.log(names);

// ANSWER: ['A', 'B']
// WHY: Each object is destructured, extracting only name

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 15: Rest must be last
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 15 ═══");

const { a: a4, ...rest } = { a: 1, b: 2, c: 3 };
console.log(a4, rest);

// ANSWER: 1 { b: 2, c: 3 }
// WHY: a extracted to a4, rest collects remaining properties

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 16: Spread in array literal
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 16 ═══");

const chars = [...'hello'];
console.log(chars);

// ANSWER: ['h', 'e', 'l', 'l', 'o']
// WHY: Strings are iterable, spread into individual characters

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 17: Order in object spread
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 17 ═══");

const obj2 = { ...{ a: 1, b: 2 }, a: 10 };
console.log(obj2.a);

// ANSWER: 10
// WHY: Later a: 10 overwrites spread a: 1

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE 18: Function with rest and normal params
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Example 18 ═══");

function log(level, ...messages) {
  console.log(level, messages.join(' '));
}

log('INFO', 'Hello', 'World');

// ANSWER: INFO Hello World
// WHY: level='INFO', messages=['Hello', 'World'], joined with space

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIPS                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When solving destructuring problems:                                        │
 * │                                                                             │
 * │ 1. Identify: Array (position) or Object (name)?                            │
 * │ 2. Check: Is it spread (expanding) or rest (collecting)?                   │
 * │ 3. Defaults: Only apply to undefined, not null/0/''                        │
 * │ 4. Nesting: Work from outside in                                           │
 * │ 5. Aliases: { prop: alias } - alias is the variable, not prop              │
 * │ 6. Order: For object spread, later values win                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/14-destructuring-spread/08-tricky-examples.js
 */
