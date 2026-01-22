/**
 * CHALLENGE 03: Object.fromEntries()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.fromEntries() transforms a list of [key, value] pairs into an       ║
 * ║ object. It's the INVERSE of Object.entries().                              ║
 * ║                                                                            ║
 * ║   Object.entries({ a: 1 })     →  [['a', 1]]                               ║
 * ║   Object.fromEntries([['a', 1]])  →  { a: 1 }                              ║
 * ║                                                                            ║
 * ║   Accepts:                                                                 ║
 * ║   - Array of [key, value] pairs                                            ║
 * ║   - Map objects                                                            ║
 * ║   - Any iterable of [key, value] pairs                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var entries = [['name', 'Alice'], ['age', 25]];
console.log('A:', Object.fromEntries(entries));

var map = new Map([['x', 1], ['y', 2]]);
console.log('B:', Object.fromEntries(map));

// Transform: double all values
var prices = { apple: 1, banana: 2, orange: 3 };
var doubled = Object.fromEntries(
  Object.entries(prices).map(([k, v]) => [k, v * 2])
);
console.log('C:', doubled);

// Filter: keep values > 1
var filtered = Object.fromEntries(
  Object.entries(prices).filter(([k, v]) => v > 1)
);
console.log('D:', filtered);

// Swap keys and values
var swapped = Object.fromEntries(
  Object.entries({ a: '1', b: '2' }).map(([k, v]) => [v, k])
);
console.log('E:', swapped);

/**
 * OUTPUT:
 *   A: { name: 'Alice', age: 25 }
 *   B: { x: 1, y: 2 }
 *   C: { apple: 2, banana: 4, orange: 6 }
 *   D: { banana: 2, orange: 3 }
 *   E: { '1': 'a', '2': 'b' }
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Object.fromEntries([['name', 'Alice'], ['age', 25]])                    ║
 * ║ ───────────────────────────────────────────────────────                    ║
 * ║   Each [key, value] pair becomes a property                                ║
 * ║   Result: { name: 'Alice', age: 25 }                                       ║
 * ║                                                                            ║
 * ║ B: Object.fromEntries(map)                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   Map is iterable of [key, value] pairs                                    ║
 * ║   Converts Map to plain object                                             ║
 * ║   Result: { x: 1, y: 2 }                                                   ║
 * ║                                                                            ║
 * ║ C: Transform pattern                                                       ║
 * ║ ──────────────────────                                                     ║
 * ║   Step 1: Object.entries(prices) → [['apple', 1], ['banana', 2], ...]      ║
 * ║   Step 2: .map(([k, v]) => [k, v * 2]) → [['apple', 2], ['banana', 4], ...]║
 * ║   Step 3: Object.fromEntries(...) → { apple: 2, banana: 4, orange: 6 }     ║
 * ║                                                                            ║
 * ║ D: Filter pattern                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   Filter keeps only [k, v] pairs where v > 1                               ║
 * ║   'apple' (v=1) removed, 'banana' and 'orange' kept                        ║
 * ║   Result: { banana: 2, orange: 3 }                                         ║
 * ║                                                                            ║
 * ║ E: Swap keys and values                                                    ║
 * ║ ──────────────────────                                                     ║
 * ║   Original: { a: '1', b: '2' }                                             ║
 * ║   Map swaps: [k, v] → [v, k]                                               ║
 * ║   Result: { '1': 'a', '2': 'b' }                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE TRANSFORM PATTERN                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Object.fromEntries(                                                       │
 * │     Object.entries(obj)                                                     │
 * │       .map(...)      // Transform                                           │
 * │       .filter(...)   // Filter                                              │
 * │   )                                                                         │
 * │                                                                             │
 * │   This pattern lets you use array methods on objects!                       │
 * │                                                                             │
 * │   ┌─────────┐    entries()    ┌─────────┐    map/filter    ┌─────────┐      │
 * │   │ Object  │ ──────────────> │ Array   │ ───────────────> │ Array   │      │
 * │   └─────────┘                 └─────────┘                  └─────────┘      │
 * │                                                                  │          │
 * │                                     fromEntries()                │          │
 * │   ┌─────────┐ <──────────────────────────────────────────────────┘          │
 * │   │ Object  │                                                               │
 * │   └─────────┘                                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON USE CASES                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Map to Object                                                          │
 * │   const obj = Object.fromEntries(myMap);                                    │
 * │                                                                             │
 * │   // URLSearchParams to Object                                              │
 * │   const params = Object.fromEntries(new URLSearchParams('a=1&b=2'));        │
 * │   // { a: '1', b: '2' }                                                     │
 * │                                                                             │
 * │   // Rename keys                                                            │
 * │   const renamed = Object.fromEntries(                                       │
 * │     Object.entries(obj).map(([k, v]) => [k.toUpperCase(), v])               │
 * │   );                                                                        │
 * │                                                                             │
 * │   // Pick certain keys                                                      │
 * │   const pick = (obj, keys) => Object.fromEntries(                           │
 * │     Object.entries(obj).filter(([k]) => keys.includes(k))                   │
 * │   );                                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.fromEntries() transforms an iterable of [key, value] pairs into    │
 * │  a plain object. It's the inverse of Object.entries().                      │
 * │                                                                             │
 * │  It accepts:                                                                │
 * │  - Arrays of [key, value] pairs                                             │
 * │  - Map objects                                                              │
 * │  - Any iterable that yields [key, value] pairs                              │
 * │                                                                             │
 * │  The powerful pattern is:                                                   │
 * │  Object.fromEntries(Object.entries(obj).map/filter(...))                    │
 * │                                                                             │
 * │  This lets you use array methods like map() and filter() on objects,        │
 * │  which was previously awkward. It's commonly used for:                      │
 * │  - Transforming object values                                               │
 * │  - Filtering object entries                                                 │
 * │  - Converting Maps to objects                                               │
 * │  - Renaming or swapping keys                                                │
 * │                                                                             │
 * │  Introduced in ES2019 (ES10)."                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/03-object-fromentries.js
 */
