// CHALLENGE 10: Ultimate Custom Array Methods
//
// What prints for A, B, C, D, E?

// Challenge 1: Implement groupBy
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
var byAge = people.myGroupBy(p => p.age);
console.log('A:', byAge[25].length);

// Challenge 2: Implement chunk
Array.prototype.myChunk = function(size) {
  var result = [];
  for (var i = 0; i < this.length; i += size) {
    result.push(this.slice(i, i + size));
  }
  return result;
};

console.log('B:', [1,2,3,4,5].myChunk(2));

// Challenge 3: Implement unique
Array.prototype.myUnique = function() {
  return this.filter((item, index) => this.indexOf(item) === index);
};

console.log('C:', [1,2,2,3,3,3,4].myUnique());

// Challenge 4: Implement partition
Array.prototype.myPartition = function(predicate) {
  return this.reduce(([pass, fail], item) => {
    return predicate(item) ? [[...pass, item], fail] : [pass, [...fail, item]];
  }, [[], []]);
};

var [evens, odds] = [1,2,3,4,5,6].myPartition(x => x % 2 === 0);
console.log('D:', evens);
console.log('E:', odds);
