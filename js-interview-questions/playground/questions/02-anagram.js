/**
 * Question 2: Anagram Check
 *
 * An anagram is a word formed by rearranging the letters of another word,
 * using all the original letters exactly once.
 *
 * Examples:
 * - "listen" and "silent" -> true
 * - "triangle" and "integral" -> true
 * - "hello" and "world" -> false
 *
 * Task: Write a function to check if two strings are anagrams of each other.
 *
 * Constraints:
 * - Consider case-insensitivity
 * - Ignore spaces
 */



function isAnagram(str1, str2) {
    // Your solution here
    const cs1 = str1.toLowerCase().replace(/[^a-z0-9]/g, "")
    const cs2 = str2.toLowerCase().replace(/[^a-z0-9]/g, "")

    if(cs1.length !== cs2.length) return false;
   
    const map = new Map();

    for(let char of cs1){
       map.set(char, (map.get(char) || 0) + 1);
    }
    for (const char of cs2) {
        if(!map.get(char)) return false;
        map.set(char, (map.get(char)) -1 )
    }
    return true;
}

// Test cases
console.log(isAnagram("listen listen", "silent")); // true
console.log(isAnagram("triangle", "integral")); // true
console.log(isAnagram("hello", "world")); // false
console.log(isAnagram("Dormitory", "Dirty room")); // true
