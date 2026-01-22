// CHALLENGE 00: Object.keys()
//
// What prints for A, B, C, D, E?

var person = { name: 'Alice', age: 25, city: 'NYC' };
console.log('A:', Object.keys(person));

var arr = ['a', 'b', 'c'];
console.log('B:', Object.keys(arr));

var sparse = [1, , 3];
console.log('C:', Object.keys(sparse));

var obj = { 2: 'two', 1: 'one', 3: 'three' };
console.log('D:', Object.keys(obj));

var proto = { inherited: true };
var child = Object.create(proto);
child.own = 'property';
console.log('E:', Object.keys(child));
