/**
 * CHALLENGE 09: Object.is() vs === vs ==
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.is(a, b) determines if two values are THE SAME VALUE.               ║
 * ║ It's similar to === but handles two special cases differently:             ║
 * ║                                                                            ║
 * ║   NaN === NaN         →  false  (IEEE 754 standard)                        ║
 * ║   Object.is(NaN, NaN) →  TRUE   (same value!)                              ║
 * ║                                                                            ║
 * ║   0 === -0            →  true   (considered equal)                         ║
 * ║   Object.is(0, -0)    →  FALSE  (different values!)                        ║
 * ║                                                                            ║
 * ║ Object.is() performs "SameValue" comparison from the spec.                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// NaN comparison
console.log('A1:', NaN === NaN);
console.log('A2:', Object.is(NaN, NaN));

// Positive and negative zero
console.log('B1:', 0 === -0);
console.log('B2:', Object.is(0, -0));
console.log('B3:', Object.is(-0, -0));

// Regular comparisons
console.log('C1:', Object.is(5, 5));
console.log('C2:', Object.is('hello', 'hello'));
console.log('C3:', Object.is({}, {}));

// Comparison table
var a = { x: 1 };
var b = a;
console.log('D1:', a == b, a === b, Object.is(a, b));

var c = { x: 1 };
console.log('D2:', a == c, a === c, Object.is(a, c));

// Edge cases
console.log('E1:', Object.is(null, null));
console.log('E2:', Object.is(undefined, undefined));
console.log('E3:', Object.is(null, undefined));

/**
 * OUTPUT:
 *   A1: false
 *   A2: true
 *   B1: true
 *   B2: false
 *   B3: true
 *   C1: true
 *   C2: true
 *   C3: false
 *   D1: true true true
 *   D2: false false false
 *   E1: true
 *   E2: true
 *   E3: false
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: NaN comparison                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   NaN === NaN → false (by IEEE 754 floating-point standard)                ║
 * ║   Object.is(NaN, NaN) → true (recognizes they're the same value)           ║
 * ║                                                                            ║
 * ║ B: Zero comparison                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   0 === -0 → true (=== considers them equal)                               ║
 * ║   Object.is(0, -0) → false (different bit representations!)                ║
 * ║   Object.is(-0, -0) → true (same value)                                    ║
 * ║                                                                            ║
 * ║ C: Regular values                                                          ║
 * ║ ─────────────────                                                          ║
 * ║   Primitives: same value = true                                            ║
 * ║   Objects: must be same reference (like ===)                               ║
 * ║   {} === {} is false, so Object.is({}, {}) is also false                   ║
 * ║                                                                            ║
 * ║ D: Object references                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   a and b point to same object → all three return true                     ║
 * ║   a and c are different objects → all three return false                   ║
 * ║                                                                            ║
 * ║ E: null and undefined                                                      ║
 * ║ ────────────────────────                                                   ║
 * ║   null === null → true, Object.is(null, null) → true                       ║
 * ║   undefined === undefined → true, Object.is same                           ║
 * ║   null == undefined (true with ==), but Object.is → false                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON TABLE                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────┬────────┬─────────┬─────────────┐                │
 * │   │ Comparison            │   ==   │   ===   │ Object.is() │                │
 * │   ├───────────────────────┼────────┼─────────┼─────────────┤                │
 * │   │ NaN vs NaN            │ false  │  false  │    TRUE     │                │
 * │   │ 0 vs -0               │  true  │   true  │    FALSE    │                │
 * │   │ null vs undefined     │  true  │  false  │    false    │                │
 * │   │ 5 vs '5'              │  true  │  false  │    false    │                │
 * │   │ [] vs false           │  true  │  false  │    false    │                │
 * │   │ {} vs {}              │ false  │  false  │    false    │                │
 * │   │ 'a' vs 'a'            │  true  │   true  │    true     │                │
 * │   └───────────────────────┴────────┴─────────┴─────────────┘                │
 * │                                                                             │
 * │   == : Type coercion, loose equality                                        │
 * │   === : Strict equality, no coercion                                        │
 * │   Object.is() : SameValue, strictest comparison                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY DOES THIS MATTER?                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Detecting NaN properly                                                 │
 * │   function isReallyNaN(value) {                                             │
 * │     return Object.is(value, NaN);                                           │
 * │     // or: return Number.isNaN(value);                                      │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Detecting negative zero                                                │
 * │   function isNegativeZero(value) {                                          │
 * │     return Object.is(value, -0);                                            │
 * │   }                                                                         │
 * │                                                                             │
 * │   // React uses Object.is() for state comparison!                           │
 * │   // That's why setState({}) always triggers re-render                      │
 * │   // but setState with same primitive doesn't                               │
 * │                                                                             │
 * │   // Array.includes uses SameValueZero (Object.is but 0 === -0)             │
 * │   [NaN].includes(NaN);  // true!                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.is() performs 'SameValue' comparison. It's like === but with       │
 * │  two important differences:                                                 │
 * │                                                                             │
 * │  1. NaN: Object.is(NaN, NaN) returns TRUE                                   │
 * │     (=== returns false due to IEEE 754)                                     │
 * │                                                                             │
 * │  2. Zeros: Object.is(0, -0) returns FALSE                                   │
 * │     (=== considers them equal)                                              │
 * │                                                                             │
 * │  For all other values, Object.is() behaves like ===.                        │
 * │                                                                             │
 * │  Practical uses:                                                            │
 * │  - React uses it for state comparison (Object.is in useState)               │
 * │  - Properly detecting NaN values                                            │
 * │  - Distinguishing between +0 and -0 in mathematical computations            │
 * │                                                                             │
 * │  For most code, === is sufficient. Object.is() is for edge cases            │
 * │  where you need mathematically precise value comparison."                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/09-object-is.js
 */
