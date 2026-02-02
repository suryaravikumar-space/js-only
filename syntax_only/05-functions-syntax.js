// ============================================
// TOPIC 5: Functions - Syntax Only
// ============================================

console.log("=== PART 1: Function Declaration ===");

// ✅ Function Declaration - Hoisted
greet();  // Works! (hoisted)

function greet() {
  console.log("Hello from declaration");
}

greet();  // Also works


console.log("\n=== PART 2: Function Expression ===");

// ❌ Function Expression - NOT Hoisted
try {
  sayHi();  // Error!
} catch(e) {
  console.log("Error:", e.message);
}

const sayHi = function() {
  console.log("Hi from expression");
};

sayHi();  // Works now


console.log("\n=== PART 3: Arrow Function ===");

// ❌ Arrow Function - NOT Hoisted
const hello = () => {
  console.log("Hello from arrow");
};

hello();

// ✅ Short syntax
const add = (a, b) => a + b;           // No braces, implicit return
const double = x => x * 2;             // Single param, no parentheses
const getNum = () => 42;               // No params, need parentheses

console.log("add(2, 3):", add(2, 3));
console.log("double(5):", double(5));
console.log("getNum():", getNum());


console.log("\n=== PART 4: this Binding ===");

const obj = {
  name: "John",

  regularFunc: function() {
    console.log("Regular:", this.name);  // this = obj
  },

  arrowFunc: () => {
    console.log("Arrow:", this.name);    // this = undefined (or global)
  },

  method() {  // Shorthand syntax
    console.log("Method:", this.name);   // this = obj
  }
};

obj.regularFunc();  // "John"
obj.arrowFunc();    // undefined
obj.method();       // "John"


console.log("\n=== PART 5: Parameters ===");

// Default parameters
function greetUser(name = "Guest") {
  console.log("Hello,", name);
}

greetUser();         // "Hello, Guest"
greetUser("Alice");  // "Hello, Alice"

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}

console.log("sum(1, 2, 3):", sum(1, 2, 3));
console.log("sum(1, 2, 3, 4, 5):", sum(1, 2, 3, 4, 5));


console.log("\n=== PART 6: Return Syntax ===");

// ❌ Explicit return
const multiply1 = (a, b) => {
  return a * b;
};

// ✅ Implicit return
const multiply2 = (a, b) => a * b;

// ✅ Returning object (need parentheses)
const makeObj1 = () => ({ name: "John", age: 25 });
// ❌ WRONG:
// const makeObj2 = () => { name: "John" };  // Returns undefined!

console.log("multiply1(3, 4):", multiply1(3, 4));
console.log("multiply2(3, 4):", multiply2(3, 4));
console.log("makeObj1():", makeObj1());


console.log("\n=== PART 7: Callback Syntax ===");

const numbers = [1, 2, 3, 4, 5];

// ❌ Function expression
const doubled1 = numbers.map(function(n) {
  return n * 2;
});

// ✅ Arrow function (shorter)
const doubled2 = numbers.map(n => n * 2);

console.log("doubled1:", doubled1);
console.log("doubled2:", doubled2);


console.log("\n=== PART 8: Interview Traps ===");

// Trap 1: this in arrow function
const person = {
  name: "Alice",
  greet: () => {
    console.log("Trap 1:", this);  // NOT person!
  }
};
person.greet();

// Trap 2: Arrow function in setTimeout
const counter = {
  count: 0,
  regularInc: function() {
    setTimeout(function() {
      console.log("Trap 2a:", this);  // Window/global, not counter
    }, 10);
  },
  arrowInc: function() {
    setTimeout(() => {
      console.log("Trap 2b:", this);  // counter object ✅
    }, 20);
  }
};

counter.regularInc();
counter.arrowInc();


console.log("\n=== SUMMARY ===");
/*
┌──────────────────────────────────────────────────────────────┐
│  FUNCTION TYPES:                                             │
│                                                              │
│  Declaration:  function name() {}                           │
│  • Hoisted (can call before definition)                     │
│  • Has its own 'this'                                       │
│                                                              │
│  Expression:   const name = function() {}                   │
│  • NOT hoisted                                              │
│  • Has its own 'this'                                       │
│                                                              │
│  Arrow:        const name = () => {}                        │
│  • NOT hoisted                                              │
│  • NO 'this' (inherits from parent)                         │
│  • Shorter syntax                                           │
│                                                              │
│  SYNTAX SHORTCUTS:                                           │
│  • (a, b) => a + b         (implicit return)                │
│  • x => x * 2              (single param, no parens)        │
│  • () => 42                (no params, need parens)         │
│  • () => ({ key: val })    (return object, need parens)     │
│                                                              │
│  WHEN TO USE:                                                │
│  • Declaration: Top-level utility functions                 │
│  • Expression:  Named function needed                       │
│  • Arrow:       Callbacks, short functions, preserve 'this' │
└──────────────────────────────────────────────────────────────┘
*/

// 📌 GOLDEN RULE:
// "Arrow = no 'this', shorter syntax. Use for callbacks!"