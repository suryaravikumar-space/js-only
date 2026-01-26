/**
 * Answer 2: Anagram Check
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Sorting Method
function isAnagram(str1, str2) {
    const clean = str => str.toLowerCase().replace(/[^a-z]/g, '').split('').sort().join('');
    return clean(str1) === clean(str2);
}

// Approach 2: Character Count with Object (More Efficient)
function isAnagramCharCount(str1, str2) {
    const clean1 = str1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = str2.toLowerCase().replace(/[^a-z]/g, '');

    if (clean1.length !== clean2.length) return false;

    const charCount = {};

    for (let char of clean1) {
        charCount[char] = (charCount[char] || 0) + 1;
    }

    for (let char of clean2) {
        if (!charCount[char]) return false;
        charCount[char]--;
    }

    return true;
}

// Approach 3: Using Map
function isAnagramMap(str1, str2) {
    const clean1 = str1.toLowerCase().replace(/[^a-z]/g, '');
    const clean2 = str2.toLowerCase().replace(/[^a-z]/g, '');

    if (clean1.length !== clean2.length) return false;

    const map = new Map();

    for (let char of clean1) {
        map.set(char, (map.get(char) || 0) + 1);
    }

    for (let char of clean2) {
        if (!map.get(char)) return false;
        map.set(char, map.get(char) - 1);
    }

    return true;
}

// Test cases
console.log("=== Approach 1: Sorting ===");
console.log(isAnagram("listen", "silent")); // true
console.log(isAnagram("triangle", "integral")); // true
console.log(isAnagram("hello", "world")); // false

console.log("\n=== Approach 2: Character Count ===");
console.log(isAnagramCharCount("Dormitory", "Dirty room")); // true
console.log(isAnagramCharCount("hello", "world")); // false

console.log("\n=== Approach 3: Using Map ===");
console.log(isAnagramMap("listen", "silent")); // true

/**
 * Time Complexity:
 * - Approach 1: O(n log n) - due to sorting
 * - Approach 2: O(n) - single pass through both strings
 * - Approach 3: O(n) - single pass through both strings
 *
 * Space Complexity:
 * - Approach 1: O(n) - sorted arrays
 * - Approach 2: O(1) - max 26 characters in object
 * - Approach 3: O(1) - max 26 characters in map
 */
