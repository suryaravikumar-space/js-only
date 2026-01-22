// CHALLENGE 07: Property Descriptors with defineProperty
//
// What prints for A, B, C, D, E?

// Basic defineProperty
var obj = {};

Object.defineProperty(obj, 'name', {
  value: 'Alice',
  writable: false,
  enumerable: true,
  configurable: false
});

obj.name = 'Bob';  // Try to change
console.log('A:', obj.name);

// Enumerable property
var person = { visible: 'yes' };
Object.defineProperty(person, 'hidden', {
  value: 'secret',
  enumerable: false
});

console.log('B:', Object.keys(person).length);

// Configurable property
var config = {};
Object.defineProperty(config, 'setting', {
  value: 'locked',
  configurable: false
});

try {
  delete config.setting;
  console.log('C:', 'Deleted');
} catch(e) {
  console.log('C:', 'Cannot delete');
}

console.log('D:', config.setting);

// Multiple properties
var user = {};
Object.defineProperties(user, {
  firstName: { value: 'John', enumerable: true },
  lastName: { value: 'Doe', enumerable: true },
  fullName: {
    get() {
      return this.firstName + ' ' + this.lastName;
    },
    enumerable: true
  }
});

console.log('E:', user.fullName);
