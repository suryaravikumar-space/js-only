// CHALLENGE 06: Spread Operator for Objects
//
// What prints for A, B, C, D, E?

// Basic spread
var obj1 = { a: 1, b: 2 };
var obj2 = { c: 3, d: 4 };

var merged = { ...obj1, ...obj2 };

console.log('A:', Object.keys(merged).length);

// Spread with override
var defaults = { theme: 'light', fontSize: 14, lang: 'en' };
var userConfig = { fontSize: 18, theme: 'dark' };

var config = { ...defaults, ...userConfig };

console.log('B:', config.theme, config.fontSize);

// Order matters
var first = { x: 1 };
var second = { x: 2, y: 3 };

var result1 = { ...first, ...second };
var result2 = { ...second, ...first };

console.log('C:', result1.x, result2.x);

// Shallow copy
var original = {
  name: 'Alice',
  skills: ['JS', 'Python']
};

var copy = { ...original };
copy.skills.push('Go');

console.log('D:', original.skills.length);

// Spread with new properties
var person = { name: 'Bob', age: 25 };
var updated = { ...person, age: 26, role: 'Dev' };

console.log('E:', updated.age, updated.role);
