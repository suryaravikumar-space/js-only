/**
 * MACHINE CODING 07: Polyfill — myBind, myCall, myApply
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ call(ctx, a, b)   — invoke immediately with context + args               ║
 * ║ apply(ctx, [a,b]) — invoke immediately with context + args array         ║
 * ║ bind(ctx, a)      — return NEW function with bound context + partial     ║
 * ║                                                                          ║
 * ║ Key trick: attach fn as a temporary property on ctx, call it, delete.    ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                         │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ call  = Phone CALL: talk NOW, list items one by one                       │
 * │ apply = job APPLICATION: hand in everything at once (array)               │
 * │ bind  = BIND a book: prepare it now, read (invoke) later                  │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │  fn.myCall(ctx, a, b)                                                     │
 * │  ┌─────────────┐                                                          │
 * │  │ ctx.__fn = fn│ → ctx.__fn(a, b) → delete ctx.__fn → return result      │
 * │  └─────────────┘                                                          │
 * │                                                                           │
 * │  fn.myBind(ctx, a) → returns boundFn                                      │
 * │  boundFn(b) → fn.call(ctx, a, b)                                          │
 * │  new boundFn(b) → fn called with new object as this (ignores ctx)         │
 * │                                                                           │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * PROBLEM:
 *   Polyfill Function.prototype.myCall, myApply, myBind
 *   myBind must work correctly with the `new` keyword.
 *
 * RUN: node docs/javascript/29-machine-coding/07-bind-call-apply.js
 */

// ─────────────────────────────────────────────
// myCall
// ─────────────────────────────────────────────

Function.prototype.myCall = function(ctx) {
  ctx = ctx != null ? Object(ctx) : globalThis;
  var uniqueKey = Symbol('fn');
  ctx[uniqueKey] = this;

  var args = [];
  for (var i = 1; i < arguments.length; i++) {
    args.push(arguments[i]);
  }

  var result = ctx[uniqueKey].apply(ctx, args);
  delete ctx[uniqueKey];
  return result;
};

// ─────────────────────────────────────────────
// myApply
// ─────────────────────────────────────────────

Function.prototype.myApply = function(ctx, argsArray) {
  ctx = ctx != null ? Object(ctx) : globalThis;
  var uniqueKey = Symbol('fn');
  ctx[uniqueKey] = this;

  var result;
  if (!argsArray || argsArray.length === 0) {
    result = ctx[uniqueKey]();
  } else {
    result = ctx[uniqueKey].apply(ctx, argsArray);
  }

  delete ctx[uniqueKey];
  return result;
};

// ─────────────────────────────────────────────
// myBind
// ─────────────────────────────────────────────

Function.prototype.myBind = function(ctx) {
  var fn = this;
  var boundArgs = [];
  for (var i = 1; i < arguments.length; i++) {
    boundArgs.push(arguments[i]);
  }

  var bound = function() {
    var callArgs = [];
    for (var i = 0; i < arguments.length; i++) {
      callArgs.push(arguments[i]);
    }
    var allArgs = boundArgs.concat(callArgs);

    // If called with new, `this` is an instance of bound
    if (this instanceof bound) {
      return fn.apply(this, allArgs);
    }
    return fn.apply(ctx, allArgs);
  };

  // Maintain prototype chain for new keyword
  if (fn.prototype) {
    bound.prototype = Object.create(fn.prototype);
  }

  return bound;
};

// ─────────────────────────────────────────────
// TEST CASES — myCall
// ─────────────────────────────────────────────

console.log('=== myCall Tests ===');

var person = { name: 'Surya' };

function greet(greeting, punctuation) {
  return greeting + ', ' + this.name + punctuation;
}

console.log('A:', greet.myCall(person, 'Hello', '!'));        // Hello, Surya!
console.log('B:', greet.myCall({ name: 'Bob' }, 'Hi', '.'));  // Hi, Bob.

function getType() { return typeof this; }
console.log('C:', getType.myCall(42));                        // object (boxed)
console.log('D:', getType.myCall(null));                      // object (globalThis)

// ─────────────────────────────────────────────
// TEST CASES — myApply
// ─────────────────────────────────────────────

console.log('\n=== myApply Tests ===');

console.log('E:', greet.myApply(person, ['Hey', '?']));       // Hey, Surya?
console.log('F:', Math.max.myApply(null, [3, 7, 2, 9, 1]));  // 9

function sum() {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) total += arguments[i];
  return total;
}
console.log('G:', sum.myApply(null, [1, 2, 3, 4, 5]));       // 15
console.log('H:', sum.myApply(null));                          // 0

// ─────────────────────────────────────────────
// TEST CASES — myBind
// ─────────────────────────────────────────────

console.log('\n=== myBind Tests ===');

var greetSurya = greet.myBind(person, 'Howdy');
console.log('I:', greetSurya('!'));                           // Howdy, Surya!
console.log('J:', greetSurya('...'));                          // Howdy, Surya...

var greetFull = greet.myBind(person);
console.log('K:', greetFull('Yo', '!!'));                     // Yo, Surya!!

// Test with `new` keyword
function Animal(name) {
  this.name = name;
}
Animal.prototype.speak = function() { return this.name + ' speaks'; };

var BoundAnimal = Animal.myBind({ name: 'ignored' });
var cat = new BoundAnimal('Cat');
console.log('L:', cat.name);                                  // Cat (not 'ignored')
console.log('M:', cat.speak());                               // Cat speaks
console.log('N:', cat instanceof BoundAnimal);                // true

// Partial application with bind
function multiply(a, b, c) { return a * b * c; }
var double = multiply.myBind(null, 2);
console.log('O:', double(3, 4));                              // 24
var triple6 = multiply.myBind(null, 3, 6);
console.log('P:', triple6(2));                                // 36

/**
 * FOLLOW-UP QUESTIONS:
 *
 * 1. Why use Symbol() for the temporary key in myCall/myApply?
 *    - Avoids collision with existing properties on ctx.
 * 2. Why does myBind need to handle `new`?
 *    - Native bind lets bound functions be used as constructors.
 *      When `new` is used, `this` should be the new instance, not ctx.
 * 3. What happens if you call myCall with ctx = undefined in strict mode?
 *    - this should remain undefined. Our polyfill uses globalThis instead.
 * 4. Can you chain bind? e.g., fn.bind(a).bind(b) — which context wins?
 *    - The first bind wins. Second bind cannot override.
 * 5. How does the real bind handle .length (arity of bound function)?
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ myCall/myApply: Attach fn as a temp property on ctx using a Symbol key,  ║
 * ║ invoke it so `this` inside fn points to ctx, then delete the property.   ║
 * ║                                                                          ║
 * ║ myBind: Return a closure that captures ctx + partial args. On call,      ║
 * ║ concat new args and invoke with fn.apply(ctx, allArgs). For `new`,       ║
 * ║ check `this instanceof bound` — if true, use `this` instead of ctx.     ║
 * ║ Set bound.prototype = Object.create(fn.prototype) for instanceof.        ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
