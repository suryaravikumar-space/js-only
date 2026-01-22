// CHALLENGE 29: Strict Mode
//
// What prints for A, B, C, D, E?

// Non-strict mode behavior
var obj = {
  name: 'Object',
  getName: function() {
    return this.name;
  }
};

function nonStrictThis() {
  return this === undefined ? 'undefined' : 'global';
}

console.log('A:', nonStrictThis());

var getName = obj.getName;
console.log('B:', typeof getName());

function callWithNull() {
  return function() {
    return this === null ? 'null' : (this === undefined ? 'undefined' : 'global');
  }.call(null);
}

console.log('C:', callWithNull());

// Strict mode comparison (simulated)
var strictBehavior = (function() {
  'use strict';
  return function() {
    return this === undefined ? 'undefined' : 'not undefined';
  };
})();

console.log('D:', strictBehavior());

var withExplicitThis = (function() {
  'use strict';
  return function() {
    return this === undefined ? 'undefined' : this.name;
  };
})();

console.log('E:', withExplicitThis.call({ name: 'Explicit' }));
