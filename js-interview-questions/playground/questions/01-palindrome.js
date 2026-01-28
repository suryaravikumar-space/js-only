/**
 * Question 1: Palindrome Check
 *
 * A palindrome is a word, phrase, number, or sequence that reads the same
 * backward as forward.
 *
 * Examples:
 * - "madam" -> true
 * - "racecar" -> true
 * - "hello" -> false
 * - "A man a plan a canal Panama" -> true (ignoring spaces and case)
 *
 * Task: Write a function to check if a given string is a palindrome.
 *
 * Constraints:
 * - Consider case-insensitivity
 * - Handle spaces and special characters appropriately
 */

function isPalindrome(str) {
    // Your solution here
    const clean = str.toLowerCase().replace(/[^a-z0-9]/g, "")
    function check(left, right){
        if(left >= right)  return true;
        if(clean[left] !== clean[right])return false;
        return check(left+1, right-1);
    }
    return check(0, clean.length-1)
}

// Test cases
console.log(isPalindrome("madam")); // true
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello")); // false
console.log(isPalindrome("A man a plan a canal Panama")); // true
