/**
 * CHALLENGE 08: getOwnPropertyNames and getOwnPropertySymbols
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.getOwnPropertyNames(obj) - ALL own string keys (including           ║
 * ║   non-enumerable ones). Does NOT include Symbol keys.                      ║
 * ║                                                                            ║
 * ║ Object.getOwnPropertySymbols(obj) - ALL own Symbol keys.                   ║
 * ║                                                                            ║
 * ║ Reflect.ownKeys(obj) - ALL own keys (strings + symbols).                   ║
 * ║                                                                            ║
 * ║   ┌─────────────────────────────────────────────────────────────────────┐  ║
 * ║   │ Method                  │ String │ Symbol │ Non-enum │ Inherited   │  ║
 * ║   │ Object.keys()           │   Yes  │   No   │    No    │     No      │  ║
 * ║   │ getOwnPropertyNames()   │   Yes  │   No   │   Yes    │     No      │  ║
 * ║   │ getOwnPropertySymbols() │   No   │  Yes   │   Yes    │     No      │  ║
 * ║   │ Reflect.ownKeys()       │   Yes  │  Yes   │   Yes    │     No      │  ║
 * ║   └─────────────────────────────────────────────────────────────────────┘  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var obj = { visible: 1 };
Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
console.log('A keys:', Object.keys(obj));
console.log('A names:', Object.getOwnPropertyNames(obj));

var sym1 = Symbol('id');
var sym2 = Symbol('secret');
var withSymbols = {
  name: 'test',
  [sym1]: 100,
  [sym2]: 200
};
console.log('B:', Object.getOwnPropertySymbols(withSymbols));

// Array with extra property
var arr = [1, 2, 3];
arr.custom = 'extra';
console.log('C:', Object.getOwnPropertyNames(arr));

// Get ALL own properties (strings + symbols)
var all = { a: 1, [Symbol('x')]: 2 };
Object.defineProperty(all, 'b', { value: 3, enumerable: false });
var allProps = [
  ...Object.getOwnPropertyNames(all),
  ...Object.getOwnPropertySymbols(all)
];
console.log('D:', allProps.length);

// Reflect.ownKeys alternative
console.log('E:', Reflect.ownKeys(all));

/**
 * OUTPUT:
 *   A keys: [ 'visible' ]
 *   A names: [ 'visible', 'hidden' ]
 *   B: [ Symbol(id), Symbol(secret) ]
 *   C: [ '0', '1', '2', 'length', 'custom' ]
 *   D: 3
 *   E: [ 'a', 'b', Symbol(x) ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: keys vs getOwnPropertyNames                                             ║
 * ║ ──────────────────────────────                                             ║
 * ║   Object.keys() → ['visible'] (only enumerable)                            ║
 * ║   getOwnPropertyNames() → ['visible', 'hidden'] (includes non-enumerable)  ║
 * ║                                                                            ║
 * ║ B: getOwnPropertySymbols                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   Returns array of Symbol keys                                             ║
 * ║   Result: [Symbol(id), Symbol(secret)]                                     ║
 * ║   String key 'name' is NOT included                                        ║
 * ║                                                                            ║
 * ║ C: Array properties                                                        ║
 * ║ ──────────────────                                                         ║
 * ║   Arrays are objects! getOwnPropertyNames returns:                         ║
 * ║   - Index keys: '0', '1', '2'                                              ║
 * ║   - 'length' property (non-enumerable!)                                    ║
 * ║   - Custom property: 'custom'                                              ║
 * ║                                                                            ║
 * ║ D: Combining methods                                                       ║
 * ║ ──────────────────                                                         ║
 * ║   getOwnPropertyNames → ['a', 'b'] (strings including non-enum)            ║
 * ║   getOwnPropertySymbols → [Symbol(x)]                                      ║
 * ║   Total: 3 properties                                                      ║
 * ║                                                                            ║
 * ║ E: Reflect.ownKeys                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   Returns ALL own keys in one call                                         ║
 * ║   Order: strings first, then symbols                                       ║
 * ║   Result: ['a', 'b', Symbol(x)]                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL COMPARISON                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const obj = {                                                             │
 * │     a: 1,                    // enumerable string                           │
 * │     [Symbol('s')]: 2         // enumerable symbol                           │
 * │   };                                                                        │
 * │   Object.defineProperty(obj, 'b', { value: 3, enumerable: false });         │
 * │                              // non-enumerable string                       │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────┐        │
 * │   │ Method                        │ Returns                       │        │
 * │   ├────────────────────────────────────────────────────────────────┤        │
 * │   │ Object.keys(obj)              │ ['a']                         │        │
 * │   │ Object.getOwnPropertyNames()  │ ['a', 'b']                    │        │
 * │   │ Object.getOwnPropertySymbols()│ [Symbol(s)]                   │        │
 * │   │ Reflect.ownKeys(obj)          │ ['a', 'b', Symbol(s)]         │        │
 * │   │ for...in                      │ 'a' + inherited enumerable    │        │
 * │   └────────────────────────────────────────────────────────────────┘        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASES                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Find all properties including non-enumerable                           │
 * │   const allStringKeys = Object.getOwnPropertyNames(obj);                    │
 * │                                                                             │
 * │   // Find hidden Symbol properties                                          │
 * │   const symbolKeys = Object.getOwnPropertySymbols(obj);                     │
 * │                                                                             │
 * │   // Clone with ALL properties                                              │
 * │   function deepClone(obj) {                                                 │
 * │     const clone = {};                                                       │
 * │     Reflect.ownKeys(obj).forEach(key => {                                   │
 * │       const desc = Object.getOwnPropertyDescriptor(obj, key);               │
 * │       Object.defineProperty(clone, key, desc);                              │
 * │     });                                                                     │
 * │     return clone;                                                           │
 * │   }                                                                         │
 * │                                                                             │
 * │   // Check if array has extra properties                                    │
 * │   const hasExtraProps = Object.getOwnPropertyNames(arr)                     │
 * │     .some(k => isNaN(k) && k !== 'length');                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Object.getOwnPropertyNames() returns ALL own string-keyed properties,     │
 * │  including non-enumerable ones. This differs from Object.keys() which       │
 * │  only returns enumerable properties.                                        │
 * │                                                                             │
 * │  Object.getOwnPropertySymbols() returns all own Symbol-keyed properties.    │
 * │                                                                             │
 * │  To get ALL own properties (both strings and symbols), you can either:      │
 * │  1. Combine: [...getOwnPropertyNames(obj), ...getOwnPropertySymbols(obj)]   │
 * │  2. Use Reflect.ownKeys(obj) - cleaner, single call                         │
 * │                                                                             │
 * │  Common use cases:                                                          │
 * │  - Debugging objects with hidden properties                                 │
 * │  - Cloning objects with non-enumerable properties                           │
 * │  - Finding array's 'length' property (non-enumerable)                       │
 * │  - Working with Symbol-keyed properties in libraries                        │
 * │                                                                             │
 * │  None of these methods return inherited properties - they're all 'own'."    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-object-methods/08-object-getownpropertynames.js
 */
