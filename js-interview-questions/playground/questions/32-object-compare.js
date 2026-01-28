/**
 * Question 32: Deep Compare Objects
 *
 * Task: Write a function to check if two objects are deeply equal.
 *
 * Examples:
 * - deepEqual({a: 1}, {a: 1}) -> true
 * - deepEqual({a: {b: 2}}, {a: {b: 2}}) -> true
 * - deepEqual({a: 1}, {a: 2}) -> false
 *
 * Constraints:
 * - Handle nested objects and arrays
 * - Handle different types (null, undefined, etc.)
 */

function deepEqual(obj1, obj2) {
    // Your solution here
}

// Test cases
console.log(deepEqual({ a: 1 }, { a: 1 })); // true
console.log(deepEqual({ a: { b: 2 } }, { a: { b: 2 } })); // true
console.log(deepEqual([1, 2, 3], [1, 2, 3])); // true
console.log(deepEqual({ a: 1 }, { a: 2 })); // false
console.log(deepEqual(null, null)); // true
console.log(deepEqual({ a: 1 }, { a: 1, b: 2 })); // false
