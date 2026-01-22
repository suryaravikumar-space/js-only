// CHALLENGE 05: Custom Some and Every Implementation
//
// What prints for A, B, C, D, E, F?

Array.prototype.mySome = function(callback, thisArg) {
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      if (callback.call(thisArg, this[i], i, this)) {
        return true;
      }
    }
  }
  return false;
};

Array.prototype.myEvery = function(callback, thisArg) {
  for (var i = 0; i < this.length; i++) {
    if (i in this) {
      if (!callback.call(thisArg, this[i], i, this)) {
        return false;
      }
    }
  }
  return true;
};

// Test 1: Some with match
var nums = [1, 2, 3, 4, 5];
console.log('A:', nums.mySome(x => x > 3));

// Test 2: Some without match
console.log('B:', nums.mySome(x => x > 10));

// Test 3: Every passes
var allPositive = [1, 2, 3, 4, 5];
console.log('C:', allPositive.myEvery(x => x > 0));

// Test 4: Every fails
console.log('D:', allPositive.myEvery(x => x > 3));

// Test 5: Empty array behavior
console.log('E:', [].mySome(x => true));   // false - no elements match
console.log('F:', [].myEvery(x => false)); // true - vacuous truth
