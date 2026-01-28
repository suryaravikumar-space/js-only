/**
 * Answers 71-80: Operators & Comparisons
 *
 * Detailed explanations for each question.
 */

// Question 71: == vs ===
// Output: true, false, true, false
console.log("Q71a:", 1 == "1");         // true
console.log("Q71b:", 1 === "1");        // false
console.log("Q71c:", null == undefined); // true
console.log("Q71d:", null === undefined); // false
/**
 * Explanation:
 * == (loose equality): performs type coercion
 * === (strict equality): no coercion, types must match
 *
 * Q71a: "1" is coerced to 1, 1 == 1 is true
 * Q71b: Different types (number vs string) = false
 * Q71c: null and undefined are == to each other (special case)
 * Q71d: Different types (null vs undefined) = false
 */

// Question 72: Comparison with null and undefined
// Output: false, false, true, false, false
console.log("Q72a:", null == 0);   // false
console.log("Q72b:", null > 0);    // false
console.log("Q72c:", null >= 0);   // true (!)
console.log("Q72d:", undefined == 0);  // false
console.log("Q72e:", undefined > 0);   // false
/**
 * Explanation:
 * This is one of JavaScript's weirdest behaviors!
 *
 * null == 0: null only equals null and undefined
 * null > 0: null is converted to 0, 0 > 0 is false
 * null >= 0: null is converted to 0, 0 >= 0 is true
 *
 * == doesn't convert null to 0, but > and >= do!
 * undefined converts to NaN, which is never equal/greater than anything.
 */

// Question 73: Short-circuit evaluation
// Output: true, "Hello", "Hello", false, "default", "fallback"
console.log("Q73a:", true || "Hello");    // true
console.log("Q73b:", false || "Hello");   // "Hello"
console.log("Q73c:", true && "Hello");    // "Hello"
console.log("Q73d:", false && "Hello");   // false
console.log("Q73e:", null || "default");  // "default"
console.log("Q73f:", "" || "fallback");   // "fallback"
/**
 * Explanation:
 * || returns first truthy value, or last value
 * && returns first falsy value, or last value
 *
 * Q73a: true is truthy, return it
 * Q73b: false is falsy, check next, "Hello" is truthy
 * Q73c: true is truthy, check next, return "Hello"
 * Q73d: false is falsy, return it immediately
 * Q73e: null is falsy, return "default"
 * Q73f: "" is falsy, return "fallback"
 */

// Question 74: Nullish coalescing
// Output: "default", "default", 0, "", false
console.log("Q74a:", null ?? "default");      // "default"
console.log("Q74b:", undefined ?? "default"); // "default"
console.log("Q74c:", 0 ?? "default");         // 0
console.log("Q74d:", "" ?? "default");        // ""
console.log("Q74e:", false ?? "default");     // false
/**
 * Explanation:
 * ?? only checks for null or undefined (not all falsy)
 * This is different from ||!
 *
 * || treats 0, "", false as falsy (uses default)
 * ?? only treats null/undefined as nullish (uses default)
 *
 * Use ?? when 0, "", false are valid values.
 */

// Question 75: Optional chaining
// Output: 42, undefined, 42, "not found"
const obj = {
    a: {
        b: {
            c: 42
        }
    }
};
console.log("Q75a:", obj?.a?.b?.c);              // 42
console.log("Q75b:", obj?.x?.y?.z);              // undefined
console.log("Q75c:", obj.a?.b?.c);               // 42
console.log("Q75d:", obj?.a?.b?.d ?? "not found"); // "not found"
/**
 * Explanation:
 * ?. returns undefined if any part is null/undefined
 * Instead of throwing error, it short-circuits to undefined.
 *
 * Q75a: All exist, returns 42
 * Q75b: x doesn't exist, returns undefined (no error!)
 * Q75c: a exists, so same as Q75a
 * Q75d: d doesn't exist, ?? provides fallback
 */

