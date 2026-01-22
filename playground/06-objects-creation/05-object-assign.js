// CHALLENGE 05: Object.assign() for Copying
//
// What prints for A, B, C, D, E?

// Basic Object.assign
var target = { a: 1, b: 2 };
var source = { b: 3, c: 4 };

var result = Object.assign(target, source);

console.log('A:', result.b);
console.log('B:', target === result);

// Multiple sources
var defaults = { theme: 'light', fontSize: 14 };
var userPrefs = { fontSize: 16 };
var overrides = { theme: 'dark' };

var config = Object.assign({}, defaults, userPrefs, overrides);

console.log('C:', config.theme, config.fontSize);

// Shallow copy limitation
var original = {
  name: 'Alice',
  address: { city: 'NYC', zip: '10001' }
};

var copy = Object.assign({}, original);
copy.address.city = 'LA';

console.log('D:', original.address.city);

// Non-enumerable properties are not copied
var obj = {};
Object.defineProperty(obj, 'hidden', {
  value: 'secret',
  enumerable: false
});
obj.visible = 'public';

var cloned = Object.assign({}, obj);

console.log('E:', cloned.hidden, cloned.visible);
