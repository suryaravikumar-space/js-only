/**
 * MACHINE CODING 06: Curry Function with Placeholder Support
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ curry(fn) returns a function that:                                       ║
 * ║   - If enough args provided → call fn                                    ║
 * ║   - If not enough → return a new function waiting for the rest           ║
 * ║   - Placeholders (_) let you skip arguments and fill them later          ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                         │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ Think of a restaurant order form with 3 blanks: [entree] [side] [drink]. │
 * │ You can fill them in any order. Placeholders = "I'll decide later."      │
 * │ Once all blanks are filled, the kitchen (fn) starts cooking.             │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │  curry(fn)(a)(b)(c)     → fn(a, b, c)                                     │
 * │  curry(fn)(a, b)(c)     → fn(a, b, c)                                     │
 * │  curry(fn)(_, b)(a)(c)  → fn(a, b, c)   ← placeholder fills slot 0       │
 * │  curry(fn)(_, _, c)(a)(b) → fn(a, b, c)                                   │
 * │                                                                           │
 * │  Internally: [_, b, _]  + [a] → [a, b, _]  + [c] → [a, b, c] → CALL     │
 * │                                                                           │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM:
 *   1. Implement curry(fn) with partial application
 *   2. Add placeholder support via curry._
 *
 * RUN: node docs/javascript/29-machine-coding/06-curry-function.js
 */

// ─────────────────────────────────────────────
// PART 1: Basic curry (no placeholders)
// ─────────────────────────────────────────────

function curryBasic(fn) {
  return function curried() {
    var args = Array.prototype.slice.call(arguments);
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    }
    return function() {
      var nextArgs = Array.prototype.slice.call(arguments);
      return curried.apply(this, args.concat(nextArgs));
    };
  };
}

// ─────────────────────────────────────────────
// PART 2: Curry with placeholder support
// ─────────────────────────────────────────────

function curry(fn) {
  var placeholder = curry._;

  return function curried() {
    var args = Array.prototype.slice.call(arguments);

    // Check if we have enough non-placeholder args
    var hasEnough = args.length >= fn.length &&
      args.slice(0, fn.length).every(function(a) { return a !== placeholder; });

    if (hasEnough) {
      return fn.apply(this, args);
    }

    return function() {
      var nextArgs = Array.prototype.slice.call(arguments);
      // Merge: fill placeholders in args with values from nextArgs
      var merged = [];
      var nextIdx = 0;
      for (var i = 0; i < args.length; i++) {
        if (args[i] === placeholder && nextIdx < nextArgs.length) {
          merged.push(nextArgs[nextIdx++]);
        } else {
          merged.push(args[i]);
        }
      }
      // Append remaining nextArgs
      while (nextIdx < nextArgs.length) {
        merged.push(nextArgs[nextIdx++]);
      }
      return curried.apply(this, merged);
    };
  };
}

curry._ = Symbol('curry.placeholder');

// ─────────────────────────────────────────────
// TEST CASES — Basic curry
// ─────────────────────────────────────────────

console.log('=== Basic Curry ===');

var add = curryBasic(function(a, b, c) { return a + b + c; });

console.log('A:', add(1)(2)(3));          // 6
console.log('B:', add(1, 2)(3));          // 6
console.log('C:', add(1)(2, 3));          // 6
console.log('D:', add(1, 2, 3));          // 6

var multiply = curryBasic(function(a, b) { return a * b; });
var double = multiply(2);
console.log('E:', double(5));             // 10
console.log('F:', double(10));            // 20

// ─────────────────────────────────────────────
// TEST CASES — Curry with placeholders
// ─────────────────────────────────────────────

console.log('\n=== Curry with Placeholders ===');

var _ = curry._;

var fn = curry(function(a, b, c) {
  return a + '-' + b + '-' + c;
});

console.log('G:', fn('a', 'b', 'c'));                // a-b-c
console.log('H:', fn('a')('b')('c'));                 // a-b-c
console.log('I:', fn(_, 'b')('a')('c'));              // a-b-c
console.log('J:', fn(_, _, 'c')('a')('b'));           // a-b-c
console.log('K:', fn(_, 'b', _)('a', 'c'));           // a-b-c
console.log('L:', fn(_, _, _)('a', 'b', 'c'));        // a-b-c

// ─────────────────────────────────────────────
// TEST CASES — Practical usage
// ─────────────────────────────────────────────

console.log('\n=== Practical Usage ===');

var greet = curry(function(greeting, name) {
  return greeting + ', ' + name + '!';
});

var sayHello = greet('Hello');
var sayHi = greet('Hi');

console.log('M:', sayHello('Surya'));     // Hello, Surya!
console.log('N:', sayHi('World'));        // Hi, World!

// Using with map
var nums = [1, 2, 3];
var addCurried = curry(function(a, b) { return a + b; });
var add10 = addCurried(10);
console.log('O:', nums.map(add10));       // [11, 12, 13]

// Reusable formatter
var format = curry(function(prefix, suffix, value) {
  return prefix + value + suffix;
});
var wrapInParens = format('(', ')');
var wrapInBrackets = format('[', ']');
console.log('P:', wrapInParens('hello'));    // (hello)
console.log('Q:', wrapInBrackets('world'));  // [world]

/**
 * FOLLOW-UP QUESTIONS:
 *
 * 1. What is the difference between currying and partial application?
 *    - Currying: f(a,b,c) -> f(a)(b)(c). Always unary.
 *    - Partial: fix some args, return fn taking the rest. Can be any arity.
 * 2. How does fn.length work? What about rest params / default params?
 *    - fn.length counts params before the first default or rest param.
 * 3. Can you curry variadic functions (unknown arity)?
 *    - Not automatically. You need a termination signal (e.g., call with no args).
 * 4. Why use a Symbol for the placeholder instead of undefined?
 *    - undefined could be a legitimate argument value.
 * 5. How does Lodash _.curry differ from this implementation?
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ curry(fn) returns a curried function that collects arguments across       ║
 * ║ multiple calls. When args.length >= fn.length, it calls fn.              ║
 * ║ Otherwise it returns a new function that concatenates new args.           ║
 * ║                                                                          ║
 * ║ Placeholder support: track unfilled slots. On each call, fill            ║
 * ║ placeholders left-to-right with new args, then append the rest.          ║
 * ║ Call fn only when all fn.length slots are non-placeholder values.         ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
