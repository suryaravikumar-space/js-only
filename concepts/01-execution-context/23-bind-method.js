/**
 * CONCEPT 23: The bind() Method - Permanent this Binding
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT IS bind()?                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ bind() creates a NEW FUNCTION with `this` permanently locked.              ║
 * ║                                                                            ║
 * ║ CRITICAL DIFFERENCE FROM call()/apply():                                   ║
 * ║   - call() and apply() IMMEDIATELY execute the function                    ║
 * ║   - bind() RETURNS a new function (doesn't execute)                        ║
 * ║                                                                            ║
 * ║ SYNTAX:  const boundFunc = func.bind(thisArg, arg1, arg2, ...)             ║
 * ║                                                                            ║
 * ║   - Returns a NEW function with this permanently bound                     ║
 * ║   - Optional: Pre-fill some arguments (partial application)                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ============================================================================
// EXAMPLE 1: bind() Basics
// ============================================================================

console.log('=== Example 1: bind() Basics ===');

var person = {
  name: 'Alice',
  greet: function(greeting) {
    console.log(greeting + ', ' + this.name);
  }
};

// Normal method call
person.greet('Hello');  // Hello, Alice

// Get reference to the method
var greetFunc = person.greet;
// greetFunc('Hi');  // Would fail - this = global, this.name = undefined

// Create a bound function
var boundGreet = person.greet.bind(person);
boundGreet('Hi');  // Hi, Alice - works! this is locked to person

// Can call it from anywhere
var anotherObj = { name: 'Bob', sayHi: boundGreet };
anotherObj.sayHi('Hey');  // Hey, Alice - STILL Alice! bind is permanent

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE KEY INSIGHT                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ anotherObj.sayHi('Hey') prints "Hey, Alice" NOT "Hey, Bob"                  │
 * │                                                                             │
 * │ Why? Because boundGreet was created with bind(person).                      │
 * │ Once bound, the `this` value is LOCKED FOREVER.                             │
 * │ It doesn't matter HOW you call it later.                                    │
 * │                                                                             │
 * │ Even these won't change it:                                                 │
 * │   boundGreet.call({name: 'Charlie'}, 'Yo')  // Still Alice!                 │
 * │   boundGreet.apply({name: 'Dave'}, ['Sup']) // Still Alice!                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 2: call() vs apply() vs bind()
// ============================================================================

console.log('\n=== Example 2: Comparison ===');

function introduce(greeting, punctuation) {
  console.log(greeting + ', I am ' + this.name + punctuation);
}

var user = { name: 'John' };

// call() - executes immediately, comma-separated args
introduce.call(user, 'Hello', '!');
// Hello, I am John!

// apply() - executes immediately, array of args
introduce.apply(user, ['Hi', '...']);
// Hi, I am John...

// bind() - returns NEW function, doesn't execute
var boundIntroduce = introduce.bind(user, 'Hey');
boundIntroduce('?');  // Hey, I am John?
// Note: 'Hey' was pre-filled, only '?' was passed

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SUMMARY TABLE                                                               │
 * ├──────────┬─────────────────┬────────────────────────────────────────────────┤
 * │ Method   │ Executes?       │ Arguments                                      │
 * ├──────────┼─────────────────┼────────────────────────────────────────────────┤
 * │ call()   │ Immediately     │ Individual (comma-separated)                   │
 * │ apply()  │ Immediately     │ Array                                          │
 * │ bind()   │ NO (returns fn) │ Individual (can pre-fill some)                 │
 * └──────────┴─────────────────┴────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 3: Partial Application (Currying) with bind()
// ============================================================================

console.log('\n=== Example 3: Partial Application ===');

function multiply(a, b) {
  return a * b;
}

// Create specialized functions by pre-filling arguments
var double = multiply.bind(null, 2);   // a is locked to 2
var triple = multiply.bind(null, 3);   // a is locked to 3
var quadruple = multiply.bind(null, 4);

console.log(double(5));     // 10  (2 * 5)
console.log(triple(5));     // 15  (3 * 5)
console.log(quadruple(5));  // 20  (4 * 5)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PARTIAL APPLICATION EXPLAINED                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ multiply.bind(null, 2)                                                      │
 * │             │     │                                                         │
 * │             │     └── First argument (a) is PRE-FILLED with 2               │
 * │             │                                                               │
 * │             └── null because multiply doesn't use `this`                    │
 * │                                                                             │
 * │ double(5) is like calling multiply(2, 5)                                    │
 * │                                                                             │
 * │ This pattern is called "partial application" or "currying"                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 4: bind() for Event Handlers (THE MOST COMMON USE CASE)
// ============================================================================

console.log('\n=== Example 4: Event Handlers ===');

var button = {
  label: 'Submit',
  handleClick: function() {
    console.log('Button clicked: ' + this.label);
  }
};

// Simulating what happens in DOM event handling
function simulateClick(handler) {
  // DOM calls handlers with `this` = the element, not the object
  // We simulate this by calling as standalone function
  handler();
}

// Problem: this is lost
simulateClick(button.handleClick);
// Button clicked: undefined (this = global, not button)

// Solution: bind() to lock `this`
simulateClick(button.handleClick.bind(button));
// Button clicked: Submit (this = button, correctly!)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REAL DOM EXAMPLE (Browser)                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ // React Class Component (before hooks)                                     │
 * │ class MyComponent extends React.Component {                                 │
 * │   constructor() {                                                           │
 * │     super();                                                                │
 * │     // Must bind methods to use `this` in event handlers                    │
 * │     this.handleClick = this.handleClick.bind(this);                         │
 * │   }                                                                         │
 * │                                                                             │
 * │   handleClick() {                                                           │
 * │     console.log(this.state);  // Works because of bind()                    │
 * │   }                                                                         │
 * │                                                                             │
 * │   render() {                                                                │
 * │     return <button onClick={this.handleClick}>Click</button>;               │
 * │   }                                                                         │
 * │ }                                                                           │
 * │                                                                             │
 * │ Without bind(), `this.state` would be undefined because event handlers      │
 * │ are called as standalone functions by the DOM.                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 5: bind() in setTimeout/setInterval
// ============================================================================

console.log('\n=== Example 5: setTimeout ===');

var counter = {
  count: 0,
  increment: function() {
    this.count++;
    console.log('Count:', this.count);
  }
};

// Problem: setTimeout loses `this`
// setTimeout(counter.increment, 100);  // Count: NaN (this.count is undefined)

// Solution 1: bind()
setTimeout(counter.increment.bind(counter), 100);  // Count: 1

// Solution 2: Arrow function (ES6)
setTimeout(() => counter.increment(), 200);  // Count: 2

// Solution 3: Wrapper function
setTimeout(function() { counter.increment(); }, 300);  // Count: 3


// ============================================================================
// EXAMPLE 6: bind() Cannot be Overridden
// ============================================================================

console.log('\n=== Example 6: bind() is Permanent ===');

var obj1 = { name: 'Object 1' };
var obj2 = { name: 'Object 2' };
var obj3 = { name: 'Object 3' };

function getName() {
  return this.name;
}

// Bind to obj1
var boundToObj1 = getName.bind(obj1);
console.log('Bound to obj1:', boundToObj1());  // Object 1

// Try to override with call()
console.log('call(obj2):', boundToObj1.call(obj2));  // Object 1 (still!)

// Try to override with apply()
console.log('apply(obj3):', boundToObj1.apply(obj3));  // Object 1 (still!)

// Try to bind again
var rebind = boundToObj1.bind(obj2);
console.log('rebind(obj2):', rebind());  // Object 1 (STILL!)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BIND IS PERMANENT                                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Once a function is bound, its `this` CANNOT be changed by:                  │
 * │   - call()                                                                  │
 * │   - apply()                                                                 │
 * │   - Another bind()                                                          │
 * │   - Method call (obj.boundFunc())                                           │
 * │   - new keyword (special case - can override)                               │
 * │                                                                             │
 * │ This is why bind() is perfect for event handlers - you WANT `this`          │
 * │ to stay fixed no matter how the function is called later.                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 7: bind() with Constructor Functions
// ============================================================================

console.log('\n=== Example 7: bind() with new ===');

function Person(name) {
  this.name = name;
}

var boundPerson = Person.bind({ name: 'Ignored' });

// When using `new`, the bound `this` is IGNORED
var john = new boundPerson('John');
console.log(john.name);  // John (not 'Ignored'!)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SPECIAL CASE: new OVERRIDES bind()                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ The `new` keyword is the ONLY thing that can override bind().               │
 * │                                                                             │
 * │ When you use `new` with a bound function:                                   │
 * │   - The bound `this` is ignored                                             │
 * │   - A new object is created as usual                                        │
 * │   - `this` inside the function = the new object                             │
 * │                                                                             │
 * │ Pre-filled arguments from bind() are STILL used though!                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 8: Polyfill - How bind() Works Internally
// ============================================================================

console.log('\n=== Example 8: How bind() Works ===');

// Simplified polyfill (not production-ready)
Function.prototype.myBind = function(context, ...boundArgs) {
  var fn = this;  // The function being bound

  return function(...args) {
    return fn.apply(context, [...boundArgs, ...args]);
  };
};

function greetPerson(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

var alice = { name: 'Alice' };
var customBound = greetPerson.myBind(alice, 'Hello');
customBound('!');  // Hello, Alice!

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ UNDERSTANDING THE POLYFILL                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Function.prototype.myBind = function(context, ...boundArgs) {               │
 * │   var fn = this;  // 'this' is the function we're binding                   │
 * │                                                                             │
 * │   return function(...args) {      // Return a NEW function                  │
 * │     return fn.apply(              // When called, use apply to:             │
 * │       context,                    // - Set `this` to the bound context      │
 * │       [...boundArgs, ...args]     // - Combine pre-filled + new args        │
 * │     );                                                                      │
 * │   };                                                                        │
 * │ };                                                                          │
 * │                                                                             │
 * │ The real bind() is more complex (handles `new`, has proper prototype, etc.) │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ VISUAL: call() vs apply() vs bind()                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║   │ call()                                                             │   ║
 * ║   │ ──────                                                             │   ║
 * ║   │                                                                    │   ║
 * ║   │   func.call(obj, a, b)  ──►  func executes NOW with this=obj       │   ║
 * ║   │                              Returns: function's return value      │   ║
 * ║   │                                                                    │   ║
 * ║   └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║   │ apply()                                                            │   ║
 * ║   │ ───────                                                            │   ║
 * ║   │                                                                    │   ║
 * ║   │   func.apply(obj, [a,b]) ──► func executes NOW with this=obj       │   ║
 * ║   │                              Returns: function's return value      │   ║
 * ║   │                                                                    │   ║
 * ║   └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║   │ bind()                                                             │   ║
 * ║   │ ──────                                                             │   ║
 * ║   │                                                                    │   ║
 * ║   │   func.bind(obj, a)  ──►  Returns NEW FUNCTION                     │   ║
 * ║   │                           (doesn't execute yet!)                   │   ║
 * ║   │                                                                    │   ║
 * ║   │   boundFunc(b)  ──►  NOW it executes with this=obj                 │   ║
 * ║   │                      Arguments: a (pre-filled) + b (new)           │   ║
 * ║   │                                                                    │   ║
 * ║   └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUMMARY: bind()                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PURPOSE:                                                                   ║
 * ║   Create a new function with `this` permanently bound                      ║
 * ║                                                                            ║
 * ║ SYNTAX:                                                                    ║
 * ║   const boundFunc = func.bind(thisArg, arg1, arg2);                        ║
 * ║                                                                            ║
 * ║ KEY DIFFERENCES FROM call/apply:                                           ║
 * ║   1. Returns a new function (doesn't execute immediately)                  ║
 * ║   2. `this` is permanently locked (can't be changed later)                 ║
 * ║   3. Supports partial application (pre-filling arguments)                  ║
 * ║                                                                            ║
 * ║ COMMON USE CASES:                                                          ║
 * ║   1. Event handlers (React class components)                               ║
 * ║   2. setTimeout/setInterval callbacks                                      ║
 * ║   3. Passing methods as callbacks                                          ║
 * ║   4. Creating specialized functions (partial application)                  ║
 * ║                                                                            ║
 * ║ CANNOT OVERRIDE bind() EXCEPT:                                             ║
 * ║   The `new` keyword can override a bound `this`                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "bind() creates a new function with `this` permanently bound to a specific │
 * │  object. Unlike call() and apply() which execute immediately, bind()        │
 * │  returns a new function that you can call later.                            │
 * │                                                                             │
 * │  The most common use case is event handlers. When you pass a method as a   │
 * │  callback, `this` gets lost. Using bind(), you can lock `this` to the      │
 * │  correct object.                                                            │
 * │                                                                             │
 * │  bind() also supports partial application - you can pre-fill some          │
 * │  arguments when binding. This is useful for creating specialized           │
 * │  functions from generic ones.                                               │
 * │                                                                             │
 * │  Once bound, `this` cannot be changed by call(), apply(), or another       │
 * │  bind(). The only exception is the `new` keyword, which can override       │
 * │  the bound `this` when using a bound function as a constructor."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node concepts/01-execution-context/23-bind-method.js
 */
