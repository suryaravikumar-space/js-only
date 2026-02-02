/**
 * CHALLENGE 04: Object.assign() Deep Dive
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.assign(target, ...sources) copies enumerable own properties from    ║
 * ║ source objects to target. Returns the modified target.                     ║
 * ║                                                                            ║
 * ║   CRITICAL BEHAVIORS:                                                      ║
 * ║   - MODIFIES target (returns same reference)                               ║
 * ║   - SHALLOW copy (nested objects share references)                         ║
 * ║   - Later sources OVERRIDE earlier ones                                    ║
 * ║   - Getters are INVOKED, not copied                                        ║
 * ║   - Non-enumerable properties are NOT copied                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var target = { a: 1 };
var source = { b: 2 };
var result = Object.assign(target, source);
console.log('A:', result);
console.log('A2:', target === result);

// Multiple sources
var merged = Object.assign({}, { a: 1 }, { b: 2 }, { a: 3 });
console.log('B:', merged);

// Shallow copy problem
var original = { nested: { x: 1 } };
var copy = Object.assign({}, original);
copy.nested.x = 999;
console.log('C:', original.nested.x);

// Getters are invoked
var withGetter = {
  get value() { return 'computed'; }
};
var copied = Object.assign({}, withGetter);
console.log('D:', Object.getOwnPropertyDescriptor(copied, 'value'));

// Non-enumerable not copied
var obj = {};
Object.defineProperty(obj, 'hidden', { value: 'secret', enumerable: false });
obj.visible = 'seen';
var cloned = Object.assign({}, obj);
console.log('E:', Object.keys(cloned));

/**
 * OUTPUT:
 *   A: { a: 1, b: 2 }
 *   A2: true
 *   B: { a: 3, b: 2 }
 *   C: 999
 *   D: { value: 'computed', writable: true, enumerable: true, configurable: true }
 *   E: [ 'visible' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Object.assign(target, source)                                           ║
 * ║ ────────────────────────────────                                           ║
 * ║   Copies source properties to target                                       ║
 * ║   Returns the SAME target object (mutated)                                 ║
 * ║   target === result is TRUE (same reference)                               ║
 * ║                                                                            ║
 * ║ B: Multiple sources with override                                          ║
 * ║ ────────────────────────────────                                           ║
 * ║   {} + { a: 1 } → { a: 1 }                                                 ║
 * ║   { a: 1 } + { b: 2 } → { a: 1, b: 2 }                                     ║
 * ║   { a: 1, b: 2 } + { a: 3 } → { a: 3, b: 2 }                               ║
 * ║   Later source overrides earlier!                                          ║
 * ║                                                                            ║
 * ║ C: Shallow copy danger                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   original.nested and copy.nested point to SAME object                     ║
 * ║   Modifying copy.nested.x also changes original.nested.x!                  ║
 * ║   Result: 999 (both modified)                                              ║
 * ║                                                                            ║
 * ║ D: Getters are invoked                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   Getter is CALLED, result is stored as simple property                    ║
 * ║   Original: getter function                                                ║
 * ║   Copied: plain value 'computed' (no longer a getter!)                     ║
 * ║                                                                            ║
 * ║ E: Non-enumerable excluded                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   'hidden' has enumerable: false, so it's NOT copied                       ║
 * ║   Only 'visible' is copied                                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SHALLOW VS DEEP COPY                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const obj = { a: 1, nested: { b: 2 } };                                   │
 * │                                                                             │
 * │   SHALLOW (Object.assign):                                                  │
 * │   ┌─────────────┐       ┌─────────────┐                                     │
 * │   │ original    │       │ copy        │                                     │
 * │   │ a: 1        │       │ a: 1        │                                     │
 * │   │ nested: ────┼───┬───┼─ nested     │                                     │
 * │   └─────────────┘   │   └─────────────┘                                     │
 * │                     ▼                                                       │
 * │              ┌─────────────┐                                                │
 * │              │  { b: 2 }   │  ← SHARED!                                     │
 * │              └─────────────┘                                                │
 * │                                                                             │
 * │   DEEP (structuredClone):                                                   │
 * │   ┌─────────────┐       ┌─────────────┐                                     │
 * │   │ original    │       │ copy        │                                     │
 * │   │ a: 1        │       │ a: 1        │                                     │
 * │   │ nested: ────┼──┐    │ nested: ────┼──┐                                  │
 * │   └─────────────┘  │    └─────────────┘  │                                  │
 * │                    ▼                     ▼                                  │
 * │              ┌──────────┐          ┌──────────┐                             │
 * │              │ { b: 2 } │          │ { b: 2 } │  ← SEPARATE!                │
 * │              └──────────┘          └──────────┘                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON USE CASES                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Clone object (shallow)                                                 │
 * │   const clone = Object.assign({}, original);                                │
 * │                                                                             │
 * │   // Merge objects                                                          │
 * │   const merged = Object.assign({}, defaults, userOptions);                  │
 * │                                                                             │
 * │   // Add properties to existing object                                      │
 * │   Object.assign(existingObj, { newProp: 'value' });                         │
 * │                                                                             │
 * │   // Modern alternative: spread operator                                    │
 * │   const clone = { ...original };                                            │
 * │   const merged = { ...defaults, ...userOptions };                           │
 * │                                                                             │
 * │   // Deep clone                                                             │
 * │   const deepClone = structuredClone(original);  // Modern                   │
 * │   const deepClone = JSON.parse(JSON.stringify(original));  // Legacy        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.assign() copies enumerable own properties from source objects      │
 * │  to a target object and returns the modified target.                        │
 * │                                                                             │
 * │  Critical behaviors to remember:                                            │
 * │  1. MUTATES target - returns the same reference                             │
 * │  2. SHALLOW copy - nested objects share references                          │
 * │  3. Later sources override earlier ones                                     │
 * │  4. Getters are invoked, not copied as getters                              │
 * │  5. Non-enumerable and Symbol properties are skipped                        │
 * │                                                                             │
 * │  Common uses: cloning objects, merging configs, adding properties.          │
 * │                                                                             │
 * │  Modern alternatives:                                                       │
 * │  - Spread operator for shallow copy: { ...obj }                             │
 * │  - structuredClone() for deep copy                                          │
 * │                                                                             │
 * │  The shallow copy pitfall is a common interview gotcha!"                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/04-object-assign.js
 */
