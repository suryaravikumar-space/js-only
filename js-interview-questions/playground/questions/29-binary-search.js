/**
 * Question 29: Binary Search
 *
 * Binary search is an efficient algorithm for finding an item in a sorted array.
 * It works by repeatedly dividing the search interval in half.
 *
 * Examples:
 * - binarySearch([1, 3, 5, 7, 9, 11], 7) -> 3 (index)
 * - binarySearch([1, 3, 5, 7, 9, 11], 6) -> -1 (not found)
 *
 * Task: Implement binary search algorithm.
 *
 * Constraints:
 * - Array is sorted in ascending order
 * - Return -1 if element not found
 */

function binarySearch(arr, target) {
    // Your solution here
}

// Test cases
console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9, 11], 6)); // -1
console.log(binarySearch([1, 3, 5, 7, 9, 11], 1)); // 0
console.log(binarySearch([1, 3, 5, 7, 9, 11], 11)); // 5
