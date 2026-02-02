/**
 * TYPE COERCION: 09 - Interview Q&A Summary
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE FOR TYPE COERCION                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file contains the most common interview questions with detailed       ║
 * ║ answers, plus a quick reference cheat sheet.                               ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is type coercion in JavaScript?                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Type coercion is the automatic or implicit conversion of values from       │
 * │ one data type to another. JavaScript is dynamically typed and performs      │
 * │ these conversions automatically in many situations.                         │
 * │                                                                             │
 * │ Two types:                                                                  │
 * │ • EXPLICIT: You intentionally convert - String(123), Number('5')            │
 * │ • IMPLICIT: JavaScript converts automatically - '5' - 3 = 2                 │
 * │                                                                             │
 * │ Coercion happens with:                                                      │
 * │ • Operators (+, -, ==, <, etc.)                                             │
 * │ • Conditions (if, while, ternary)                                           │
 * │ • Comparisons"                                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: What's the difference between == and ===?                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "== (loose equality) performs type coercion before comparing.               │
 * │ === (strict equality) compares both type AND value without coercion.        │
 * │                                                                             │
 * │ Examples:                                                                   │
 * │   5 == '5'   → true  (string converted to number)                           │
 * │   5 === '5'  → false (different types)                                      │
 * │                                                                             │
 * │   null == undefined  → true  (special case)                                 │
 * │   null === undefined → false (different types)                              │
 * │                                                                             │
 * │ Rule: Always use === unless you specifically need type coercion.            │
 * │ The only legitimate use of == is checking for null/undefined together:      │
 * │   if (value == null) { }  // true for both null and undefined"              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What are truthy and falsy values?                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Falsy values are the 8 values that convert to false in boolean context:    │
 * │                                                                             │
 * │   false                                                                     │
 * │   0, -0, 0n (BigInt zero)                                                   │
 * │   '' (empty string)                                                         │
 * │   null                                                                      │
 * │   undefined                                                                 │
 * │   NaN                                                                       │
 * │                                                                             │
 * │ EVERYTHING else is truthy, including:                                       │
 * │ • '0' (string zero)                                                         │
 * │ • 'false' (string false)                                                    │
 * │ • [] (empty array)                                                          │
 * │ • {} (empty object)                                                         │
 * │ • function() {} (any function)                                              │
 * │                                                                             │
 * │ Gotcha: [] is truthy, but [] == false is true!                              │
 * │ This is because [] becomes '' in comparison, and '' == false is true."      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: Explain how the + operator works with different types.                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "The + operator is overloaded:                                              │
 * │                                                                             │
 * │ NUMBER + NUMBER → Addition                                                  │
 * │   5 + 3 = 8                                                                 │
 * │                                                                             │
 * │ STRING + ANYTHING → Concatenation                                           │
 * │   '5' + 3 = '53'                                                            │
 * │   5 + '3' = '53'                                                            │
 * │                                                                             │
 * │ Order matters:                                                              │
 * │   '1' + 2 + 3 = '123'  (left to right, string first)                        │
 * │   1 + 2 + '3' = '33'   (1+2=3, then '3'+'3')                                │
 * │                                                                             │
 * │ Unary + converts to number:                                                 │
 * │   +'5' = 5                                                                  │
 * │   +[] = 0                                                                   │
 * │   +{} = NaN                                                                 │
 * │                                                                             │
 * │ Other math operators (-, *, /, %) always convert to numbers."               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: Why is typeof null === 'object'?                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "This is a bug from the original JavaScript implementation that can         │
 * │ never be fixed due to backwards compatibility.                              │
 * │                                                                             │
 * │ In the original implementation, values were represented with a type tag     │
 * │ and a value. Objects had type tag 0. null was represented as the null       │
 * │ pointer (0x00), so its type tag was also 0, making typeof return 'object'.  │
 * │                                                                             │
 * │ To properly check for null:                                                 │
 * │   value === null                                                            │
 * │                                                                             │
 * │ To check if something is an object (not null):                              │
 * │   typeof value === 'object' && value !== null"                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: Why is NaN !== NaN? How do you check for NaN?                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "NaN stands for 'Not a Number' and represents an invalid numeric result.    │
 * │ By IEEE 754 specification, NaN is not equal to any value, including itself. │
 * │                                                                             │
 * │   NaN === NaN  // false                                                     │
 * │   NaN == NaN   // false                                                     │
 * │                                                                             │
 * │ To check for NaN:                                                           │
 * │   Number.isNaN(value)    // Preferred (only true for actual NaN)            │
 * │   Object.is(value, NaN)  // Also works                                      │
 * │                                                                             │
 * │ Avoid global isNaN() - it coerces the value first:                          │
 * │   isNaN('hello')       // true (coerces to NaN first)                       │
 * │   Number.isNaN('hello') // false (no coercion)"                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ CHEAT SHEET: Type Coercion                                                 ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ TO STRING:                                                                 ║
 * ║   String(123)        → "123"                                               ║
 * ║   String(true)       → "true"                                              ║
 * ║   String(null)       → "null"                                              ║
 * ║   String(undefined)  → "undefined"                                         ║
 * ║   String([1,2,3])    → "1,2,3"                                             ║
 * ║   String({})         → "[object Object]"                                   ║
 * ║                                                                            ║
 * ║ TO NUMBER:                                                                 ║
 * ║   Number("123")      → 123                                                 ║
 * ║   Number("")         → 0                                                   ║
 * ║   Number("hello")    → NaN                                                 ║
 * ║   Number(true)       → 1                                                   ║
 * ║   Number(false)      → 0                                                   ║
 * ║   Number(null)       → 0                                                   ║
 * ║   Number(undefined)  → NaN                                                 ║
 * ║   Number([])         → 0                                                   ║
 * ║   Number([5])        → 5                                                   ║
 * ║   Number([1,2])      → NaN                                                 ║
 * ║                                                                            ║
 * ║ FALSY VALUES (8 total):                                                    ║
 * ║   false, 0, -0, 0n, "", null, undefined, NaN                               ║
 * ║                                                                            ║
 * ║ TRUTHY SURPRISES:                                                          ║
 * ║   "0", "false", [], {}, function(){}                                       ║
 * ║                                                                            ║
 * ║ == COERCION RULES:                                                         ║
 * ║   String vs Number   → String becomes Number                               ║
 * ║   Boolean vs anything → Boolean becomes Number (true→1, false→0)           ║
 * ║   null == undefined  → true (special case!)                                ║
 * ║   Object vs primitive → Object.valueOf() then .toString()                  ║
 * ║                                                                            ║
 * ║ COMMON GOTCHAS:                                                            ║
 * ║   [] == false        → true  ([] → "" → 0)                                 ║
 * ║   [] == ![]          → true  ([] == false)                                 ║
 * ║   "10" > "9"         → false (string comparison: "1" < "9")                ║
 * ║   null > 0           → false                                               ║
 * ║   null >= 0          → true  (null → 0 for comparison only!)               ║
 * ║   typeof null        → "object" (bug)                                      ║
 * ║   typeof NaN         → "number"                                            ║
 * ║   0.1 + 0.2 === 0.3  → false (floating point)                              ║
 * ║                                                                            ║
 * ║ BEST PRACTICES:                                                            ║
 * ║   • Use === instead of ==                                                  ║
 * ║   • Use explicit conversions (String(), Number(), Boolean())               ║
 * ║   • Use Number.isNaN() not isNaN()                                         ║
 * ║   • Check for null with === null                                           ║
 * ║   • Use value == null to check for null OR undefined                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/19-type-coercion/09-interview-qa.js
 */


// Verify file loads
console.log('Type Coercion module complete!');
console.log('Topics covered:');
console.log('  00 - Coercion basics');
console.log('  01 - To String conversion');
console.log('  02 - To Number conversion');
console.log('  03 - To Boolean conversion');
console.log('  04 - Equality operators (== vs ===)');
console.log('  05 - Comparison operators');
console.log('  06 - Operators and coercion');
console.log('  07 - Common gotchas');
console.log('  08 - Tricky examples');
console.log('  09 - Interview Q&A');
console.log('\n=== ALL MODULES COMPLETE! ===');
