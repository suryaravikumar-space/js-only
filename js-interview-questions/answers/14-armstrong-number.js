/**
 * Answer 14: Armstrong Number
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: String Conversion
function isArmstrong(num) {
    const digits = num.toString().split('');
    const power = digits.length;

    const sum = digits.reduce((acc, digit) => {
        return acc + Math.pow(parseInt(digit), power);
    }, 0);

    return sum === num;
}

// Approach 2: Mathematical Approach
function isArmstrongMath(num) {
    const digits = [];
    let temp = num;

    while (temp > 0) {
        digits.push(temp % 10);
        temp = Math.floor(temp / 10);
    }

    const power = digits.length;
    const sum = digits.reduce((acc, d) => acc + Math.pow(d, power), 0);

    return sum === num;
}

// Approach 3: Find all Armstrong numbers in a range
function findArmstrongNumbers(start, end) {
    const result = [];

    for (let num = start; num <= end; num++) {
        if (isArmstrong(num)) {
            result.push(num);
        }
    }

    return result;
}

// Approach 4: Get Armstrong breakdown
function armstrongBreakdown(num) {
    const digits = num.toString().split('').map(Number);
    const power = digits.length;

    const breakdown = digits.map(d => ({
        digit: d,
        power: power,
        result: Math.pow(d, power)
    }));

    const sum = breakdown.reduce((acc, b) => acc + b.result, 0);

    return {
        number: num,
        digits: digits,
        power: power,
        breakdown: breakdown,
        sum: sum,
        isArmstrong: sum === num
    };
}

// Test cases
console.log("=== Basic Check ===");
console.log(isArmstrong(153)); // true
console.log(isArmstrong(370)); // true
console.log(isArmstrong(123)); // false

console.log("\n=== Math Approach ===");
console.log(isArmstrongMath(371)); // true
console.log(isArmstrongMath(9474)); // true

console.log("\n=== Find Armstrong Numbers 1-1000 ===");
console.log(findArmstrongNumbers(1, 1000));
// [1, 2, 3, 4, 5, 6, 7, 8, 9, 153, 370, 371, 407]

console.log("\n=== Breakdown ===");
console.log(armstrongBreakdown(153));
// { number: 153, digits: [1,5,3], power: 3, breakdown: [...], sum: 153, isArmstrong: true }

/**
 * Time Complexity: O(d) where d is number of digits
 * Space Complexity: O(d) for storing digits
 */
