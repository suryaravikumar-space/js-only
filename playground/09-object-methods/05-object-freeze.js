// CHALLENGE 05: Object.freeze() and isFrozen
//
// What prints for A, B, C, D, E?

var frozen = Object.freeze({ name: 'Alice', age: 25 });
frozen.name = 'Bob';
frozen.city = 'NYC';
delete frozen.age;
console.log('A:', frozen);

console.log('B:', Object.isFrozen(frozen));
console.log('B2:', Object.isFrozen({ x: 1 }));

// Shallow freeze!
var nested = Object.freeze({ outer: { inner: 1 } });
nested.outer.inner = 999;
console.log('C:', nested.outer.inner);

// Freeze an array
var arr = Object.freeze([1, 2, 3]);
arr.push(4);  // What happens?
console.log('D:', arr);  // This line won't run if error

// Empty object is frozen by default?
var empty = {};
console.log('E:', Object.isFrozen(empty));
Object.preventExtensions(empty);
console.log('E2:', Object.isFrozen(empty));
