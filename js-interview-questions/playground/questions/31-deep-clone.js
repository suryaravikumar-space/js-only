/**
 * Question 31: Deep Clone an Object
 *
 * Task: Create a function that makes a deep copy of an object,
 * including nested objects and arrays.
 *
 * Examples:
 * const obj = { a: 1, b: { c: 2 } };
 * const clone = deepClone(obj);
 * clone.b.c = 3; // Original obj.b.c should still be 2
 *
 * Constraints:
 * - Handle nested objects and arrays
 * - Handle circular references (bonus)
 */

function deepClone(obj) {
    // Your solution here
}

// Test cases
const original = { a: 1, b: { c: 2 }, d: [1, 2, { e: 3 }] };
const cloned = deepClone(original);
cloned.b.c = 100;
cloned.d[2].e = 300;

console.log(original.b.c); // Should still be 2
console.log(original.d[2].e); // Should still be 3
