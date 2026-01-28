/**
 * TYPE COERCION: 02 - To Number Conversion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ JavaScript converts values to numbers for math operations:                 ║
 * ║                                                                            ║
 * ║   Number(value)    - Explicit (preferred)                                  ║
 * ║   +value           - Unary plus (shorthand)                                ║
 * ║   parseInt(str)    - Parse integer from string                             ║
 * ║   parseFloat(str)  - Parse float from string                               ║
 * ║   value * 1        - Implicit via math                                     ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE NUMBER CONVERSION - Real World Justification                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. FORM INPUT PROCESSING                                                    │
 * │    → Input values are always strings                                        │
 * │    → Need to convert for calculations                                       │
 * │                                                                             │
 * │ 2. API RESPONSES                                                            │
 * │    → Numbers may come as strings in JSON                                    │
 * │    → "price": "19.99" needs conversion                                      │
 * │                                                                             │
 * │ 3. URL PARAMETERS                                                           │
 * │    → Query params are strings                                               │
 * │    → ?page=5 → page is "5" not 5                                            │
 * │                                                                             │
 * │ 4. ARITHMETIC OPERATIONS                                                    │
 * │    → Ensure correct math behavior                                           │
 * │    → Avoid string concatenation bugs                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// NUMBER CONVERSION TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NUMBER CONVERSION RESULTS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   VALUE                 │  Number(value)                                    │
 * │   ──────────────────────┼────────────────────────────                       │
 * │   "123"                 │  123                                              │
 * │   "  123  "             │  123 (trims whitespace)                           │
 * │   ""                    │  0  (empty string!)                               │
 * │   "   "                 │  0  (whitespace only!)                            │
 * │   "123abc"              │  NaN                                              │
 * │   "abc"                 │  NaN                                              │
 * │   true                  │  1                                                │
 * │   false                 │  0                                                │
 * │   null                  │  0  (important!)                                  │
 * │   undefined             │  NaN (different from null!)                       │
 * │   []                    │  0  (empty array!)                                │
 * │   [5]                   │  5  (single element)                              │
 * │   [1, 2]                │  NaN (multiple elements)                          │
 * │   {}                    │  NaN                                              │
 * │   Infinity              │  Infinity                                         │
 * │   "Infinity"            │  Infinity                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXPLICIT CONVERSION: Number()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Number() Conversion ===\n');

// Strings
console.log('A:', Number("123"));       // 123
console.log('B:', Number("  123  "));   // 123 (whitespace trimmed)
console.log('C:', Number(""));          // 0 (empty = 0!)
console.log('D:', Number("   "));       // 0 (whitespace = 0!)
console.log('E:', Number("123abc"));    // NaN
console.log('F:', Number("abc"));       // NaN
console.log('G:', Number("12.34"));     // 12.34
console.log('H:', Number("1e5"));       // 100000

// Booleans
console.log('I:', Number(true));        // 1
console.log('J:', Number(false));       // 0

// null and undefined
console.log('K:', Number(null));        // 0 (!!!)
console.log('L:', Number(undefined));   // NaN (!!!)

// Arrays
console.log('M:', Number([]));          // 0 (empty!)
console.log('N:', Number([5]));         // 5
console.log('O:', Number([1, 2]));      // NaN
console.log('P:', Number(["5"]));       // 5

// Objects
console.log('Q:', Number({}));          // NaN
console.log('R:', Number({a: 1}));      // NaN


// ═══════════════════════════════════════════════════════════════════════════════
// UNARY PLUS: +value
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Unary + Conversion ===\n');

console.log('S:', +"123");        // 123
console.log('T:', +"");           // 0
console.log('U:', +true);         // 1
console.log('V:', +false);        // 0
console.log('W:', +null);         // 0
console.log('X:', +undefined);    // NaN
console.log('Y:', +[]);           // 0
console.log('Z:', +[5]);          // 5
console.log('AA:', +{});          // NaN


// ═══════════════════════════════════════════════════════════════════════════════
// parseInt() vs Number()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== parseInt() vs Number() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY DIFFERENCE                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Number()   - Converts entire value, NaN if any part invalid                 │
 * │ parseInt() - Parses from start, stops at first non-digit                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('AB: Number("123abc"):', Number("123abc"));     // NaN
console.log('AC: parseInt("123abc"):', parseInt("123abc")); // 123

console.log('AD: Number("  42  "):', Number("  42  "));     // 42
console.log('AE: parseInt("  42  "):', parseInt("  42  ")); // 42

console.log('AF: Number(""):', Number(""));                 // 0
console.log('AG: parseInt(""):', parseInt(""));             // NaN (!!!)

console.log('AH: Number("12.34"):', Number("12.34"));       // 12.34
console.log('AI: parseInt("12.34"):', parseInt("12.34"));   // 12 (truncates!)

// parseInt with radix (base)
console.log('AJ: parseInt("ff", 16):', parseInt("ff", 16)); // 255
console.log('AK: parseInt("11", 2):', parseInt("11", 2));   // 3
console.log('AL: parseInt("077", 8):', parseInt("077", 8)); // 63

// GOTCHA: Always specify radix!
console.log('AM: parseInt("08"):', parseInt("08"));         // 8 (used to be 0!)
console.log('AN: parseInt("08", 10):', parseInt("08", 10)); // 8 (explicit)


// ═══════════════════════════════════════════════════════════════════════════════
// parseFloat()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== parseFloat() ===\n');

console.log('AO:', parseFloat("3.14"));        // 3.14
console.log('AP:', parseFloat("3.14.15"));     // 3.14 (stops at second .)
console.log('AQ:', parseFloat("3.14abc"));     // 3.14
console.log('AR:', parseFloat("abc3.14"));     // NaN (must start with number)
console.log('AS:', parseFloat("  3.14  "));    // 3.14


// ═══════════════════════════════════════════════════════════════════════════════
// IMPLICIT CONVERSION (Math Operations)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Implicit Conversion ===\n');

// Subtraction, multiplication, division ALWAYS convert to number
console.log('AT:', "10" - 5);       // 5
console.log('AU:', "10" * 2);       // 20
console.log('AV:', "10" / 2);       // 5
console.log('AW:', "10" % 3);       // 1

// Comparison operators convert to number
console.log('AX:', "10" > 5);       // true (10 > 5)
console.log('AY:', "10" > "5");     // false! (string comparison: "1" < "5")

// GOTCHA: + with string is concatenation!
console.log('AZ:', "10" + 5);       // "105" (string!)
console.log('BA:', 10 + "5");       // "105" (string!)


// ═══════════════════════════════════════════════════════════════════════════════
// SPECIAL VALUES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Special Values ===\n');

console.log('BB:', Number(Infinity));     // Infinity
console.log('BC:', Number(-Infinity));    // -Infinity
console.log('BD:', Number("Infinity"));   // Infinity
console.log('BE:', Number("-Infinity"));  // -Infinity
console.log('BF:', Number(NaN));          // NaN

// Checking for NaN
console.log('BG:', Number.isNaN(NaN));              // true
console.log('BH:', Number.isNaN("hello"));          // false (no coercion)
console.log('BI:', isNaN("hello"));                 // true (coerces first!)

// Checking for finite
console.log('BJ:', Number.isFinite(123));           // true
console.log('BK:', Number.isFinite(Infinity));      // false
console.log('BL:', Number.isFinite("123"));         // false (no coercion)
console.log('BM:', isFinite("123"));                // true (coerces!)


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Practical Examples ===\n');

// Form input processing
function calculateTotal(priceStr, quantityStr) {
  const price = Number(priceStr);
  const quantity = Number(quantityStr);

  if (Number.isNaN(price) || Number.isNaN(quantity)) {
    return 'Invalid input';
  }

  return price * quantity;
}

console.log('BN:', calculateTotal("19.99", "3"));    // 59.97
console.log('BO:', calculateTotal("abc", "3"));     // Invalid input

// URL parameter parsing
function getPage(pageParam) {
  const page = parseInt(pageParam, 10);
  return Number.isNaN(page) ? 1 : page;
}

console.log('BP:', getPage("5"));       // 5
console.log('BQ:', getPage("abc"));     // 1 (default)
console.log('BR:', getPage(undefined)); // 1 (default)


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript converts to numbers in several ways:                            │
 * │                                                                             │
 * │ 1. Number(value) - Strict, entire value must be valid                       │
 * │ 2. +value - Same as Number(), shorter syntax                                │
 * │ 3. parseInt(str, radix) - Parses integer, stops at non-digit                │
 * │ 4. parseFloat(str) - Parses float, stops at invalid char                    │
 * │                                                                             │
 * │ Key gotchas to remember:                                                    │
 * │ • '' (empty string) → 0                                                     │
 * │ • null → 0                                                                  │
 * │ • undefined → NaN                                                           │
 * │ • [] → 0                                                                    │
 * │ • [5] → 5                                                                   │
 * │ • parseInt('') → NaN (different from Number('')!)                           │
 * │                                                                             │
 * │ Always use Number.isNaN() not isNaN() to check for NaN.                     │
 * │ Always specify radix with parseInt(): parseInt('08', 10)                    │
 * │                                                                             │
 * │ For user input, prefer Number() for strictness,                             │
 * │ parseInt() when you expect trailing non-numeric chars."                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/02-to-number.js
 */
