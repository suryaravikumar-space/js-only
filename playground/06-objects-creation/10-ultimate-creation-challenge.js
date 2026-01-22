// CHALLENGE 10: Ultimate Object Creation Challenge
//
// What prints for A, B, C, D, E, F, G?

// Challenge 1: Prototype chain
var animal = { eats: true };
var rabbit = Object.create(animal);
rabbit.jumps = true;

var whiteRabbit = Object.create(rabbit);
whiteRabbit.color = 'white';

console.log('A:', whiteRabbit.eats);
console.log('B:', whiteRabbit.hasOwnProperty('eats'));

// Challenge 2: Constructor vs class
function PersonFn(name) {
  this.name = name;
}
PersonFn.prototype.greet = function() {
  return 'Hi, ' + this.name;
};

class PersonClass {
  constructor(name) {
    this.name = name;
  }
  greet() {
    return 'Hi, ' + this.name;
  }
}

var p1 = new PersonFn('Alice');
var p2 = new PersonClass('Bob');

console.log('C:', typeof PersonFn.prototype.greet);
console.log('D:', typeof PersonClass.prototype.greet);

// Challenge 3: Object.assign vs spread with getters
var source = {
  _value: 10,
  get value() {
    return this._value * 2;
  }
};

var assigned = Object.assign({}, source);
var spread = { ...source };

console.log('E:', assigned.value);
console.log('F:', typeof Object.getOwnPropertyDescriptor(spread, 'value').get);

// Challenge 4: Factory with private state
var createStack = function() {
  var items = [];
  return {
    push(item) { items.push(item); },
    pop() { return items.pop(); },
    get length() { return items.length; }
  };
};

var stack = createStack();
stack.push(1);
stack.push(2);
stack.push(3);
stack.pop();

console.log('G:', stack.length);
