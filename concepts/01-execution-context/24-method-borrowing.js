/**
 * CONCEPT 24: Method Borrowing
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT IS METHOD BORROWING?                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Method borrowing is using a method from one object on another object      ║
 * ║ using call(), apply(), or bind().                                          ║
 * ║                                                                            ║
 * ║ WHY BORROW?                                                                ║
 * ║   - Reuse functionality without duplicating code                           ║
 * ║   - Use Array methods on array-like objects                                ║
 * ║   - Share methods between similar objects                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ============================================================================
// EXAMPLE 1: Basic Method Borrowing
// ============================================================================

console.log('=== Example 1: Basic Borrowing ===');

var person1 = {
  name: 'Alice',
  age: 25,
  introduce: function() {
    console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
  }
};

var person2 = {
  name: 'Bob',
  age: 30
  // No introduce method!
};

// person2 doesn't have introduce(), but we can BORROW it from person1
person1.introduce.call(person2);
// Hi, I'm Bob and I'm 30 years old.

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT HAPPENED?                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ person1.introduce.call(person2)                                             │
 * │                                                                             │
 * │ 1. We took the introduce method from person1                                │
 * │ 2. We called it with this = person2                                         │
 * │ 3. Inside introduce, this.name = 'Bob', this.age = 30                       │
 * │                                                                             │
 * │ person2 now has access to functionality it doesn't own!                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 2: Borrowing Array Methods (MOST COMMON USE CASE)
// ============================================================================

console.log('\n=== Example 2: Array Methods on Array-like Objects ===');

// Array-like objects: Have length and indexed elements, but NOT real arrays
// Examples: arguments, NodeList, HTMLCollection, strings

function sumAll() {
  // `arguments` is array-like but NOT an array
  console.log('arguments:', arguments);
  console.log('Is array?', Array.isArray(arguments));  // false

  // Can't use: arguments.reduce(...) - doesn't exist!

  // Solution 1: Borrow Array.prototype.reduce
  var sum = Array.prototype.reduce.call(arguments, function(acc, num) {
    return acc + num;
  }, 0);

  console.log('Sum:', sum);
}

sumAll(1, 2, 3, 4, 5);  // Sum: 15

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY Array.prototype.method.call() WORKS                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Array methods like reduce(), map(), filter() are designed to work on       │
 * │ ANY object that has:                                                        │
 * │   - A .length property                                                      │
 * │   - Numeric indexes (0, 1, 2, ...)                                          │
 * │                                                                             │
 * │ They access elements using: this[0], this[1], this.length, etc.            │
 * │                                                                             │
 * │ So when we call: Array.prototype.reduce.call(arguments, ...)               │
 * │   - this = arguments (which has length and indexes)                         │
 * │   - reduce() works perfectly!                                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 3: Converting Array-like to Real Array
// ============================================================================

console.log('\n=== Example 3: Converting to Real Array ===');

function showArgs() {
  // Method 1: slice (ES5)
  var args1 = Array.prototype.slice.call(arguments);

  // Method 2: Array.from (ES6)
  var args2 = Array.from(arguments);

  // Method 3: Spread operator (ES6)
  var args3 = [...arguments];

  console.log('slice.call:', args1);
  console.log('Array.from:', args2);
  console.log('spread:', args3);

  // Now we can use ALL array methods
  console.log('mapped:', args1.map(x => x * 2));
}

showArgs(1, 2, 3);

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON CONVERSIONS                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ // arguments to array                                                       │
 * │ Array.prototype.slice.call(arguments)                                       │
 * │ [...arguments]  // ES6                                                      │
 * │                                                                             │
 * │ // NodeList to array (DOM)                                                  │
 * │ Array.prototype.slice.call(document.querySelectorAll('div'))               │
 * │ [...document.querySelectorAll('div')]  // ES6                               │
 * │                                                                             │
 * │ // String to array                                                          │
 * │ Array.prototype.slice.call('hello')  // ['h','e','l','l','o']              │
 * │ [...'hello']  // ES6                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 4: Using Array Methods on Strings
// ============================================================================

console.log('\n=== Example 4: Array Methods on Strings ===');

var str = 'hello';

// Strings are array-like (have length and indexes)
console.log('Length:', str.length);  // 5
console.log('str[0]:', str[0]);      // 'h'

// Borrow Array methods
var reversed = Array.prototype.reverse.call(str.split('')).join('');
console.log('Reversed:', reversed);  // 'olleh'

// Or use map
var uppercased = Array.prototype.map.call(str, function(char) {
  return char.toUpperCase();
});
console.log('Uppercased:', uppercased);  // ['H', 'E', 'L', 'L', 'O']

// Check if all characters are lowercase
var allLower = Array.prototype.every.call(str, function(char) {
  return char === char.toLowerCase();
});
console.log('All lowercase?', allLower);  // true


// ============================================================================
// EXAMPLE 5: Borrowing Object Methods
// ============================================================================

console.log('\n=== Example 5: Object Methods ===');

var logger = {
  prefix: '[LOG]',
  log: function(message) {
    console.log(this.prefix + ' ' + message);
  }
};

var errorLogger = {
  prefix: '[ERROR]'
};

var warnLogger = {
  prefix: '[WARN]'
};

// Borrow the log method
logger.log('System started');              // [LOG] System started
logger.log.call(errorLogger, 'File not found');  // [ERROR] File not found
logger.log.call(warnLogger, 'Low memory');       // [WARN] Low memory


// ============================================================================
// EXAMPLE 6: Permanent Borrowing with bind()
// ============================================================================

console.log('\n=== Example 6: Permanent Borrowing ===');

var dog = {
  name: 'Buddy',
  speak: function() {
    console.log(this.name + ' says: Woof!');
  }
};

var cat = {
  name: 'Whiskers'
};

// Temporary borrowing with call (one-time use)
dog.speak.call(cat);  // Whiskers says: Woof!

// Permanent borrowing with bind
cat.speak = dog.speak.bind(cat);
cat.speak();  // Whiskers says: Woof!

// Now cat has its own speak method (forever bound to cat)


// ============================================================================
// EXAMPLE 7: Borrowing Math Methods
// ============================================================================

console.log('\n=== Example 7: Math with apply() ===');

var numbers = [5, 6, 2, 3, 7];

// Math.max doesn't take arrays, but we can use apply
var max = Math.max.apply(null, numbers);
var min = Math.min.apply(null, numbers);

console.log('Numbers:', numbers);
console.log('Max:', max);  // 7
console.log('Min:', min);  // 2

// ES6 equivalent
console.log('Max (ES6):', Math.max(...numbers));


// ============================================================================
// EXAMPLE 8: Borrowing hasOwnProperty Safely
// ============================================================================

console.log('\n=== Example 8: Safe hasOwnProperty ===');

// Problem: Objects can override hasOwnProperty
var sketchy = {
  hasOwnProperty: function() {
    return true;  // Always returns true!
  },
  foo: 'bar'
};

console.log('sketchy.hasOwnProperty("anything"):', sketchy.hasOwnProperty('anything'));  // true (fake!)

// Solution: Borrow from Object.prototype
var hasOwn = Object.prototype.hasOwnProperty;
console.log('Real check:', hasOwn.call(sketchy, 'foo'));       // true (real)
console.log('Real check:', hasOwn.call(sketchy, 'missing'));   // false (real)

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY THIS MATTERS                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When iterating over objects with for...in, you often check:                 │
 * │   if (obj.hasOwnProperty(key)) { ... }                                      │
 * │                                                                             │
 * │ But what if obj has its own hasOwnProperty? Or was created with             │
 * │ Object.create(null) (no prototype)?                                         │
 * │                                                                             │
 * │ Safe pattern:                                                               │
 * │   if (Object.prototype.hasOwnProperty.call(obj, key)) { ... }               │
 * │                                                                             │
 * │ Or ES6+:                                                                    │
 * │   if (Object.hasOwn(obj, key)) { ... }                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ============================================================================
// EXAMPLE 9: Real-World Pattern - jQuery-style Chaining
// ============================================================================

console.log('\n=== Example 9: Chaining Pattern ===');

var collection = {
  items: [1, 2, 3, 4, 5],

  map: function(fn) {
    this.items = Array.prototype.map.call(this.items, fn);
    return this;  // Return this for chaining
  },

  filter: function(fn) {
    this.items = Array.prototype.filter.call(this.items, fn);
    return this;
  },

  get: function() {
    return this.items;
  }
};

var result = collection
  .map(x => x * 2)      // [2, 4, 6, 8, 10]
  .filter(x => x > 5)   // [6, 8, 10]
  .get();

console.log('Result:', result);


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMMON METHOD BORROWING PATTERNS                                           ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ 1. Array methods on arguments:                                             ║
 * ║    Array.prototype.slice.call(arguments)                                   ║
 * ║    Array.prototype.forEach.call(arguments, fn)                             ║
 * ║                                                                            ║
 * ║ 2. Array methods on NodeList (DOM):                                        ║
 * ║    Array.prototype.map.call(nodeList, fn)                                  ║
 * ║                                                                            ║
 * ║ 3. Array methods on strings:                                               ║
 * ║    Array.prototype.join.call('hello', '-')  // 'h-e-l-l-o'                ║
 * ║                                                                            ║
 * ║ 4. Safe hasOwnProperty:                                                    ║
 * ║    Object.prototype.hasOwnProperty.call(obj, key)                          ║
 * ║                                                                            ║
 * ║ 5. toString for type checking:                                             ║
 * ║    Object.prototype.toString.call(value)                                   ║
 * ║    // "[object Array]", "[object Object]", "[object Null]"                ║
 * ║                                                                            ║
 * ║ 6. Math functions with arrays:                                             ║
 * ║    Math.max.apply(null, numbers)                                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ TYPE CHECKING WITH toString                                                ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Object.prototype.toString.call(value) gives reliable type info:            ║
 * ║                                                                            ║
 * ║ Object.prototype.toString.call([])        → "[object Array]"               ║
 * ║ Object.prototype.toString.call({})        → "[object Object]"              ║
 * ║ Object.prototype.toString.call(null)      → "[object Null]"                ║
 * ║ Object.prototype.toString.call(undefined) → "[object Undefined]"           ║
 * ║ Object.prototype.toString.call(42)        → "[object Number]"              ║
 * ║ Object.prototype.toString.call('str')     → "[object String]"              ║
 * ║ Object.prototype.toString.call(true)      → "[object Boolean]"             ║
 * ║ Object.prototype.toString.call(function(){}) → "[object Function]"         ║
 * ║ Object.prototype.toString.call(/regex/)   → "[object RegExp]"              ║
 * ║ Object.prototype.toString.call(new Date)  → "[object Date]"                ║
 * ║                                                                            ║
 * ║ This is more reliable than typeof for distinguishing arrays from objects!  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ SUMMARY: Method Borrowing                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ WHAT: Using a method from one object on another object                     ║
 * ║                                                                            ║
 * ║ HOW: Using call(), apply(), or bind()                                      ║
 * ║                                                                            ║
 * ║ WHY:                                                                       ║
 * ║   - Reuse code without inheritance                                         ║
 * ║   - Use Array methods on array-like objects                                ║
 * ║   - Share functionality between objects                                    ║
 * ║                                                                            ║
 * ║ MOST COMMON:                                                               ║
 * ║   Array.prototype.slice.call(arguments)                                    ║
 * ║   Object.prototype.hasOwnProperty.call(obj, key)                           ║
 * ║   Object.prototype.toString.call(value)                                    ║
 * ║                                                                            ║
 * ║ MODERN ALTERNATIVES:                                                       ║
 * ║   Array.from(arguments)  // Instead of slice.call                          ║
 * ║   [...arguments]         // Spread operator                                ║
 * ║   Object.hasOwn(obj, key) // Instead of hasOwnProperty.call               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Method borrowing is a pattern where you use a method from one object on   │
 * │  another object using call(), apply(), or bind(). The most common use      │
 * │  case is borrowing Array methods for array-like objects.                    │
 * │                                                                             │
 * │  For example, the `arguments` object in functions looks like an array      │
 * │  (has length and indexes) but isn't a real array - it doesn't have         │
 * │  methods like map() or filter(). We can borrow these:                       │
 * │                                                                             │
 * │    Array.prototype.slice.call(arguments)                                    │
 * │                                                                             │
 * │  This works because Array methods are designed to work on any object       │
 * │  with length and numeric indexes.                                           │
 * │                                                                             │
 * │  Other common borrowing patterns include:                                   │
 * │  - Object.prototype.hasOwnProperty.call() for safe property checking       │
 * │  - Object.prototype.toString.call() for reliable type detection            │
 * │                                                                             │
 * │  In modern ES6+, spread operator and Array.from() often replace these      │
 * │  patterns, but understanding method borrowing is still important."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node concepts/01-execution-context/24-method-borrowing.js
 */
