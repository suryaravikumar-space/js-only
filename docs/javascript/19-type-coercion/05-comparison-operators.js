/**
 * TYPE COERCION: 05 - Comparison Operators (<, >, <=, >=)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Comparison operators convert operands to primitives, then:                 ║
 * ║                                                                            ║
 * ║   • Both strings? → Lexicographic (dictionary) comparison                  ║
 * ║   • Otherwise?    → Convert both to numbers and compare                    ║
 * ║                                                                            ║
 * ║ This causes many unexpected results!                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON ALGORITHM                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Convert both operands to primitives (ToPrimitive)                        │
 * │                                                                             │
 * │ 2. If BOTH are strings:                                                     │
 * │    → Compare character by character using Unicode code points               │
 * │    → "banana" > "apple" (b > a)                                             │
 * │    → "10" < "9" (because "1" < "9")                                         │
 * │                                                                             │
 * │ 3. Otherwise:                                                               │
 * │    → Convert both to numbers                                                │
 * │    → Compare numerically                                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// NUMERIC COMPARISONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Numeric Comparisons ===\n');

console.log('A: 5 > 3:', 5 > 3);               // true
console.log('B: 5 < 3:', 5 < 3);               // false
console.log('C: 5 >= 5:', 5 >= 5);             // true
console.log('D: 5 <= 5:', 5 <= 5);             // true

// String to number conversion
console.log('E: "10" > 5:', "10" > 5);         // true (10 > 5)
console.log('F: "10" < 5:', "10" < 5);         // false (10 < 5)
console.log('G: "3" > 2:', "3" > 2);           // true (3 > 2)


// ═══════════════════════════════════════════════════════════════════════════════
// STRING COMPARISONS (GOTCHA!)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== String Comparisons (Watch Out!) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ CRITICAL GOTCHA: STRING VS NUMERIC SORTING                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ When BOTH operands are strings, comparison is LEXICOGRAPHIC                 │
 * │ (character by character by Unicode code point)                              │
 * │                                                                             │
 * │ "10" < "9" is TRUE because "1" (code 49) < "9" (code 57)                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('H: "10" < "9":', "10" < "9");           // true! (string comparison)
console.log('I: "10" < 9:', "10" < 9);               // false (numeric: 10 < 9)

console.log('J: "apple" < "banana":', "apple" < "banana"); // true (a < b)
console.log('K: "Apple" < "apple":', "Apple" < "apple");   // true (A < a)

// Character code comparison
console.log('L: "a".charCodeAt(0):', "a".charCodeAt(0));   // 97
console.log('M: "A".charCodeAt(0):', "A".charCodeAt(0));   // 65
console.log('N: "1".charCodeAt(0):', "1".charCodeAt(0));   // 49
console.log('O: "9".charCodeAt(0):', "9".charCodeAt(0));   // 57

// More string comparison examples
console.log('P: "abc" < "abd":', "abc" < "abd");     // true (c < d)
console.log('Q: "abc" < "abcd":', "abc" < "abcd");   // true (shorter comes first)
console.log('R: "100" < "20":', "100" < "20");       // true! (1 < 2 lexicographically)


// ═══════════════════════════════════════════════════════════════════════════════
// NULL AND UNDEFINED COMPARISONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== null and undefined Comparisons ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NULL COMPARISON WEIRDNESS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ For <, >, <=, >=: null converts to 0                                        │
 * │ For ==: null only equals undefined                                          │
 * │                                                                             │
 * │ This creates an inconsistency!                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// null comparisons (null → 0)
console.log('S: null > 0:', null > 0);     // false (0 > 0)
console.log('T: null < 0:', null < 0);     // false (0 < 0)
console.log('U: null >= 0:', null >= 0);   // true! (0 >= 0)
console.log('V: null <= 0:', null <= 0);   // true (0 <= 0)
console.log('W: null == 0:', null == 0);   // false! (special rule)

// undefined comparisons (undefined → NaN)
console.log('X: undefined > 0:', undefined > 0);   // false (NaN)
console.log('Y: undefined < 0:', undefined < 0);   // false (NaN)
console.log('Z: undefined >= 0:', undefined >= 0); // false (NaN)
console.log('AA: undefined == 0:', undefined == 0); // false


// ═══════════════════════════════════════════════════════════════════════════════
// NaN COMPARISONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== NaN Comparisons ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NaN IS NEVER EQUAL OR COMPARABLE TO ANYTHING (INCLUDING ITSELF)             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('AB: NaN > 0:', NaN > 0);       // false
console.log('AC: NaN < 0:', NaN < 0);       // false
console.log('AD: NaN >= 0:', NaN >= 0);     // false
console.log('AE: NaN <= 0:', NaN <= 0);     // false
console.log('AF: NaN == NaN:', NaN == NaN); // false!
console.log('AG: NaN > NaN:', NaN > NaN);   // false


// ═══════════════════════════════════════════════════════════════════════════════
// OBJECT COMPARISONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Object Comparisons ===\n');

// Objects convert to primitives (valueOf → toString)
console.log('AH: [10] > 5:', [10] > 5);     // true ([10] → "10" → 10)
console.log('AI: [10] > [5]:', [10] > [5]); // false! ("10" > "5" lexicographic)
console.log('AJ: [2] > [10]:', [2] > [10]); // true! ("2" > "1" lexicographic)

// Custom valueOf
const obj1 = { valueOf: () => 10 };
const obj2 = { valueOf: () => 5 };
console.log('AK: obj1 > obj2:', obj1 > obj2); // true (10 > 5)

// Date comparisons (valueOf returns timestamp)
const date1 = new Date('2024-01-01');
const date2 = new Date('2024-06-01');
console.log('AL: date1 < date2:', date1 < date2); // true


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL SORTING ISSUES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Sorting Issues ===\n');

// Default sort is string-based!
const numbers = [1, 10, 2, 20, 3];
console.log('AM: numbers.sort():', numbers.sort());
// [1, 10, 2, 20, 3] - Wrong! (string comparison)

// Correct numeric sort
const numbers2 = [1, 10, 2, 20, 3];
console.log('AN: numeric sort:', numbers2.sort((a, b) => a - b));
// [1, 2, 3, 10, 20] - Correct!

// String sort of numbers
const strNumbers = ['1', '10', '2', '20', '3'];
console.log('AO: string sort:', strNumbers.sort());
// ['1', '10', '2', '20', '3'] - Lexicographic

// Numeric sort of string numbers
console.log('AP: string as numbers:', [...strNumbers].sort((a, b) => a - b));
// ['1', '2', '3', '10', '20']


// ═══════════════════════════════════════════════════════════════════════════════
// SAFE COMPARISON PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Safe Comparison Patterns ===\n');

// Always convert to same type first
function safeCompare(a, b) {
  const numA = Number(a);
  const numB = Number(b);

  if (Number.isNaN(numA) || Number.isNaN(numB)) {
    return null; // Can't compare
  }

  if (numA < numB) return -1;
  if (numA > numB) return 1;
  return 0;
}

console.log('AQ: safeCompare("10", "9"):', safeCompare("10", "9"));   // 1
console.log('AR: safeCompare("10", 9):', safeCompare("10", 9));       // 1
console.log('AS: safeCompare("abc", 9):', safeCompare("abc", 9));     // null


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Comparison operators (<, >, <=, >=) first convert operands to primitives.  │
 * │                                                                             │
 * │ If BOTH are strings: lexicographic (Unicode) comparison                     │
 * │   '10' < '9' is TRUE because '1' < '9' by character code                    │
 * │                                                                             │
 * │ Otherwise: convert both to numbers                                          │
 * │   '10' < 9 is FALSE because 10 < 9 numerically                              │
 * │                                                                             │
 * │ Special cases:                                                              │
 * │ • null converts to 0 for <, >, <=, >= BUT null == 0 is false               │
 * │ • undefined converts to NaN (all comparisons false)                         │
 * │ • NaN compared to anything is always false                                  │
 * │                                                                             │
 * │ Common gotcha: Array.sort() does string comparison by default!              │
 * │   [1, 10, 2].sort() → [1, 10, 2] (wrong!)                                   │
 * │   [1, 10, 2].sort((a,b) => a-b) → [1, 2, 10] (correct)                      │
 * │                                                                             │
 * │ Best practice: Convert to same type before comparing."                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/05-comparison-operators.js
 */
