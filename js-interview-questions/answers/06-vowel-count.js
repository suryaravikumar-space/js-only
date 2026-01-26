/**
 * Answer 6: Count Vowels in a String
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Loop
function countVowels(str) {
    const vowels = 'aeiouAEIOU';
    let count = 0;

    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }

    return count;
}

// Approach 2: Using Regex
function countVowelsRegex(str) {
    const matches = str.match(/[aeiou]/gi);
    return matches ? matches.length : 0;
}

// Approach 3: Using Filter
function countVowelsFilter(str) {
    const vowels = new Set(['a', 'e', 'i', 'o', 'u']);
    return str.toLowerCase().split('').filter(char => vowels.has(char)).length;
}

// Approach 4: Using Reduce
function countVowelsReduce(str) {
    const vowels = 'aeiou';
    return str.toLowerCase().split('').reduce((count, char) => {
        return vowels.includes(char) ? count + 1 : count;
    }, 0);
}

// Approach 5: Get vowel positions
function getVowelInfo(str) {
    const vowels = 'aeiouAEIOU';
    const positions = [];
    const vowelCount = {};

    for (let i = 0; i < str.length; i++) {
        if (vowels.includes(str[i])) {
            positions.push({ char: str[i], index: i });
            const lower = str[i].toLowerCase();
            vowelCount[lower] = (vowelCount[lower] || 0) + 1;
        }
    }

    return { total: positions.length, positions, breakdown: vowelCount };
}

// Test cases
console.log("=== Loop Method ===");
console.log(countVowels("hello")); // 2
console.log(countVowels("JavaScript")); // 3

console.log("\n=== Regex Method ===");
console.log(countVowelsRegex("rhythm")); // 0
console.log(countVowelsRegex("AEIOU")); // 5

console.log("\n=== Detailed Info ===");
console.log(getVowelInfo("JavaScript"));
// { total: 3, positions: [...], breakdown: { a: 2, i: 1 } }

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity:
 * - Loop/Reduce: O(1)
 * - Regex/Filter: O(n) for matches array
 */
