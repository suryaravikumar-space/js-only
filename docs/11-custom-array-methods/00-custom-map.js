/**
 * CHALLENGE 00: Custom Map Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.prototype.map creates a NEW array by calling a callback function    ║
 * ║ on every element of the original array.                                    ║
 * ║                                                                            ║
 * ║   callback(element, index, array) - called for each element               ║
 * ║   thisArg - optional value to use as 'this' in callback                   ║
 * ║                                                                            ║
 * ║ Key behaviors to implement:                                                ║
 * ║   - Returns a new array of the same length                                 ║
 * ║   - Skips holes in sparse arrays (but preserves them in result)           ║
 * ║   - Supports thisArg for callback context                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Implement Array.prototype.myMap
Array.prototype.myMap = function(callback, thisArg) {
  var result = [];
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      result[i] = callback.call(thisArg, this[i], i, this);
    }
  }
  return result;
};

// Test 1: Basic transformation
var nums = [1, 2, 3, 4, 5];
var doubled = nums.myMap(function(x) { return x * 2; });
console.log('A:', doubled);

// Test 2: Using index parameter
var indexed = nums.myMap(function(val, idx) {
  return val + '-' + idx;
});
console.log('B:', indexed);

// Test 3: Using thisArg
var multiplier = { factor: 10 };
var scaled = nums.myMap(function(x) {
  return x * this.factor;
}, multiplier);
console.log('C:', scaled);

// Test 4: Sparse array handling
var sparse = [1, , 3, , 5];
var mapped = sparse.myMap(function(x) { return x * 2; });
console.log('D:', mapped);
console.log('D length:', mapped.length);

/**
 * OUTPUT:
 *   A: [ 2, 4, 6, 8, 10 ]
 *   B: [ '1-0', '2-1', '3-2', '4-3', '5-4' ]
 *   C: [ 10, 20, 30, 40, 50 ]
 *   D: [ 2, <1 empty item>, 6, <1 empty item>, 10 ]
 *   D length: 5
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Basic transformation                                                    ║
 * ║ ───────────────────────                                                    ║
 * ║   nums = [1, 2, 3, 4, 5]                                                   ║
 * ║   callback: x => x * 2                                                     ║
 * ║                                                                            ║
 * ║   Iteration 0: callback(1, 0, nums) => 1 * 2 = 2                           ║
 * ║   Iteration 1: callback(2, 1, nums) => 2 * 2 = 4                           ║
 * ║   Iteration 2: callback(3, 2, nums) => 3 * 2 = 6                           ║
 * ║   Iteration 3: callback(4, 3, nums) => 4 * 2 = 8                           ║
 * ║   Iteration 4: callback(5, 4, nums) => 5 * 2 = 10                          ║
 * ║                                                                            ║
 * ║   Result: [2, 4, 6, 8, 10]                                                 ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: Sparse array handling                                                   ║
 * ║ ─────────────────────────                                                  ║
 * ║   sparse = [1, <empty>, 3, <empty>, 5]                                     ║
 * ║                                                                            ║
 * ║   i=0: 0 in sparse? true  => result[0] = 1 * 2 = 2                         ║
 * ║   i=1: 1 in sparse? false => SKIP (hole preserved)                         ║
 * ║   i=2: 2 in sparse? true  => result[2] = 3 * 2 = 6                         ║
 * ║   i=3: 3 in sparse? false => SKIP (hole preserved)                         ║
 * ║   i=4: 4 in sparse? true  => result[4] = 5 * 2 = 10                        ║
 * ║                                                                            ║
 * ║   Result: [2, <empty>, 6, <empty>, 10] (length: 5)                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPLEMENTATION DETAILS                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Array.prototype.myMap = function(callback, thisArg) {                     │
 * │     var result = [];                    // New array to return              │
 * │     for (var i = 0; i < this.length; i++) {                                 │
 * │       if (i in this) {                  // Check for holes                  │
 * │         result[i] = callback.call(      // Use call for thisArg            │
 * │           thisArg,                      // The 'this' context               │
 * │           this[i],                      // Current element                  │
 * │           i,                            // Current index                    │
 * │           this                          // Original array                   │
 * │         );                                                                  │
 * │       }                                                                     │
 * │     }                                                                       │
 * │     return result;                                                          │
 * │   };                                                                        │
 * │                                                                             │
 * │   Why 'i in this'?                                                          │
 * │   - Checks if index exists in array (not just undefined)                    │
 * │   - [1,,3] has index 0 and 2, but NOT index 1                               │
 * │   - This preserves sparse array behavior                                    │
 * │                                                                             │
 * │   Why callback.call()?                                                      │
 * │   - Allows setting 'this' context for the callback                          │
 * │   - If thisArg is undefined, callback's 'this' is undefined (strict)        │
 * │     or globalThis (non-strict)                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To implement Array.prototype.map, I need to:                               │
 * │                                                                             │
 * │  1. Create a new empty array for results                                    │
 * │  2. Loop through each index of the original array                           │
 * │  3. Check if the index exists (for sparse array support)                    │
 * │  4. Call the callback with (element, index, array) using .call()            │
 * │     to support the optional thisArg parameter                               │
 * │  5. Store the callback's return value at the same index                     │
 * │  6. Return the new array                                                    │
 * │                                                                             │
 * │  Key details:                                                               │
 * │  - Use 'i in this' to check for holes, not this[i] !== undefined            │
 * │  - Use callback.call(thisArg, ...) to support custom 'this' binding         │
 * │  - The result array has the same length as the original                     │
 * │  - map() never mutates the original array"                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/07-custom-array-methods/00-custom-map.js
 */
