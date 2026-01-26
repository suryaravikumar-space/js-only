/**
 * Question 14: Armstrong Number
 *
 * An Armstrong number (narcissistic number) is a number that is equal to
 * the sum of its own digits each raised to the power of the number of digits.
 *
 * Examples:
 * - 153 = 1³ + 5³ + 3³ = 1 + 125 + 27 = 153 ✓
 * - 370 = 3³ + 7³ + 0³ = 27 + 343 + 0 = 370 ✓
 * - 123 = 1³ + 2³ + 3³ = 1 + 8 + 27 = 36 ✗
 *
 * Task: Write a function to check if a number is an Armstrong number.
 */

function isArmstrong(num) {
    // Your solution here
}

// Test cases
console.log(isArmstrong(153)); // true
console.log(isArmstrong(370)); // true
console.log(isArmstrong(371)); // true
console.log(isArmstrong(123)); // false
console.log(isArmstrong(9474)); // true (4-digit Armstrong)
