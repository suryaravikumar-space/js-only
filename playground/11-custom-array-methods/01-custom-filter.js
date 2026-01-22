// CHALLENGE 01: Custom Filter Implementation
//
// What prints for A, B, C, D?

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
