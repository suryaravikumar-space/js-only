/**
 * Question 26: Array Rotation
 *
 * Task: Write functions to rotate an array left or right by k positions.
 *
 * Examples:
 * - rotateLeft([1, 2, 3, 4, 5], 2) -> [3, 4, 5, 1, 2]
 * - rotateRight([1, 2, 3, 4, 5], 2) -> [4, 5, 1, 2, 3]
 *
 * Constraints:
 * - Handle k greater than array length
 * - Handle negative k values
 */

function rotateLeft(arr, k) {
    // Your solution here
}

function rotateRight(arr, k) {
    // Your solution here
}

// Test cases
console.log(rotateLeft([1, 2, 3, 4, 5], 2)); // [3, 4, 5, 1, 2]
console.log(rotateRight([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]
console.log(rotateLeft([1, 2, 3], 5)); // [3, 1, 2] (5 % 3 = 2)
