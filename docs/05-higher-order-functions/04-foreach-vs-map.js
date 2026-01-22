/**
 * CHALLENGE 04: forEach vs map
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ forEach: Executes function for side effects, returns UNDEFINED             ║
 * ║ map: Transforms elements, returns NEW ARRAY                                ║
 * ║                                                                            ║
 * ║   [1,2,3].forEach(x => x*2)  →  undefined                                  ║
 * ║   [1,2,3].map(x => x*2)      →  [2,4,6]                                    ║
 * ║                                                                            ║
 * ║ Use forEach for: logging, DOM updates, API calls (side effects)            ║
 * ║ Use map for: transforming data (pure functions)                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var numbers = [1, 2, 3];

// forEach - returns undefined, used for side effects
var forEachResult = numbers.forEach(function(num) {
  return num * 2;  // This return is ignored!
});
console.log('A:', forEachResult);

// map - returns new array
var mapResult = numbers.map(function(num) {
  return num * 2;
});
console.log('B:', mapResult);

// forEach with side effect
var doubled = [];
numbers.forEach(function(num) {
  doubled.push(num * 2);
});
console.log('C:', doubled);

// Original array unchanged in both
console.log('D:', numbers);

/**
 * OUTPUT:
 *   A: undefined
 *   B: [ 2, 4, 6 ]
 *   C: [ 2, 4, 6 ]
 *   D: [ 1, 2, 3 ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: forEach return value                                                    ║
 * ║ ────────────────────────                                                   ║
 * ║   • forEach ALWAYS returns undefined                                       ║
 * ║   • The callback's return value is completely ignored                      ║
 * ║   • It's designed for side effects only                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: map return value                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • map collects all return values into a new array                        ║
 * ║   • [1*2, 2*2, 3*2] = [2, 4, 6]                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: forEach with external mutation                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║   • Since forEach returns undefined, we use side effect                    ║
 * ║   • Push to external array to achieve map-like behavior                    ║
 * ║   • This works but is NOT recommended (mutation)                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FOREACH vs MAP COMPARISON                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌──────────────────┬───────────────────┬────────────────────────┐         │
 * │   │ Feature          │ forEach           │ map                    │         │
 * │   ├──────────────────┼───────────────────┼────────────────────────┤         │
 * │   │ Returns          │ undefined         │ New array              │         │
 * │   │ Callback return  │ Ignored           │ Collected              │         │
 * │   │ Chainable        │ No                │ Yes                    │         │
 * │   │ Use for          │ Side effects      │ Transformation         │         │
 * │   │ Mutates original │ No (unless you do)│ No                     │         │
 * │   │ Can break early  │ No*               │ No                     │         │
 * │   └──────────────────┴───────────────────┴────────────────────────┘         │
 * │                                                                             │
 * │   * forEach cannot be broken with break/return. Use for...of or some()     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WHICH                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // USE forEach for SIDE EFFECTS:                                          │
 * │                                                                             │
 * │   // Logging                                                                │
 * │   items.forEach(item => console.log(item));                                 │
 * │                                                                             │
 * │   // DOM manipulation                                                       │
 * │   elements.forEach(el => el.classList.add('active'));                       │
 * │                                                                             │
 * │   // API calls                                                              │
 * │   users.forEach(user => sendEmail(user));                                   │
 * │                                                                             │
 * │                                                                             │
 * │   // USE map for TRANSFORMATION:                                            │
 * │                                                                             │
 * │   // Transform data                                                         │
 * │   var names = users.map(user => user.name);                                 │
 * │                                                                             │
 * │   // Create new structures                                                  │
 * │   var options = items.map(item => ({ value: item.id, label: item.name }));  │
 * │                                                                             │
 * │   // Chain operations                                                       │
 * │   numbers.map(x => x * 2).filter(x => x > 5);                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON MISTAKE                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // BAD: Using map for side effects (wasteful)                             │
 * │   users.map(user => {                                                       │
 * │     console.log(user.name);  // Side effect                                 │
 * │     // No return - creates array of undefined!                              │
 * │   });                                                                       │
 * │   // Returns: [undefined, undefined, undefined]                             │
 * │                                                                             │
 * │                                                                             │
 * │   // GOOD: Use forEach for side effects                                     │
 * │   users.forEach(user => {                                                   │
 * │     console.log(user.name);                                                 │
 * │   });                                                                       │
 * │                                                                             │
 * │                                                                             │
 * │   // BAD: Using forEach and collecting results                              │
 * │   var results = [];                                                         │
 * │   numbers.forEach(n => results.push(n * 2));  // Mutating external var      │
 * │                                                                             │
 * │                                                                             │
 * │   // GOOD: Use map for transformation                                       │
 * │   var results = numbers.map(n => n * 2);  // Pure, no mutation              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/04-foreach-vs-map.js
 */
