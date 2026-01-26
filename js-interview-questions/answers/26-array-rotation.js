/**
 * Answer 26: Array Rotation
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Slice and Concat
function rotateLeft(arr, k) {
    if (arr.length === 0) return arr;
    k = k % arr.length;
    return arr.slice(k).concat(arr.slice(0, k));
}

function rotateRight(arr, k) {
    if (arr.length === 0) return arr;
    k = k % arr.length;
    return arr.slice(-k).concat(arr.slice(0, -k));
}

// Approach 2: Using Spread Operator
function rotateLeftSpread(arr, k) {
    k = k % arr.length;
    return [...arr.slice(k), ...arr.slice(0, k)];
}

// Approach 3: In-place Rotation (Reversal Algorithm)
function rotateLeftInPlace(arr, k) {
    k = k % arr.length;

    const reverse = (start, end) => {
        while (start < end) {
            [arr[start], arr[end]] = [arr[end], arr[start]];
            start++;
            end--;
        }
    };

    reverse(0, k - 1);
    reverse(k, arr.length - 1);
    reverse(0, arr.length - 1);

    return arr;
}

// Approach 4: Using Pop and Unshift (for right rotation)
function rotateRightPopShift(arr, k) {
    k = k % arr.length;
    for (let i = 0; i < k; i++) {
        arr.unshift(arr.pop());
    }
    return arr;
}

// Approach 5: Using Shift and Push (for left rotation)
function rotateLeftShiftPush(arr, k) {
    k = k % arr.length;
    for (let i = 0; i < k; i++) {
        arr.push(arr.shift());
    }
    return arr;
}

// Approach 6: Generic rotate function
function rotate(arr, k, direction = 'right') {
    if (arr.length === 0) return arr;
    k = k % arr.length;

    if (direction === 'left') {
        return [...arr.slice(k), ...arr.slice(0, k)];
    } else {
        return [...arr.slice(-k), ...arr.slice(0, -k)];
    }
}

// Test cases
console.log("=== Slice and Concat ===");
console.log(rotateLeft([1, 2, 3, 4, 5], 2)); // [3, 4, 5, 1, 2]
console.log(rotateRight([1, 2, 3, 4, 5], 2)); // [4, 5, 1, 2, 3]

console.log("\n=== Handle k > length ===");
console.log(rotateLeft([1, 2, 3], 5)); // [3, 1, 2]

console.log("\n=== In-place Reversal ===");
console.log(rotateLeftInPlace([1, 2, 3, 4, 5], 2)); // [3, 4, 5, 1, 2]

console.log("\n=== Generic Function ===");
console.log(rotate([1, 2, 3, 4, 5], 2, 'left')); // [3, 4, 5, 1, 2]
console.log(rotate([1, 2, 3, 4, 5], 2, 'right')); // [4, 5, 1, 2, 3]

/**
 * Time Complexity:
 * - Slice/Concat: O(n)
 * - In-place: O(n)
 * - Pop/Shift: O(n * k)
 *
 * Space Complexity:
 * - Slice/Concat: O(n)
 * - In-place: O(1)
 */
