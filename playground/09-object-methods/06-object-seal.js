// CHALLENGE 06: Object.seal() and isSealed
//
// What prints for A, B, C, D, E?

var sealed = Object.seal({ name: 'Alice', age: 25 });
sealed.name = 'Bob';        // Can we modify?
sealed.city = 'NYC';        // Can we add?
delete sealed.age;          // Can we delete?
console.log('A:', sealed);

console.log('B:', Object.isSealed(sealed));
console.log('B2:', Object.isSealed({ x: 1 }));

// Sealed vs Frozen
var sealedObj = Object.seal({ x: 1 });
var frozenObj = Object.freeze({ x: 1 });
sealedObj.x = 100;
frozenObj.x = 100;
console.log('C:', sealedObj.x, frozenObj.x);

// Property descriptors after seal
var obj = { value: 42 };
console.log('D before:', Object.getOwnPropertyDescriptor(obj, 'value').configurable);
Object.seal(obj);
console.log('D after:', Object.getOwnPropertyDescriptor(obj, 'value').configurable);

// isSealed on frozen object?
var frozen = Object.freeze({ a: 1 });
console.log('E:', Object.isSealed(frozen));
