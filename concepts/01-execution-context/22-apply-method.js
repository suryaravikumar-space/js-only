/**
 * CONCEPT 22: The apply() Method - call() with Arrays
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT IS apply()?                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ apply() is IDENTICAL to call(), except arguments are passed as an ARRAY.  ║
 * ║                                                                            ║
 * ║ SYNTAX:  function.apply(thisArg, [arg1, arg2, ...])                        ║
 * ║                                                                            ║
 * ║   - thisArg: The object to use as `this`                                   ║
 * ║   - [args]: Arguments as an ARRAY (or array-like object)                   ║
 * ║                                                                            ║
 * ║ MEMORY TRICK:                                                              ║
 * ║   call = Comma separated arguments                                         ║
 * ║   apply = Array of arguments                                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ============================================================================
// EXAMPLE 1: call() vs apply() - The Difference
// ============================================================================

console.log('=== Example 1: call() vs apply() ===');

function greet(greeting, punctuation) {
  console.log(greeting + ', ' + this.name + punctuation);
}

var person = { name: 'Alice' };

// Using call() - arguments are COMMA separated
greet.call(person, 'Hello', '!');      // Hello, Alice!

// Using apply() - arguments are in an ARRAY
greet.apply(person, ['Hello', '!']);   // Hello, Alice!

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE ONLY DIFFERENCE                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ call(thisArg, arg1, arg2, arg3)     ← Individual arguments                  │
 * │ apply(thisArg, [arg1, arg2, arg3])  ← Array of arguments                    │
 * │                                                                             │
 * │ That's it! Everything else is identical.                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 2: When apply() is BETTER - Unknown Number of Arguments
// ============================================================================

console.log('\n=== Example 2: Dynamic Arguments ===');

// Scenario: You have an array of numbers, find the max
var numbers = [5, 6, 2, 3, 7];

// Problem: Math.max doesn't accept an array directly
// console.log(Math.max(numbers));  // NaN - doesn't work!

// Solution 1: apply() to spread the array as individual arguments
console.log('Max (apply):', Math.max.apply(null, numbers));  // 7

// Solution 2: Modern spread operator (ES6)
console.log('Max (spread):', Math.max(...numbers));          // 7

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY null AS FIRST ARGUMENT?                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Math.max.apply(null, numbers)                                               │
 * │              ^^^^                                                           │
 * │                                                                             │
 * │ Math.max doesn't use `this` at all. It just compares numbers.               │
 * │ So we pass null (or anything) as the first argument - it's ignored.         │
 * │                                                                             │
 * │ When a function doesn't need `this`, pass null or undefined.                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 3: apply() with Math Functions
// ============================================================================

console.log('\n=== Example 3: Math Functions ===');

var scores = [45, 89, 23, 91, 67, 12, 78];

// Find min and max
var max = Math.max.apply(null, scores);
var min = Math.min.apply(null, scores);

console.log('Scores:', scores);
console.log('Highest:', max);  // 91
console.log('Lowest:', min);   // 12

// Modern ES6 equivalent
console.log('Highest (ES6):', Math.max(...scores));
console.log('Lowest (ES6):', Math.min(...scores));


// ============================================================================
// EXAMPLE 4: apply() for Array Concatenation
// ============================================================================

console.log('\n=== Example 4: Array Concatenation ===');

var array1 = [1, 2, 3];
var array2 = [4, 5, 6];

// Push all elements from array2 into array1
// array1.push(array2) would push the array itself, not elements!

// Using apply() to push multiple elements
Array.prototype.push.apply(array1, array2);
console.log('Combined:', array1);  // [1, 2, 3, 4, 5, 6]

// Modern ES6 equivalent
var arr1 = [1, 2, 3];
var arr2 = [4, 5, 6];
arr1.push(...arr2);
console.log('Combined (ES6):', arr1);  // [1, 2, 3, 4, 5, 6]

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BREAKDOWN                                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Array.prototype.push.apply(array1, array2)                                  │
 * │                                                                             │
 * │ This is equivalent to:                                                      │
 * │   array1.push(4, 5, 6)                                                      │
 * │                                                                             │
 * │ Because apply() spreads array2 into individual arguments.                   │
 * │                                                                             │
 * │ Without apply():                                                            │
 * │   array1.push(array2) → [1, 2, 3, [4, 5, 6]] (nested array!)               │
 * │                                                                             │
 * │ With apply():                                                               │
 * │   Array.prototype.push.apply(array1, array2) → [1, 2, 3, 4, 5, 6]          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 5: apply() with arguments Object
// ============================================================================

console.log('\n=== Example 5: Forwarding Arguments ===');

function logger(level) {
  // Get all arguments after 'level'
  var args = Array.prototype.slice.call(arguments, 1);

  // Forward all remaining arguments to console.log
  console.log.apply(console, ['[' + level + ']'].concat(args));
}

logger('INFO', 'Server started on port', 3000);
// [INFO] Server started on port 3000

logger('ERROR', 'Connection failed:', 'timeout', 'after', 30, 'seconds');
// [ERROR] Connection failed: timeout after 30 seconds

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARGUMENT FORWARDING PATTERN                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ This pattern is useful when:                                                │
 * │   1. You want to wrap a function                                            │
 * │   2. You don't know how many arguments will be passed                       │
 * │   3. You want to add something then forward the rest                        │
 * │                                                                             │
 * │ Modern ES6 equivalent using rest/spread:                                    │
 * │                                                                             │
 * │   function logger(level, ...args) {                                         │
 * │     console.log(`[${level}]`, ...args);                                     │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 6: apply() for Constructor with Dynamic Arguments
// ============================================================================

console.log('\n=== Example 6: Constructor Pattern ===');

// Before ES6, creating an object with dynamic constructor args was tricky
function createInstance(Constructor, args) {
  // Create a new function that wraps the constructor
  var Wrapper = function() {
    return Constructor.apply(this, args);
  };
  Wrapper.prototype = Constructor.prototype;
  return new Wrapper();
}

function Person(name, age, city) {
  this.name = name;
  this.age = age;
  this.city = city;
}

var args = ['John', 30, 'Mumbai'];
var person = createInstance(Person, args);
console.log(person);  // Person { name: 'John', age: 30, city: 'Mumbai' }

// Modern ES6 equivalent
var person2 = new Person(...args);
console.log(person2);  // Person { name: 'John', age: 30, city: 'Mumbai' }

// Even simpler with Reflect.construct (ES6)
var person3 = Reflect.construct(Person, args);
console.log(person3);  // Person { name: 'John', age: 30, city: 'Mumbai' }


// ============================================================================
// EXAMPLE 7: apply() in Real-World Scenarios
// ============================================================================

console.log('\n=== Example 7: Real-World Usage ===');

// Scenario 1: Merge configurations
function mergeConfig(defaults, options) {
  var result = {};

  // Copy defaults
  Object.keys(defaults).forEach(function(key) {
    result[key] = defaults[key];
  });

  // Override with options
  Object.keys(options).forEach(function(key) {
    result[key] = options[key];
  });

  return result;
}

// Scenario 2: Variadic logging with context
var myApp = {
  name: 'MyApp',
  log: function() {
    var args = Array.prototype.slice.call(arguments);
    args.unshift('[' + this.name + ']');
    console.log.apply(console, args);
  }
};

myApp.log('User logged in:', 'user123');
// [MyApp] User logged in: user123

myApp.log('Error:', 404, 'Not Found');
// [MyApp] Error: 404 Not Found


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ VISUAL: call() vs apply()                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║   │                                                                    │   ║
 * ║   │   func.call(obj,  'a',  'b',  'c')                                 │   ║
 * ║   │              │     │     │     │                                   │   ║
 * ║   │              │     └─────┴─────┴── individual args                 │   ║
 * ║   │              │                                                     │   ║
 * ║   │              └── this value                                        │   ║
 * ║   │                                                                    │   ║
 * ║   └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ║   ┌────────────────────────────────────────────────────────────────────┐   ║
 * ║   │                                                                    │   ║
 * ║   │   func.apply(obj, ['a', 'b', 'c'])                                 │   ║
 * ║   │               │    └──────────────── array of args                 │   ║
 * ║   │               │                                                    │   ║
 * ║   │               └── this value                                       │   ║
 * ║   │                                                                    │   ║
 * ║   └────────────────────────────────────────────────────────────────────┘   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHEN TO USE WHICH?                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ USE call() WHEN:                                                           ║
 * ║   • You know the exact arguments at coding time                            ║
 * ║   • You have a fixed number of arguments                                   ║
 * ║   • Example: greet.call(person, 'Hello', '!')                              ║
 * ║                                                                            ║
 * ║ USE apply() WHEN:                                                          ║
 * ║   • Arguments are already in an array                                      ║
 * ║   • Number of arguments is dynamic/unknown                                 ║
 * ║   • You're forwarding arguments                                            ║
 * ║   • Example: Math.max.apply(null, numbers)                                 ║
 * ║                                                                            ║
 * ║ USE SPREAD (...) WHEN:                                                     ║
 * ║   • You're writing modern ES6+ code                                        ║
 * ║   • You want cleaner syntax                                                ║
 * ║   • Example: Math.max(...numbers)                                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUMMARY: apply()                                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ PURPOSE:                                                                   ║
 * ║   Same as call() but takes arguments as an array                           ║
 * ║                                                                            ║
 * ║ SYNTAX:                                                                    ║
 * ║   func.apply(thisArg, [arg1, arg2, arg3])                                  ║
 * ║                                                                            ║
 * ║ MEMORY TRICK:                                                              ║
 * ║   A in Apply = Array                                                       ║
 * ║   C in Call = Comma                                                        ║
 * ║                                                                            ║
 * ║ COMMON USE CASES:                                                          ║
 * ║   1. Math.max/min with arrays                                              ║
 * ║   2. Pushing multiple elements to array                                    ║
 * ║   3. Forwarding unknown arguments                                          ║
 * ║   4. Constructor with dynamic arguments                                    ║
 * ║                                                                            ║
 * ║ KEY POINT:                                                                 ║
 * ║   apply() IMMEDIATELY executes the function (same as call).                ║
 * ║   Mostly replaced by spread operator (...) in modern code.                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "apply() is nearly identical to call() - both invoke a function with a     │
 * │  specific `this` value. The only difference is how you pass arguments:     │
 * │                                                                             │
 * │  - call() takes arguments individually: func.call(obj, a, b, c)            │
 * │  - apply() takes arguments as an array: func.apply(obj, [a, b, c])         │
 * │                                                                             │
 * │  A common use case is using apply() with Math.max on an array of numbers,  │
 * │  since Math.max doesn't accept arrays directly. However, in modern ES6+    │
 * │  code, the spread operator (...) is often preferred: Math.max(...numbers)  │
 * │                                                                             │
 * │  The memory trick I use: A in Apply = Array, C in Call = Comma."           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node concepts/01-execution-context/22-apply-method.js
 */
