/**
 * TYPE COERCION: 07 - Common Gotchas & Pitfalls
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Type coercion causes subtle bugs when you ASSUME values behave one way     ║
 * ║ but JavaScript coerces them differently. Learn these gotchas to avoid      ║
 * ║ debugging nightmares!                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 1: Empty Array is Truthy but Equals False
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Gotcha 1: Empty Array Paradox ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE PARADOX                                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   [] is TRUTHY (passes if check)                                            │
 * │   BUT                                                                       │
 * │   [] == false is TRUE                                                       │
 * │                                                                             │
 * │   HOW?                                                                      │
 * │   ┌──────────────────────────────────────────────────────────────────┐      │
 * │   │ [] == false                                                      │      │
 * │   │  ↓                                                               │      │
 * │   │ "" == false   ([] → "" via ToPrimitive)                          │      │
 * │   │  ↓                                                               │      │
 * │   │ 0 == 0        ("" → 0, false → 0)                                │      │
 * │   │  ↓                                                               │      │
 * │   │ TRUE                                                             │      │
 * │   └──────────────────────────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('A: Boolean([]):', Boolean([]));      // true (truthy!)
console.log('B: [] == false:', [] == false);       // true (equals false!)
console.log('C: [] == true:', [] == true);         // false

// Visual breakdown
console.log('\n--- Coercion Steps ---');
console.log('D: [].toString():', [].toString());   // ""
console.log('E: Number(""):', Number(""));         // 0
console.log('F: Number(false):', Number(false));   // 0
console.log('G: 0 == 0:', 0 == 0);                 // true

// Fix: Use strict equality or explicit checks
console.log('\n--- Safe Patterns ---');
console.log('H: [] === false:', [] === false);     // false
console.log('I: [].length === 0:', [].length === 0); // true


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 2: null vs undefined Coercion Differences
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 2: null vs undefined ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ null AND undefined COERCE DIFFERENTLY                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────┬──────────────┬────────────────────┐                │
 * │   │ Operation          │ null         │ undefined          │                │
 * │   ├────────────────────┼──────────────┼────────────────────┤                │
 * │   │ To Number          │ 0            │ NaN                │                │
 * │   │ To String          │ "null"       │ "undefined"        │                │
 * │   │ To Boolean         │ false        │ false              │                │
 * │   │ == null            │ true         │ true               │                │
 * │   │ == undefined       │ true         │ true               │                │
 * │   │ == 0               │ false        │ false              │                │
 * │   └────────────────────┴──────────────┴────────────────────┘                │
 * │                                                                             │
 * │   ⚠️  null == undefined but Number(null) ≠ Number(undefined)               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('J: Number(null):', Number(null));           // 0
console.log('K: Number(undefined):', Number(undefined)); // NaN

console.log('L: null + 5:', null + 5);           // 5 (0 + 5)
console.log('M: undefined + 5:', undefined + 5); // NaN

console.log('N: null == undefined:', null == undefined); // true
console.log('O: null === undefined:', null === undefined); // false

// The weird comparison gotcha
console.log('\n--- Comparison Gotcha ---');
console.log('P: null >= 0:', null >= 0);   // true (null → 0)
console.log('Q: null > 0:', null > 0);     // false (0 > 0 = false)
console.log('R: null == 0:', null == 0);   // false (special rule!)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 3: String Number Comparisons
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 3: String Number Comparisons ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STRING vs STRING = LEXICOGRAPHIC (Dictionary Order)                         │
 * │ STRING vs NUMBER = NUMERIC COMPARISON                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   "10" < "9"   →  TRUE  (lexicographic: "1" < "9")                          │
 * │   "10" < 9     →  FALSE (numeric: 10 < 9)                                   │
 * │                                                                             │
 * │   ┌──────────────────────────────────────────────────────────────────┐      │
 * │   │  String Comparison        vs         Numeric Comparison          │      │
 * │   │  ──────────────────              ──────────────────────          │      │
 * │   │  "10" < "9"                      "10" < 9                        │      │
 * │   │    ↓                               ↓                             │      │
 * │   │  "1" < "9" (char codes)           10 < 9 (numbers)               │      │
 * │   │    ↓                               ↓                             │      │
 * │   │  49 < 57                          FALSE                          │      │
 * │   │    ↓                                                             │      │
 * │   │  TRUE                                                            │      │
 * │   └──────────────────────────────────────────────────────────────────┘      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('S: "10" < "9":', "10" < "9");   // true! (lexicographic)
console.log('T: "10" < 9:', "10" < 9);       // false (numeric)

// More examples
console.log('U: "100" < "20":', "100" < "20"); // true! ("1" < "2")
console.log('V: "abc" < "abd":', "abc" < "abd"); // true ("c" < "d")

// Array sort gotcha
console.log('\n--- Array.sort() Default is String! ---');
const nums = [1, 10, 2, 20, 3];
console.log('W: [1,10,2,20,3].sort():', nums.sort()); // [1, 10, 2, 20, 3] WRONG!

const nums2 = [1, 10, 2, 20, 3];
console.log('X: Numeric sort:', nums2.sort((a, b) => a - b)); // [1, 2, 3, 10, 20]


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 4: + Operator Confusion
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 4: + Operator Confusion ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ + OPERATOR HAS TWO PERSONALITIES                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────┐        │
 * │   │                                                                │        │
 * │   │   a + b                                                        │        │
 * │   │     │                                                          │        │
 * │   │     ▼                                                          │        │
 * │   │   ┌─────────────────────────┐                                  │        │
 * │   │   │ Is a OR b a STRING?     │                                  │        │
 * │   │   └───────────┬─────────────┘                                  │        │
 * │   │       YES │       │ NO                                         │        │
 * │   │           │       │                                            │        │
 * │   │           ▼       ▼                                            │        │
 * │   │   ┌───────────┐  ┌───────────┐                                 │        │
 * │   │   │ STRING    │  │ NUMERIC   │                                 │        │
 * │   │   │ CONCAT    │  │ ADDITION  │                                 │        │
 * │   │   └───────────┘  └───────────┘                                 │        │
 * │   │                                                                │        │
 * │   └────────────────────────────────────────────────────────────────┘        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('Y: "5" + 3:', "5" + 3);         // "53" (concat)
console.log('Z: 5 + "3":', 5 + "3");         // "53" (concat)
console.log('AA: 5 + 3:', 5 + 3);            // 8 (addition)

// Order matters!
console.log('\n--- Order Matters! ---');
console.log('AB: 1 + 2 + "3":', 1 + 2 + "3");   // "33" (3 + "3")
console.log('AC: "1" + 2 + 3:', "1" + 2 + 3);   // "123" (all concat)
console.log('AD: 1 + "2" + 3:', 1 + "2" + 3);   // "123"

// Unary + converts to number
console.log('\n--- Unary + is Different ---');
console.log('AE: +"5":', +"5");           // 5 (number)
console.log('AF: +"5" + 3:', +"5" + 3);   // 8 (both numbers)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 5: Boolean Object vs Boolean Primitive
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 5: Boolean Objects ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ new Boolean(false) IS TRUTHY!                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │                                                                   │     │
 * │   │   const b = new Boolean(false);                                   │     │
 * │   │                                                                   │     │
 * │   │   typeof b → "object"  (NOT "boolean"!)                           │     │
 * │   │                                                                   │     │
 * │   │   if (b) { ... }  → EXECUTES! (objects are truthy)                │     │
 * │   │                                                                   │     │
 * │   │   b.valueOf() → false (the wrapped value)                         │     │
 * │   │                                                                   │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                                             │
 * │   ⚠️  NEVER use new Boolean(), new Number(), new String()                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const boolObj = new Boolean(false);
console.log('AG: typeof new Boolean(false):', typeof boolObj); // "object"
console.log('AH: new Boolean(false) is truthy:', !!boolObj);   // true!

if (boolObj) {
  console.log('AI: This RUNS because objects are truthy!');
}

console.log('AJ: boolObj.valueOf():', boolObj.valueOf()); // false
console.log('AK: boolObj == false:', boolObj == false);   // true (coerced)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 6: NaN Weirdness
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 6: NaN Weirdness ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ NaN IS THE ONLY VALUE THAT DOESN'T EQUAL ITSELF                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   NaN === NaN  →  FALSE                                                     │
 * │   NaN == NaN   →  FALSE                                                     │
 * │   NaN !== NaN  →  TRUE  (use this to check!)                                │
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │                                                                   │     │
 * │   │   WRONG:  if (value === NaN) { ... }  // Never true!              │     │
 * │   │                                                                   │     │
 * │   │   RIGHT:  if (Number.isNaN(value)) { ... }                        │     │
 * │   │                                                                   │     │
 * │   │   ⚠️ isNaN() coerces first: isNaN("hello") → true (WRONG!)        │     │
 * │   │   ✓ Number.isNaN() doesn't coerce                                 │     │
 * │   │                                                                   │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('AL: NaN === NaN:', NaN === NaN);     // false
console.log('AM: NaN == NaN:', NaN == NaN);       // false
console.log('AN: NaN !== NaN:', NaN !== NaN);     // true

// Checking for NaN
console.log('\n--- How to Check for NaN ---');
console.log('AO: isNaN("hello"):', isNaN("hello"));           // true (WRONG!)
console.log('AP: Number.isNaN("hello"):', Number.isNaN("hello")); // false (correct)
console.log('AQ: Number.isNaN(NaN):', Number.isNaN(NaN));     // true

// typeof NaN
console.log('AR: typeof NaN:', typeof NaN); // "number" (ironic!)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 7: Empty String Converts to 0
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 7: Empty String = 0 ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ "" (empty string) CONVERTS TO 0, NOT NaN                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │                                                                   │     │
 * │   │   Number("")     → 0   (empty = zero)                             │     │
 * │   │   Number("   ")  → 0   (whitespace = zero too!)                   │     │
 * │   │   Number("0")    → 0                                              │     │
 * │   │                                                                   │     │
 * │   │   BUT:                                                            │     │
 * │   │   parseInt("")   → NaN (different behavior!)                      │     │
 * │   │                                                                   │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('AS: Number(""):', Number(""));         // 0
console.log('AT: Number("   "):', Number("   "));   // 0
console.log('AU: parseInt(""):', parseInt(""));     // NaN

console.log('AV: "" == 0:', "" == 0);     // true
console.log('AW: "" == false:', "" == false); // true

// Gotcha in form validation
console.log('\n--- Form Validation Gotcha ---');
const userInput = "";
if (Number(userInput) === 0) {
  console.log('AX: Empty string passes as 0!'); // This runs!
}

// Better validation
if (userInput === "" || Number.isNaN(Number(userInput))) {
  console.log('AY: Properly detected empty input');
}


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 8: Object to Primitive Conversion
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 8: Object ToPrimitive ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ OBJECTS CONVERT VIA valueOf() THEN toString()                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────┐        │
 * │   │                                                                │        │
 * │   │   Object → Primitive (ToPrimitive algorithm)                   │        │
 * │   │     │                                                          │        │
 * │   │     ▼                                                          │        │
 * │   │   ┌─────────────────────────┐                                  │        │
 * │   │   │ Try valueOf()           │                                  │        │
 * │   │   │ Returns primitive?      │                                  │        │
 * │   │   └───────────┬─────────────┘                                  │        │
 * │   │       YES │       │ NO                                         │        │
 * │   │           │       │                                            │        │
 * │   │           ▼       ▼                                            │        │
 * │   │   ┌───────────┐  ┌─────────────────────────┐                   │        │
 * │   │   │ Use it    │  │ Try toString()          │                   │        │
 * │   │   └───────────┘  │ Returns primitive?      │                   │        │
 * │   │                  └───────────┬─────────────┘                   │        │
 * │   │                      YES │       │ NO                          │        │
 * │   │                          │       │                             │        │
 * │   │                          ▼       ▼                             │        │
 * │   │                  ┌───────────┐  ┌───────────┐                  │        │
 * │   │                  │ Use it    │  │ TypeError │                  │        │
 * │   │                  └───────────┘  └───────────┘                  │        │
 * │   │                                                                │        │
 * │   └────────────────────────────────────────────────────────────────┘        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Default object behavior
console.log('AZ: {} + 1:', {} + 1);           // "[object Object]1"
console.log('BA: {}.toString():', ({}).toString()); // "[object Object]"

// Array behavior
console.log('BB: [1,2] + [3,4]:', [1,2] + [3,4]);   // "1,23,4"
console.log('BC: [1,2].toString():', [1,2].toString()); // "1,2"

// Custom valueOf
const customObj = {
  valueOf() { return 42; },
  toString() { return "hello"; }
};
console.log('BD: customObj + 1:', customObj + 1);   // 43 (valueOf used)
console.log('BE: customObj + "":', customObj + ""); // "42" (valueOf, then string)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 9: typeof null
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 9: typeof null ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ typeof null === "object" IS A BUG FROM 1995!                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   This is a famous JavaScript bug that can never be fixed                   │
 * │   (would break too much existing code).                                     │
 * │                                                                             │
 * │   ┌───────────────────────────────────────────────────────────────────┐     │
 * │   │                                                                   │     │
 * │   │   typeof null       → "object"    ⚠️ BUG!                         │     │
 * │   │   typeof undefined  → "undefined"                                 │     │
 * │   │   typeof {}         → "object"                                    │     │
 * │   │   typeof []         → "object"    (arrays are objects)            │     │
 * │   │                                                                   │     │
 * │   │   To check for null:                                              │     │
 * │   │   value === null   (strict equality)                              │     │
 * │   │                                                                   │     │
 * │   └───────────────────────────────────────────────────────────────────┘     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('BF: typeof null:', typeof null);           // "object" (bug!)
console.log('BG: typeof undefined:', typeof undefined); // "undefined"
console.log('BH: typeof {}:', typeof {});               // "object"
console.log('BI: typeof []:', typeof []);               // "object"

// Proper null check
function isNull(value) {
  return value === null;
}
console.log('BJ: isNull(null):', isNull(null));   // true
console.log('BK: isNull({}):', isNull({}));       // false


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 10: Implicit Boolean in Array Methods
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Gotcha 10: Array Method Boolean Coercion ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ filter(), find(), some(), every() COERCE RETURN VALUES TO BOOLEAN           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   [0, 1, 2, "", "hello"].filter(x => x)                                     │
 * │   → [1, 2, "hello"]  (0 and "" are filtered out!)                           │
 * │                                                                             │
 * │   ⚠️ This can accidentally remove valid values like 0 or ""                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const mixedValues = [0, 1, 2, "", "hello", null, undefined, false];

// Filter with truthy check (DANGEROUS)
console.log('BL: filter(x => x):', mixedValues.filter(x => x));
// [1, 2, "hello"] - Lost 0, "", null, undefined, false!

// Explicit check for only null/undefined
console.log('BM: filter(x => x != null):', mixedValues.filter(x => x != null));
// [0, 1, 2, "", "hello", false] - Keeps 0, "", false

// Check for non-empty values only
console.log('BN: filter(x => x !== ""):', mixedValues.filter(x => x !== "" && x != null));
// [0, 1, 2, "hello", false]


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The main type coercion gotchas in JavaScript are:                          │
 * │                                                                             │
 * │ 1. Empty array paradox: [] is truthy, but [] == false is true               │
 * │    - [] → "" → 0, false → 0, so 0 == 0                                      │
 * │                                                                             │
 * │ 2. null vs undefined: Number(null)=0, Number(undefined)=NaN                 │
 * │    - But null == undefined is true (special rule)                           │
 * │    - null >= 0 is true, but null == 0 is false                              │
 * │                                                                             │
 * │ 3. String comparisons: "10" < "9" is true (lexicographic)                   │
 * │    - Array.sort() does string comparison by default!                        │
 * │                                                                             │
 * │ 4. + operator: Has two modes (concat vs addition)                           │
 * │    - "5" + 3 = "53", but "5" - 3 = 2                                        │
 * │                                                                             │
 * │ 5. Boolean objects: new Boolean(false) is truthy!                           │
 * │    - Never use new Boolean/Number/String                                    │
 * │                                                                             │
 * │ 6. NaN: Only value that doesn't equal itself                                │
 * │    - Use Number.isNaN(), not isNaN()                                        │
 * │                                                                             │
 * │ 7. Empty string: "" converts to 0, not NaN                                  │
 * │                                                                             │
 * │ 8. typeof null: Returns "object" (historical bug)                           │
 * │                                                                             │
 * │ Best practices:                                                             │
 * │ - Use === instead of ==                                                     │
 * │ - Use Number.isNaN() and Number.isFinite()                                  │
 * │ - Always pass comparator to Array.sort()                                    │
 * │ - Be explicit about type conversions"                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/07-common-gotchas.js
 */
