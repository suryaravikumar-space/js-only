/**
 * CHALLENGE 06: Spread Operator for Objects
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Spread operator (...) copies enumerable own properties.                    ║
 * ║                                                                            ║
 * ║   { ...obj }           // Clone                                            ║
 * ║   { ...a, ...b }       // Merge (b overwrites a)                           ║
 * ║   { ...obj, key: val } // Clone + override                                 ║
 * ║                                                                            ║
 * ║ ORDER MATTERS: Later properties override earlier ones.                     ║
 * ║ SHALLOW COPY: Nested objects are still references!                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Basic spread
var obj1 = { a: 1, b: 2 };
var obj2 = { c: 3, d: 4 };

var merged = { ...obj1, ...obj2 };

console.log('A:', Object.keys(merged).length);

// Spread with override
var defaults = { theme: 'light', fontSize: 14, lang: 'en' };
var userConfig = { fontSize: 18, theme: 'dark' };

var config = { ...defaults, ...userConfig };

console.log('B:', config.theme, config.fontSize);

// Order matters
var first = { x: 1 };
var second = { x: 2, y: 3 };

var result1 = { ...first, ...second };
var result2 = { ...second, ...first };

console.log('C:', result1.x, result2.x);

// Shallow copy
var original = {
  name: 'Alice',
  skills: ['JS', 'Python']
};

var copy = { ...original };
copy.skills.push('Go');

console.log('D:', original.skills.length);

// Spread with new properties
var person = { name: 'Bob', age: 25 };
var updated = { ...person, age: 26, role: 'Dev' };

console.log('E:', updated.age, updated.role);

/**
 * OUTPUT:
 *   A: 4
 *   B: dark 18
 *   C: 2 1
 *   D: 3
 *   E: 26 Dev
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Basic merge                                                             ║
 * ║ ──────────────                                                             ║
 * ║   { ...{a:1,b:2}, ...{c:3,d:4} }                                           ║
 * ║   = { a: 1, b: 2, c: 3, d: 4 }                                             ║
 * ║   4 keys total                                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Later spread overrides                                                  ║
 * ║ ───────────────────────────                                                ║
 * ║   defaults: theme='light', fontSize=14                                     ║
 * ║   userConfig: theme='dark', fontSize=18                                    ║
 * ║   Result: theme='dark', fontSize=18 (userConfig wins)                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: Order determines final value                                            ║
 * ║ ────────────────────────────────                                           ║
 * ║   { ...first, ...second } → x: 2 (second's x)                              ║
 * ║   { ...second, ...first } → x: 1 (first's x)                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Shallow copy warning!                                                   ║
 * ║ ─────────────────────────                                                  ║
 * ║   copy.skills === original.skills (same array!)                            ║
 * ║   push('Go') affects both                                                  ║
 * ║   original.skills.length = 3                                               ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Clone + update pattern                                                  ║
 * ║ ────────────────────────────                                               ║
 * ║   { ...person, age: 26, role: 'Dev' }                                      ║
 * ║   age: 25 → 26 (overridden)                                                ║
 * ║   role: 'Dev' (new property)                                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SPREAD vs Object.assign                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Spread (creates new object)                                            │
 * │   var clone = { ...obj };                                                   │
 * │   var merged = { ...a, ...b };                                              │
 * │                                                                             │
 * │   // Object.assign (mutates target)                                         │
 * │   var clone = Object.assign({}, obj);                                       │
 * │   var merged = Object.assign({}, a, b);                                     │
 * │                                                                             │
 * │   // Key differences:                                                       │
 * │   // - Spread is more readable                                              │
 * │   // - Spread always creates new object                                     │
 * │   // - Object.assign can merge into existing                                │
 * │   // - Both are shallow copies!                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-objects-creation/06-spread-operator.js
 */