// Question 76: typeof quirks
// Output: "undefined", "object", "number", "function", "object", "object"
console.log("Q76a:", typeof undefined);        // "undefined"
console.log("Q76b:", typeof null);             // "object" (bug!)
console.log("Q76c:", typeof NaN);              // "number" (!)
console.log("Q76d:", typeof function() {});   // "function"
console.log("Q76e:", typeof []);               // "object"
console.log("Q76f:", typeof {});               // "object"
/**
 * Explanation:
 * typeof null = "object" is a famous JS bug (kept for compatibility)
 * typeof NaN = "number" because NaN is a numeric value
 * typeof [] = "object" because arrays are objects
 *
 * Use Array.isArray() to check for arrays.
 * Use obj === null to check for null.
 */

// Question 77: instanceof
// Output: true, true, false, true, true
console.log("Q77a:", [] instanceof Array);      // true
console.log("Q77b:", [] instanceof Object);     // true
console.log("Q77c:", {} instanceof Array);      // false
console.log("Q77d:", (() => {}) instanceof Function); // true
console.log("Q77e:", new Date() instanceof Object);   // true
/**
 * Explanation:
 * instanceof checks the prototype chain.
 *
 * Q77a: Array is in []'s prototype chain
 * Q77b: Object is in EVERYTHING's prototype chain
 * Q77c: {} is not an array
 * Q77d: Functions are instances of Function
 * Q77e: All objects inherit from Object
 */

// Question 78: Increment/Decrement
// Output: 5, 6, 7, 7, 8
let x = 5;
console.log("Q78a:", x++);  // 5 (returns then increments)
console.log("Q78b:", x);    // 6
console.log("Q78c:", ++x);  // 7 (increments then returns)
console.log("Q78d:", x);    // 7

let y = 5;
console.log("Q78e:", y-- + --y); // 5 + 3 = 8
/**
 * Explanation:
 * x++: post-increment - returns current value, THEN increments
 * ++x: pre-increment - increments FIRST, then returns new value
 *
 * Q78e: y-- returns 5 (y becomes 4), --y decrements to 3 and returns 3
 *       5 + 3 = 8
 */

// Question 79: Comma operator
// Output: 3, 3
let a = (1, 2, 3);
console.log("Q79a:", a);  // 3

let b = 1;
let c = (b++, b++, b);
console.log("Q79b:", c);  // 3

console.log("Q79c:", (console.log("Q79d: First"), "Q79e: Second"));
/**
 * Explanation:
 * Comma operator evaluates all expressions, returns the LAST one.
 *
 * Q79a: (1, 2, 3) evaluates all, returns 3
 * Q79b: b++ (b=2), b++ (b=3), returns b which is 3
 * Q79c: Logs "First", then returns "Second"
 */

// Question 80: Bitwise operators
// Output: 1, 7, 6, -6, 10, 2, 3
console.log("Q80a:", 5 & 3);   // 1 (AND)
console.log("Q80b:", 5 | 3);   // 7 (OR)
console.log("Q80c:", 5 ^ 3);   // 6 (XOR)
console.log("Q80d:", ~5);      // -6 (NOT)
console.log("Q80e:", 5 << 1);  // 10 (left shift)
console.log("Q80f:", 5 >> 1);  // 2 (right shift)
console.log("Q80g:", ~~3.7);   // 3 (double NOT = truncate)
/**
 * Explanation:
 * 5 = 101 in binary, 3 = 011
 *
 * Q80a: 101 & 011 = 001 = 1
 * Q80b: 101 | 011 = 111 = 7
 * Q80c: 101 ^ 011 = 110 = 6
 * Q80d: ~5 = -(5+1) = -6 (inverts all bits)
 * Q80e: 101 << 1 = 1010 = 10 (multiply by 2)
 * Q80f: 101 >> 1 = 10 = 2 (divide by 2)
 * Q80g: ~~3.7 truncates decimal (faster than Math.floor for positive)
 */

console.log("\n=== Summary ===");
console.log("1. === is safer than == (no type coercion)");
console.log("2. null >= 0 but null != 0 (weird!)");
console.log("3. || returns first truthy, && returns first falsy");
console.log("4. ?? only checks null/undefined (not 0, '', false)");
console.log("5. typeof null = 'object' (bug)");
console.log("6. x++ returns then increments, ++x increments then returns");
