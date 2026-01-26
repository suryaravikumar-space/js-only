/**
 * Answer 44: Roman to Integer & Integer to Roman
 *
 * Multiple approaches:
 */

// Roman to Integer
function romanToInt(roman) {
    const values = {
        'I': 1, 'V': 5, 'X': 10, 'L': 50,
        'C': 100, 'D': 500, 'M': 1000
    };

    let result = 0;

    for (let i = 0; i < roman.length; i++) {
        const current = values[roman[i]];
        const next = values[roman[i + 1]];

        if (next > current) {
            result -= current;
        } else {
            result += current;
        }
    }

    return result;
}

// Roman to Integer - Using replacement
function romanToIntReplace(roman) {
    const replacements = {
        'IV': 'IIII', 'IX': 'VIIII',
        'XL': 'XXXX', 'XC': 'LXXXX',
        'CD': 'CCCC', 'CM': 'DCCCC'
    };

    for (let [from, to] of Object.entries(replacements)) {
        roman = roman.replace(from, to);
    }

    const values = { 'I': 1, 'V': 5, 'X': 10, 'L': 50, 'C': 100, 'D': 500, 'M': 1000 };
    return roman.split('').reduce((sum, char) => sum + values[char], 0);
}

// Integer to Roman
function intToRoman(num) {
    const romanNumerals = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']
    ];

    let result = '';

    for (let [value, symbol] of romanNumerals) {
        while (num >= value) {
            result += symbol;
            num -= value;
        }
    }

    return result;
}

// Integer to Roman - Using arrays
function intToRomanArrays(num) {
    const thousands = ['', 'M', 'MM', 'MMM'];
    const hundreds = ['', 'C', 'CC', 'CCC', 'CD', 'D', 'DC', 'DCC', 'DCCC', 'CM'];
    const tens = ['', 'X', 'XX', 'XXX', 'XL', 'L', 'LX', 'LXX', 'LXXX', 'XC'];
    const ones = ['', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX'];

    return thousands[Math.floor(num / 1000)] +
        hundreds[Math.floor((num % 1000) / 100)] +
        tens[Math.floor((num % 100) / 10)] +
        ones[num % 10];
}

// Validate Roman numeral
function isValidRoman(roman) {
    const pattern = /^M{0,3}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/;
    return pattern.test(roman);
}

// Test cases
console.log("=== Roman to Integer ===");
console.log(romanToInt("III")); // 3
console.log(romanToInt("IV")); // 4
console.log(romanToInt("LVIII")); // 58
console.log(romanToInt("MCMXCIV")); // 1994

console.log("\n=== Integer to Roman ===");
console.log(intToRoman(3)); // "III"
console.log(intToRoman(4)); // "IV"
console.log(intToRoman(58)); // "LVIII"
console.log(intToRoman(1994)); // "MCMXCIV"

console.log("\n=== Validation ===");
console.log(isValidRoman("MCMXCIV")); // true
console.log(isValidRoman("IIII")); // false

console.log("\n=== Round Trip ===");
const testNum = 1994;
const roman = intToRoman(testNum);
const back = romanToInt(roman);
console.log(`${testNum} -> ${roman} -> ${back}`);

/**
 * Time Complexity: O(1) - bounded by max value (3999)
 * Space Complexity: O(1)
 */
