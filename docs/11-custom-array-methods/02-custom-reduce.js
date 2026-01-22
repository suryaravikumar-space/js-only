/**
 * CHALLENGE 02: Custom Reduce Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Array.prototype.reduce accumulates array values into a single result.      ║
 * ║                                                                            ║
 * ║   callback(accumulator, currentValue, index, array)                        ║
 * ║   initialValue - optional starting accumulator value                       ║
 * ║                                                                            ║
 * ║ Key behaviors:                                                             ║
 * ║   - With initialValue: starts at index 0                                   ║
 * ║   - Without initialValue: first element is accumulator, starts at index 1  ║
 * ║   - Empty array + no initialValue = TypeError                              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

Array.prototype.myReduce = function(callback, initialValue) {
  var accumulator;
  var startIndex;

  if (arguments.length >= 2) {
    accumulator = initialValue;
    startIndex = 0;
  } else {
    if (this.length === 0) {
      throw new TypeError('Reduce of empty array with no initial value');
    }
    accumulator = this[0];
    startIndex = 1;
  }

  for (var i = startIndex; i < this.length; i++) {
    if (i in this) {
      accumulator = callback(accumulator, this[i], i, this);
    }
  }

  return accumulator;
};

// Test 1: Sum with initial value
var sum = [1, 2, 3, 4, 5].myReduce((acc, val) => acc + val, 0);
console.log('A:', sum);

// Test 2: Sum without initial value
var sum2 = [1, 2, 3, 4, 5].myReduce((acc, val) => acc + val);
console.log('B:', sum2);

// Test 3: Flatten array
var nested = [[1, 2], [3, 4], [5]];
var flat = nested.myReduce((acc, val) => acc.concat(val), []);
console.log('C:', flat);

// Test 4: Count occurrences
var fruits = ['apple', 'banana', 'apple', 'orange', 'banana', 'apple'];
var count = fruits.myReduce((acc, fruit) => {
  acc[fruit] = (acc[fruit] || 0) + 1;
  return acc;
}, {});
console.log('D:', count.apple);

/**
 * OUTPUT:
 *   A: 15
 *   B: 15
 *   C: [ 1, 2, 3, 4, 5 ]
 *   D: 3
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: Sum with initialValue=0                                                 ║
 * ║ ────────────────────────────                                               ║
 * ║   acc=0, val=1 → 0+1=1                                                     ║
 * ║   acc=1, val=2 → 1+2=3                                                     ║
 * ║   acc=3, val=3 → 3+3=6                                                     ║
 * ║   acc=6, val=4 → 6+4=10                                                    ║
 * ║   acc=10, val=5 → 10+5=15                                                  ║
 * ║                                                                            ║
 * ║ B: Sum without initialValue                                                ║
 * ║ ───────────────────────────                                                ║
 * ║   acc=1 (first element), starts at index 1                                 ║
 * ║   Same result: 15                                                          ║
 * ║                                                                            ║
 * ║ C: Flatten with concat                                                     ║
 * ║ ─────────────────────────                                                  ║
 * ║   acc=[], val=[1,2] → [1,2]                                                ║
 * ║   acc=[1,2], val=[3,4] → [1,2,3,4]                                         ║
 * ║   acc=[1,2,3,4], val=[5] → [1,2,3,4,5]                                     ║
 * ║                                                                            ║
 * ║ D: Count occurrences                                                       ║
 * ║ ─────────────────────                                                      ║
 * ║   Builds {apple:3, banana:2, orange:1}                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/11-custom-array-methods/02-custom-reduce.js
 */
