// CHALLENGE 04: Object.assign() Deep Dive
//
// What prints for A, B, C, D, E?

var target = { a: 1 };
var source = { b: 2 };
var result = Object.assign(target, source);
console.log('A:', result);
console.log('A2:', target === result);

// Multiple sources
var merged = Object.assign({}, { a: 1 }, { b: 2 }, { a: 3 });
console.log('B:', merged);

// Shallow copy problem
var original = { nested: { x: 1 } };
var copy = Object.assign({}, original);
copy.nested.x = 999;
console.log('C:', original.nested.x);

// Getters are invoked
var withGetter = {
  get value() { return 'computed'; }
};
var copied = Object.assign({}, withGetter);
console.log('D:', Object.getOwnPropertyDescriptor(copied, 'value'));

// Non-enumerable not copied
var obj = {};
Object.defineProperty(obj, 'hidden', { value: 'secret', enumerable: false });
obj.visible = 'seen';
var cloned = Object.assign({}, obj);
console.log('E:', Object.keys(cloned));
