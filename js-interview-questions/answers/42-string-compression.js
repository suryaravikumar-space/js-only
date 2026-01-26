/**
 * Answer 42: String Compression
 *
 * Multiple approaches to solve this problem:
 */

// Approach 1: Using Loop
function compressString(str) {
    if (str.length === 0) return str;

    let compressed = '';
    let count = 1;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1]) {
            count++;
        } else {
            compressed += str[i] + count;
            count = 1;
        }
    }

    return compressed.length < str.length ? compressed : str;
}

// Approach 2: Using Regex
function compressStringRegex(str) {
    const compressed = str.replace(/(.)\1*/g, (match, char) => {
        return char + match.length;
    });

    return compressed.length < str.length ? compressed : str;
}

// Approach 3: Array-based
function compressStringArray(str) {
    if (str.length === 0) return str;

    const result = [];
    let count = 1;

    for (let i = 1; i <= str.length; i++) {
        if (str[i] === str[i - 1]) {
            count++;
        } else {
            result.push(str[i - 1], count);
            count = 1;
        }
    }

    const compressed = result.join('');
    return compressed.length < str.length ? compressed : str;
}

// Approach 4: Decompress
function decompressString(str) {
    return str.replace(/(\D)(\d+)/g, (_, char, count) => {
        return char.repeat(parseInt(count));
    });
}

// Approach 5: Run-length encoding (advanced)
function runLengthEncode(str) {
    const encoded = [];
    let i = 0;

    while (i < str.length) {
        let count = 1;
        while (str[i] === str[i + 1]) {
            count++;
            i++;
        }
        encoded.push({ char: str[i], count });
        i++;
    }

    return encoded;
}

function runLengthDecode(encoded) {
    return encoded.map(({ char, count }) => char.repeat(count)).join('');
}

// Approach 6: With max count limit
function compressWithLimit(str, maxCount = 9) {
    if (str.length === 0) return str;

    let compressed = '';
    let count = 1;

    for (let i = 0; i < str.length; i++) {
        if (str[i] === str[i + 1] && count < maxCount) {
            count++;
        } else {
            compressed += str[i] + count;
            count = 1;
        }
    }

    return compressed.length < str.length ? compressed : str;
}

// Test cases
console.log("=== Basic Compression ===");
console.log(compressString("aabcccccaaa")); // "a2b1c5a3"
console.log(compressString("abcd")); // "abcd"
console.log(compressString("aaa")); // "a3"

console.log("\n=== Regex Method ===");
console.log(compressStringRegex("aaabbbccc")); // "a3b3c3"

console.log("\n=== Decompress ===");
console.log(decompressString("a2b1c5a3")); // "aabcccccaaa"

console.log("\n=== Run-length Encoding ===");
const encoded = runLengthEncode("aaabbbcc");
console.log(encoded);
// [{ char: 'a', count: 3 }, { char: 'b', count: 3 }, { char: 'c', count: 2 }]
console.log(runLengthDecode(encoded)); // "aaabbbcc"

console.log("\n=== Edge Cases ===");
console.log(compressString("")); // ""
console.log(compressString("a")); // "a"

/**
 * Time Complexity: O(n)
 * Space Complexity: O(n) for compressed string
 */
