/**
 * CHALLENGE 24: Method Borrowing
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Method borrowing lets you USE a method from one object ON another object.  ║
 * ║                                                                            ║
 * ║   object1.method.call(object2, args)                                       ║
 * ║                                                                            ║
 * ║ The method executes, but `this` refers to object2, not object1!            ║
 * ║                                                                            ║
 * ║ MOST COMMON USE CASE:                                                      ║
 * ║   Array.prototype.slice.call(arguments)                                    ║
 * ║   - Borrows slice() from Array                                             ║
 * ║   - Uses it on array-like `arguments` object                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var logger = {
  prefix: '[LOG]',
  log: function(msg) {
    return this.prefix + ' ' + msg;
  }
};

var errorLogger = { prefix: '[ERROR]' };
var warnLogger = { prefix: '[WARN]' };

console.log('A:', logger.log('System started'));
console.log('B:', logger.log.call(errorLogger, 'Something broke'));
console.log('C:', logger.log.call(warnLogger, 'Be careful'));

var borrowed = logger.log;
console.log('D:', borrowed('Test'));

function sum() {
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function(a, b) { return a + b; }, 0);
}

console.log('E:', sum(1, 2, 3));
console.log('F:', sum(1, 2, 3, 4, 5));

/**
 * OUTPUT:
 *   A: [LOG] System started
 *   B: [ERROR] Something broke
 *   C: [WARN] Be careful
 *   D: undefined Test
 *   E: 6
 *   F: 15
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: logger.log('System started')                                            ║
 * ║ ───────────────────────────────                                            ║
 * ║   • Method call: this = logger                                             ║
 * ║   • this.prefix = '[LOG]'                                                  ║
 * ║   • Result: '[LOG] System started'                                         ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: logger.log.call(errorLogger, 'Something broke')                         ║
 * ║ ──────────────────────────────────────────────────                         ║
 * ║   • BORROWING: Using logger's method with errorLogger's data               ║
 * ║   • call() sets this = errorLogger                                         ║
 * ║   • this.prefix = '[ERROR]'                                                ║
 * ║   • Result: '[ERROR] Something broke'                                      ║
 * ║                                                                            ║
 * ║   KEY INSIGHT:                                                             ║
 * ║   errorLogger doesn't have a log method, but we borrowed one!              ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: logger.log.call(warnLogger, 'Be careful')                               ║
 * ║ ────────────────────────────────────────────                               ║
 * ║   • Same pattern: borrow log() for warnLogger                              ║
 * ║   • this = warnLogger                                                      ║
 * ║   • this.prefix = '[WARN]'                                                 ║
 * ║   • Result: '[WARN] Be careful'                                            ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: borrowed('Test')  ← THE TRICKY ONE!                                     ║
 * ║ ───────────────────                                                        ║
 * ║   • var borrowed = logger.log; (just a reference)                          ║
 * ║   • borrowed('Test') is a STANDALONE call                                  ║
 * ║   • this = global object (non-strict mode)                                 ║
 * ║   • global.prefix = undefined                                              ║
 * ║   • Result: 'undefined Test'                                               ║
 * ║                                                                            ║
 * ║   COMMON MISTAKE:                                                          ║
 * ║   Thinking borrowed() still uses logger.prefix                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: sum(1, 2, 3)                                                            ║
 * ║ ───────────────                                                            ║
 * ║   • arguments = { 0: 1, 1: 2, 2: 3, length: 3 } (array-like, NOT array)    ║
 * ║   • Array.prototype.slice.call(arguments) borrows slice()                  ║
 * ║   • Converts arguments to real array: [1, 2, 3]                            ║
 * ║   • reduce() adds them: 1 + 2 + 3 = 6                                      ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: sum(1, 2, 3, 4, 5)                                                      ║
 * ║ ─────────────────────                                                      ║
 * ║   • Same pattern with more arguments                                       ║
 * ║   • [1, 2, 3, 4, 5].reduce((a, b) => a + b, 0)                             ║
 * ║   • 1 + 2 + 3 + 4 + 5 = 15                                                 ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHAT IS THE `arguments` OBJECT?                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Every non-arrow function has a special `arguments` object:                  │
 * │                                                                             │
 * │   function example(a, b) {                                                  │
 * │     console.log(arguments);                                                 │
 * │   }                                                                         │
 * │                                                                             │
 * │   example(1, 2, 3, 4);                                                      │
 * │   // { '0': 1, '1': 2, '2': 3, '3': 4, length: 4 }                          │
 * │                                                                             │
 * │ It's ARRAY-LIKE but NOT an array:                                           │
 * │ ┌─────────────────────┬─────────────────────────────────────────────┐       │
 * │ │ Has                 │ Doesn't Have                                │       │
 * │ ├─────────────────────┼─────────────────────────────────────────────┤       │
 * │ │ Numbered indices    │ Array methods (map, filter, reduce, etc.)   │       │
 * │ │ length property     │ Array prototype                             │       │
 * │ │ Iterable (for...of) │ push, pop, slice, etc.                      │       │
 * │ └─────────────────────┴─────────────────────────────────────────────┘       │
 * │                                                                             │
 * │ TO USE ARRAY METHODS, you must convert it:                                  │
 * │   Array.prototype.slice.call(arguments)  // ES5                             │
 * │   Array.from(arguments)                  // ES6                             │
 * │   [...arguments]                         // ES6 spread                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW Array.prototype.slice.call(arguments) WORKS                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ STEP BY STEP:                                                               │
 * │                                                                             │
 * │   Array.prototype.slice                                                     │
 * │   ─────────────────────                                                     │
 * │   → Gets the slice method from Array.prototype                              │
 * │   → This is the same slice() that every array has                           │
 * │                                                                             │
 * │   .call(arguments)                                                          │
 * │   ────────────────                                                          │
 * │   → Calls slice() with this = arguments                                     │
 * │   → slice() only needs .length and numeric indices to work                  │
 * │   → arguments has both!                                                     │
 * │                                                                             │
 * │   Result:                                                                   │
 * │   → slice() iterates from 0 to length-1                                     │
 * │   → Creates a real array from the values                                    │
 * │   → [1, 2, 3] ← A real array with all array methods!                        │
 * │                                                                             │
 * │                                                                             │
 * │ WHY THIS WORKS:                                                             │
 * │   slice() doesn't check if `this` is actually an array.                     │
 * │   It just needs:                                                            │
 * │     1. this.length (to know how many items)                                 │
 * │     2. this[0], this[1], etc. (to access items)                             │
 * │                                                                             │
 * │   arguments has both, so slice() works perfectly!                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON METHOD BORROWING PATTERNS                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Convert arguments to array:                                              │
 * │    var args = Array.prototype.slice.call(arguments);                        │
 * │    var args = [].slice.call(arguments);  // Shorter version                 │
 * │                                                                             │
 * │ 2. Convert NodeList to array:                                               │
 * │    var divs = document.querySelectorAll('div');                             │
 * │    var arr = Array.prototype.slice.call(divs);                              │
 * │                                                                             │
 * │ 3. Check actual type:                                                       │
 * │    Object.prototype.toString.call([]);      // "[object Array]"             │
 * │    Object.prototype.toString.call({});      // "[object Object]"            │
 * │    Object.prototype.toString.call(null);    // "[object Null]"              │
 * │                                                                             │
 * │ 4. Borrow hasOwnProperty:                                                   │
 * │    Object.prototype.hasOwnProperty.call(obj, 'prop');                       │
 * │    // Safer than obj.hasOwnProperty('prop')                                 │
 * │                                                                             │
 * │ 5. Use array methods on array-likes:                                        │
 * │    Array.prototype.forEach.call(nodeList, function(el) {                    │
 * │      // do something with each element                                      │
 * │    });                                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Method borrowing uses call() or apply() to execute a method from one       │
 * │  object while using another object as `this`. The most common example       │
 * │  is Array.prototype.slice.call(arguments), which borrows slice() from       │
 * │  Array to convert the array-like arguments object into a real array.        │
 * │                                                                             │
 * │  This works because slice() only needs `this.length` and numeric indices    │
 * │  to function - it doesn't actually verify that `this` is an Array.          │
 * │                                                                             │
 * │  The gotcha to watch for is extracting a method into a variable:            │
 * │    var borrowed = logger.log;                                               │
 * │    borrowed('test');  // this = global, not logger!                         │
 * │                                                                             │
 * │  In ES6+, we have cleaner alternatives:                                     │
 * │    Array.from(arguments)  // Convert array-like to array                    │
 * │    [...arguments]         // Spread into array                              │
 * │    function sum(...args)  // Rest parameters (actual array)"                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/24-method-borrowing.js
 */
