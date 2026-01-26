/**
 * Answer 19: Binary to Decimal & Decimal to Binary
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Manual Decimal to Binary
function decimalToBinary(num) {
    if (num === 0) return "0";

    let binary = "";
    let n = Math.abs(num);

    while (n > 0) {
        binary = (n % 2) + binary;
        n = Math.floor(n / 2);
    }

    return num < 0 ? "-" + binary : binary;
}

// Approach 2: Manual Binary to Decimal
function binaryToDecimal(binary) {
    const isNegative = binary[0] === '-';
    if (isNegative) binary = binary.slice(1);

    let decimal = 0;
    let power = 0;

    for (let i = binary.length - 1; i >= 0; i--) {
        if (binary[i] === '1') {
            decimal += Math.pow(2, power);
        }
        power++;
    }

    return isNegative ? -decimal : decimal;
}

// Approach 3: Using Built-in Methods
function decToBinBuiltin(num) {
    return num.toString(2);
}

function binToDecBuiltin(binary) {
    return parseInt(binary, 2);
}

// Approach 4: Binary to Decimal using Reduce
function binaryToDecimalReduce(binary) {
    return binary.split('').reduce((dec, bit) => {
        return dec * 2 + parseInt(bit);
    }, 0);
}

// Approach 5: Hexadecimal Conversions
function decimalToHex(num) {
    if (num === 0) return "0";

    const hexChars = "0123456789ABCDEF";
    let hex = "";
    let n = Math.abs(num);

    while (n > 0) {
        hex = hexChars[n % 16] + hex;
        n = Math.floor(n / 16);
    }

    return num < 0 ? "-" + hex : hex;
}

function hexToDecimal(hex) {
    const isNegative = hex[0] === '-';
    if (isNegative) hex = hex.slice(1);

    hex = hex.toUpperCase();
    const hexChars = "0123456789ABCDEF";
    let decimal = 0;

    for (let char of hex) {
        decimal = decimal * 16 + hexChars.indexOf(char);
    }

    return isNegative ? -decimal : decimal;
}

// Test cases
console.log("=== Decimal to Binary ===");
console.log(decimalToBinary(10)); // "1010"
console.log(decimalToBinary(255)); // "11111111"
console.log(decimalToBinary(0)); // "0"

console.log("\n=== Binary to Decimal ===");
console.log(binaryToDecimal("1010")); // 10
console.log(binaryToDecimal("11111111")); // 255

console.log("\n=== Using Reduce ===");
console.log(binaryToDecimalReduce("1010")); // 10

console.log("\n=== Hexadecimal ===");
console.log(decimalToHex(255)); // "FF"
console.log(hexToDecimal("FF")); // 255

/**
 * Time Complexity: O(log n) or O(length of binary)
 * Space Complexity: O(log n) for binary string
 */
