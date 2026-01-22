/**
 * CHALLENGE 03: Custom forEach Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ forEach executes a callback for each element. Returns undefined.           ║
 * ║                                                                            ║
 * ║   callback(element, index, array)                                          ║
 * ║   thisArg - optional value to use as 'this'                                ║
 * ║                                                                            ║
 * ║ Key behaviors:                                                             ║
 * ║   - Always returns undefined (can't break/return early)                    ║
 * ║   - Skips holes in sparse arrays                                           ║
 * ║   - For side effects only, not for transformation                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

Array.prototype.myForEach = function(callback, thisArg) {
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      callback.call(thisArg, this[i], i, this);
    }
  }
};

// Test 1: Basic iteration
var result = [];
[1, 2, 3].myForEach(function(val) {
  result.push(val * 2);
});
console.log('A:', result);

// Test 2: Using thisArg
var multiplier = { factor: 10 };
var output = [];
[1, 2, 3].myForEach(function(val) {
  output.push(val * this.factor);
}, multiplier);
console.log('B:', output);

// Test 3: Sparse array handling
var sparse = [1, , 3];
var items = [];
sparse.myForEach(function(val, idx) {
  items.push(idx + ':' + val);
});
console.log('C:', items);

/**
 * OUTPUT:
 *   A: [ 2, 4, 6 ]
 *   B: [ 10, 20, 30 ]
 *   C: [ '0:1', '2:3' ]
 *
 * RUN: node docs/11-custom-array-methods/03-custom-foreach.js
 */
