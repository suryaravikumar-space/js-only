// CHALLENGE 08: Custom Includes and IndexOf
//
// What prints for A, B, C, D, E?

Array.prototype.myIncludes = function(searchElement, fromIndex = 0) {
  var start = fromIndex < 0 ? Math.max(this.length + fromIndex, 0) : fromIndex;
  
  for (var i = start; i < this.length; i++) {
    if (this[i] === searchElement || 
        (Number.isNaN(searchElement) && Number.isNaN(this[i]))) {
      return true;
    }
  }
  return false;
};

Array.prototype.myIndexOf = function(searchElement, fromIndex = 0) {
  var start = fromIndex < 0 ? Math.max(this.length + fromIndex, 0) : fromIndex;
  
  for (var i = start; i < this.length; i++) {
    if (i in this && this[i] === searchElement) {
      return i;
    }
  }
  return -1;
};

var arr = [1, 2, 3, NaN, 4, 5];

// Test 1: Basic includes
console.log('A:', arr.myIncludes(3));

// Test 2: NaN handling (includes finds it!)
console.log('B:', arr.myIncludes(NaN));

// Test 3: indexOf with NaN (doesn't find it!)
console.log('C:', arr.myIndexOf(NaN));

// Test 4: fromIndex
console.log('D:', arr.myIncludes(2, 2));

// Test 5: Negative fromIndex
console.log('E:', arr.myIncludes(4, -3));
