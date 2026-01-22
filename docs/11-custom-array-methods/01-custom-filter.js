/**
 * CHALLENGE 01: Custom Filter Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.prototype.filter creates a NEW array with elements that pass        ║
 * ║ a test implemented by the callback function.                               ║
 * ║                                                                            ║
 * ║   callback(element, index, array) - returns true to keep element          ║
 * ║   thisArg - optional value to use as 'this' in callback                   ║
 * ║                                                                            ║
 * ║ Key behaviors to implement:                                                ║
 * ║   - Returns a NEW array (may be shorter than original)                     ║
 * ║   - Only includes elements where callback returns truthy value             ║
 * ║   - Skips holes in sparse arrays                                           ║
 * ║   - Original array is never mutated                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Implement Array.prototype.myFilter
Array.prototype.myFilter = function(callback, thisArg) {
  var result = [];
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        result.push(this[i]);
      }
    }
  }
  return result;
};

// Test 1: Basic filtering
var nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var evens = nums.myFilter(function(x) { return x % 2 === 0; });
console.log('A:', evens);

// Test 2: Filtering with index
var indexed = nums.myFilter(function(val, idx) {
  return idx % 2 === 0;  // Keep elements at even indices
});
console.log('B:', indexed);

// Test 3: Using thisArg
var threshold = { min: 5 };
var aboveMin = nums.myFilter(function(x) {
  return x >= this.min;
}, threshold);
console.log('C:', aboveMin);

// Test 4: Filtering objects
var users = [
  { name: 'Alice', age: 25, active: true },
  { name: 'Bob', age: 17, active: true },
  { name: 'Charlie', age: 30, active: false },
  { name: 'Diana', age: 22, active: true }
];
var activeAdults = users.myFilter(function(user) {
  return user.active && user.age >= 18;
});
console.log('D:', activeAdults.map(function(u) { return u.name; }));

/**
 * OUTPUT:
 *   A: [ 2, 4, 6, 8, 10 ]
 *   B: [ 1, 3, 5, 7, 9 ]
 *   C: [ 5, 6, 7, 8, 9, 10 ]
 *   D: [ 'Alice', 'Diana' ]
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Basic filtering for even numbers                                        ║
 * ║ ─────────────────────────────────────                                      ║
 * ║   nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]                                   ║
 * ║   callback: x => x % 2 === 0                                               ║
 * ║                                                                            ║
 * ║   i=0: 1 % 2 === 0? false => skip                                          ║
 * ║   i=1: 2 % 2 === 0? true  => push(2)                                       ║
 * ║   i=2: 3 % 2 === 0? false => skip                                          ║
 * ║   i=3: 4 % 2 === 0? true  => push(4)                                       ║
 * ║   ... and so on                                                            ║
 * ║                                                                            ║
 * ║   Result: [2, 4, 6, 8, 10]                                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: Keep elements at even INDICES                                           ║
 * ║ ───────────────────────────────────                                        ║
 * ║   Index:  0  1  2  3  4  5  6  7  8  9                                     ║
 * ║   Value:  1  2  3  4  5  6  7  8  9  10                                    ║
 * ║                                                                            ║
 * ║   Even indices (0, 2, 4, 6, 8) => values [1, 3, 5, 7, 9]                   ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Multiple conditions on objects                                          ║
 * ║ ───────────────────────────────────                                        ║
 * ║   Alice:   active=true,  age=25 >= 18  => KEEP                             ║
 * ║   Bob:     active=true,  age=17 < 18   => SKIP                             ║
 * ║   Charlie: active=false                => SKIP                             ║
 * ║   Diana:   active=true,  age=22 >= 18  => KEEP                             ║
 * ║                                                                            ║
 * ║   Result: ['Alice', 'Diana']                                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FILTER vs MAP - KEY DIFFERENCE                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   MAP:    Same length, transformed values                                   │
 * │           [1, 2, 3].map(x => x * 2)    => [2, 4, 6]                         │
 * │                                                                             │
 * │   FILTER: Variable length, same values                                      │
 * │           [1, 2, 3].filter(x => x > 1) => [2, 3]                            │
 * │                                                                             │
 * │   Implementation difference:                                                │
 * │   - map:    result[i] = callback(...)  // Assigns at index                  │
 * │   - filter: result.push(...)           // Appends if truthy                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To implement Array.prototype.filter, I need to:                            │
 * │                                                                             │
 * │  1. Create a new empty array for results                                    │
 * │  2. Loop through each index of the original array                           │
 * │  3. Check if the index exists (for sparse array support)                    │
 * │  4. Call the callback with (element, index, array)                          │
 * │  5. If callback returns truthy, push the element to result                  │
 * │  6. Return the new array                                                    │
 * │                                                                             │
 * │  Key differences from map:                                                  │
 * │  - Use result.push() not result[i] = ...                                    │
 * │  - Result array may be shorter than original                                │
 * │  - We keep the original values, not transformed ones                        │
 * │  - Callback's return value is used as boolean test, not stored"            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-custom-array-methods/01-custom-filter.js
 */
