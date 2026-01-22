/**
 * CHALLENGE 10: Ultimate Custom Array Methods
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Master these utility implementations:                                      ║
 * ║                                                                            ║
 * ║   groupBy:   Group items by key function                                   ║
 * ║   chunk:     Split array into chunks of size N                             ║
 * ║   unique:    Remove duplicates                                             ║
 * ║   partition: Split into [pass, fail] arrays                                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// GroupBy
Array.prototype.myGroupBy = function(keyFn) {
  return this.reduce((groups, item) => {
    var key = keyFn(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {});
};

var people = [
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 },
  { name: 'Charlie', age: 25 }
];
console.log('A:', people.myGroupBy(p => p.age)[25].length);

// Chunk
Array.prototype.myChunk = function(size) {
  var result = [];
  for (var i = 0; i < this.length; i += size) {
    result.push(this.slice(i, i + size));
  }
  return result;
};

console.log('B:', [1,2,3,4,5].myChunk(2));

// Unique
Array.prototype.myUnique = function() {
  return this.filter((item, index) => this.indexOf(item) === index);
};

console.log('C:', [1,2,2,3,3,3,4].myUnique());

// Partition
Array.prototype.myPartition = function(predicate) {
  return this.reduce(([pass, fail], item) => {
    return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
  }, [[], []]);
};

var [evens, odds] = [1,2,3,4,5,6].myPartition(x => x % 2 === 0);
console.log('D:', evens);
console.log('E:', odds);

/**
 * OUTPUT:
 *   A: 2
 *   B: [ [ 1, 2 ], [ 3, 4 ], [ 5 ] ]
 *   C: [ 1, 2, 3, 4 ]
 *   D: [ 2, 4, 6 ]
 *   E: [ 1, 3, 5 ]
 *
 * RUN: node docs/11-custom-array-methods/10-ultimate-custom-methods.js
 */
