// CHALLENGE 00: Custom Map Implementation
//
// What prints for A, B, C, D?

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
