// CHALLENGE 09: Custom Slice Implementation
//
// What prints for A, B, C, D?

Array.prototype.mySlice = function(start = 0, end) {
  var result = [];
  var len = this.length;
  
  var s = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  var e = end === undefined ? len : (end < 0 ? Math.max(len + end, 0) : Math.min(end, len));
  
  for (var i = s; i < e; i++) {
    result.push(this[i]);
  }
  
  return result;
};

var arr = [1, 2, 3, 4, 5];

// Test 1: Basic slice
console.log('A:', arr.mySlice(1, 3));

// Test 2: From index to end
console.log('B:', arr.mySlice(2));

// Test 3: Negative indices
console.log('C:', arr.mySlice(-3, -1));

// Test 4: Copy entire array
console.log('D:', arr.mySlice());
