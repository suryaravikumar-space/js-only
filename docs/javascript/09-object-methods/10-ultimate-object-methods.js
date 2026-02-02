/**
 * CHALLENGE 10: Ultimate Object Methods Challenge
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master these Object methods:                                               ║
 * ║                                                                            ║
 * ║ - entries/fromEntries: Transform objects functionally                      ║
 * ║ - freeze/seal: Immutability (shallow only!)                                ║
 * ║ - keys/getOwnPropertyNames/Symbols: Different property access              ║
 * ║ - Object.is: SameValue comparison (handles NaN and -0)                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

/**
 * OUTPUT:
 *   A: 6
 *   B: 999
 *   C: 1 2 1 3
 *   D: 1
 *   E: 10 1 0 1
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: entries/fromEntries transformation                                      ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   Object.entries → [['apples',5], ['bananas',3], ['oranges',8]]            ║
 * ║   .map([k,v] => [k, v*2]) → [['apples',10], ['bananas',6], ...]            ║
 * ║   Object.fromEntries → { apples: 10, bananas: 6, oranges: 16 }             ║
 * ║                                                                            ║
 * ║ B: Shallow freeze!                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   nested is frozen → can't add/modify direct properties                    ║
 * ║   nested.outer is frozen → can't modify outer's direct properties          ║
 * ║   nested.outer.inner is NOT frozen → inner.value can be changed!           ║
 * ║   freeze is SHALLOW - nested objects need to be frozen separately          ║
 * ║                                                                            ║
 * ║ C: Property enumeration methods                                            ║
 * ║ ─────────────────────────────────                                          ║
 * ║   Object.keys: enumerable string keys only → ['a'] → 1                     ║
 * ║   getOwnPropertyNames: all string keys → ['a', 'b'] → 2                    ║
 * ║   getOwnPropertySymbols: symbol keys → [Symbol(c)] → 1                     ║
 * ║   Reflect.ownKeys: ALL keys → ['a', 'b', Symbol(c)] → 3                    ║
 * ║                                                                            ║
 * ║ D: Object.is edge cases                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   Object.is(NaN, NaN) → true (unlike ===)                                  ║
 * ║   Object.is(0, -0) → false (unlike ===)                                    ║
 * ║   Object.is(null, undefined) → false                                       ║
 * ║   Object.is([], []) → false (different references)                         ║
 * ║   Only 1 is true: [true, false, false, false].filter(Boolean) → 1          ║
 * ║                                                                            ║
 * ║ E: Seal vs Freeze                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   sealed.count = 10 → WORKS (seal allows modification)                     ║
 * ║   sealed.items.push('a') → WORKS (items array is not sealed)               ║
 * ║   frozen.count = 10 → FAILS silently (freeze prevents modification)        ║
 * ║   frozen.items.push('b') → WORKS (items array is not frozen!)              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CHEAT SHEET                                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────┬───────────┬──────────┬───────────┐               │
 * │   │ Method              │ Enumerable│ Non-Enum │ Symbols   │               │
 * │   ├─────────────────────┼───────────┼──────────┼───────────┤               │
 * │   │ Object.keys         │ ✓         │          │           │               │
 * │   │ Object.values       │ ✓         │          │           │               │
 * │   │ Object.entries      │ ✓         │          │           │               │
 * │   │ getOwnPropertyNames │ ✓         │ ✓        │           │               │
 * │   │ getOwnPropertySymb. │           │          │ ✓         │               │
 * │   │ Reflect.ownKeys     │ ✓         │ ✓        │ ✓         │               │
 * │   └─────────────────────┴───────────┴──────────┴───────────┘               │
 * │                                                                             │
 * │   ┌────────────────┬───────────┬───────────┬───────────────┐               │
 * │   │ Method         │ Add Props │ Delete    │ Modify Values │               │
 * │   ├────────────────┼───────────┼───────────┼───────────────┤               │
 * │   │ preventExtens. │ ✗         │ ✓         │ ✓             │               │
 * │   │ seal           │ ✗         │ ✗         │ ✓             │               │
 * │   │ freeze         │ ✗         │ ✗         │ ✗             │               │
 * │   └────────────────┴───────────┴───────────┴───────────────┘               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/09-object-methods/10-ultimate-object-methods.js
 */
