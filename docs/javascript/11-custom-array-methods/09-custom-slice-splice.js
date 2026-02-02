/**
 * CHALLENGE 09: Custom Slice Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ slice(start, end) returns a shallow copy from start to end (exclusive)     ║
 * ║                                                                            ║
 * ║   - Negative indices count from end                                        ║
 * ║   - Original array is NOT modified                                         ║
 * ║   - slice() with no args = shallow copy entire array                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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
console.log('A:', arr.mySlice(1, 3));
console.log('B:', arr.mySlice(2));
console.log('C:', arr.mySlice(-3, -1));
console.log('D:', arr.mySlice());

/**
 * OUTPUT:
 *   A: [ 2, 3 ]
 *   B: [ 3, 4, 5 ]
 *   C: [ 3, 4 ]
 *   D: [ 1, 2, 3, 4, 5 ]
 *
 * RUN: node docs/11-custom-array-methods/09-custom-slice-splice.js
 */
