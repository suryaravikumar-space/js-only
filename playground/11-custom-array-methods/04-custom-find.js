// CHALLENGE 04: Custom Find Implementation
//
// What prints for A, B, C, D?

Array.prototype.myFind = function(callback, thisArg) {
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        return this[i];
      }
    }
  }
  return undefined;
};

Array.prototype.myFindIndex = function(callback, thisArg) {
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        return i;
      }
    }
  }
  return -1;
};

// Test 1: Find first even
var nums = [1, 3, 5, 6, 7, 8];
var firstEven = nums.myFind(x => x % 2 === 0);
console.log('A:', firstEven);

// Test 2: Find object
var users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];
var user = users.myFind(u => u.id === 2);
console.log('B:', user.name);

// Test 3: Not found
var notFound = nums.myFind(x => x > 100);
console.log('C:', notFound);

// Test 4: FindIndex
var idx = nums.myFindIndex(x => x % 2 === 0);
console.log('D:', idx);
