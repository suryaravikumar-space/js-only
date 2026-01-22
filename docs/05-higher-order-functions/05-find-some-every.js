/**
 * CHALLENGE 05: find, some, every
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ find:  Returns FIRST element that matches (or undefined)                   ║
 * ║ some:  Returns true if ANY element matches (short-circuits)                ║
 * ║ every: Returns true if ALL elements match (short-circuits)                 ║
 * ║                                                                            ║
 * ║   [1,2,3].find(x => x > 1)   →  2                                          ║
 * ║   [1,2,3].some(x => x > 2)   →  true                                       ║
 * ║   [1,2,3].every(x => x > 0)  →  true                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var numbers = [1, 2, 3, 4, 5];

// find - returns FIRST element that matches
var firstEven = numbers.find(function(num) {
  return num % 2 === 0;
});
console.log('A:', firstEven);

// find returns undefined if nothing matches
var greaterThan10 = numbers.find(num => num > 10);
console.log('B:', greaterThan10);

// some - returns true if ANY element matches
var hasEven = numbers.some(num => num % 2 === 0);
console.log('C:', hasEven);

var hasNegative = numbers.some(num => num < 0);
console.log('D:', hasNegative);

// every - returns true if ALL elements match
var allPositive = numbers.every(num => num > 0);
console.log('E:', allPositive);

var allEven = numbers.every(num => num % 2 === 0);
console.log('F:', allEven);

/**
 * OUTPUT:
 *   A: 2
 *   B: undefined
 *   C: true
 *   D: false
 *   E: true
 *   F: false
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: find first even                                                         ║
 * ║ ──────────────────                                                         ║
 * ║   • Check 1: 1 % 2 === 0? NO → continue                                    ║
 * ║   • Check 2: 2 % 2 === 0? YES → return 2 (stops here!)                     ║
 * ║   • Doesn't check 3, 4, 5                                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: some - any even?                                                        ║
 * ║ ───────────────────                                                        ║
 * ║   • Check 1: NO → continue                                                 ║
 * ║   • Check 2: YES → return true (short-circuits!)                           ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: every - all positive?                                                   ║
 * ║ ────────────────────────                                                   ║
 * ║   • Check 1: 1 > 0? YES → continue                                         ║
 * ║   • Check 2: 2 > 0? YES → continue                                         ║
 * ║   • Check 3: 3 > 0? YES → continue                                         ║
 * ║   • Check 4: 4 > 0? YES → continue                                         ║
 * ║   • Check 5: 5 > 0? YES → return true                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: every - all even?                                                       ║
 * ║ ────────────────────                                                       ║
 * ║   • Check 1: 1 % 2 === 0? NO → return false (short-circuits!)              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ METHOD COMPARISON                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────┬─────────────────┬───────────────────┬────────────────────┐    │
 * │   │ Method  │ Returns         │ Short-circuits    │ Use case           │    │
 * │   ├─────────┼─────────────────┼───────────────────┼────────────────────┤    │
 * │   │ find    │ Element/undef   │ On first match    │ Get one item       │    │
 * │   │ some    │ Boolean         │ On first true     │ Existence check    │    │
 * │   │ every   │ Boolean         │ On first false    │ Validation         │    │
 * │   │ filter  │ Array           │ Never             │ Get all matches    │    │
 * │   └─────────┴─────────────────┴───────────────────┴────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SHORT-CIRCUITING EXPLAINED                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // some() stops at first true                                             │
 * │   [1, 2, 3, 4, 5].some(x => {                                               │
 * │     console.log('Checking', x);                                             │
 * │     return x === 2;                                                         │
 * │   });                                                                       │
 * │   // Logs: Checking 1, Checking 2                                           │
 * │   // Stops after finding 2                                                  │
 * │                                                                             │
 * │                                                                             │
 * │   // every() stops at first false                                           │
 * │   [1, 2, 3, 4, 5].every(x => {                                              │
 * │     console.log('Checking', x);                                             │
 * │     return x < 3;                                                           │
 * │   });                                                                       │
 * │   // Logs: Checking 1, Checking 2, Checking 3                               │
 * │   // Stops after 3 fails the test                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ RELATED: findIndex                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // find returns the ELEMENT                                               │
 * │   [10, 20, 30].find(x => x > 15);      // 20                                │
 * │                                                                             │
 * │   // findIndex returns the INDEX                                            │
 * │   [10, 20, 30].findIndex(x => x > 15); // 1                                 │
 * │                                                                             │
 * │   // Both return undefined/-1 if not found                                  │
 * │   [10, 20, 30].find(x => x > 100);      // undefined                        │
 * │   [10, 20, 30].findIndex(x => x > 100); // -1                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL-WORLD EXAMPLES                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var users = [                                                             │
 * │     { id: 1, name: 'Alice', admin: false },                                 │
 * │     { id: 2, name: 'Bob', admin: true },                                    │
 * │     { id: 3, name: 'Charlie', admin: false }                                │
 * │   ];                                                                        │
 * │                                                                             │
 * │   // find: Get user by ID                                                   │
 * │   var user = users.find(u => u.id === 2);  // { id: 2, name: 'Bob'... }     │
 * │                                                                             │
 * │   // some: Check if any admin exists                                        │
 * │   var hasAdmin = users.some(u => u.admin);  // true                         │
 * │                                                                             │
 * │   // every: Check if all users are verified                                 │
 * │   var allVerified = users.every(u => u.verified);  // false (undefined)     │
 * │                                                                             │
 * │   // Validate form fields                                                   │
 * │   var isValid = fields.every(f => f.value.trim() !== '');                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/05-higher-order-functions/05-find-some-every.js
 */
