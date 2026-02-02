/**
 * CHALLENGE 05: Custom Some and Every
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ some: Returns true if ANY element passes the test                          ║
 * ║ every: Returns true if ALL elements pass the test                          ║
 * ║                                                                            ║
 * ║ Empty array behavior:                                                      ║
 * ║   [].some(fn)  → false (no elements match)                                 ║
 * ║   [].every(fn) → true (vacuous truth - no counter-examples)                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

var nums = [1, 2, 3, 4, 5];
console.log('A:', nums.mySome(x => x > 3));
console.log('B:', nums.mySome(x => x > 10));
console.log('C:', nums.myEvery(x => x > 0));
console.log('D:', nums.myEvery(x => x > 3));
console.log('E:', [].mySome(x => true));
console.log('F:', [].myEvery(x => false));

/**
 * OUTPUT:
 *   A: true
 *   B: false
 *   C: true
 *   D: false
 *   E: false
 *   F: true
 *
 * RUN: node docs/11-custom-array-methods/05-custom-some-every.js
 */
