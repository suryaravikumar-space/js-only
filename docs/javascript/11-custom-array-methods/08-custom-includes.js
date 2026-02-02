/**
 * CHALLENGE 08: Custom Includes and IndexOf
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ includes vs indexOf:                                                       ║
 * ║                                                                            ║
 * ║   includes: Returns boolean, FINDS NaN                                     ║
 * ║   indexOf:  Returns index (-1 if not found), CANNOT find NaN               ║
 * ║                                                                            ║
 * ║   [NaN].includes(NaN)  → true                                              ║
 * ║   [NaN].indexOf(NaN)   → -1                                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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
console.log('A:', arr.myIncludes(3));
console.log('B:', arr.myIncludes(NaN));
console.log('C:', arr.myIndexOf(NaN));
console.log('D:', arr.myIncludes(2, 2));
console.log('E:', arr.myIncludes(4, -3));

/**
 * OUTPUT:
 *   A: true
 *   B: true
 *   C: -1
 *   D: false
 *   E: true
 *
 * RUN: node docs/11-custom-array-methods/08-custom-includes.js
 */
