/**
 * Answer 1: Palindrome Check
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using built-in methods (Clean & Simple)
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    return cleaned === cleaned.split('').reverse().join('');
}

// Approach 2: Two Pointer Technique (More Efficient - O(n) time, O(1) space)
function isPalindromeTwoPointer(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    let left = 0;
    let right = cleaned.length - 1;

    while (left < right) {
        if (cleaned[left] !== cleaned[right]) {
            return false;
        }
        left++;
        right--;
    }
    return true;
}

// Approach 3: Recursive Solution
function isPalindromeRecursive(str) {
    const cleaned = str.toLowerCase().replace(/[^a-z0-9]/g, '');

    function check(left, right) {
        if (left >= right) return true;
        if (cleaned[left] !== cleaned[right]) return false;
        return check(left + 1, right - 1);
    }

    return check(0, cleaned.length - 1);
}

// Test cases
console.log("=== Approach 1: Built-in Methods ===");
console.log(isPalindrome("madam")); // true
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("A man a plan a canal Panama")); // true

console.log("\n=== Approach 2: Two Pointer ===");
console.log(isPalindromeTwoPointer("madam")); // true
console.log(isPalindromeTwoPointer("hello")); // false

console.log("\n=== Approach 3: Recursive ===");
console.log(isPalindromeRecursive("racecar")); // true
console.log(isPalindromeRecursive("hello")); // false

/**
 * Time Complexity:
 * - Approach 1: O(n) - reverse creates new array
 * - Approach 2: O(n) - single pass with two pointers
 * - Approach 3: O(n) - recursive calls
 *
 * Space Complexity:
 * - Approach 1: O(n) - creates new string/array
 * - Approach 2: O(n) - for cleaned string, O(1) for pointers
 * - Approach 3: O(n) - call stack
 */
