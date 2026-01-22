// CHALLENGE 06: Custom Flat Implementation
//
// What prints for A, B, C, D?

Array.prototype.myFlat = function(depth = 1) {
  var result = [];
  
  function flatten(arr, d) {
    for (var i = 0; i < arr.length; i++) {
      if (i in arr) {
        if (Array.isArray(arr[i]) && d > 0) {
          flatten(arr[i], d - 1);
        } else {
          result.push(arr[i]);
        }
      }
    }
  }
  
  flatten(this, depth);
  return result;
};

// Test 1: Default depth (1)
var nested1 = [1, [2, 3], [4, [5, 6]]];
console.log('A:', nested1.myFlat());

// Test 2: Depth 2
console.log('B:', nested1.myFlat(2));

// Test 3: Infinity depth
var deep = [1, [2, [3, [4, [5]]]]];
console.log('C:', deep.myFlat(Infinity));

// Test 4: Handles sparse arrays
var sparse = [1, , [2, , 3]];
console.log('D:', sparse.myFlat().length);
