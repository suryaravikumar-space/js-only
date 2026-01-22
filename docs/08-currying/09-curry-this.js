/**
 * CHALLENGE 09: Currying and this Binding
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ When currying methods that use 'this', you must preserve context!          ║
 * ║                                                                            ║
 * ║ Use .apply(this, args) or .bind(this) in your curry implementation.        ║
 * ║                                                                            ║
 * ║ Arrow functions don't have their own 'this', so they work differently      ║
 * ║ with currying - they capture 'this' from the enclosing scope.              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

// Currying with this context
function curryThis(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return curried.bind(this, ...args);
  };
}

var obj = {
  multiplier: 10,
  multiply: curryThis(function(a, b) {
    return a * b * this.multiplier;
  })
};

console.log('A:', obj.multiply(2, 3));
console.log('B:', obj.multiply(2)(3));

// Be careful with method extraction
var extracted = obj.multiply;
// console.log(extracted(2, 3));  // Would fail - lost this

// Fix with bind
var bound = obj.multiply.bind(obj);
console.log('C:', bound(2)(3));

// Arrow functions don't have their own this
var objArrow = {
  value: 5,
  getCurried: function() {
    return a => b => a + b + this.value;
  }
};

var curriedFn = objArrow.getCurried();
console.log('D:', curriedFn(1)(2));  // Works because arrow uses lexical this

/**
 * OUTPUT:
 *   A: 60
 *   B: 60
 *   C: 60
 *   D: 8
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A & B: obj.multiply uses this.multiplier                                   ║
 * ║ ─────────────────────────────────────────                                  ║
 * ║   • obj.multiply(2, 3) → 2 * 3 * 10 = 60                                   ║
 * ║   • obj.multiply(2)(3):                                                    ║
 * ║     - First call: this=obj, returns curried.bind(obj, 2)                   ║
 * ║     - Second call: this=obj (from bind), fn.apply(obj, [2, 3])             ║
 * ║     - Result: 2 * 3 * 10 = 60                                              ║
 * ║                                                                            ║
 * ║ D: Arrow function currying                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   • getCurried() called with this=objArrow                                 ║
 * ║   • Returns arrow function that captures this=objArrow                     ║
 * ║   • curriedFn(1)(2) = 1 + 2 + 5 = 8                                        ║
 * ║   • Arrow function's this is LEXICAL (from getCurried's this)              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE PROBLEM WITH THIS AND CURRYING                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Simple curry without this handling                                     │
 * │   function badCurry(fn) {                                                   │
 * │     return (...args) => args.length >= fn.length                            │
 * │       ? fn(...args)  // 'this' is lost!                                     │
 * │       : badCurry(fn.bind(null, ...args));                                   │
 * │   }                                                                         │
 * │                                                                             │
 * │   var obj = {                                                               │
 * │     value: 10,                                                              │
 * │     method: badCurry(function(a) { return a + this.value; })                │
 * │   };                                                                        │
 * │                                                                             │
 * │   obj.method(5);  // NaN or error - this.value is undefined                 │
 * │                                                                             │
 * │                                                                             │
 * │   // Proper curry with this handling                                        │
 * │   function goodCurry(fn) {                                                  │
 * │     return function curried(...args) {                                      │
 * │       if (args.length >= fn.length) {                                       │
 * │         return fn.apply(this, args);  // Preserve this!                     │
 * │       }                                                                     │
 * │       return curried.bind(this, ...args);  // Bind this!                    │
 * │     };                                                                      │
 * │   }                                                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ ARROW FUNCTIONS AND THIS                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Arrow functions capture 'this' from enclosing scope                    │
 * │   // This can be HELPFUL or PROBLEMATIC depending on use case               │
 * │                                                                             │
 * │   // HELPFUL: Curried arrow in method                                       │
 * │   var obj = {                                                               │
 * │     name: 'Object',                                                         │
 * │     getCurried: function() {                                                │
 * │       // Arrow captures this=obj                                            │
 * │       return a => b => `${this.name}: ${a + b}`;                            │
 * │     }                                                                       │
 * │   };                                                                        │
 * │   obj.getCurried()(1)(2);  // 'Object: 3'                                   │
 * │                                                                             │
 * │                                                                             │
 * │   // PROBLEMATIC: Arrow as method itself                                    │
 * │   var obj = {                                                               │
 * │     name: 'Object',                                                         │
 * │     // Arrow captures 'this' from where obj is defined (global)             │
 * │     badMethod: a => b => `${this.name}: ${a + b}`                           │
 * │   };                                                                        │
 * │   obj.badMethod(1)(2);  // 'undefined: 3' - wrong this!                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ BEST PRACTICES                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. For standalone utilities: Arrow functions work great                   │
 * │      var add = a => b => a + b;  // No this needed                          │
 * │                                                                             │
 * │   2. For methods using this: Use function keyword + proper curry            │
 * │      obj.method = curryThis(function(a, b) { return this.x + a + b; })      │
 * │                                                                             │
 * │   3. When extracting methods: Always bind                                   │
 * │      var method = obj.method.bind(obj);                                     │
 * │                                                                             │
 * │   4. Factory pattern: Return arrows from regular function                   │
 * │      function factory() {                                                   │
 * │        return a => b => a + b + this.value;  // Captures factory's this     │
 * │      }                                                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/06-currying/09-curry-this.js
 */
