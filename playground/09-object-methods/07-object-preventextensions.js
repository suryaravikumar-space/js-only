// CHALLENGE 07: Object.preventExtensions()
//
// What prints for A, B, C, D, E?

var obj = Object.preventExtensions({ x: 1, y: 2 });
obj.x = 100;         // Can we modify?
obj.z = 3;           // Can we add?
delete obj.y;        // Can we delete?
console.log('A:', obj);

console.log('B:', Object.isExtensible(obj));
console.log('B2:', Object.isExtensible({ a: 1 }));

// Chain of restrictions
var regular = { a: 1 };
console.log('C1:', Object.isExtensible(regular), Object.isSealed(regular), Object.isFrozen(regular));

Object.preventExtensions(regular);
console.log('C2:', Object.isExtensible(regular), Object.isSealed(regular), Object.isFrozen(regular));

// Can we make non-extensible object sealed/frozen?
var nonExt = Object.preventExtensions({ val: 1 });
Object.defineProperty(nonExt, 'val', { configurable: false });
console.log('D:', Object.isSealed(nonExt));

// Prototype chain still works
var proto = { inherited: 'yes' };
var child = Object.preventExtensions(Object.create(proto));
console.log('E:', child.inherited);
