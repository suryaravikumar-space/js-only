/**
 * REGULAR EXPRESSIONS: 03 - The exec() Method
 *
 * ONE CONCEPT: Using regex.exec() to get detailed match information
 */


// ═══════════════════════════════════════════════════════════════════════════
// THE exec() METHOD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * regex.exec(string)
 *
 * Returns: Array with match details, or null if no match
 *
 * Question it answers: "WHERE is the match and WHAT did it capture?"
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   /(\d+)-(\d+)/.exec("Call 555-1234 now")
 *
 *   ┌───────────────────────────────────────────────────────────────────────┐
 *   │  ENGINE EXECUTION                                                     │
 *   ├───────────────────────────────────────────────────────────────────────┤
 *   │                                                                       │
 *   │  Input:  "Call 555-1234 now"                                          │
 *   │  Pattern: /(\d+)-(\d+)/                                               │
 *   │           ──────  ──────                                              │
 *   │           Group1  Group2                                              │
 *   │                                                                       │
 *   │  1. Search for pattern start...                                       │
 *   │     Position 5: '5' matches \d ✓                                      │
 *   │                                                                       │
 *   │  2. Match full pattern:                                               │
 *   │     "555" matches (\d+)  → captured in Group 1                        │
 *   │     "-"   matches -      → literal match                              │
 *   │     "1234" matches (\d+) → captured in Group 2                        │
 *   │                                                                       │
 *   │  3. Build result array:                                               │
 *   │                                                                       │
 *   │     ┌─────────────────────────────────────────────────────────────┐   │
 *   │     │  Result Array                                               │   │
 *   │     ├─────────────────────────────────────────────────────────────┤   │
 *   │     │  [0]: "555-1234"     ← Full match                           │   │
 *   │     │  [1]: "555"          ← Capture group 1                      │   │
 *   │     │  [2]: "1234"         ← Capture group 2                      │   │
 *   │     │                                                             │   │
 *   │     │  index: 5            ← Where match started                  │   │
 *   │     │  input: "Call..."    ← Original string                      │   │
 *   │     │  groups: undefined   ← Named groups (if any)                │   │
 *   │     └─────────────────────────────────────────────────────────────┘   │
 *   │                                                                       │
 *   └───────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// BASIC USAGE
// ═══════════════════════════════════════════════════════════════════════════

const phonePattern = /(\d+)-(\d+)/;
const text = "Call 555-1234 now";

const result = phonePattern.exec(text);

console.log('--- exec() Result ---');
console.log('Full result:', result);
console.log('');
console.log('Match [0]:', result[0]);      // "555-1234" (full match)
console.log('Group 1 [1]:', result[1]);    // "555"
console.log('Group 2 [2]:', result[2]);    // "1234"
console.log('Index:', result.index);        // 5
console.log('Input:', result.input);        // "Call 555-1234 now"


// ═══════════════════════════════════════════════════════════════════════════
// WHEN NO MATCH: Returns null
// ═══════════════════════════════════════════════════════════════════════════

const noMatch = /xyz/.exec("abc");
console.log('\n--- No Match ---');
console.log('Result:', noMatch);  // null

// Always check for null before accessing properties!
if (noMatch === null) {
  console.log('Pattern not found');
}


// ═══════════════════════════════════════════════════════════════════════════
// FINDING ALL MATCHES (with 'g' flag)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * With 'g' flag, call exec() repeatedly to get all matches
 */

const findAllNumbers = /\d+/g;
const sentence = "I have 3 cats, 2 dogs, and 15 fish";

console.log('\n--- Finding All Matches ---');

let match;
while ((match = findAllNumbers.exec(sentence)) !== null) {
  console.log(`Found "${match[0]}" at position ${match.index}`);
}

/**
 * HOW THIS WORKS:
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  With 'g' flag, lastIndex updates after each exec()       │
 *   ├────────────────────────────────────────────────────────────┤
 *   │                                                            │
 *   │  Call 1: lastIndex = 0                                     │
 *   │          Finds "3" at index 7                              │
 *   │          Sets lastIndex = 8                                │
 *   │                                                            │
 *   │  Call 2: Starts at index 8                                 │
 *   │          Finds "2" at index 15                             │
 *   │          Sets lastIndex = 16                               │
 *   │                                                            │
 *   │  Call 3: Starts at index 16                                │
 *   │          Finds "15" at index 26                            │
 *   │          Sets lastIndex = 28                               │
 *   │                                                            │
 *   │  Call 4: Starts at index 28                                │
 *   │          No more matches → returns null                    │
 *   │          Resets lastIndex = 0                              │
 *   │                                                            │
 *   └────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════
// PRACTICAL: Extracting Data
// ═══════════════════════════════════════════════════════════════════════════

function parseDate(dateString) {
  const pattern = /(\d{4})-(\d{2})-(\d{2})/;
  const result = pattern.exec(dateString);

  if (!result) return null;

  return {
    full: result[0],
    year: result[1],
    month: result[2],
    day: result[3]
  };
}

console.log('\n--- Parsing Date ---');
console.log(parseDate("2024-12-25"));
console.log(parseDate("invalid"));


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "What's the difference between test() and exec()?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "test() and exec() serve different purposes.
 *
 * test() is simple - it just returns true or false. You use it when
 * you only need to know IF a pattern exists. It's great for validation.
 *
 * exec() is more detailed - it returns an array with the full match,
 * all capture groups, the index where the match was found, and the
 * original input. You use it when you need to EXTRACT data from the
 * string, not just check if it matches.
 *
 * For example, if I'm parsing a phone number like '555-1234', exec()
 * gives me the area code in one group and the number in another.
 * The result array has the full match at index 0, and each capture
 * group at subsequent indices.
 *
 * With the global flag, exec() is stateful - it remembers where it
 * stopped via lastIndex, so you can call it in a loop to find all
 * matches. Each call returns the next match until there are no more,
 * then it returns null.
 *
 * If there's no match at all, exec() returns null, so you always
 * need to check for that before accessing the result."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ test() → true/false, exec() → array or null
 * ✓ exec() gives: full match, groups, index, input
 * ✓ With 'g' flag, exec() finds multiple matches in loop
 * ✓ Returns null when no match (always check!)
 *
 */


// RUN: node docs/25-regular-expressions/03-exec-method.js
