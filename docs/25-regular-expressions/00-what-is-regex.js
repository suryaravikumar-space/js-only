/**
 * REGULAR EXPRESSIONS: 00 - What is a Regular Expression?
 *
 * ONE CONCEPT: Understanding what regex is and why it exists
 */


// ═══════════════════════════════════════════════════════════════════════════
// WHAT IS A REGULAR EXPRESSION?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * A Regular Expression (regex) is a PATTERN used to match text.
 *
 * Think of it like a search query with superpowers.
 *
 *
 * SIMPLE ANALOGY:
 * ───────────────
 *
 *   Normal search:  "cat"     → finds exactly "cat"
 *
 *   Regex search:   /c.t/     → finds "cat", "cot", "cut", "c@t", etc.
 *                              (the dot means "any character")
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * When you write:
 *
 *   const regex = /hello/;
 *
 *
 * The JavaScript engine creates a RegExp object internally:
 *
 *   ┌─────────────────────────────────────────────────────────┐
 *   │  RegExp Object                                          │
 *   ├─────────────────────────────────────────────────────────┤
 *   │                                                         │
 *   │  [[RegExpMatcher]]: Internal matching algorithm         │
 *   │                                                         │
 *   │  source: "hello"        ← the pattern string            │
 *   │  flags: ""              ← modifiers (g, i, m, etc.)     │
 *   │  lastIndex: 0           ← position for next match       │
 *   │                                                         │
 *   │  Methods:                                               │
 *   │    • test()   → returns true/false                      │
 *   │    • exec()   → returns match details or null           │
 *   │                                                         │
 *   └─────────────────────────────────────────────────────────┘
 *
 *
 * The engine compiles the pattern into a STATE MACHINE:
 *
 *   Pattern: /cat/
 *
 *   ┌───────┐  'c'   ┌───────┐  'a'   ┌───────┐  't'   ┌─────────┐
 *   │ START │ ────▶  │ State1│ ────▶  │ State2│ ────▶  │ MATCH!  │
 *   └───────┘        └───────┘        └───────┘        └─────────┘
 *        │                │                │
 *        │ (other)        │ (other)        │ (other)
 *        ▼                ▼                ▼
 *     [FAIL]           [FAIL]           [FAIL]
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// BASIC EXAMPLE
// ═══════════════════════════════════════════════════════════════════════════

const pattern = /JavaScript/;
const text = "I love JavaScript programming";

console.log('Pattern:', pattern);
console.log('Text:', text);
console.log('Match found?', pattern.test(text));  // true


// ═══════════════════════════════════════════════════════════════════════════
// WHY USE REGEX?
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WITHOUT regex - checking if string contains email:
 */

function hasEmailWithoutRegex(str) {
  // Need to check for @, then domain, then extension...
  // Very complex and error-prone!
  return str.includes('@') &&
         str.includes('.') &&
         str.indexOf('@') < str.lastIndexOf('.');
}

/**
 * WITH regex - same check:
 */

function hasEmailWithRegex(str) {
  return /\S+@\S+\.\S+/.test(str);
  // \S+ = one or more non-space characters
}

console.log('\n--- Email Check ---');
console.log('Without regex:', hasEmailWithoutRegex('contact me at test@email.com'));
console.log('With regex:', hasEmailWithRegex('contact me at test@email.com'));


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "What is a Regular Expression in JavaScript?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "A Regular Expression, or regex, is a pattern used to match and
 * manipulate text. It's like a powerful search query.
 *
 * In JavaScript, we create regex using forward slashes, like /pattern/,
 * or using the RegExp constructor.
 *
 * When the engine sees a regex, it compiles the pattern into an
 * internal state machine. As it reads through the input string,
 * it transitions through states. If it reaches the final 'match'
 * state, we have a successful match.
 *
 * Common use cases include:
 * - Validating user input (emails, phone numbers, passwords)
 * - Searching and replacing text
 * - Parsing strings and extracting data
 *
 * The main methods are test() which returns true/false, and exec()
 * which returns match details."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Pattern matching for text
 * ✓ Two ways to create: literal /.../ or new RegExp()
 * ✓ Engine compiles to state machine
 * ✓ Use cases: validation, search, parsing
 *
 */


// RUN: node docs/25-regular-expressions/00-what-is-regex.js
