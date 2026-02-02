// ============================================
// TOPIC 3: Hoisting - The Invisible Movement
// ============================================

console.log("=== PART 1: var Hoisting Basics ===");

// ❌ What you write:
console.log(x); // undefined
var x = 5;
console.log(x); // 5

// ✅ What JavaScript actually does:
var y;              // Declaration hoisted
console.log(y);     // undefined
y = 10;             // Assignment stays
console.log(y);     // 10

console.log("\n=== PART 2: let/const TDZ (Temporal Dead Zone) ===");

// ❌ This throws error:

// ✅ Correct way:
let myConst = 30;
console.log(myConst); // 30

/*
  TDZ Explanation:

  // ← TDZ starts here
  // console.log(x); // ❌ ReferenceError
  // let x;
  // ← TDZ ends here
  // console.log(x); // ✅ undefined

  let/const ARE hoisted, but not initialized!
*/

console.log("\n=== PART 3: Function Declaration Hoisting ===");

// ✅ Function declarations ARE fully hoisted
greet(); // "Hello!" - Works!

function greet() {
  console.log("Hello!");
}

greet(); // "Hello!" - Also works!

console.log("\n=== PART 4: Function Expression Hoisting ===");

// ❌ Function expressions are NOT hoisted
try {
  sayHi(); // TypeError: sayHi is not a function
} catch(e) {
  console.log("Error:", e.message);
}

var sayHi = function() {
  console.log("Hi!");
};

sayHi(); // Now it works!

/*
  Why? Because it's treated like this:

  var sayHi;           // Only declaration hoisted
  sayHi();             // sayHi is undefined!
  sayHi = function(){} // Assignment stays here
*/

console.log("\n=== PART 5: Arrow Functions (Not Hoisted) ===");

// ❌ Arrow functions are NOT hoisted
try {
  // hello(); // ReferenceError (const/let)
} catch(e) {
  console.log("Error:", e.message);
}

const hello = () => console.log("Hello!");
hello(); // Works now

console.log("\n=== PART 6: The Scope Hoisting Trap ===");

var a = 1;

function scopeTest() {
  console.log("a before declaration:", a); // undefined (not 1!)
  var a = 2;
  console.log("a after declaration:", a);  // 2
}

scopeTest();
console.log("Global a:", a); // 1

/*
  What JavaScript sees:

  var a = 1;

  function scopeTest() {
    var a;              // Hoisted! Shadows global a
    console.log(a);     // undefined
    a = 2;
    console.log(a);     // 2
  }
*/

console.log("\n=== PART 7: Class Hoisting ===");

// ❌ Classes are NOT hoisted (like let/const)
try {
  // const p = new Person(); // ReferenceError!
} catch(e) {
  console.log("Class error:", e.message);
}

class Person {
  constructor(name) {
    this.name = name;
  }
}

const p = new Person("John");
console.log("Person created:", p.name);

console.log("\n=== PART 8: Hoisting in Blocks ===");

console.log("Before block");

{
  // ❌ var hoisting ignores blocks
  console.log(blockVar); // undefined (hoisted to function/global)
  var blockVar = "I leaked!";
}

console.log("Outside block:", blockVar); // "I leaked!"

// ✅ let/const respect blocks
{
  // console.log(blockLet); // ReferenceError (TDZ)
  let blockLet = "I'm safe";
  console.log("Inside block:", blockLet);
}
// console.log(blockLet); // ReferenceError

console.log("\n=== PART 9: Multiple Declarations ===");

var name = "First";
console.log(name); // "First"

var name = "Second"; // ✅ var allows redeclaration
console.log(name); // "Second"

// ❌ let/const don't allow redeclaration
let age = 25;
// let age = 30; // SyntaxError!

console.log("\n=== PART 10: Interview Gotchas ===");

// Question 1: What's the output?
var i = 5;
function test1() {
  console.log("Q1 - i:", i);
  var i = 10;
}
test1(); // undefined

// Question 2: What's the output?
function test2() {
  console.log("Q2 - typeof myFunc:", typeof myFunc);
  var myFunc = function() {};
  console.log("Q2 - typeof myFunc:", typeof myFunc);
}
test2(); // undefined, function

// Question 3: What's the output?
var flag = true;
function test3() {
  if (flag) {
    var message = "Hello";
  }
  console.log("Q3 - message:", message);
}
test3(); // "Hello" (var hoisted to function scope)

// Question 4: What's the output?
function test4() {
  console.log("Q4 - foo:", foo);
  var foo = function() { return 5; };
  console.log("Q4 - foo():", foo());
}
test4(); // undefined, 5

console.log("\n=== PART 11: Real-World Examples ===");

// ❌ BAD: Hoisting creates bugs
function badExample() {
  if (Math.random() > 0.5) {
    var result = "Success";
  }
  console.log(result); // undefined or "Success" (unpredictable!)
}

// ✅ GOOD: Declare at top
function goodExample() {
  let result;
  if (Math.random() > 0.5) {
    result = "Success";
  }
  console.log(result); // undefined or "Success" (predictable)
}

console.log("\n=== PART 12: Hoisting Priority ===");

/*
  Order of hoisting:
  1. Function declarations (fully hoisted)
  2. var declarations (hoisted, initialized to undefined)
  3. let/const declarations (hoisted to TDZ, not initialized)
*/

console.log(typeof test5); // "function" (not undefined!)

var test5 = "I'm a variable";

function test5() {
  return "I'm a function";
}

console.log(typeof test5); // "string" (variable assignment wins)
console.log(test5); // "I'm a variable"

console.log("\n=== SUMMARY ===");
/*
┌──────────────────────────────────────────────────────────────┐
│  HOISTING RULES:                                             │
│                                                              │
│  var:                                                        │
│  ✅ Declaration hoisted                                     │
│  ✅ Initialized to undefined                                │
│  ❌ Creates confusing bugs                                  │
│                                                              │
│  let/const:                                                  │
│  ✅ Declaration hoisted                                     │
│  ❌ NOT initialized (TDZ)                                   │
│  ✅ Throws ReferenceError (safer!)                          │
│                                                              │
│  Function Declarations:                                      │
│  ✅ Fully hoisted (entire function)                         │
│  ✅ Can be called before definition                         │
│                                                              │
│  Function Expressions / Arrow Functions:                     │
│  ❌ NOT hoisted                                             │
│  ❌ Cannot be called before definition                      │
│                                                              │
│  Classes:                                                    │
│  ❌ NOT hoisted (TDZ like let/const)                        │
│                                                              │
│  Best Practice:                                              │
│  → Always declare at the top                                │
│  → Use const/let (not var)                                  │
│  → Use function declarations for utilities                  │
│  → Use arrow functions for callbacks                        │
└──────────────────────────────────────────────────────────────┘
*/

// 📌 GOLDEN RULES:
// 1. "Declarations float up, assignments stay down"
// 2. "var gives undefined, let/const throws error"
// 3. "Function declarations fully hoisted, expressions are not"
// 4. "When in doubt, declare at the top!"