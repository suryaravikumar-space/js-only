/**
 * Answer 16: Sum of Digits
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: String Conversion
function sumOfDigits(num) {
    return Math.abs(num)
        .toString()
        .split('')
        .reduce((sum, digit) => sum + parseInt(digit), 0);
}

// Approach 2: Mathematical
function sumOfDigitsMath(num) {
    num = Math.abs(num);
    let sum = 0;

    while (num > 0) {
        sum += num % 10;
        num = Math.floor(num / 10);
    }

    return sum;
}

// Approach 3: Recursive
function sumOfDigitsRecursive(num) {
    num = Math.abs(num);
    if (num < 10) return num;
    return (num % 10) + sumOfDigitsRecursive(Math.floor(num / 10));
}

// Digital Root - Reduce to single digit
function digitalRoot(num) {
    num = Math.abs(num);

    while (num >= 10) {
        num = sumOfDigits(num);
    }

    return num;
}

// Digital Root - Mathematical Formula
// Digital root = 1 + (n - 1) % 9 (for n > 0)
function digitalRootFormula(num) {
    if (num === 0) return 0;
    num = Math.abs(num);
    return 1 + ((num - 1) % 9);
}

// Get digit breakdown
function digitBreakdown(num) {
    const digits = Math.abs(num)
        .toString()
        .split('')
        .map(Number);

    return {
        original: num,
        digits: digits,
        sum: digits.reduce((a, b) => a + b, 0),
        digitalRoot: digitalRoot(num)
    };
}

// Test cases
console.log("=== String Method ===");
console.log(sumOfDigits(123)); // 6
console.log(sumOfDigits(9999)); // 36

console.log("\n=== Math Method ===");
console.log(sumOfDigitsMath(-45)); // 9

console.log("\n=== Digital Root ===");
console.log(digitalRoot(9999)); // 9
console.log(digitalRoot(123456)); // 3

console.log("\n=== Digital Root Formula ===");
console.log(digitalRootFormula(9999)); // 9

console.log("\n=== Breakdown ===");
console.log(digitBreakdown(9999));
// { original: 9999, digits: [9,9,9,9], sum: 36, digitalRoot: 9 }

/**
 * Time Complexity: O(d) where d is number of digits
 * Space Complexity:
 * - Math: O(1)
 * - String: O(d)
 * - Digital Root Formula: O(1)
 */
