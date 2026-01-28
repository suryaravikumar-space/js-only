/**
 * Answers 11-20: Closures & Scope
 *
 * Detailed explanations for each question.
 */

// Question 11: Basic closure
// Output: 1 2 3
function outer() {
    let count = 0;
    return function inner() {
        count++;
        return count;
    };
}
const counter = outer();
console.log("Q11:", counter(), counter(), counter());
/**
 * Explanation:
 * inner() forms a closure over 'count'.
 * Each call increments the SAME count variable.
 * The variable persists between calls because of closure.
 */

// Question 12: Classic loop closure problem
// Output: 3 3 3 (all print 3)
for (var i = 0; i < 3; i++) {
    setTimeout(function() {
        console.log("Q12:", i);
    }, 100);
}
/**
 * Explanation:
 * var has function scope, not block scope.
 * All three callbacks share the SAME 'i' variable.
 * By the time setTimeout executes, the loop has finished and i = 3.
 * This is the famous "closure in loop" problem.
 */

// Question 13: Loop closure with let
// Output: 0 1 2
for (let j = 0; j < 3; j++) {
    setTimeout(function() {
        console.log("Q13:", j);
    }, 200);
}
/**
 * Explanation:
 * let is block-scoped.
 * Each iteration creates a NEW 'j' variable.
 * Each callback captures its own copy of 'j'.
 */

// Question 14: IIFE closure solution
// Output: 0 1 2
for (var k = 0; k < 3; k++) {
    (function(k) {
        setTimeout(function() {
            console.log("Q14:", k);
        }, 300);
    })(k);
}
/**
 * Explanation:
 * The IIFE creates a new scope for each iteration.
 * Each IIFE captures the current value of k as a parameter.
 * This is the pre-ES6 solution to the loop closure problem.
 */

// Question 15: Closure with shared variable
// Output: 3 3 3
function createFunctions() {
    var funcs = [];
    for (var i = 0; i < 3; i++) {
        funcs.push(function() { return i; });
    }
    return funcs;
}
var fns = createFunctions();
console.log("Q15:", fns[0](), fns[1](), fns[2]());
/**
 * Explanation:
 * Same as Q12 - all functions share the same 'i'.
 * When they execute, i = 3 (loop has finished).
 * Use let, IIFE, or bind() to fix this.
 */

// Question 16: Closure retaining reference
// Output: 2 1
function createCounter() {
    let count = 0;
    return {
        increment: function() { count++; },
        get: function() { return count; }
    };
}
const c1 = createCounter();
const c2 = createCounter();
c1.increment();
c1.increment();
c2.increment();
console.log("Q16:", c1.get(), c2.get());
/**
 * Explanation:
 * Each call to createCounter() creates a NEW closure with its own 'count'.
 * c1 and c2 have SEPARATE count variables.
 * c1 was incremented twice (2), c2 once (1).
 */

// Question 17: Nested closures
// Output: 6
function outer2(x) {
    return function middle(y) {
        return function inner(z) {
            return x + y + z;
        };
    };
}
console.log("Q17:", outer2(1)(2)(3));
/**
 * Explanation:
 * This is currying - each function returns another function.
 * inner() has access to x, y, and z through closure chain.
 * 1 + 2 + 3 = 6
 */

// Question 18: Closure with parameter shadowing
// Output: "local"
let value = "global";
function test(value) {
    return function() {
        return value;
    };
}
const getValue = test("local");
console.log("Q18:", getValue());
/**
 * Explanation:
 * The parameter 'value' shadows the global 'value'.
 * The returned function closes over the parameter, not the global.
 * It returns "local".
 */

// Question 19: Module pattern closure
// Output: "secret", "new secret", undefined
const module = (function() {
    let private = "secret";
    return {
        getPrivate: function() { return private; },
        setPrivate: function(val) { private = val; }
    };
})();
console.log("Q19a:", module.getPrivate()); // "secret"
module.setPrivate("new secret");
console.log("Q19b:", module.getPrivate()); // "new secret"
console.log("Q19c:", module.private);       // undefined
/**
 * Explanation:
 * This is the Module Pattern - using closure for privacy.
 * 'private' is not directly accessible (Q19c = undefined).
 * It can only be accessed through the returned methods.
 */

// Question 20: Closure scope chain
// Output: 30
var x = 10;
function first() {
    var x = 20;
    function second() {
        var x = 30;
        return function third() {
            return x;
        };
    }
    return second();
}
console.log("Q20:", first()());
/**
 * Explanation:
 * third() looks for 'x' in the scope chain.
 * It finds x = 30 in second()'s scope (closest).
 * Scope chain: third -> second (x=30) -> first (x=20) -> global (x=10)
 */

console.log("\n=== Summary ===");
console.log("1. Closures 'remember' variables from their outer scope");
console.log("2. var in loops: all callbacks share same variable");
console.log("3. let in loops: each iteration gets its own variable");
console.log("4. Each function call creates a new closure");
console.log("5. Scope chain: inner -> outer -> ... -> global");
