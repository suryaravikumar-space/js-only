/**
 * REGULAR EXPRESSIONS: 01 - Creating a Regex
 *
 * ONE CONCEPT: Two ways to create regular expressions
 */


// ═══════════════════════════════════════════════════════════════════════════
// TWO WAYS TO CREATE REGEX
// ═══════════════════════════════════════════════════════════════════════════

/**
 * METHOD 1: Literal Notation (recommended)
 *
 *   /pattern/flags
 *
 *
 * METHOD 2: Constructor Function
 *
 *   new RegExp('pattern', 'flags')
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// HOW THE ENGINE SEES IT
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LITERAL: Compiled at PARSE TIME (before code runs)
 *
 *   const regex = /hello/i;
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │  PARSE TIME (script loading)                          │
 *   ├────────────────────────────────────────────────────────┤
 *   │                                                        │
 *   │  JavaScript sees: /hello/i                             │
 *   │                                                        │
 *   │  Engine action:                                        │
 *   │    1. Recognizes regex literal                         │
 *   │    2. Compiles pattern immediately                     │
 *   │    3. Creates RegExp object                            │
 *   │    4. Stores compiled matcher                          │
 *   │                                                        │
 *   │  ✓ Fast - compiled once                                │
 *   │  ✓ Pattern checked for errors at parse time            │
 *   │  ✗ Pattern cannot change                               │
 *   │                                                        │
 *   └────────────────────────────────────────────────────────┘
 *
 *
 * CONSTRUCTOR: Compiled at RUNTIME (when code executes)
 *
 *   const regex = new RegExp('hello', 'i');
 *
 *   ┌────────────────────────────────────────────────────────┐
 *   │  RUNTIME (code execution)                             │
 *   ├────────────────────────────────────────────────────────┤
 *   │                                                        │
 *   │  JavaScript sees: new RegExp('hello', 'i')             │
 *   │                                                        │
 *   │  Engine action:                                        │
 *   │    1. Evaluates string 'hello'                         │
 *   │    2. Calls RegExp constructor                         │
 *   │    3. Compiles pattern from string                     │
 *   │    4. Creates RegExp object                            │
 *   │                                                        │
 *   │  ✓ Pattern can be dynamic (from variable)              │
 *   │  ✗ Slightly slower - compiled each time called         │
 *   │  ✗ Errors only caught at runtime                       │
 *   │                                                        │
 *   └────────────────────────────────────────────────────────┘
 *
 */


// ═══════════════════════════════════════════════════════════════════════════
// EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════

// Method 1: Literal (use when pattern is fixed)
const literal = /hello/i;

// Method 2: Constructor (use when pattern is dynamic)
const constructor = new RegExp('hello', 'i');

console.log('Literal:', literal);
console.log('Constructor:', constructor);
console.log('Both match "Hello"?', literal.test('Hello'), constructor.test('Hello'));


// ═══════════════════════════════════════════════════════════════════════════
// WHEN TO USE EACH
// ═══════════════════════════════════════════════════════════════════════════

/**
 * USE LITERAL when:
 * - Pattern is known and fixed
 * - Most common case
 */

const emailCheck = /\S+@\S+\.\S+/;  // Fixed pattern


/**
 * USE CONSTRUCTOR when:
 * - Pattern comes from user input
 * - Pattern is built dynamically
 */

function searchFor(word) {
  // Pattern built from variable
  const regex = new RegExp(word, 'gi');
  return regex;
}

console.log('\n--- Dynamic Pattern ---');
const userSearch = searchFor('test');
console.log('Dynamic regex:', userSearch);
console.log('Matches "Testing"?', userSearch.test('Testing'));


// ═══════════════════════════════════════════════════════════════════════════
// ESCAPING: KEY DIFFERENCE
// ═══════════════════════════════════════════════════════════════════════════

/**
 * LITERAL: Backslash works directly
 *
 *   /\d+/    means "one or more digits"
 *
 *
 * CONSTRUCTOR: Need double backslash!
 *
 *   new RegExp('\\d+')    means "one or more digits"
 *
 *   Why? The string processes \d first, sees unknown escape,
 *   keeps just 'd'. We need \\ to get a literal backslash.
 *
 */

console.log('\n--- Escaping Difference ---');

const literalDigits = /\d+/;
const constructorDigits = new RegExp('\\d+');  // Note: double backslash

console.log('Literal /\\d+/:', literalDigits.test('123'));
console.log('Constructor "\\\\d+":', constructorDigits.test('123'));

// WRONG way with constructor:
const wrongConstructor = new RegExp('\d+');  // \d becomes just 'd'
console.log('Wrong constructor "\\d+":', wrongConstructor);  // Shows /d+/


// ═══════════════════════════════════════════════════════════════════════════
// 🎤 INTERVIEW: What to Say (1-2 minutes)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * QUESTION: "What are the two ways to create a regex in JavaScript?"
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * YOUR ANSWER:
 *
 * "There are two ways to create a regular expression in JavaScript:
 *
 * First, the literal notation using forward slashes, like /pattern/flags.
 * This is compiled at parse time, before the code even runs.
 * The engine sees the pattern immediately and can report syntax errors
 * right away. Use this when your pattern is fixed and known.
 *
 * Second, the RegExp constructor, like new RegExp('pattern', 'flags').
 * This is compiled at runtime, when the code executes.
 * Use this when you need a dynamic pattern, like when the search term
 * comes from user input.
 *
 * One important difference: with the constructor, you need to
 * double-escape backslashes. So \\d in a literal becomes \\\\d
 * in the constructor string, because the string parsing processes
 * escapes first.
 *
 * I prefer the literal notation for fixed patterns because it's
 * cleaner and errors are caught earlier."
 *
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * KEY POINTS TO MENTION:
 * ✓ Literal: /pattern/ - compiled at parse time
 * ✓ Constructor: new RegExp() - compiled at runtime
 * ✓ Literal for fixed patterns, constructor for dynamic
 * ✓ Constructor needs double-escaping: \\d becomes '\\\\d'
 *
 */


// RUN: node docs/25-regular-expressions/01-creating-regex.js
