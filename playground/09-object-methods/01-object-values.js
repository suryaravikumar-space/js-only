// CHALLENGE 01: Object.values()
//
// What prints for A, B, C, D, E?

var person = { name: 'Alice', age: 25, city: 'NYC' };
console.log('A:', Object.values(person));

var arr = ['x', 'y', 'z'];
console.log('B:', Object.values(arr));

var mixed = { 2: 'two', b: 'bee', 1: 'one' };
console.log('C:', Object.values(mixed));

var withSymbol = { [Symbol('id')]: 123, name: 'test' };
console.log('D:', Object.values(withSymbol));

var proto = { inherited: 'value' };
var child = Object.create(proto);
child.own = 'mine';
console.log('E:', Object.values(child));
