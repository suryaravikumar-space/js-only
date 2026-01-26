/**
 * Question 33: Flatten a Nested Object
 *
 * Task: Convert a nested object into a flat object with dot notation keys.
 *
 * Examples:
 * Input: { a: { b: { c: 1 } }, d: 2 }
 * Output: { 'a.b.c': 1, 'd': 2 }
 *
 * Bonus: Implement unflatten to reverse the operation
 */

function flattenObject(obj) {
    // Your solution here
}

function unflattenObject(obj) {
    // Bonus: Your solution here
}

// Test cases
console.log(flattenObject({ a: { b: { c: 1 } }, d: 2 }));
// { 'a.b.c': 1, 'd': 2 }

console.log(flattenObject({ a: [1, 2, { b: 3 }] }));
// { 'a.0': 1, 'a.1': 2, 'a.2.b': 3 }
