// CHALLENGE 08: getOwnPropertyNames and getOwnPropertySymbols
//
// What prints for A, B, C, D, E?

var obj = { visible: 1 };
Object.defineProperty(obj, 'hidden', { value: 2, enumerable: false });
console.log('A keys:', Object.keys(obj));
console.log('A names:', Object.getOwnPropertyNames(obj));

var sym1 = Symbol('id');
var sym2 = Symbol('secret');
var withSymbols = {
  name: 'test',
  [sym1]: 100,
  [sym2]: 200
};
console.log('B:', Object.getOwnPropertySymbols(withSymbols));

// Array with extra property
var arr = [1, 2, 3];
arr.custom = 'extra';
console.log('C:', Object.getOwnPropertyNames(arr));

// Get ALL own properties (strings + symbols)
var all = { a: 1, [Symbol('x')]: 2 };
Object.defineProperty(all, 'b', { value: 3, enumerable: false });
var allProps = [
  ...Object.getOwnPropertyNames(all),
  ...Object.getOwnPropertySymbols(all)
];
console.log('D:', allProps.length);

// Reflect.ownKeys alternative
console.log('E:', Reflect.ownKeys(all));
