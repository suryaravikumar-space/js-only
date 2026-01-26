/**
 * Answer 9: Remove Duplicate Characters from String
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Set
function removeDuplicates(str) {
    return [...new Set(str)].join('');
}

// Approach 2: Using Loop and Object
function removeDuplicatesLoop(str) {
    const seen = {};
    let result = '';

    for (let char of str) {
        if (!seen[char]) {
            seen[char] = true;
            result += char;
        }
    }

    return result;
}

// Approach 3: Using Filter
function removeDuplicatesFilter(str) {
    return str
        .split('')
        .filter((char, index, arr) => arr.indexOf(char) === index)
        .join('');
}

// Approach 4: Using Reduce
function removeDuplicatesReduce(str) {
    return str.split('').reduce((acc, char) => {
        return acc.includes(char) ? acc : acc + char;
    }, '');
}

// Approach 5: Case-insensitive version
function removeDuplicatesCaseInsensitive(str) {
    const seen = new Set();
    let result = '';

    for (let char of str) {
        const lower = char.toLowerCase();
        if (!seen.has(lower)) {
            seen.add(lower);
            result += char;
        }
    }

    return result;
}

// Test cases
console.log("=== Using Set ===");
console.log(removeDuplicates("hello")); // "helo"
console.log(removeDuplicates("programming")); // "progamin"

console.log("\n=== Using Loop ===");
console.log(removeDuplicatesLoop("aabbcc")); // "abc"

console.log("\n=== Using Filter ===");
console.log(removeDuplicatesFilter("abcABC")); // "abcABC"

console.log("\n=== Case Insensitive ===");
console.log(removeDuplicatesCaseInsensitive("AaBbCc")); // "Abc"

/**
 * Time Complexity:
 * - Set: O(n)
 * - Loop: O(n)
 * - Filter with indexOf: O(n²)
 * - Reduce with includes: O(n²)
 *
 * Space Complexity: O(n) for all approaches
 */
