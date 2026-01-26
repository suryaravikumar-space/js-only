/**
 * Question 37: Function Currying
 *
 * Currying transforms a function with multiple arguments into a sequence
 * of functions each taking a single argument.
 *
 * Examples:
 * const add = (a, b, c) => a + b + c;
 * const curriedAdd = curry(add);
 * curriedAdd(1)(2)(3) // 6
 * curriedAdd(1, 2)(3) // 6
 * curriedAdd(1)(2, 3) // 6
 *
 * Task: Implement a curry function.
 */

function curry(fn) {
    // Your solution here
}

// Test cases
const add = (a, b, c) => a + b + c;
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
