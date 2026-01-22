// CHALLENGE 02: Custom Reduce Implementation
//
// What prints for A, B, C, D?

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
