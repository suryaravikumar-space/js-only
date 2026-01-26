/**
 * Question 34: Deep Merge Objects
 *
 * Task: Merge two or more objects deeply, combining nested properties.
 *
 * Examples:
 * const obj1 = { a: 1, b: { c: 2 } };
 * const obj2 = { b: { d: 3 }, e: 4 };
 * deepMerge(obj1, obj2) -> { a: 1, b: { c: 2, d: 3 }, e: 4 }
 *
 * Constraints:
 * - Later objects should override earlier ones
 * - Handle arrays (replace or merge based on preference)
 */

function deepMerge(...objects) {
    // Your solution here
}

// Test cases
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { b: { d: 3 }, e: 4 };
console.log(deepMerge(obj1, obj2));
// { a: 1, b: { c: 2, d: 3 }, e: 4 }
