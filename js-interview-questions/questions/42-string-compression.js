/**
 * Question 42: String Compression
 *
 * Implement a method to perform basic string compression using the counts
 * of repeated characters.
 *
 * Examples:
 * - "aabcccccaaa" -> "a2b1c5a3"
 * - "abcd" -> "abcd" (compressed isn't shorter)
 *
 * Constraints:
 * - Return original string if compressed isn't shorter
 * - Case-sensitive
 */

function compressString(str) {
    // Your solution here
}

// Test cases
console.log(compressString("aabcccccaaa")); // "a2b1c5a3"
console.log(compressString("abcd")); // "abcd"
console.log(compressString("aaa")); // "a3"
console.log(compressString("")); // ""
