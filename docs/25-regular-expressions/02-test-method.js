/**
 * REGULAR EXPRESSIONS: 02 - The test() Method
 *
 * ONE CONCEPT: Using regex.test() to check if pattern exists
 */


// ═══════════════════════════════════════════════════════════════════════════
// THE test() METHOD
// ═══════════════════════════════════════════════════════════════════════════

/**
 * regex.test(string)
 *
 * Returns: true or false
 *
 * Question it answers: "Does this string contain the pattern?"
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 *   /cat/.test("I have a cat")
 *
 *   ┌──────────────────────────────────────────────────────────────────────┐
 *   │  ENGINE EXECUTION                                                    │
 *   ├──────────────────────────────────────────────────────────────────────┤
 *   │                                                                      │
 *   │  Input:  "I have a cat"                                              │
 *   │  Pattern: /cat/                                                      │
 *   │                                                                      │
 *   │  Step 1: Start at position 0 ("I")                                   │
 *   │          Try matching 'c' → 'I' ≠ 'c' → FAIL                         │
 *   │          Move to next position                                       │
 *   │                                                                      │
 *   │  Step 2: Position 1 (" ")                                            │
 *   │          Try matching 'c' → ' ' ≠ 'c' → FAIL                         │
 *   │          Move to next position                                       │
 *   │                                                                      │
 *   │  ... continues until ...                                             │
 *   │                                                                      │
 *   │  Step 10: Position 9 ("c")                                           │
 *   │          Try matching 'c' → 'c' = 'c' → OK                           │
 *   │          Try matching 'a' → 'a' = 'a' → OK                           │
 *   │          Try matching 't' → 't' = 't' → OK                           │
 *   │                                                                      │
 *   │  ✓ MATCH FOUND → return true                                         │
 *   │                                                                      │
 *   │  (Engine stops immediately after first match)                        │
 *   │                                                                      │
 *   └──────────────────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// BASIC USAGE
// ═══════════════════════════════════════════════════════════════════════════

const hasNumber = /\d/;  // \d = any digit

console.log('--- Basic test() ---');
console.log('/\\d/.test("abc123"):', hasNumber.test("abc123"));  // true
console.log('/\\d/.test("abcdef"):', hasNumber.test("abcdef"));  // false


// ═══════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

function validatePassword(password) {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasMinLength = password.length >= 8;

  return {
    valid: hasUppercase && hasLowercase && hasNumber && hasMinLength,
    checks: { hasUppercase, hasLowercase, hasNumber, hasMinLength }
  };
}

console.log('\n--- Password Validation ---');
console.log('Password "abc":', validatePassword('abc'));
console.log('Password "Abc12345":', validatePassword('Abc12345'));


// ═══════════════════════════════════════════════════════════════════════════
// ⚠️ GOTCHA: test() with 'g' flag
// ═══════════════════════════════════════════════════════════════════════════

/**
 * WARNING: test() with global flag (g) updates lastIndex!
 *
 * This can cause unexpected behavior when testing same string multiple times.
 */

const globalRegex = /a/g;  // Global flag

console.log('\n--- GOTCHA: Global flag ---');
console.log('Test 1:', globalRegex.test("abc"));  // true, lastIndex = 1
console.log('lastIndex:', globalRegex.lastIndex);

console.log('Test 2:', globalRegex.test("abc"));  // false! lastIndex = 0
console.log('lastIndex:', globalRegex.lastIndex);

console.log('Test 3:', globalRegex.test("abc"));  // true again!

/**
 * WHY THIS HAPPENS:
 *
 *   ┌────────────────────────────────────────────────────────────┐
 *   │  With 'g' flag, regex remembers where it stopped          │
 *   ├────────────────────────────────────────────────────────────┤
 *   │                                                            │
 *   │  Test 1: Starts at 0, finds 'a' at 0, lastIndex → 1        │
 *   │  Test 2: Starts at 1, no 'a' after position 1 → false      │
 *   │          lastIndex resets → 0                              │
 *   │  Test 3: Starts at 0 again, finds 'a' → true               │
 *   │                                                            │
 *   └────────────────────────────────────────────────────────────┘
 *
 * SOLUTION: Don't use 'g' flag with test() for repeated validation
 */

const safeRegex = /a/;  // No 'g' flag
console.log('\n--- Safe (no global flag) ---');
console.log('Test 1:', safeRegex.test("abc"));  // true
console.log('Test 2:', safeRegex.test("abc"));  // true (consistent!)


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "How does the test() method work?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "The test() method is the simplest regex method. You call it on a
 * regex and pass a string, and it returns true if the pattern exists
 * anywhere in the string, false otherwise.
 *
 * Under the hood, the engine starts at position 0 and tries to match
 * the pattern. If it fails, it moves to position 1 and tries again,
 * continuing through the string. As soon as it finds one match, it
 * returns true immediately - it doesn't keep searching.
 *
 * One important gotcha: if you use the global flag 'g' with test(),
 * the regex remembers its lastIndex position between calls. This can
 * cause test() to return different results for the same string on
 * consecutive calls. For simple validation, I avoid the global flag
 * with test() to keep behavior consistent.
 *
 * I typically use test() for validation - checking if an email has
 * an @ symbol, if a password contains a number, things like that."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Returns true/false
 * ✓ Checks if pattern exists anywhere in string
 * ✓ Stops at first match (efficient)
 * ✓ Gotcha: 'g' flag updates lastIndex between calls
 *
 */


// RUN: node docs/25-regular-expressions/02-test-method.js
