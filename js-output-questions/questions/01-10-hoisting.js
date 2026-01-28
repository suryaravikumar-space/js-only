/**
 * Questions 01-10: Hoisting
 *
 * Predict the output for each code snippet.
 * Run this file to check your answers!
 */

// Question 01: var hoisting
console.log("Q01:", x);
var x = 5;

// Question 02: function hoisting
console.log("Q02:", foo());
function foo() {
    return "Hello";
}

// Question 03: let hoisting (TDZ)
// Uncomment to test - will throw error
// console.log("Q03:", y);
// let y = 10;
console.log("Q03: ReferenceError (TDZ)");

// Question 04: function expression hoisting
// Uncomment to test - will throw error
// console.log("Q04:", bar());
// var bar = function() { return "World"; };
console.log("Q04: TypeError - bar is not a function");

// Question 05: var vs let in same scope
var a = 1;
let b = 2;
{
    console.log("Q05a:", a);
    // console.log("Q05b:", c); // ReferenceError
    var a = 3;
    let c = 4;
}
console.log("Q05b:", a);

// Question 06: function hoisting inside block
console.log("Q06:", typeof test);
{
    function test() { return 1; }
}

// Question 07: variable shadowing with hoisting
var num = 10;
function checkNum() {
    console.log("Q07:", num);
    var num = 20;
}
checkNum();

// Question 08: const hoisting
// Uncomment to test
// console.log("Q08:", PI);
// const PI = 3.14;
console.log("Q08: ReferenceError (TDZ)");

// Question 09: function vs var same name
var double = 2;
function double(n) {
    return n * 2;
}
console.log("Q09:", typeof double);

// Question 10: nested function hoisting
function outer() {
    console.log("Q10:", typeof inner);
    var x = 1;
    function inner() { return x; }
    return inner();
}
console.log("Q10 result:", outer());
