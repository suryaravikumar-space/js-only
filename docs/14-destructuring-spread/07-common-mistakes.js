/**
 * CHALLENGE 07: Common Mistakes & Gotchas
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THESE MISTAKES APPEAR IN INTERVIEWS ALL THE TIME!                          ║
 * ║ Understanding them shows deep knowledge of JavaScript.                     ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 1: Destructuring undefined/null
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 1: Destructuring undefined/null ═══\n");

// This CRASHES!
function badFunction(options) {
  // const { name } = options;  // TypeError if options is undefined!
}

// badFunction();  // Would throw: Cannot destructure property 'name' of 'undefined'

// SOLUTION: Default parameter value
function goodFunction({ name = 'default' } = {}) {
  console.log('A: Name:', name);
}

goodFunction();           // Works! Uses defaults
goodFunction({});         // Works! Uses default for name
goodFunction({ name: 'John' }); // Works!

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS HAPPENS                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function fn({ a }) { }                                                    │
 * │   fn();  // Equals fn(undefined)                                           │
 * │          // Tries to destructure undefined                                 │
 * │          // TypeError!                                                      │
 * │                                                                             │
 * │   FIX:                                                                      │
 * │   function fn({ a } = {}) { }  // = {} provides empty object if undefined │
 * │                 └────┘                                                     │
 * │                    │                                                       │
 * │   Default for ENTIRE parameter, not just properties                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 2: Default values only work for undefined
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 2: Defaults only for undefined ═══\n");

const { a = 'default' } = { a: undefined };  // Uses default
const { b = 'default' } = { a: null };       // null is NOT undefined!
const { c = 'default' } = { c: 0 };          // 0 is NOT undefined!
const { d = 'default' } = { d: '' };         // '' is NOT undefined!
const { e = 'default' } = { e: false };      // false is NOT undefined!

console.log('B: undefined ->', a);  // 'default'
console.log('C: null ->', b);       // 'default' (property missing, so undefined)
console.log('D: 0 ->', c);          // 0
console.log('E: empty string ->', d); // ''
console.log('F: false ->', e);      // false

// If you want default for ALL falsy values, use ||
const value = null;
const withFallback = value || 'default';
console.log('G: With || fallback:', withFallback);

// Better for 0 and '': use ??
const maybeZero = 0;
const withNullish = maybeZero ?? 'default';
console.log('H: With ?? (nullish):', withNullish);  // 0 (not default!)

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 3: Shallow copy traps
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 3: Shallow Copy Issues ═══\n");

const original = {
  name: 'John',
  scores: [85, 90, 95],
  address: { city: 'NYC' }
};

const copy = { ...original };

// Primitives are safe
copy.name = 'Jane';
console.log('I: Original name:', original.name);  // Still 'John'

// Nested objects/arrays are SHARED!
copy.scores.push(100);
copy.address.city = 'LA';

console.log('J: Original scores:', original.scores);  // [85, 90, 95, 100] MODIFIED!
console.log('K: Original city:', original.address.city);  // 'LA' MODIFIED!

// SOLUTION: Deep copy
const deepCopy = JSON.parse(JSON.stringify(original));
// Or: structuredClone(original)

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SHALLOW COPY VISUALIZATION                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   original         copy                                                     │
 * │   ┌─────────┐     ┌─────────┐                                              │
 * │   │name:'X' │     │name:'Y' │  ← Copied (safe)                             │
 * │   │scores ──┼──┐  │scores ──┼──┐                                           │
 * │   │address ─┼─┐│  │address ─┼─┐│                                           │
 * │   └─────────┘ ││  └─────────┘ ││                                           │
 * │               ││              ││                                           │
 * │               │└──────┬───────┘│                                           │
 * │               │       ▼        │                                           │
 * │               │   [85, 90]    ← SHARED!                                    │
 * │               │                │                                           │
 * │               └───────┬────────┘                                           │
 * │                       ▼                                                    │
 * │                  {city:'NYC'}  ← SHARED!                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 4: Confusing rest and spread
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 4: Rest vs Spread Confusion ═══\n");

// They look the same but do OPPOSITE things!

// SPREAD: Expands array into elements
const arr = [1, 2, 3];
console.log('L: Spread expands:', Math.max(...arr));  // Expands to max(1, 2, 3)

// REST: Collects elements into array
function collect(...nums) {  // Collects all args into nums array
  console.log('M: Rest collects:', nums);
}
collect(1, 2, 3);

// IN SAME FUNCTION:
function example(first, ...rest) {  // REST in parameter
  return [first, ...rest];          // SPREAD in return
}
console.log('N: Combined:', example(1, 2, 3, 4));

console.log('');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REMEMBER THE RULE                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   SPREAD = Right side / Call site                                          │
 * │   const x = [...arr];          // Spread: expand arr                       │
 * │   fn(...arr);                  // Spread: expand arr as args               │
 * │                                                                             │
 * │   REST = Left side / Definition                                             │
 * │   const [a, ...rest] = arr;    // Rest: collect remaining                  │
 * │   function fn(...args) { }     // Rest: collect all args                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 5: Nested destructuring doesn't create intermediate variables
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 5: Nested Destructuring Variables ═══\n");

const data = {
  user: {
    profile: {
      name: 'John',
      age: 30
    }
  }
};

// This does NOT create 'user' or 'profile' variables!
const { user: { profile: { name, age } } } = data;

// console.log(user);     // ReferenceError: user is not defined
// console.log(profile);  // ReferenceError: profile is not defined
console.log('O: name:', name);  // 'John' - only this exists!
console.log('P: age:', age);    // 30 - and this!

// If you ALSO need intermediate objects:
const { user, user: { profile, profile: { name: n } } } = data;
console.log('Q: user exists:', typeof user);      // 'object'
console.log('R: profile exists:', typeof profile); // 'object'

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 6: Object destructuring without declaration keyword
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 6: Missing Declaration ═══\n");

let x, y;

// This FAILS - looks like block statement!
// { x, y } = { x: 1, y: 2 };  // SyntaxError!

// SOLUTION: Wrap in parentheses
({ x, y } = { x: 1, y: 2 });  // Works!
console.log('S: x:', x, 'y:', y);

// Or just declare inline (preferred)
const { a: x2, b: y2 } = { a: 10, b: 20 };
console.log('T: x2:', x2, 'y2:', y2);

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 7: Spread operator order matters for objects
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 7: Spread Order Matters ═══\n");

const defaults = { a: 1, b: 2, c: 3 };
const overrides = { b: 99 };

// Later values WIN!
const result1 = { ...defaults, ...overrides };
console.log('U: defaults then overrides:', result1);  // { a: 1, b: 99, c: 3 }

const result2 = { ...overrides, ...defaults };
console.log('V: overrides then defaults:', result2);  // { a: 1, b: 2, c: 3 } - defaults win!

// Single property overrides spread
const result3 = { ...defaults, b: 50 };
console.log('W: spread then single:', result3);  // { a: 1, b: 50, c: 3 }

console.log('');


// ═══════════════════════════════════════════════════════════════════════════════
// MISTAKE 8: Array spread order vs object spread
// ═══════════════════════════════════════════════════════════════════════════════

console.log("═══ Mistake 8: Array vs Object Spread Behavior ═══\n");

// Arrays: Items are just added in order
const arr1 = [1, 2];
const arr2 = [2, 3];  // Duplicate 2!
const merged = [...arr1, ...arr2];
console.log('X: Array spread (keeps duplicates):', merged);  // [1, 2, 2, 3]

// Objects: Same keys are overwritten
const obj1 = { a: 1, b: 2 };
const obj2 = { b: 99, c: 3 };
const mergedObj = { ...obj1, ...obj2 };
console.log('Y: Object spread (overwrites):', mergedObj);  // { a: 1, b: 99, c: 3 }

// To merge arrays without duplicates:
const unique = [...new Set([...arr1, ...arr2])];
console.log('Z: Unique merged array:', unique);  // [1, 2, 3]

console.log('');


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ QUICK REFERENCE: COMMON GOTCHAS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Add = {} for optional object parameters                                  │
 * │ 2. Defaults only apply to undefined (not null, 0, '')                       │
 * │ 3. Spread creates SHALLOW copies only                                       │
 * │ 4. Rest collects, Spread expands (opposite operations!)                    │
 * │ 5. Nested destructuring doesn't create intermediate variables              │
 * │ 6. Wrap assignment destructuring in parentheses: ({ a } = obj)            │
 * │ 7. Object spread: later values win                                          │
 * │ 8. Array spread keeps duplicates, object spread overwrites                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/14-destructuring-spread/07-common-mistakes.js
 */
