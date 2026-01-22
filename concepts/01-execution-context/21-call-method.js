/**
 * CONCEPT 21: The call() Method - Explicit this Binding
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT IS call()?                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ call() lets you BORROW a function and tell it exactly what `this` should  ║
 * ║ be. Instead of relying on how a function is called, YOU decide.           ║
 * ║                                                                            ║
 * ║ SYNTAX:  function.call(thisArg, arg1, arg2, ...)                          ║
 * ║                                                                            ║
 * ║   - thisArg: The object to use as `this`                                  ║
 * ║   - arg1, arg2, ...: Arguments passed to the function (comma-separated)   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ============================================================================
// EXAMPLE 1: Basic call() Usage
// ============================================================================

var person1 = {
  name: 'Alice',
  greet: function(greeting, punctuation) {
    console.log(greeting + ', ' + this.name + punctuation);
  }
};

var person2 = {
  name: 'Bob'
};

console.log('=== Example 1: Basic call() ===');
person1.greet('Hello', '!');                          // Hello, Alice!
person1.greet.call(person2, 'Hi', '...');             // Hi, Bob...
person1.greet.call({ name: 'Charlie' }, 'Hey', '?');  // Hey, Charlie?

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BREAKDOWN                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ person1.greet('Hello', '!')                                                 │
 * │   → Normal method call                                                      │
 * │   → this = person1 (object before the dot)                                  │
 * │   → Output: Hello, Alice!                                                   │
 * │                                                                             │
 * │ person1.greet.call(person2, 'Hi', '...')                                    │
 * │   → Using call() to OVERRIDE this                                           │
 * │   → this = person2 (first argument to call)                                 │
 * │   → Output: Hi, Bob...                                                      │
 * │                                                                             │
 * │ person1.greet.call({ name: 'Charlie' }, 'Hey', '?')                         │
 * │   → Using call() with an inline object                                      │
 * │   → this = { name: 'Charlie' }                                              │
 * │   → Output: Hey, Charlie?                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 2: Why call() is Useful - Function Reuse
// ============================================================================

console.log('\n=== Example 2: Function Reuse ===');

// Standalone function (not attached to any object)
function introduce(hobby, years) {
  console.log(`I'm ${this.name}, ${this.age} years old.`);
  console.log(`I've been doing ${hobby} for ${years} years.`);
}

var developer = { name: 'Surya', age: 28 };
var designer = { name: 'Priya', age: 25 };

introduce.call(developer, 'coding', 5);
// I'm Surya, 28 years old.
// I've been doing coding for 5 years.

introduce.call(designer, 'design', 3);
// I'm Priya, 25 years old.
// I've been doing design for 3 years.

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY INSIGHT                                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ The function `introduce` doesn't belong to any object.                      │
 * │ Using call(), we can run it with ANY object as `this`.                      │
 * │                                                                             │
 * │ This is FUNCTION REUSE - write once, use with many objects.                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 3: call() with Primitives
// ============================================================================

console.log('\n=== Example 3: call() with Primitives ===');

function showThis() {
  console.log('this =', this);
  console.log('typeof this =', typeof this);
}

showThis.call('hello');     // this = [String: 'hello'], typeof = object
showThis.call(42);          // this = [Number: 42], typeof = object
showThis.call(true);        // this = [Boolean: true], typeof = object
showThis.call(null);        // this = global (non-strict) or null (strict)
showThis.call(undefined);   // this = global (non-strict) or undefined (strict)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PRIMITIVE COERCION                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ In NON-STRICT mode:                                                         │
 * │   - Primitives (string, number, boolean) get WRAPPED in objects             │
 * │   - null/undefined get replaced with the global object                      │
 * │                                                                             │
 * │ In STRICT mode:                                                             │
 * │   - Primitives stay as primitives                                           │
 * │   - null stays null, undefined stays undefined                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 4: call() for Constructor Chaining
// ============================================================================

console.log('\n=== Example 4: Constructor Chaining ===');

function Animal(name) {
  this.name = name;
  this.isAlive = true;
}

function Dog(name, breed) {
  // Call Animal constructor with `this` = the new Dog object
  Animal.call(this, name);
  this.breed = breed;
}

var myDog = new Dog('Buddy', 'Golden Retriever');
console.log(myDog);
// { name: 'Buddy', isAlive: true, breed: 'Golden Retriever' }

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CONSTRUCTOR CHAINING EXPLAINED                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ new Dog('Buddy', 'Golden Retriever')                                        │
 * │   │                                                                         │
 * │   ├─► `new` creates empty object: {}                                        │
 * │   ├─► `new` sets this = that object                                         │
 * │   │                                                                         │
 * │   └─► Inside Dog:                                                           │
 * │         │                                                                   │
 * │         ├─► Animal.call(this, name)                                         │
 * │         │     → Calls Animal with this = the new Dog object                 │
 * │         │     → Animal adds: this.name = 'Buddy', this.isAlive = true       │
 * │         │                                                                   │
 * │         └─► this.breed = 'Golden Retriever'                                 │
 * │               → Dog adds its own property                                   │
 * │                                                                             │
 * │ Result: { name: 'Buddy', isAlive: true, breed: 'Golden Retriever' }         │
 * │                                                                             │
 * │ This is how you achieve INHERITANCE before ES6 classes!                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 5: call() with Array-like Objects
// ============================================================================

console.log('\n=== Example 5: Array-like Objects ===');

function listArgs() {
  // `arguments` is array-like but NOT a real array
  // It doesn't have .map(), .filter(), etc.

  // TRICK: Borrow Array's slice method!
  var argsArray = Array.prototype.slice.call(arguments);

  console.log('arguments:', arguments);
  console.log('argsArray:', argsArray);
  console.log('Is array?', Array.isArray(argsArray));
}

listArgs('a', 'b', 'c');
// arguments: [Arguments] { '0': 'a', '1': 'b', '2': 'c' }
// argsArray: [ 'a', 'b', 'c' ]
// Is array? true

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CLASSIC INTERVIEW PATTERN                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Array.prototype.slice.call(arguments)                                       │
 * │                                                                             │
 * │ What this does:                                                             │
 * │   1. Get the slice method from Array.prototype                              │
 * │   2. Call it with `this` = arguments                                        │
 * │   3. slice() works on anything with length and indexes                      │
 * │   4. Returns a REAL array                                                   │
 * │                                                                             │
 * │ Modern alternative: Array.from(arguments) or [...arguments]                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 6: call() vs Direct Method Call
// ============================================================================

console.log('\n=== Example 6: Comparison ===');

var calculator = {
  value: 10,
  add: function(num) {
    return this.value + num;
  }
};

var anotherObj = { value: 100 };

// Method 1: Direct call (this = calculator)
console.log('Direct:', calculator.add(5));  // 15

// Method 2: call() (this = anotherObj)
console.log('With call:', calculator.add.call(anotherObj, 5));  // 105

// Method 3: call() with inline object
console.log('Inline:', calculator.add.call({ value: 1000 }, 5));  // 1005


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ VISUAL: How call() Works                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   NORMAL CALL: obj.method(arg1, arg2)                                      ║
 * ║   ─────────────────────────────────────                                    ║
 * ║                                                                            ║
 * ║   ┌──────────────────────────────────────────────────────────┐             ║
 * ║   │  method executes with:                                   │             ║
 * ║   │    this = obj (object before dot)                        │             ║
 * ║   │    arguments = [arg1, arg2]                              │             ║
 * ║   └──────────────────────────────────────────────────────────┘             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║   CALL(): obj.method.call(customThis, arg1, arg2)                          ║
 * ║   ───────────────────────────────────────────────                          ║
 * ║                                                                            ║
 * ║   ┌──────────────────────────────────────────────────────────┐             ║
 * ║   │  method executes with:                                   │             ║
 * ║   │    this = customThis (YOU decide!)                       │             ║
 * ║   │    arguments = [arg1, arg2]                              │             ║
 * ║   └──────────────────────────────────────────────────────────┘             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUMMARY: call()                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PURPOSE:                                                                   ║
 * ║   Execute a function with a specific `this` value                          ║
 * ║                                                                            ║
 * ║ SYNTAX:                                                                    ║
 * ║   func.call(thisArg, arg1, arg2, arg3, ...)                                ║
 * ║                                                                            ║
 * ║ USE CASES:                                                                 ║
 * ║   1. Borrow methods from other objects                                     ║
 * ║   2. Chain constructors (inheritance)                                      ║
 * ║   3. Convert array-like objects to arrays                                  ║
 * ║   4. Use array methods on non-arrays                                       ║
 * ║                                                                            ║
 * ║ KEY POINT:                                                                 ║
 * ║   call() IMMEDIATELY executes the function.                                ║
 * ║   (compare with bind() which returns a new function)                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "call() is a method available on all functions that lets you invoke the    │
 * │  function with a specific `this` value. The first argument becomes `this`, │
 * │  and subsequent arguments are passed to the function.                       │
 * │                                                                             │
 * │  Common use cases include:                                                  │
 * │  - Borrowing methods from other objects                                     │
 * │  - Constructor chaining for inheritance                                     │
 * │  - Converting arguments or NodeLists to real arrays                         │
 * │                                                                             │
 * │  The key difference from apply() is that call() takes arguments             │
 * │  individually (comma-separated), while apply() takes them as an array."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node concepts/01-execution-context/21-call-method.js
 */
