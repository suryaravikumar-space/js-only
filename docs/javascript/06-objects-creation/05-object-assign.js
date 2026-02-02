/**
 * CHALLENGE 05: Object.assign() for Copying
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.assign(target, ...sources)                                          ║
 * ║                                                                            ║
 * ║ Copies enumerable own properties from sources to target.                   ║
 * ║ Later sources override earlier ones.                                       ║
 * ║                                                                            ║
 * ║   Object.assign({}, obj)     // Shallow clone                              ║
 * ║   Object.assign(a, b, c)     // Merge into a                               ║
 * ║                                                                            ║
 * ║ IMPORTANT: This is a SHALLOW copy!                                         ║
 * ║   Nested objects are copied by reference.                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic Object.assign
var target = { a: 1, b: 2 };
var source = { b: 3, c: 4 };

var result = Object.assign(target, source);

console.log('A:', result.b);
console.log('B:', target === result);

// Multiple sources
var defaults = { theme: 'light', fontSize: 14 };
var userPrefs = { fontSize: 16 };
var overrides = { theme: 'dark' };

var config = Object.assign({}, defaults, userPrefs, overrides);

console.log('C:', config.theme, config.fontSize);

// Shallow copy limitation
var original = {
  name: 'Alice',
  address: { city: 'NYC', zip: '10001' }
};

var copy = Object.assign({}, original);
copy.address.city = 'LA';

console.log('D:', original.address.city);

// Non-enumerable properties are not copied
var obj = {};
Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false
});
obj.visible = 'public';

var cloned = Object.assign({}, obj);

console.log('E:', cloned.hidden, cloned.visible);

/**
 * OUTPUT:
 *   A: 3
 *   B: true
 *   C: dark 16
 *   D: LA
 *   E: undefined public
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: assign mutates and returns target                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   target = { a: 1, b: 2 }                                                  ║
 * ║   After assign: target = { a: 1, b: 3, c: 4 }                              ║
 * ║   result.b = 3 (overwritten by source)                                     ║
 * ║   target === result → true (same object!)                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Multiple sources, later wins                                            ║
 * ║ ────────────────────────────────                                           ║
 * ║   {} ← defaults ← userPrefs ← overrides                                    ║
 * ║   fontSize: 14 → 16 (from userPrefs)                                       ║
 * ║   theme: 'light' → 'dark' (from overrides)                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Shallow copy - nested objects shared!                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   copy.address === original.address (same reference!)                      ║
 * ║   Modifying copy.address.city also changes original                        ║
 * ║   original.address.city = 'LA'                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Non-enumerable not copied                                               ║
 * ║ ────────────────────────────────                                           ║
 * ║   'hidden' has enumerable: false → not copied                              ║
 * ║   'visible' has enumerable: true → copied                                  ║
 * ║   cloned.hidden = undefined                                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DEEP CLONE SOLUTIONS                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // 1. JSON (simple objects only, loses functions/undefined)               │
 * │   var deep = JSON.parse(JSON.stringify(original));                          │
 * │                                                                             │
 * │   // 2. structuredClone (modern, handles more types)                        │
 * │   var deep = structuredClone(original);                                     │
 * │                                                                             │
 * │   // 3. Manual recursive                                                    │
 * │   function deepClone(obj) {                                                 │
 * │     if (obj === null || typeof obj !== 'object') return obj;                │
 * │     var clone = Array.isArray(obj) ? [] : {};                               │
 * │     for (var key in obj) {                                                  │
 * │       if (obj.hasOwnProperty(key)) {                                        │
 * │         clone[key] = deepClone(obj[key]);                                   │
 * │       }                                                                     │
 * │     }                                                                       │
 * │     return clone;                                                           │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/05-object-assign.js
 */
