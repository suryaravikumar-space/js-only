// CHALLENGE 03: Object.create
//
// What prints for A, B, C, D, E?

var proto = {
  greet: function() {
    return 'Hello, ' + this.name;
  }
};

var obj1 = Object.create(proto);
obj1.name = 'Object 1';

var obj2 = Object.create(proto);
obj2.name = 'Object 2';

var obj3 = Object.create(null);
obj3.name = 'Object 3';

console.log('A:', obj1.greet());
console.log('B:', obj2.greet());
console.log('C:', obj1.greet === obj2.greet);
console.log('D:', obj3.hasOwnProperty);
console.log('E:', Object.getPrototypeOf(obj1) === proto);
