/**
 * THIS BINDING: 04 - Common Gotchas & Tricky Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ "this" INTERVIEW GOTCHAS                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The most commonly asked "this" questions in interviews.                    ║
 * ║ Predict the output before running!                                         ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 1: setTimeout
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Gotcha 1: setTimeout ===\n');

const obj1 = {
  name: 'Object1',
  greet() {
    console.log('A: Direct call:', this.name);  // Object1

    setTimeout(function() {
      console.log('B: setTimeout regular:', this.name);  // undefined
    }, 0);

    setTimeout(() => {
      console.log('C: setTimeout arrow:', this.name);  // Object1
    }, 10);
  }
};

obj1.greet();


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 2: Nested Functions
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 2: Nested Functions ===\n');

const obj2 = {
  name: 'Object2',
  outer() {
    console.log('D: outer this.name:', this.name);  // Object2

    function inner() {
      console.log('E: inner this.name:', this.name);  // undefined (strict mode)
    }
    inner();

    const innerArrow = () => {
      console.log('F: innerArrow this.name:', this.name);  // Object2
    };
    innerArrow();
  }
};

obj2.outer();


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 3: Method Assignment
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 3: Method Assignment ===\n');

const obj3 = {
  name: 'Object3',
  greet() {
    console.log('Hello from', this.name);
  }
};

const obj4 = {
  name: 'Object4'
};

// Borrowing method
obj4.greet = obj3.greet;

console.log('G: obj3.greet():');
obj3.greet();  // Hello from Object3

console.log('H: obj4.greet():');
obj4.greet();  // Hello from Object4 (implicit binding to obj4!)

// Extracting breaks binding
const greet = obj3.greet;
console.log('I: extracted greet():');
greet();  // Hello from undefined


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 4: IIFE inside Method
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 4: IIFE inside Method ===\n');

const obj5 = {
  name: 'Object5',
  showThis() {
    console.log('J: method this:', this.name);  // Object5

    (function() {
      console.log('K: IIFE this:', this?.name);  // undefined
    })();

    (() => {
      console.log('L: Arrow IIFE this:', this.name);  // Object5
    })();
  }
};

obj5.showThis();


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 5: Array Methods
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 5: Array Methods ===\n');

const obj6 = {
  multiplier: 2,
  numbers: [1, 2, 3],

  doubleWithRegular() {
    return this.numbers.map(function(n) {
      return n * this.multiplier;  // this.multiplier is undefined!
    });
  },

  doubleWithArrow() {
    return this.numbers.map(n => n * this.multiplier);  // Works!
  },

  doubleWithThisArg() {
    return this.numbers.map(function(n) {
      return n * this.multiplier;
    }, this);  // Second argument sets "this"
  }
};

console.log('M: Regular function in map:', obj6.doubleWithRegular());  // [NaN, NaN, NaN]
console.log('N: Arrow function in map:', obj6.doubleWithArrow());       // [2, 4, 6]
console.log('O: thisArg in map:', obj6.doubleWithThisArg());           // [2, 4, 6]


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 6: Chained Method Calls
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 6: Chained Calls ===\n');

const calculator = {
  value: 0,
  add(n) {
    this.value += n;
    return this;  // Return this for chaining
  },
  subtract(n) {
    this.value -= n;
    return this;
  },
  log() {
    console.log('P: Value:', this.value);
    return this;
  }
};

calculator.add(10).subtract(3).log();  // Value: 7

// But what if we extract?
const { add } = calculator;
try {
  add(5);  // Error! this.value is undefined
} catch (e) {
  console.log('Q: Extracted add() error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 7: Constructor Returns
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 7: Constructor Returns ===\n');

function Person(name) {
  this.name = name;
  // If constructor returns an object, that becomes the result
  // return { name: 'Override' };  // Would override!
}

function WeirdPerson(name) {
  this.name = name;
  return { name: 'I am weird' };  // Returns this object instead!
}

const normal = new Person('Alice');
const weird = new WeirdPerson('Bob');

console.log('R: normal.name:', normal.name);  // Alice
console.log('S: weird.name:', weird.name);    // I am weird (not Bob!)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 8: bind() Multiple Times
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 8: bind() Multiple Times ===\n');

function showName() {
  console.log(this.name);
}

const alice = { name: 'Alice' };
const bob = { name: 'Bob' };

const boundToAlice = showName.bind(alice);
const reboundToBob = boundToAlice.bind(bob);  // Trying to rebind

console.log('T: boundToAlice():');
boundToAlice();  // Alice

console.log('U: reboundToBob():');
reboundToBob();  // Alice! (can't rebind a bound function)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 9: Event Handler "this"
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 9: Event Handlers (Simulated) ===\n');

// Simulating DOM event handling
function addEventListener(element, callback) {
  // In real DOM, callback is called with element as "this"
  callback.call(element);
}

const button = {
  id: 'submit-btn',
  label: 'Submit'
};

const handler = {
  buttonLabel: 'Handler Button',

  handleClick() {
    console.log('V: this.buttonLabel:', this.buttonLabel);  // undefined
    console.log('W: this.id:', this.id);                    // submit-btn
  }
};

addEventListener(button, handler.handleClick);


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 10: new with Explicit Binding
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 10: new vs bind ===\n');

function Widget(name) {
  this.name = name;
}

const boundWidget = Widget.bind({ name: 'Bound' });

// new has higher priority than bind!
const instance = new boundWidget('Instance');

console.log('X: instance.name:', instance.name);  // Instance (not Bound!)


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY GOTCHAS SUMMARY                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. setTimeout: Regular function loses "this", arrow keeps it                │
 * │ 2. Nested functions: Regular loses context, arrow inherits                  │
 * │ 3. Method assignment: "this" follows the object before the dot              │
 * │ 4. IIFE inside method: Regular = global, arrow = enclosing                  │
 * │ 5. Array methods: Pass thisArg or use arrow functions                       │
 * │ 6. Extracting methods: Loses implicit binding                               │
 * │ 7. Constructor return: Returning object overrides "this"                    │
 * │ 8. Multiple bind: Only first bind takes effect                              │
 * │ 9. Event handlers: "this" is the element, not your object                   │
 * │ 10. new vs bind: "new" has higher priority                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/21-this-binding/04-this-gotchas.js
 */
