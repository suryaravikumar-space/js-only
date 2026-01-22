// CHALLENGE 01: Factory Function Pattern
//
// What prints for A, B, C, D, E?

// Basic factory function
function createPerson(name, age) {
  return {
    name: name,
    age: age,
    greet() {
      return 'Hello, I am ' + this.name;
    }
  };
}

var alice = createPerson('Alice', 25);
var bob = createPerson('Bob', 30);

console.log('A:', alice.greet());
console.log('B:', alice === bob);

// Factory with private state (closure)
function createCounter(initial) {
  var count = initial;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

var counter = createCounter(10);
counter.increment();
counter.increment();

console.log('C:', counter.getCount());
console.log('D:', counter.count);

// Factory with composition
function withLogging(obj) {
  return {
    ...obj,
    log() {
      console.log('E:', JSON.stringify(this));
    }
  };
}

var loggedPerson = withLogging(createPerson('Charlie', 35));
loggedPerson.log();
