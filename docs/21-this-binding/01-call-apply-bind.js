/**
 * THIS BINDING: 01 - call(), apply(), and bind()
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ EXPLICIT BINDING METHODS                                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ call()  - Invoke immediately, arguments as list                            ║
 * ║ apply() - Invoke immediately, arguments as array                           ║
 * ║ bind()  - Return new function with fixed "this"                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// call() - INVOKE WITH ARGUMENTS LIST
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== call() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ fn.call(thisArg, arg1, arg2, ...)                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • Calls the function IMMEDIATELY                                            │
 * │ • First argument becomes "this"                                             │
 * │ • Remaining arguments passed to the function                                │
 * │                                                                             │
 * │   function.call(thisArg, arg1, arg2)                                        │
 * │                    ▲       ▲     ▲                                          │
 * │                    │       │     │                                          │
 * │                    │       └─────┴── function arguments                     │
 * │                    └── becomes "this"                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function introduce(greeting, hobby) {
  console.log(`  ${greeting}! I'm ${this.name} and I like ${hobby}.`);
}

const person1 = { name: 'Alice' };
const person2 = { name: 'Bob' };

console.log('A: call() with person1:');
introduce.call(person1, 'Hello', 'coding');  // Hello! I'm Alice and I like coding.

console.log('B: call() with person2:');
introduce.call(person2, 'Hi', 'music');  // Hi! I'm Bob and I like music.

// Common use: borrowing methods
console.log('\nC: Method Borrowing with call():');

const nums = { 0: 'a', 1: 'b', 2: 'c', length: 3 };  // Array-like object
const arr = Array.prototype.slice.call(nums);
console.log('  Array from array-like:', arr);  // ['a', 'b', 'c']

// Get type of any value
function getType(value) {
  return Object.prototype.toString.call(value);
}
console.log('  Type of []:', getType([]));        // [object Array]
console.log('  Type of {}:', getType({}));        // [object Object]
console.log('  Type of null:', getType(null));    // [object Null]


// ═══════════════════════════════════════════════════════════════════════════════
// apply() - INVOKE WITH ARGUMENTS ARRAY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== apply() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ fn.apply(thisArg, [arg1, arg2, ...])                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • Calls the function IMMEDIATELY                                            │
 * │ • First argument becomes "this"                                             │
 * │ • Second argument is an ARRAY of arguments                                  │
 * │                                                                             │
 * │   function.apply(thisArg, [arg1, arg2])                                     │
 * │                     ▲       ▲                                               │
 * │                     │       │                                               │
 * │                     │       └── arguments as ARRAY                          │
 * │                     └── becomes "this"                                      │
 * │                                                                             │
 * │   Mnemonic: "A" for Apply = "A" for Array                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('D: apply() with array of arguments:');
introduce.apply(person1, ['Hey', 'gaming']);  // Hey! I'm Alice and I like gaming.

// apply() is great for variable-length arguments
console.log('\nE: Math.max with apply():');
const numbers = [5, 2, 8, 1, 9];
console.log('  Max:', Math.max.apply(null, numbers));  // 9

// Modern alternative: spread operator
console.log('  Max (spread):', Math.max(...numbers));  // 9

// Merging arrays
console.log('\nF: Array push with apply():');
const arr1 = [1, 2, 3];
const arr2 = [4, 5, 6];
Array.prototype.push.apply(arr1, arr2);
console.log('  Merged:', arr1);  // [1, 2, 3, 4, 5, 6]


// ═══════════════════════════════════════════════════════════════════════════════
// bind() - RETURN NEW FUNCTION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== bind() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ fn.bind(thisArg, arg1, arg2, ...)                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • Does NOT call the function                                                │
 * │ • Returns a NEW FUNCTION with fixed "this"                                  │
 * │ • Can also pre-fill arguments (partial application)                         │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   const bound = fn.bind(obj, arg1);                                │    │
 * │   │                                                                    │    │
 * │   │   bound(arg2)  ← Calls fn with this=obj, args=[arg1, arg2]         │    │
 * │   │                                                                    │    │
 * │   │   The bound function CANNOT have "this" changed!                   │    │
 * │   │   bound.call(other)  ← "this" stays as "obj"                       │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('G: Basic bind():');
const introduceAlice = introduce.bind(person1);
introduceAlice('Howdy', 'reading');  // Howdy! I'm Alice and I like reading.

console.log('\nH: bind() with pre-filled arguments (partial application):');
const aliceSaysHi = introduce.bind(person1, 'Hi there');
aliceSaysHi('cooking');  // Hi there! I'm Alice and I like cooking.

// bind() is permanent!
console.log('\nI: bind() is permanent:');
const boundFn = introduce.bind(person1);
boundFn.call(person2, 'Test', 'test');  // Still uses person1!

// Event handler example
console.log('\nJ: Event handler pattern:');
const button = {
  label: 'Submit',
  onClick() {
    console.log(`  Button "${this.label}" clicked`);
  }
};

// Without bind (loses context)
// element.addEventListener('click', button.onClick);  // this.label = undefined

// With bind (preserves context)
const handler = button.onClick.bind(button);
handler();  // Button "Submit" clicked


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: call() vs apply() vs bind()                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────┬─────────────────────┬─────────────────────────────────┐    │
 * │   │ Method     │ Invokes Function?   │ Arguments Format                │    │
 * │   ├────────────┼─────────────────────┼─────────────────────────────────┤    │
 * │   │ call()     │ YES (immediately)   │ List: arg1, arg2, arg3          │    │
 * │   │ apply()    │ YES (immediately)   │ Array: [arg1, arg2, arg3]       │    │
 * │   │ bind()     │ NO (returns fn)     │ List: arg1, arg2, arg3          │    │
 * │   └────────────┴─────────────────────┴─────────────────────────────────┘    │
 * │                                                                             │
 * │   USE CASES:                                                                │
 * │                                                                             │
 * │   call():  Method borrowing, immediate invocation with specific "this"      │
 * │   apply(): When arguments are in an array, Math.max/min with arrays         │
 * │   bind():  Event handlers, callbacks, partial application                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Comparison Summary ===\n');

function demo(a, b) {
  console.log(`  this.x = ${this.x}, a = ${a}, b = ${b}`);
}

const obj = { x: 10 };

console.log('K: call() - immediate, list args:');
demo.call(obj, 1, 2);  // this.x = 10, a = 1, b = 2

console.log('L: apply() - immediate, array args:');
demo.apply(obj, [3, 4]);  // this.x = 10, a = 3, b = 4

console.log('M: bind() - returns function:');
const boundDemo = demo.bind(obj, 5);
boundDemo(6);  // this.x = 10, a = 5, b = 6


// ═══════════════════════════════════════════════════════════════════════════════
// IMPLEMENTING CUSTOM bind()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Custom bind() Implementation ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW QUESTION: Implement bind()                                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

Function.prototype.myBind = function(thisArg, ...boundArgs) {
  const fn = this;  // The original function

  return function(...callArgs) {
    return fn.apply(thisArg, [...boundArgs, ...callArgs]);
  };
};

console.log('N: Custom myBind():');
const myBoundDemo = demo.myBind(obj, 'A');
myBoundDemo('B');  // this.x = 10, a = A, b = B


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "call(), apply(), and bind() are methods to explicitly set 'this':          │
 * │                                                                             │
 * │ call(thisArg, arg1, arg2):                                                  │
 * │ • Invokes function immediately                                              │
 * │ • Arguments passed as a list                                                │
 * │ • Use for: method borrowing, setting this for immediate call                │
 * │                                                                             │
 * │ apply(thisArg, [args]):                                                     │
 * │ • Invokes function immediately                                              │
 * │ • Arguments passed as array                                                 │
 * │ • Use for: spreading arrays to functions like Math.max                      │
 * │ • Mnemonic: 'A' for Apply = 'A' for Array                                   │
 * │                                                                             │
 * │ bind(thisArg, arg1, arg2):                                                  │
 * │ • Does NOT invoke - returns a new function                                  │
 * │ • The bound function's 'this' CANNOT be changed                             │
 * │ • Use for: event handlers, callbacks, partial application                   │
 * │                                                                             │
 * │ To implement bind: return a function that calls original with apply(),      │
 * │ preserving both pre-filled args and new args."                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/21-this-binding/01-call-apply-bind.js
 */
