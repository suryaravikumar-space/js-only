/**
 * Answer 10: Character Frequency Counter
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Object
function charFrequency(str) {
    const freq = {};
    for (let char of str) {
        freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
}

// Approach 2: Using Reduce
function charFrequencyReduce(str) {
    return str.split('').reduce((freq, char) => {
        freq[char] = (freq[char] || 0) + 1;
        return freq;
    }, {});
}

// Approach 3: Using Map
function charFrequencyMap(str) {
    const freq = new Map();
    for (let char of str) {
        freq.set(char, (freq.get(char) || 0) + 1);
    }
    return freq;
}

// Find most frequent character
function mostFrequentChar(str) {
    const freq = charFrequency(str);
    let maxChar = '';
    let maxCount = 0;

    for (let [char, count] of Object.entries(freq)) {
        if (count > maxCount) {
            maxCount = count;
            maxChar = char;
        }
    }

    return maxChar;
}

// Find least frequent character
function leastFrequentChar(str) {
    const freq = charFrequency(str);
    let minChar = '';
    let minCount = Infinity;

    for (let [char, count] of Object.entries(freq)) {
        if (count < minCount) {
            minCount = count;
            minChar = char;
        }
    }

    return minChar;
}

// Get sorted frequency (descending)
function sortedCharFrequency(str) {
    const freq = charFrequency(str);
    return Object.entries(freq)
        .sort((a, b) => b[1] - a[1])
        .map(([char, count]) => ({ char, count }));
}

// Test cases
console.log("=== Basic Frequency ===");
console.log(charFrequency("hello")); // { h: 1, e: 1, l: 2, o: 1 }
console.log(charFrequency("aabbcc")); // { a: 2, b: 2, c: 2 }

console.log("\n=== Most Frequent ===");
console.log(mostFrequentChar("hello")); // "l"
console.log(mostFrequentChar("aabbbcc")); // "b"

console.log("\n=== Least Frequent ===");
console.log(leastFrequentChar("aabbbcc")); // "a" or "c"

console.log("\n=== Sorted Frequency ===");
console.log(sortedCharFrequency("programming"));
// [{ char: 'r', count: 2 }, { char: 'g', count: 2 }, ...]

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity: O(k) where k is number of unique characters
 */
