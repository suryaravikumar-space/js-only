/**
 * Answer 4: Reverse a String
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Built-in Methods
function reverseStringBuiltin(str) {
    return str.split('').reverse().join('');
}

// Approach 2: Using a Loop (Without built-in reverse)
function reverseString(str) {
    let reversed = '';
    for (let i = str.length - 1; i >= 0; i--) {
        reversed += str[i];
    }
    return reversed;
}

// Approach 3: Using Array and Loop
function reverseStringArray(str) {
    const arr = [];
    for (let i = str.length - 1; i >= 0; i--) {
        arr.push(str[i]);
    }
    return arr.join('');
}

// Approach 4: Two Pointer Technique
function reverseStringTwoPointer(str) {
    const arr = str.split('');
    let left = 0;
    let right = arr.length - 1;

    while (left < right) {
        [arr[left], arr[right]] = [arr[right], arr[left]];
        left++;
        right--;
    }

    return arr.join('');
}

// Approach 5: Recursion
function reverseStringRecursive(str) {
    if (str.length <= 1) return str;
    return reverseStringRecursive(str.slice(1)) + str[0];
}

// Approach 6: Using Reduce
function reverseStringReduce(str) {
    return str.split('').reduce((rev, char) => char + rev, '');
}

// Test cases
console.log("=== Built-in Methods ===");
console.log(reverseStringBuiltin("hello")); // "olleh"

console.log("\n=== Loop Method ===");
console.log(reverseString("JavaScript")); // "tpircSavaJ"

console.log("\n=== Two Pointer ===");
console.log(reverseStringTwoPointer("12345")); // "54321"

console.log("\n=== Recursive ===");
console.log(reverseStringRecursive("hello")); // "olleh"

console.log("\n=== Reduce ===");
console.log(reverseStringReduce("world")); // "dlrow"

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity:
 * - Loop: O(n) - new string
 * - Two Pointer: O(n) - array conversion
 * - Recursive: O(n) - call stack
 */
