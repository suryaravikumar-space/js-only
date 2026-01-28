/**
 * Question 22: Flatten a Nested Array
 *
 * Task: Write a function that flattens a nested array to a single level.
 *
 * Examples:
 * - [1, [2, 3], [4, [5, 6]]] -> [1, 2, 3, 4, 5, 6]
 * - [[1, 2], [3, 4]] -> [1, 2, 3, 4]
 *
 * Constraints:
 * - Handle any level of nesting
 * - Bonus: Allow specifying depth to flatten
 */

function flattenArray(arr) {
    // Your solution here
}

function flattenToDepth(arr, depth) {
    // Bonus: Your solution here
}

// Test cases
console.log(flattenArray([1, [2, 3], [4, [5, 6]]])); // [1, 2, 3, 4, 5, 6]
console.log(flattenArray([[1, 2], [3, 4]])); // [1, 2, 3, 4]
console.log(flattenToDepth([1, [2, [3, [4]]]], 1)); // [1, 2, [3, [4]]]
console.log(flattenToDepth([1, [2, [3, [4]]]], 2)); // [1, 2, 3, [4]]
