/**
 * RECURSION: 05 - String Recursion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ STRING RECURSIVE PATTERNS                                                  ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Strings are like arrays of characters.                                     ║
 * ║ Same patterns apply: head + tail or index-based.                           ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// REVERSE STRING
// ═══════════════════════════════════════════════════════════════════════════════

function reverse(str) {
  if (str.length <= 1) return str;
  return reverse(str.slice(1)) + str[0];
}

console.log('A: Reverse "hello":', reverse('hello'));  // "olleh"


// ═══════════════════════════════════════════════════════════════════════════════
// PALINDROME CHECK
// ═══════════════════════════════════════════════════════════════════════════════

function isPalindrome(str) {
  // Normalize
  str = str.toLowerCase().replace(/[^a-z0-9]/g, '');

  if (str.length <= 1) return true;
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}

console.log('\nB: isPalindrome("racecar"):', isPalindrome('racecar'));  // true
console.log('C: isPalindrome("A man a plan a canal Panama"):',
  isPalindrome('A man a plan a canal Panama'));  // true


// ═══════════════════════════════════════════════════════════════════════════════
// COUNT CHARACTER
// ═══════════════════════════════════════════════════════════════════════════════

function countChar(str, char, i = 0) {
  if (i >= str.length) return 0;
  const match = str[i] === char ? 1 : 0;
  return match + countChar(str, char, i + 1);
}

console.log('\nD: Count "l" in "hello":', countChar('hello', 'l'));  // 2


// ═══════════════════════════════════════════════════════════════════════════════
// REMOVE CHARACTER
// ═══════════════════════════════════════════════════════════════════════════════

function removeChar(str, char) {
  if (str.length === 0) return '';
  const first = str[0] === char ? '' : str[0];
  return first + removeChar(str.slice(1), char);
}

console.log('E: Remove "l" from "hello":', removeChar('hello', 'l'));  // "heo"


// ═══════════════════════════════════════════════════════════════════════════════
// PERMUTATIONS
// ═══════════════════════════════════════════════════════════════════════════════

function permutations(str) {
  if (str.length <= 1) return [str];

  const result = [];

  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    const remaining = str.slice(0, i) + str.slice(i + 1);

    for (const perm of permutations(remaining)) {
      result.push(char + perm);
    }
  }

  return result;
}

console.log('\nF: Permutations of "abc":', permutations('abc'));
// ["abc", "acb", "bac", "bca", "cab", "cba"]


// ═══════════════════════════════════════════════════════════════════════════════
// SUBSTRINGS
// ═══════════════════════════════════════════════════════════════════════════════

function substrings(str) {
  if (str.length === 0) return [''];

  const withFirst = [];
  for (let i = 1; i <= str.length; i++) {
    withFirst.push(str.slice(0, i));
  }

  return [...withFirst, ...substrings(str.slice(1))];
}

console.log('G: Substrings of "abc":', substrings('abc'));
// ["a", "ab", "abc", "b", "bc", "c", ""]


// ═══════════════════════════════════════════════════════════════════════════════
// CAPITALIZE WORDS
// ═══════════════════════════════════════════════════════════════════════════════

function capitalizeWords(str) {
  const words = str.split(' ');

  function helper(arr, i = 0) {
    if (i >= arr.length) return [];
    const word = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
    return [word, ...helper(arr, i + 1)];
  }

  return helper(words).join(' ');
}

console.log('\nH: Capitalize "hello world from js":',
  capitalizeWords('hello world from js'));
// "Hello World From Js"


// ═══════════════════════════════════════════════════════════════════════════════
// COMPRESS STRING (Run-Length Encoding)
// ═══════════════════════════════════════════════════════════════════════════════

function compress(str, i = 0) {
  if (i >= str.length) return '';

  let count = 1;
  while (i + count < str.length && str[i] === str[i + count]) {
    count++;
  }

  const encoded = count > 1 ? str[i] + count : str[i];
  return encoded + compress(str, i + count);
}

console.log('I: Compress "aaabbbccccaa":', compress('aaabbbccccaa'));
// "a3b3c4a2"


// ═══════════════════════════════════════════════════════════════════════════════
// DECODE STRING
// ═══════════════════════════════════════════════════════════════════════════════

function decode(str) {
  // Decode patterns like "3[ab]" → "ababab"

  function helper(s, i = 0) {
    let result = '';

    while (i < s.length) {
      if (s[i] >= '0' && s[i] <= '9') {
        // Find number
        let num = 0;
        while (s[i] >= '0' && s[i] <= '9') {
          num = num * 10 + parseInt(s[i]);
          i++;
        }

        // Find matching bracket
        i++; // skip '['
        const start = i;
        let depth = 1;
        while (depth > 0) {
          if (s[i] === '[') depth++;
          if (s[i] === ']') depth--;
          i++;
        }

        // Recurse on inner content
        const inner = helper(s.slice(start, i - 1));
        result += inner.repeat(num);
      } else if (s[i] === ']') {
        return result;
      } else {
        result += s[i];
        i++;
      }
    }

    return result;
  }

  return helper(str);
}

console.log('\nJ: Decode "3[a2[b]]":', decode('3[a2[b]]'));  // "abbabbabb"


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Common string recursion patterns:                                           │
 * │ • Reverse: base case empty/single char, build from end                      │
 * │ • Palindrome: compare first/last, recurse on middle                         │
 * │ • Permutations: pick each char, permute rest, combine                       │
 * │ • Substrings: all prefixes of current + recurse on rest                     │
 * │                                                                             │
 * │ Remember:                                                                   │
 * │ • Strings are immutable - slice creates new string                          │
 * │ • Use index-based approach for better performance                           │
 * │ • Normalize strings early (lowercase, remove special chars)                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/05-string-recursion.js
 */
