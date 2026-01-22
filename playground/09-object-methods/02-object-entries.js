// CHALLENGE 02: Object.entries()
//
// What prints for A, B, C, D, E?

var person = { name: 'Alice', age: 25 };
console.log('A:', Object.entries(person));

var obj = { 2: 'two', 1: 'one' };
console.log('B:', Object.entries(obj));

// Destructuring with entries
var scores = { math: 90, science: 85 };
for (var [subject, score] of Object.entries(scores)) {
  console.log('C:', subject, score);
}

// Converting to Map
var map = new Map(Object.entries({ x: 1, y: 2 }));
console.log('D:', map.get('x'));

var arr = ['a', 'b'];
console.log('E:', Object.entries(arr));
