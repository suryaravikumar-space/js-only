/**
 * Answer 7: Capitalize First Letter of Each Word
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Split and Map
function capitalizeWords(str) {
    return str
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
}

// Approach 2: Using Regex
function capitalizeWordsRegex(str) {
    return str.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
}

// Approach 3: Manual Loop
function capitalizeWordsLoop(str) {
    let result = '';
    let capitalizeNext = true;

    for (let char of str) {
        if (char === ' ') {
            result += char;
            capitalizeNext = true;
        } else if (capitalizeNext) {
            result += char.toUpperCase();
            capitalizeNext = false;
        } else {
            result += char.toLowerCase();
        }
    }

    return result;
}

// Approach 4: Title Case with exceptions (advanced)
function titleCase(str, exceptions = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at']) {
    return str
        .toLowerCase()
        .split(' ')
        .map((word, index) => {
            if (index === 0 || !exceptions.includes(word)) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }
            return word;
        })
        .join(' ');
}

// Approach 5: Preserve original spacing
function capitalizeWordsPreserveSpace(str) {
    return str.replace(/\b\w+/g, word =>
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    );
}

// Test cases
console.log("=== Split and Map ===");
console.log(capitalizeWords("hello world")); // "Hello World"
console.log(capitalizeWords("javascript is awesome")); // "Javascript Is Awesome"

console.log("\n=== Regex Method ===");
console.log(capitalizeWordsRegex("i love coding")); // "I Love Coding"

console.log("\n=== Title Case with Exceptions ===");
console.log(titleCase("the quick brown fox and the lazy dog"));
// "The Quick Brown Fox and the Lazy Dog"

console.log("\n=== Preserve Multiple Spaces ===");
console.log(capitalizeWordsPreserveSpace("hello    world")); // "Hello    World"

/**
 * Time Complexity: O(n) for all approaches
 * Space Complexity: O(n) - new string created
 */
