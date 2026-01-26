/**
 * Question 41: Valid Parentheses
 *
 * Given a string containing just the characters '(', ')', '{', '}', '[', ']',
 * determine if the input string is valid.
 *
 * Rules:
 * - Open brackets must be closed by the same type of brackets
 * - Open brackets must be closed in the correct order
 *
 * Examples:
 * - "()" -> true
 * - "()[]{}" -> true
 * - "(]" -> false
 * - "([)]" -> false
 * - "{[]}" -> true
 */

function isValidParentheses(str) {
    // Your solution here
}

// Test cases
console.log(isValidParentheses("()")); // true
console.log(isValidParentheses("()[]{}")); // true
console.log(isValidParentheses("(]")); // false
console.log(isValidParentheses("([)]")); // false
console.log(isValidParentheses("{[]}")); // true
