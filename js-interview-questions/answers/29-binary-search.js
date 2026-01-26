/**
 * Answer 29: Binary Search
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Iterative
function binarySearch(arr, target) {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return -1;
}

// Approach 2: Recursive
function binarySearchRecursive(arr, target, left = 0, right = arr.length - 1) {
    if (left > right) return -1;

    const mid = Math.floor((left + right) / 2);

    if (arr[mid] === target) return mid;

    if (arr[mid] < target) {
        return binarySearchRecursive(arr, target, mid + 1, right);
    }

    return binarySearchRecursive(arr, target, left, mid - 1);
}

// Approach 3: Find first occurrence
function binarySearchFirst(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            result = mid;
            right = mid - 1; // Continue searching left
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

// Approach 4: Find last occurrence
function binarySearchLast(arr, target) {
    let left = 0;
    let right = arr.length - 1;
    let result = -1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] === target) {
            result = mid;
            left = mid + 1; // Continue searching right
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }

    return result;
}

// Approach 5: Find insertion position
function binarySearchInsertPosition(arr, target) {
    let left = 0;
    let right = arr.length;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid;
        }
    }

    return left;
}

// Approach 6: Count occurrences
function countOccurrences(arr, target) {
    const first = binarySearchFirst(arr, target);
    if (first === -1) return 0;

    const last = binarySearchLast(arr, target);
    return last - first + 1;
}

// Test cases
console.log("=== Iterative ===");
console.log(binarySearch([1, 3, 5, 7, 9, 11], 7)); // 3
console.log(binarySearch([1, 3, 5, 7, 9, 11], 6)); // -1

console.log("\n=== Recursive ===");
console.log(binarySearchRecursive([1, 3, 5, 7, 9, 11], 1)); // 0
console.log(binarySearchRecursive([1, 3, 5, 7, 9, 11], 11)); // 5

console.log("\n=== First Occurrence ===");
console.log(binarySearchFirst([1, 2, 2, 2, 3, 4], 2)); // 1

console.log("\n=== Last Occurrence ===");
console.log(binarySearchLast([1, 2, 2, 2, 3, 4], 2)); // 3

console.log("\n=== Count Occurrences ===");
console.log(countOccurrences([1, 2, 2, 2, 3, 4], 2)); // 3

console.log("\n=== Insert Position ===");
console.log(binarySearchInsertPosition([1, 3, 5, 7], 4)); // 2

/**
 * Time Complexity: O(log n)
 * Space Complexity:
 * - Iterative: O(1)
 * - Recursive: O(log n) call stack
 */
