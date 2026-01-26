/**
 * Answer 8: Find the Longest Word in a String
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Split and Loop
function findLongestWord(str) {
    const words = str.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(w => w);
    let longest = '';

    for (let word of words) {
        if (word.length > longest.length) {
            longest = word;
        }
    }

    return longest;
}

// Approach 2: Using Reduce
function findLongestWordReduce(str) {
    const words = str.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(w => w);
    return words.reduce((longest, word) =>
        word.length > longest.length ? word : longest, ''
    );
}

// Approach 3: Using Sort
function findLongestWordSort(str) {
    const words = str.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(w => w);
    return words.sort((a, b) => b.length - a.length)[0];
}

// Approach 4: Find All Longest Words (handles ties)
function findAllLongestWords(str) {
    const words = str.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(w => w);
    const maxLength = Math.max(...words.map(w => w.length));
    return words.filter(w => w.length === maxLength);
}

// Approach 5: Return with length info
function longestWordInfo(str) {
    const words = str.replace(/[^a-zA-Z\s]/g, '').split(' ').filter(w => w);
    const longest = words.reduce((a, b) => a.length >= b.length ? a : b, '');
    return {
        word: longest,
        length: longest.length,
        position: words.indexOf(longest)
    };
}

// Test cases
console.log("=== Basic ===");
console.log(findLongestWord("The quick brown fox")); // "quick"
console.log(findLongestWord("I love JavaScript programming")); // "programming"

console.log("\n=== Using Reduce ===");
console.log(findLongestWordReduce("Hello, world!")); // "Hello" or "world"

console.log("\n=== All Longest Words ===");
console.log(findAllLongestWords("The quick brown fox jumps")); // ["quick", "brown", "jumps"]

console.log("\n=== With Info ===");
console.log(longestWordInfo("I love JavaScript"));
// { word: "JavaScript", length: 10, position: 2 }

/**
 * Time Complexity:
 * - Loop/Reduce: O(n)
 * - Sort: O(n log n)
 *
 * Space Complexity: O(n) for words array
 */
