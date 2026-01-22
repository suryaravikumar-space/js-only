/**
 * CHALLENGE 06: Custom Flat Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ flat(depth) creates a new array with nested arrays flattened.              ║
 * ║                                                                            ║
 * ║   [1, [2, [3]]].flat()     → [1, 2, [3]]    (depth=1)                      ║
 * ║   [1, [2, [3]]].flat(2)    → [1, 2, 3]      (depth=2)                      ║
 * ║   [1, [2, [3]]].flat(Infinity) → completely flat                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

var nested1 = [1, [2, 3], [4, [5, 6]]];
console.log('A:', nested1.myFlat());
console.log('B:', nested1.myFlat(2));

var deep = [1, [2, [3, [4, [5]]]]];
console.log('C:', deep.myFlat(Infinity));

var sparse = [1, , [2, , 3]];
console.log('D:', sparse.myFlat().length);

/**
 * OUTPUT:
 *   A: [ 1, 2, 3, 4, [ 5, 6 ] ]
 *   B: [ 1, 2, 3, 4, 5, 6 ]
 *   C: [ 1, 2, 3, 4, 5 ]
 *   D: 3
 *
 * RUN: node docs/11-custom-array-methods/06-custom-flat.js
 */
