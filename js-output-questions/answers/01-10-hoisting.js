/**
 * Answers 01-10: Hoisting
 *
 * Detailed explanations for each question.
 */

// Question 01: var hoisting
// Output: undefined
console.log("Q01:", x);
var x = 5;
/**
 * Explanation:
 * var declarations are hoisted to the top, but NOT their assignments.
 * The code is interpreted as:
 *   var x;           // hoisted
 *   console.log(x);  // undefined
 *   x = 5;           // assignment stays
 */

// Question 02: function hoisting
// Output: "Hello"
console.log("Q02:", foo());
function foo() {
    return "Hello";
}
/**
 * Explanation:
 * Function declarations are FULLY hoisted - both the name AND the body.
 * The entire function is available before its declaration in the code.
 */

// Question 03: let hoisting (TDZ)
// Output: ReferenceError
/**
 * Explanation:
 * let and const are hoisted but NOT initialized.
 * They exist in a "Temporal Dead Zone" (TDZ) from the start of the block
 * until the declaration is reached. Accessing them before throws ReferenceError.
 */
console.log("Q03: ReferenceError (TDZ)");

// Question 04: function expression hoisting
// Output: TypeError: bar is not a function
/**
 * Explanation:
 * var bar is hoisted, so bar = undefined.
 * Calling undefined() throws TypeError, not ReferenceError.
 * The function assignment happens later.
 */
console.log("Q04: TypeError - bar is not a function");

// Question 05: var vs let in same scope
// Output: Q05a: 1, Q05b: 3
var a = 1;
let b = 2;
{
    console.log("Q05a:", a); // 1 - var ignores block scope
    var a = 3;              // re-declaration, same variable
    let c = 4;              // block-scoped
}
console.log("Q05b:", a);     // 3 - var was modified
/**
 * Explanation:
 * var has function scope, not block scope.
 * Inside the block, 'var a = 3' modifies the same 'a' variable.
 * let c is block-scoped and not accessible outside.
 */

// Question 06: function hoisting inside block
// Output: "undefined" or "function" (browser-dependent)
console.log("Q06:", typeof test);
{
    function test() { return 1; }
}
/**
 * Explanation:
 * Block-scoped function declarations have inconsistent behavior.
 * In strict mode: function is block-scoped (typeof = undefined before block)
 * In non-strict mode (browsers): may be hoisted (typeof = function)
 * This is a quirk - avoid function declarations in blocks!
 */

// Question 07: variable shadowing with hoisting
// Output: undefined
var num = 10;
function checkNum() {
    console.log("Q07:", num);
    var num = 20;
}
checkNum();
/**
 * Explanation:
 * Inside checkNum, 'var num' is hoisted to the function top.
 * So the function sees its own 'num' (undefined) not the outer one.
 * This is called "variable shadowing".
 */

// Question 08: const hoisting
// Output: ReferenceError
/**
 * Explanation:
 * Same as let - const is hoisted but not initialized.
 * Accessing it before declaration throws ReferenceError (TDZ).
 */
console.log("Q08: ReferenceError (TDZ)");

// Question 09: function vs var same name
// Output: "number"
var double = 2;
function double(n) {
    return n * 2;
}
console.log("Q09:", typeof double);
/**
 * Explanation:
 * Both var and function declarations are hoisted.
 * Function declarations take precedence DURING hoisting phase.
 * But then var double = 2 REASSIGNS it to a number.
 *
 * Interpreted as:
 *   function double(n) { return n * 2; }  // hoisted first
 *   var double;                            // hoisted (no effect, already exists)
 *   double = 2;                            // assignment - now it's a number
 */

// Question 10: nested function hoisting
// Output: "function", then 1
function outer() {
    console.log("Q10:", typeof inner);
    var x = 1;
    function inner() { return x; }
    return inner();
}
console.log("Q10 result:", outer());
/**
 * Explanation:
 * Inside outer(), both 'var x' and 'function inner' are hoisted.
 * typeof inner = "function" (function is fully hoisted)
 * inner() returns x, which is 1 by the time it executes.
 */

console.log("\n=== Summary ===");
console.log("1. var: declaration hoisted, value = undefined");
console.log("2. let/const: hoisted but in TDZ, accessing throws ReferenceError");
console.log("3. function declaration: fully hoisted");
console.log("4. function expression: only var name hoisted, not the function");
console.log("5. Functions take precedence over var during hoisting");
