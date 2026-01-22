/**
 * CHALLENGE 03: Currying with Array Methods
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Curried functions work perfectly with array methods like map and filter!   ║
 * ║                                                                            ║
 * ║   var double = multiply(2);                                                ║
 * ║   [1, 2, 3].map(double);  // [2, 4, 6]                                     ║
 * ║                                                                            ║
 * ║ The curried function returns a unary function (one argument),              ║
 * ║ which is exactly what map/filter expect!                                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Curried multiply
var multiply = a => b => a * b;

var double = multiply(2);
var triple = multiply(3);

var numbers = [1, 2, 3, 4, 5];

console.log('A:', numbers.map(double));
console.log('B:', numbers.map(triple));

// Curried filter helper
var greaterThan = min => num => num > min;

console.log('C:', numbers.filter(greaterThan(2)));
console.log('D:', numbers.filter(greaterThan(3)));

/**
 * OUTPUT:
 *   A: [ 2, 4, 6, 8, 10 ]
 *   B: [ 3, 6, 9, 12, 15 ]
 *   C: [ 3, 4, 5 ]
 *   D: [ 4, 5 ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: numbers.map(double)                                                     ║
 * ║ ──────────────────────                                                     ║
 * ║   • double = multiply(2) = b => 2 * b                                      ║
 * ║   • map calls double(1) → 2                                                ║
 * ║   • map calls double(2) → 4                                                ║
 * ║   • map calls double(3) → 6                                                ║
 * ║   • ... etc                                                                ║
 * ║                                                                            ║
 * ║ C: numbers.filter(greaterThan(2))                                          ║
 * ║ ─────────────────────────────────                                          ║
 * ║   • greaterThan(2) = num => num > 2                                        ║
 * ║   • filter calls predicate(1) → 1 > 2 → false                              ║
 * ║   • filter calls predicate(2) → 2 > 2 → false                              ║
 * ║   • filter calls predicate(3) → 3 > 2 → true                               ║
 * ║   • filter calls predicate(4) → 4 > 2 → true                               ║
 * ║   • filter calls predicate(5) → 5 > 2 → true                               ║
 * ║   • Result: [3, 4, 5]                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS WORKS SO WELL                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Array methods expect: element => result                                │
 * │   [1, 2, 3].map(x => x * 2);                                                │
 * │                                                                             │
 * │   // Curried function returns exactly that!                                 │
 * │   var multiply = a => b => a * b;                                           │
 * │   var double = multiply(2);  // Returns: b => 2 * b                         │
 * │                                                                             │
 * │   // Perfect fit:                                                           │
 * │   [1, 2, 3].map(double);     // Same as [1,2,3].map(b => 2 * b)             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON CURRIED UTILITIES                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Math                                                                   │
 * │   var add = a => b => a + b;                                                │
 * │   var subtract = a => b => b - a;  // Note: b - a for map usage             │
 * │   var multiply = a => b => a * b;                                           │
 * │   var divide = a => b => b / a;    // Note: b / a for map usage             │
 * │                                                                             │
 * │   // Comparison                                                             │
 * │   var greaterThan = n => x => x > n;                                        │
 * │   var lessThan = n => x => x < n;                                           │
 * │   var equals = a => b => a === b;                                           │
 * │                                                                             │
 * │   // String                                                                 │
 * │   var startsWith = prefix => str => str.startsWith(prefix);                 │
 * │   var endsWith = suffix => str => str.endsWith(suffix);                     │
 * │   var contains = sub => str => str.includes(sub);                           │
 * │                                                                             │
 * │   // Object                                                                 │
 * │   var prop = key => obj => obj[key];                                        │
 * │   var has = key => obj => key in obj;                                       │
 * │                                                                             │
 * │   // Usage:                                                                 │
 * │   users.map(prop('name'));        // ['Alice', 'Bob', ...]                  │
 * │   users.filter(has('email'));     // Users with email                       │
 * │   names.filter(startsWith('A'));  // ['Alice', 'Anna', ...]                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CHAINING WITH CURRIED FUNCTIONS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   var prop = key => obj => obj[key];                                        │
 * │   var greaterThan = n => x => x > n;                                        │
 * │   var add = a => b => a + b;                                                │
 * │                                                                             │
 * │   var users = [                                                             │
 * │     { name: 'Alice', age: 25 },                                             │
 * │     { name: 'Bob', age: 30 },                                               │
 * │     { name: 'Charlie', age: 20 }                                            │
 * │   ];                                                                        │
 * │                                                                             │
 * │   // Get names of users older than 22                                       │
 * │   users                                                                     │
 * │     .filter(user => user.age > 22)                                          │
 * │     .map(prop('name'));                                                     │
 * │   // ['Alice', 'Bob']                                                       │
 * │                                                                             │
 * │   // Sum ages of all users                                                  │
 * │   users                                                                     │
 * │     .map(prop('age'))                                                       │
 * │     .reduce(add(0));  // or just (a, b) => a + b                            │
 * │   // 75                                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/03-currying-with-map.js
 */
