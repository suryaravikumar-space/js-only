/**
 * CHALLENGE 22: The apply() Method
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE CRITICAL LESSON                                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ apply() is identical to call(), except arguments are passed as an ARRAY.  ║
 * ║                                                                            ║
 * ║   call(thisArg, arg1, arg2, arg3)     ← Comma-separated                    ║
 * ║   apply(thisArg, [arg1, arg2, arg3])  ← Array                              ║
 * ║                                                                            ║
 * ║ MEMORY TRICK:                                                              ║
 * ║   A in Apply = Array                                                       ║
 * ║   C in Call  = Comma                                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */

var calculator = {
  value: 10,
  add: function(a, b, c) {
    return this.value + a + b + c;
  }
};

var another = { value: 100 };

console.log('A:', calculator.add(1, 2, 3));
console.log('B:', calculator.add.call(another, 1, 2, 3));
console.log('C:', calculator.add.apply(another, [1, 2, 3]));

var numbers = [5, 10, 15];
console.log('D:', calculator.add.apply(null, numbers));
console.log('E:', Math.max.apply(null, [3, 7, 2, 9, 4]));
console.log('F:', Math.min.apply(null, numbers));

/**
 * OUTPUT:
 *   A: 16
 *   B: 106
 *   C: 106
 *   D: NaN
 *   E: 9
 *   F: 5
 *
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STEP-BY-STEP BREAKDOWN                                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ A: calculator.add(1, 2, 3)                                                 ║
 * ║ ──────────────────────────                                                 ║
 * ║   • Method call: this = calculator                                         ║
 * ║   • this.value = 10                                                        ║
 * ║   • 10 + 1 + 2 + 3 = 16                                                    ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ B: calculator.add.call(another, 1, 2, 3)                                   ║
 * ║ ────────────────────────────────────────                                   ║
 * ║   • call() sets this = another                                             ║
 * ║   • this.value = 100                                                       ║
 * ║   • 100 + 1 + 2 + 3 = 106                                                  ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ C: calculator.add.apply(another, [1, 2, 3])                                ║
 * ║ ───────────────────────────────────────────                                ║
 * ║   • apply() sets this = another                                            ║
 * ║   • Array [1, 2, 3] is spread as arguments                                 ║
 * ║   • this.value = 100                                                       ║
 * ║   • 100 + 1 + 2 + 3 = 106                                                  ║
 * ║   • SAME result as call() - just different syntax                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ D: calculator.add.apply(null, numbers)  ← THE TRICKY ONE!                  ║
 * ║ ──────────────────────────────────────                                     ║
 * ║   • apply(null, ...) → this = global object (non-strict)                   ║
 * ║   • global.value = undefined                                               ║
 * ║   • undefined + 5 + 10 + 15 = NaN                                          ║
 * ║                                                                            ║
 * ║   COMMON MISTAKE:                                                          ║
 * ║   Thinking this.value is still 10 from calculator                          ║
 * ║                                                                            ║
 * ║   REALITY:                                                                 ║
 * ║   null means "no specific this" → defaults to global                       ║
 * ║   global object doesn't have a .value property                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ E: Math.max.apply(null, [3, 7, 2, 9, 4])                                   ║
 * ║ ────────────────────────────────────────                                   ║
 * ║   • Math.max doesn't use `this` at all                                     ║
 * ║   • null is fine here - it's ignored                                       ║
 * ║   • Spreads array as: Math.max(3, 7, 2, 9, 4)                              ║
 * ║   • Result: 9 (largest number)                                             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║ F: Math.min.apply(null, numbers)                                           ║
 * ║ ────────────────────────────────                                           ║
 * ║   • numbers = [5, 10, 15]                                                  ║
 * ║   • Spreads as: Math.min(5, 10, 15)                                        ║
 * ║   • Result: 5 (smallest number)                                            ║
 * ║                                                                            ║
 * ║   DON'T CONFUSE:                                                           ║
 * ║   • Math.max → returns LARGEST                                             ║
 * ║   • Math.min → returns SMALLEST                                            ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE null WITH call/apply                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ✓ USE null WHEN function DOESN'T need this:                                 │
 * │                                                                             │
 * │   Math.max.apply(null, numbers)      ← Math.max ignores this                │
 * │   Math.min.apply(null, numbers)      ← Math.min ignores this                │
 * │   Array.prototype.slice.call(null)   ← Doesn't work! Needs array-like       │
 * │                                                                             │
 * │                                                                             │
 * │ ✗ DON'T use null WHEN function NEEDS this:                                  │
 * │                                                                             │
 * │   calculator.add.apply(null, nums)   ← BROKEN! this.value = undefined       │
 * │   person.greet.call(null, 'Hi')      ← BROKEN! this.name = undefined        │
 * │                                                                             │
 * │                                                                             │
 * │ WHAT null BECOMES:                                                          │
 * │ ┌────────────────┬─────────────────────────────────────────────────────┐    │
 * │ │ Mode           │ this when passed null/undefined                     │    │
 * │ ├────────────────┼─────────────────────────────────────────────────────┤    │
 * │ │ Non-strict     │ global object (window/global)                       │    │
 * │ │ Strict         │ null/undefined (stays as-is)                        │    │
 * │ └────────────────┴─────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ call() vs apply() COMPARISON                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ SYNTAX:                                                                     │
 * │   func.call(thisArg, arg1, arg2, arg3)      ← Individual arguments          │
 * │   func.apply(thisArg, [arg1, arg2, arg3])   ← Array of arguments            │
 * │                                                                             │
 * │ EXAMPLE - Same result:                                                      │
 * │   greet.call(person, 'Hello', '!')          // Hello, Alice!                │
 * │   greet.apply(person, ['Hello', '!'])       // Hello, Alice!                │
 * │                                                                             │
 * │ WHEN TO USE WHICH:                                                          │
 * │ ┌────────────────────┬──────────────────────────────────────────────────┐   │
 * │ │ Use call()         │ When you know arguments at code time             │   │
 * │ ├────────────────────┼──────────────────────────────────────────────────┤   │
 * │ │ Use apply()        │ When arguments are already in an array           │   │
 * │ │                    │ When you don't know how many arguments           │   │
 * │ └────────────────────┴──────────────────────────────────────────────────┘   │
 * │                                                                             │
 * │ MODERN ALTERNATIVE (ES6):                                                   │
 * │   Math.max(...numbers)           ← Spread operator replaces apply()         │
 * │   Math.max.apply(null, numbers)  ← Old way                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMMON USE CASES FOR apply()                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Math with arrays:                                                        │
 * │    var max = Math.max.apply(null, [1, 2, 3]);  // 3                         │
 * │    var min = Math.min.apply(null, [1, 2, 3]);  // 1                         │
 * │                                                                             │
 * │ 2. Merge arrays (push multiple):                                            │
 * │    var arr1 = [1, 2];                                                       │
 * │    var arr2 = [3, 4];                                                       │
 * │    Array.prototype.push.apply(arr1, arr2);  // arr1 = [1, 2, 3, 4]          │
 * │                                                                             │
 * │ 3. Forward unknown arguments:                                               │
 * │    function wrapper() {                                                     │
 * │      return original.apply(this, arguments);                                │
 * │    }                                                                        │
 * │                                                                             │
 * │ 4. Convert array-like to array:                                             │
 * │    var args = Array.prototype.slice.apply(arguments);                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "apply() is identical to call() - both invoke a function with a specific   │
 * │  `this` value. The only difference is how arguments are passed:             │
 * │                                                                             │
 * │  - call() takes arguments individually (comma-separated)                    │
 * │  - apply() takes arguments as an array                                      │
 * │                                                                             │
 * │  A common gotcha is using apply(null, ...) when the function needs `this`. │
 * │  In non-strict mode, null becomes the global object, so any reference       │
 * │  to this.property will be undefined.                                        │
 * │                                                                             │
 * │  null is safe to use when the function doesn't use `this` at all, like     │
 * │  Math.max or Math.min. That's why Math.max.apply(null, numbers) works.     │
 * │                                                                             │
 * │  In modern ES6+, the spread operator often replaces apply():                │
 * │    Math.max(...numbers) instead of Math.max.apply(null, numbers)"           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/01-execution-context/22-apply-method.js
 */
