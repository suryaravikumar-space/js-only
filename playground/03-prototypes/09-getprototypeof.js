// CHALLENGE 09: Object.getPrototypeOf & setPrototypeOf
//
// What prints for A, B, C, D, E?

var proto1 = { x: 10 };
var proto2 = { x: 20, y: 30 };

var obj = Object.create(proto1);

console.log('A:', obj.x);
console.log('B:', Object.getPrototypeOf(obj) === proto1);

Object.setPrototypeOf(obj, proto2);

console.log('C:', obj.x);
console.log('D:', obj.y);
console.log('E:', Object.getPrototypeOf(obj) === proto2);
