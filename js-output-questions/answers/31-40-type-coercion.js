/**
 * Answers 31-40: Type Coercion
 *
 * Detailed explanations for each question.
 */

// Question 31: String + Number
// Output: "53", "53", "532", "82"
console.log("Q31a:", "5" + 3);     // "53"
console.log("Q31b:", 5 + "3");     // "53"
console.log("Q31c:", "5" + 3 + 2); // "532"
console.log("Q31d:", 5 + 3 + "2"); // "82"
/**
 * Explanation:
 * + with string: concatenation wins, converts number to string
 * Q31a/b: String + Number = String concatenation
 * Q31c: Left to right: "5"+3="53", "53"+2="532"
 * Q31d: Left to right: 5+3=8, 8+"2"="82"
 */

// Question 32: String - Number
// Output: 2, 2, NaN
console.log("Q32a:", "5" - 3);     // 2
console.log("Q32b:", "5" - "3");   // 2
console.log("Q32c:", "five" - 3);  // NaN
/**
 * Explanation:
 * - always converts to numbers (no string subtraction)
 * "5" becomes 5, "3" becomes 3
 * "five" can't convert to number, becomes NaN
 */

// Question 33: Comparisons with type coercion
// Output: true, false, false
console.log("Q33a:", "10" > 9);       // true (string to number)
console.log("Q33b:", "10" > "9");     // false (string comparison!)
console.log("Q33c:", "apple" > "banana"); // false
/**
 * Explanation:
 * Q33a: Different types = numeric comparison. "10" -> 10. 10 > 9 = true
 * Q33b: Same types = string comparison (alphabetical/lexicographic)
 *       "1" (49) comes before "9" (57) in ASCII, so "10" < "9"
 * Q33c: String comparison: "a" (97) < "b" (98), so false
 */

// Question 34: Boolean in arithmetic
// Output: 2, 1, "true1", 0
console.log("Q34a:", true + true);  // 2
console.log("Q34b:", true + false); // 1
console.log("Q34c:", true + "1");   // "true1"
console.log("Q34d:", false + null); // 0
/**
 * Explanation:
 * true = 1, false = 0, null = 0 (in numeric context)
 * Q34a: 1 + 1 = 2
 * Q34b: 1 + 0 = 1
 * Q34c: String wins: true -> "true", concat "true1"
 * Q34d: 0 + 0 = 0
 */

// Question 35: null and undefined coercion
// Output: 1, NaN, NaN, "null1"
console.log("Q35a:", null + 1);       // 1
console.log("Q35b:", undefined + 1);  // NaN
console.log("Q35c:", null + undefined); // NaN
console.log("Q35d:", null + "1");     // "null1"
/**
 * Explanation:
 * null -> 0 (numeric), undefined -> NaN (numeric)
 * Q35a: 0 + 1 = 1
 * Q35b: NaN + 1 = NaN
 * Q35c: 0 + NaN = NaN
 * Q35d: String wins: null -> "null", concat "null1"
 */

// Question 36: Object to primitive
// Output varies by environment, but typically:
// "[object Object]", "[object Object]", "[object Object][object Object]", ""
console.log("Q36a:", {} + []);   // "[object Object]" or 0
console.log("Q36b:", [] + {});   // "[object Object]"
console.log("Q36c:", {} + {});   // "[object Object][object Object]"
console.log("Q36d:", [] + []);   // ""
/**
 * Explanation:
 * Objects convert to primitives using toString()/valueOf()
 * {} -> "[object Object]"
 * [] -> "" (empty string)
 *
 * Q36a: Tricky! In console, {} might be parsed as block.
 *       As expression: "[object Object]" + "" = "[object Object]"
 * Q36b: "" + "[object Object]" = "[object Object]"
 * Q36c: "[object Object]" + "[object Object]"
 * Q36d: "" + "" = ""
 */

// Question 37: Array coercion
// Output: "12", "1,23,4", 0, 6
console.log("Q37a:", [1] + [2]);       // "12"
console.log("Q37b:", [1, 2] + [3, 4]); // "1,23,4"
console.log("Q37c:", [1] - [1]);       // 0
console.log("Q37d:", [2] * [3]);       // 6
/**
 * Explanation:
 * Arrays convert to strings by joining with commas
 * [1] -> "1", [1,2] -> "1,2"
 *
 * Q37a: "1" + "2" = "12"
 * Q37b: "1,2" + "3,4" = "1,23,4"
 * Q37c: - forces numeric: "1" - "1" = 1 - 1 = 0
 * Q37d: "2" * "3" = 2 * 3 = 6
 */

// Question 38: Falsy values
// Output: false, false, true, true, true, false
console.log("Q38a:", Boolean(""));     // false (empty string)
console.log("Q38b:", Boolean(0));      // false
console.log("Q38c:", Boolean("0"));    // true (non-empty string!)
console.log("Q38d:", Boolean([]));     // true (empty array!)
console.log("Q38e:", Boolean({}));     // true (empty object!)
console.log("Q38f:", Boolean(null));   // false
/**
 * Explanation:
 * Falsy values: false, 0, -0, 0n, "", null, undefined, NaN
 * EVERYTHING ELSE is truthy, including:
 * - "0", "false" (non-empty strings)
 * - [], {} (empty arrays/objects)
 */

// Question 39: NaN quirks
// Output: false, true, false, "number"
console.log("Q39a:", NaN === NaN);           // false
console.log("Q39b:", isNaN("hello"));        // true
console.log("Q39c:", Number.isNaN("hello")); // false
console.log("Q39d:", typeof NaN);            // "number"
/**
 * Explanation:
 * Q39a: NaN is NOT equal to anything, including itself!
 * Q39b: isNaN() coerces first: "hello" -> NaN -> true
 * Q39c: Number.isNaN() does NOT coerce - "hello" is not NaN
 * Q39d: Ironically, NaN is of type "number"
 */

// Question 40: Unary plus and minus
// Output: 42, 1, NaN, 0, 1, NaN
console.log("Q40a:", +"42");    // 42
console.log("Q40b:", +true);    // 1
console.log("Q40c:", +"hello"); // NaN
console.log("Q40d:", +[]);      // 0
console.log("Q40e:", +[1]);     // 1
console.log("Q40f:", +[1, 2]);  // NaN
/**
 * Explanation:
 * Unary + converts to number (same as Number())
 * Q40a: "42" -> 42
 * Q40b: true -> 1
 * Q40c: "hello" -> NaN
 * Q40d: [] -> "" -> 0
 * Q40e: [1] -> "1" -> 1
 * Q40f: [1,2] -> "1,2" -> NaN (can't convert)
 */

console.log("\n=== Summary ===");
console.log("1. + with string: concatenation");
console.log("2. Other operators: numeric conversion");
console.log("3. null = 0, undefined = NaN (numeric)");
console.log("4. Arrays: toString joins with commas");
console.log("5. Only 7 falsy values - everything else truthy");
console.log("6. NaN !== NaN, use Number.isNaN()");
