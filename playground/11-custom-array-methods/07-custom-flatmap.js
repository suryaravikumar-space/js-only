// CHALLENGE 07: Custom FlatMap Implementation
//
// What prints for A, B, C?

Array.prototype.myFlatMap = function(callback, thisArg) {
  return this.map(callback, thisArg).flat(1);
};

// Test 1: Double each and flatten
var nums = [1, 2, 3];
var doubled = nums.myFlatMap(x => [x, x * 2]);
console.log('A:', doubled);

// Test 2: Filter and transform
var sentences = ['Hello world', 'How are you'];
var words = sentences.myFlatMap(s => s.split(' '));
console.log('B:', words);

// Test 3: Conditional mapping
var mixed = [1, 2, 3, 4, 5];
var result = mixed.myFlatMap(x => x % 2 === 0 ? [x] : []);
console.log('C:', result);
