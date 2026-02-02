/**
 * CHALLENGE 04: Custom Find Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ find returns the FIRST element that passes the test.                       ║
 * ║ findIndex returns the INDEX of the first matching element.                 ║
 * ║                                                                            ║
 * ║   - Returns undefined/-1 if no match found                                 ║
 * ║   - Stops iteration on first match (short-circuits)                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

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

var nums = [1, 3, 5, 6, 7, 8];
console.log('A:', nums.myFind(x => x % 2 === 0));

var users = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' }
];
console.log('B:', users.myFind(u => u.id === 2).name);

console.log('C:', nums.myFind(x => x > 100));
console.log('D:', nums.myFindIndex(x => x % 2 === 0));

/**
 * OUTPUT:
 *   A: 6
 *   B: Bob
 *   C: undefined
 *   D: 3
 *
 * RUN: node docs/11-custom-array-methods/04-custom-find.js
 */
