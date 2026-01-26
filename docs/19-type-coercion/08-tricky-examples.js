/**
 * TYPE COERCION: 08 - Tricky Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PREDICT THE OUTPUT - INTERVIEW GOTCHAS                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ These examples test deep understanding of JavaScript type coercion.        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 1: PLUS OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== GOTCHA 1: Plus Operator ===\n');

console.log('A: 1 + "2":', 1 + '2');
// YOUR ANSWER: ___
// ACTUAL: "12" (number + string = string concatenation)

console.log('B: "3" + 4 + 5:', '3' + 4 + 5);
// YOUR ANSWER: ___
// ACTUAL: "345" (left to right, "3" + 4 = "34", "34" + 5 = "345")

console.log('C: 3 + 4 + "5":', 3 + 4 + '5');
// YOUR ANSWER: ___
// ACTUAL: "75" (left to right, 3 + 4 = 7, 7 + "5" = "75")

console.log('D: +[]:', +[]);
// YOUR ANSWER: ___
// ACTUAL: 0 ([] → "" → 0)

console.log('E: +[1]:', +[1]);
// YOUR ANSWER: ___
// ACTUAL: 1 ([1] → "1" → 1)

console.log('F: +[1,2]:', +[1, 2]);
// YOUR ANSWER: ___
// ACTUAL: NaN ([1,2] → "1,2" → NaN)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 2: MINUS OPERATOR
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 2: Minus Operator ===\n');

console.log('G: "5" - 3:', '5' - 3);
// YOUR ANSWER: ___
// ACTUAL: 2 (always numeric)

console.log('H: "5" - "3":', '5' - '3');
// YOUR ANSWER: ___
// ACTUAL: 2

console.log('I: 5 - "a":', 5 - 'a');
// YOUR ANSWER: ___
// ACTUAL: NaN

console.log('J: [] - []:', [] - []);
// YOUR ANSWER: ___
// ACTUAL: 0 ([] → 0, 0 - 0 = 0)

console.log('K: [5] - [3]:', [5] - [3]);
// YOUR ANSWER: ___
// ACTUAL: 2 ([5] → 5, [3] → 3)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 3: EQUALITY MADNESS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 3: Equality ===\n');

console.log('L: [] == false:', [] == false);
// YOUR ANSWER: ___
// ACTUAL: true ([] → "" → 0, false → 0)

console.log('M: [] == ![]:', [] == ![]);
// YOUR ANSWER: ___
// ACTUAL: true ([] == false → true)

console.log('N: null == 0:', null == 0);
// YOUR ANSWER: ___
// ACTUAL: false (null only equals undefined)

console.log('O: null == false:', null == false);
// YOUR ANSWER: ___
// ACTUAL: false

console.log('P: undefined == false:', undefined == false);
// YOUR ANSWER: ___
// ACTUAL: false

console.log('Q: NaN == NaN:', NaN == NaN);
// YOUR ANSWER: ___
// ACTUAL: false (NaN never equals anything)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 4: BOOLEAN COERCION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 4: Boolean ===\n');

console.log('R: Boolean([]):', Boolean([]));
// YOUR ANSWER: ___
// ACTUAL: true (arrays are always truthy!)

console.log('S: Boolean({}):', Boolean({}));
// YOUR ANSWER: ___
// ACTUAL: true (objects are always truthy!)

console.log('T: Boolean(""):', Boolean(''));
// YOUR ANSWER: ___
// ACTUAL: false

console.log('U: Boolean("0"):', Boolean('0'));
// YOUR ANSWER: ___
// ACTUAL: true (non-empty string!)

console.log('V: Boolean("false"):', Boolean('false'));
// YOUR ANSWER: ___
// ACTUAL: true (non-empty string!)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 5: COMPARISON OPERATORS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 5: Comparisons ===\n');

console.log('W: "10" > "9":', '10' > '9');
// YOUR ANSWER: ___
// ACTUAL: false (string comparison: "1" < "9")

console.log('X: "10" > 9:', '10' > 9);
// YOUR ANSWER: ___
// ACTUAL: true (number comparison: 10 > 9)

console.log('Y: null > 0:', null > 0);
// YOUR ANSWER: ___
// ACTUAL: false

console.log('Z: null >= 0:', null >= 0);
// YOUR ANSWER: ___
// ACTUAL: true (null → 0 for comparison, but not for ==)

console.log('AA: null == 0:', null == 0);
// YOUR ANSWER: ___
// ACTUAL: false (special case!)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 6: LOGICAL OPERATORS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 6: Logical Operators ===\n');

console.log('AB: 0 || "0":', 0 || '0');
// YOUR ANSWER: ___
// ACTUAL: "0" (0 is falsy, return second)

console.log('AC: "0" || 0:', '0' || 0);
// YOUR ANSWER: ___
// ACTUAL: "0" ("0" is truthy!)

console.log('AD: null || undefined || 0 || "":', null || undefined || 0 || '');
// YOUR ANSWER: ___
// ACTUAL: "" (all falsy, returns last)

console.log('AE: 1 && 2 && 3:', 1 && 2 && 3);
// YOUR ANSWER: ___
// ACTUAL: 3 (all truthy, returns last)

console.log('AF: 1 && 0 && 3:', 1 && 0 && 3);
// YOUR ANSWER: ___
// ACTUAL: 0 (returns first falsy)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 7: TYPEOF SURPRISES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 7: typeof ===\n');

console.log('AG: typeof null:', typeof null);
// YOUR ANSWER: ___
// ACTUAL: "object" (famous bug!)

console.log('AH: typeof NaN:', typeof NaN);
// YOUR ANSWER: ___
// ACTUAL: "number" (NaN is a number!)

console.log('AI: typeof []:', typeof []);
// YOUR ANSWER: ___
// ACTUAL: "object" (arrays are objects)

console.log('AJ: typeof typeof 1:', typeof typeof 1);
// YOUR ANSWER: ___
// ACTUAL: "string" (typeof 1 → "number", typeof "number" → "string")


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 8: WEIRD MATH
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 8: Math ===\n');

console.log('AK: 0.1 + 0.2 === 0.3:', 0.1 + 0.2 === 0.3);
// YOUR ANSWER: ___
// ACTUAL: false (floating point precision!)

console.log('AL: 0.1 + 0.2:', 0.1 + 0.2);
// ACTUAL: 0.30000000000000004

console.log('AM: 99999999999999999999 + 1:', 99999999999999999999 + 1);
// ACTUAL: 100000000000000000000 (precision loss)

console.log('AN: Math.max():', Math.max());
// YOUR ANSWER: ___
// ACTUAL: -Infinity

console.log('AO: Math.min():', Math.min());
// YOUR ANSWER: ___
// ACTUAL: Infinity


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 9: ARRAY COERCION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 9: Arrays ===\n');

console.log('AP: [] + []:', [] + []);
// YOUR ANSWER: ___
// ACTUAL: "" (both become "", "" + "" = "")

console.log('AQ: [] + {}:', [] + {});
// YOUR ANSWER: ___
// ACTUAL: "[object Object]"

console.log('AR: {} + []:', {} + []);
// YOUR ANSWER: ___
// ACTUAL: "[object Object]" (or 0 in some consoles)

console.log('AS: [1,2] + [3,4]:', [1, 2] + [3, 4]);
// YOUR ANSWER: ___
// ACTUAL: "1,23,4"


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 10: THE ULTIMATE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 10: Ultimate ===\n');

console.log('AT: (!+[]+[]+![]).length:', (!+[] + [] + ![]).length);
// Break it down:
// !+[] → !0 → true
// true + [] → "true"
// "true" + ![] → "true" + false → "truefalse"
// "truefalse".length → 9


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY GOTCHAS SUMMARY                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. + is overloaded: concatenation vs addition                               │
 * │ 2. - is always numeric                                                      │
 * │ 3. [] == false but [] is truthy                                             │
 * │ 4. null only equals undefined (not 0 or false)                              │
 * │ 5. NaN never equals anything (including itself)                             │
 * │ 6. "0" and "false" are truthy (non-empty strings)                           │
 * │ 7. String comparison is character by character                              │
 * │ 8. typeof null is "object" (bug)                                            │
 * │ 9. 0.1 + 0.2 !== 0.3 (floating point)                                       │
 * │ 10. [] + [] = "" (both become strings)                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/08-tricky-examples.js
 */
