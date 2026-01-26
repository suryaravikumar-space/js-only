/**
 * Answer 43: Longest Substring Without Repeating Characters
 *
 * Sliding window technique:
 */

// Approach 1: Sliding Window with Set
function lengthOfLongestSubstring(str) {
    const seen = new Set();
    let maxLength = 0;
    let left = 0;

    for (let right = 0; right < str.length; right++) {
        while (seen.has(str[right])) {
            seen.delete(str[left]);
            left++;
        }

        seen.add(str[right]);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Approach 2: Using Map (more efficient)
function lengthOfLongestSubstringMap(str) {
    const charIndex = new Map();
    let maxLength = 0;
    let left = 0;

    for (let right = 0; right < str.length; right++) {
        if (charIndex.has(str[right]) && charIndex.get(str[right]) >= left) {
            left = charIndex.get(str[right]) + 1;
        }

        charIndex.set(str[right], right);
        maxLength = Math.max(maxLength, right - left + 1);
    }

    return maxLength;
}

// Approach 3: Return the actual substring
function longestSubstring(str) {
    const charIndex = new Map();
    let maxLength = 0;
    let start = 0;
    let maxStart = 0;

    for (let end = 0; end < str.length; end++) {
        if (charIndex.has(str[end]) && charIndex.get(str[end]) >= start) {
            start = charIndex.get(str[end]) + 1;
        }

        charIndex.set(str[end], end);

        if (end - start + 1 > maxLength) {
            maxLength = end - start + 1;
            maxStart = start;
        }
    }

    return {
        length: maxLength,
        substring: str.slice(maxStart, maxStart + maxLength)
    };
}

// Approach 4: Brute Force (for understanding)
function lengthOfLongestSubstringBrute(str) {
    let maxLength = 0;

    for (let i = 0; i < str.length; i++) {
        const seen = new Set();

        for (let j = i; j < str.length; j++) {
            if (seen.has(str[j])) break;
            seen.add(str[j]);
            maxLength = Math.max(maxLength, j - i + 1);
        }
    }

    return maxLength;
}

// Approach 5: Find all unique substrings
function findAllUniqueSubstrings(str) {
    const result = [];

    for (let i = 0; i < str.length; i++) {
        const seen = new Set();
        let substring = '';

        for (let j = i; j < str.length; j++) {
            if (seen.has(str[j])) break;
            seen.add(str[j]);
            substring += str[j];
            result.push(substring);
        }
    }

    return [...new Set(result)];
}

// Test cases
console.log("=== Sliding Window ===");
console.log(lengthOfLongestSubstring("abcabcbb")); // 3
console.log(lengthOfLongestSubstring("bbbbb")); // 1
console.log(lengthOfLongestSubstring("pwwkew")); // 3
console.log(lengthOfLongestSubstring("")); // 0

console.log("\n=== With Substring ===");
console.log(longestSubstring("abcabcbb")); // { length: 3, substring: "abc" }
console.log(longestSubstring("pwwkew")); // { length: 3, substring: "wke" }

console.log("\n=== All Unique Substrings ===");
console.log(findAllUniqueSubstrings("abc"));
// ["a", "ab", "abc", "b", "bc", "c"]

console.log("\n=== Edge Cases ===");
console.log(lengthOfLongestSubstring(" ")); // 1
console.log(lengthOfLongestSubstring("au")); // 2
console.log(lengthOfLongestSubstring("dvdf")); // 3

/**
 * Time Complexity:
 * - Sliding Window: O(n)
 * - Brute Force: O(n³)
 *
 * Space Complexity: O(min(n, m)) where m is charset size
 */
