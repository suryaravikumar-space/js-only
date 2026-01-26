/**
 * Answer 25: Find Maximum and Minimum in Array
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Math.max/min with spread
function findMaxBuiltin(arr) {
    if (arr.length === 0) return undefined;
    return Math.max(...arr);
}

function findMinBuiltin(arr) {
    if (arr.length === 0) return undefined;
    return Math.min(...arr);
}

// Approach 2: Using Loop
function findMax(arr) {
    if (arr.length === 0) return undefined;

    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            max = arr[i];
        }
    }
    return max;
}

function findMin(arr) {
    if (arr.length === 0) return undefined;

    let min = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) {
            min = arr[i];
        }
    }
    return min;
}

// Approach 3: Using Reduce
function findMaxReduce(arr) {
    if (arr.length === 0) return undefined;
    return arr.reduce((max, num) => num > max ? num : max, arr[0]);
}

function findMinReduce(arr) {
    if (arr.length === 0) return undefined;
    return arr.reduce((min, num) => num < min ? num : min, arr[0]);
}

// Approach 4: Find both in single pass (Optimal)
function findMinMax(arr) {
    if (arr.length === 0) return { min: undefined, max: undefined };

    let min = arr[0];
    let max = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < min) min = arr[i];
        if (arr[i] > max) max = arr[i];
    }

    return { min, max };
}

// Approach 5: With indices
function findMinMaxWithIndex(arr) {
    if (arr.length === 0) return null;

    let minIndex = 0, maxIndex = 0;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] < arr[minIndex]) minIndex = i;
        if (arr[i] > arr[maxIndex]) maxIndex = i;
    }

    return {
        min: { value: arr[minIndex], index: minIndex },
        max: { value: arr[maxIndex], index: maxIndex }
    };
}

// Approach 6: Second Largest/Smallest
function findSecondLargest(arr) {
    if (arr.length < 2) return undefined;

    let first = -Infinity, second = -Infinity;

    for (let num of arr) {
        if (num > first) {
            second = first;
            first = num;
        } else if (num > second && num !== first) {
            second = num;
        }
    }

    return second === -Infinity ? undefined : second;
}

// Test cases
console.log("=== Built-in ===");
console.log(findMaxBuiltin([3, 1, 4, 1, 5, 9, 2, 6])); // 9

console.log("\n=== Loop Method ===");
console.log(findMax([3, 1, 4, 1, 5, 9, 2, 6])); // 9
console.log(findMin([3, 1, 4, 1, 5, 9, 2, 6])); // 1

console.log("\n=== Single Pass ===");
console.log(findMinMax([3, 1, 4, 1, 5, 9, 2, 6])); // { min: 1, max: 9 }

console.log("\n=== With Index ===");
console.log(findMinMaxWithIndex([3, 1, 4, 1, 5, 9, 2, 6]));

console.log("\n=== Second Largest ===");
console.log(findSecondLargest([3, 1, 4, 1, 5, 9, 2, 6])); // 6

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity: O(1) for all approaches
 */
