/**
 * CHALLENGE 07: Custom FlatMap Implementation
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ flatMap = map + flat(1) in one pass                                        ║
 * ║                                                                            ║
 * ║   [1, 2].flatMap(x => [x, x*2]) → [1, 2, 2, 4]                             ║
 * ║                                                                            ║
 * ║ More efficient than arr.map().flat()                                       ║
 * ║ Only flattens ONE level deep                                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

Array.prototype.myFlatMap = function(callback, thisArg) {
  return this.map(callback, thisArg).flat(1);
};

var nums = [1, 2, 3];
console.log('A:', nums.myFlatMap(x => [x, x * 2]));

var sentences = ['Hello world', 'How are you'];
console.log('B:', sentences.myFlatMap(s => s.split(' ')));

var mixed = [1, 2, 3, 4, 5];
console.log('C:', mixed.myFlatMap(x => x % 2 === 0 ? [x] : []));

/**
 * OUTPUT:
 *   A: [ 1, 2, 2, 4, 3, 6 ]
 *   B: [ 'Hello', 'world', 'How', 'are', 'you' ]
 *   C: [ 2, 4 ]
 *
 * RUN: node docs/11-custom-array-methods/07-custom-flatmap.js
 */
