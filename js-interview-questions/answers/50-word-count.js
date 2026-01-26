/**
 * Answer 50: Word/Text Analysis
 *
 * Common text processing problems:
 */

// Helper: Clean and split text into words
function getWords(text) {
    return text.toLowerCase()
        .replace(/[^a-z0-9\s]/gi, '')
        .split(/\s+/)
        .filter(word => word.length > 0);
}

// Count total words
function wordCount(text) {
    return getWords(text).length;
}

// Count unique words
function uniqueWords(text) {
    return new Set(getWords(text)).size;
}

// Get unique words array
function getUniqueWords(text) {
    return [...new Set(getWords(text))];
}

// Word frequency map
function wordFrequency(text) {
    const words = getWords(text);
    const frequency = {};

    words.forEach(word => {
        frequency[word] = (frequency[word] || 0) + 1;
    });

    return frequency;
}

// Most frequent words
function mostFrequentWords(text, n = 10) {
    const frequency = wordFrequency(text);

    return Object.entries(frequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, n);
}

// Least frequent words
function leastFrequentWords(text, n = 10) {
    const frequency = wordFrequency(text);

    return Object.entries(frequency)
        .sort((a, b) => a[1] - b[1])
        .slice(0, n);
}

// Character frequency
function charFrequency(text, ignoreSpaces = true) {
    const chars = ignoreSpaces
        ? text.toLowerCase().replace(/\s/g, '')
        : text.toLowerCase();

    const frequency = {};
    for (let char of chars) {
        frequency[char] = (frequency[char] || 0) + 1;
    }

    return frequency;
}

// Comprehensive text statistics
function textStats(text) {
    const words = getWords(text);
    const chars = text.replace(/\s/g, '');
    const sentences = text.split(/[.!?]+/).filter(s => s.trim());
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim());
    const frequency = wordFrequency(text);

    return {
        characters: text.length,
        charactersNoSpaces: chars.length,
        words: words.length,
        uniqueWords: new Set(words).size,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        averageWordLength: words.length > 0
            ? (words.reduce((sum, w) => sum + w.length, 0) / words.length).toFixed(2)
            : 0,
        longestWord: words.reduce((a, b) => a.length >= b.length ? a : b, ''),
        shortestWord: words.reduce((a, b) => a.length <= b.length ? a : b, ''),
        mostCommon: Object.entries(frequency)
            .sort((a, b) => b[1] - a[1])[0]
    };
}

// Find words starting with specific letter
function wordsStartingWith(text, letter) {
    return getUniqueWords(text).filter(word =>
        word.startsWith(letter.toLowerCase())
    );
}

// Find words of specific length
function wordsOfLength(text, length) {
    return getUniqueWords(text).filter(word => word.length === length);
}

// Search word in text
function searchWord(text, word) {
    const words = getWords(text);
    const searchTerm = word.toLowerCase();
    const indices = [];

    words.forEach((w, i) => {
        if (w === searchTerm) indices.push(i);
    });

    return {
        found: indices.length > 0,
        count: indices.length,
        positions: indices
    };
}

// Test cases
const text = "The quick brown fox jumps over the lazy dog. The fox is quick!";

console.log("=== Basic Counts ===");
console.log("Word count:", wordCount(text)); // 13
console.log("Unique words:", uniqueWords(text)); // 10

console.log("\n=== Frequency ===");
console.log(wordFrequency(text));

console.log("\n=== Most Frequent ===");
console.log(mostFrequentWords(text, 3));
// [["the", 3], ["quick", 2], ["fox", 2]]

console.log("\n=== Full Statistics ===");
console.log(textStats(text));

console.log("\n=== Words Starting With 'q' ===");
console.log(wordsStartingWith(text, 'q')); // ["quick"]

console.log("\n=== Words of Length 3 ===");
console.log(wordsOfLength(text, 3)); // ["the", "fox", "dog"]

console.log("\n=== Search Word ===");
console.log(searchWord(text, "fox"));
// { found: true, count: 2, positions: [3, 10] }

/**
 * Time Complexity: O(n) for most operations
 * Space Complexity: O(n) for storing words/frequency
 */
