/**
 * Questions 71-80: Operators & Comparisons
 *
 * Predict the output for each code snippet.
 */

// Question 71: == vs ===
console.log("Q71a:", 1 == "1");
console.log("Q71b:", 1 === "1");
console.log("Q71c:", null == undefined);
console.log("Q71d:", null === undefined);

// Question 72: Comparison with null and undefined
console.log("Q72a:", null == 0);
console.log("Q72b:", null > 0);
console.log("Q72c:", null >= 0);
console.log("Q72d:", undefined == 0);
console.log("Q72e:", undefined > 0);

// Question 73: Short-circuit evaluation
console.log("Q73a:", true || "Hello");
console.log("Q73b:", false || "Hello");
console.log("Q73c:", true && "Hello");
console.log("Q73d:", false && "Hello");
console.log("Q73e:", null || "default");
console.log("Q73f:", "" || "fallback");

// Question 74: Nullish coalescing
console.log("Q74a:", null ?? "default");
console.log("Q74b:", undefined ?? "default");
console.log("Q74c:", 0 ?? "default");
console.log("Q74d:", "" ?? "default");
console.log("Q74e:", false ?? "default");

// Question 75: Optional chaining
const obj = {
    a: {
        b: {
            c: 42
        }
    }
};
console.log("Q75a:", obj?.a?.b?.c);
console.log("Q75b:", obj?.x?.y?.z);
console.log("Q75c:", obj.a?.b?.c);
console.log("Q75d:", obj?.a?.b?.d ?? "not found");

// Question 76: typeof quirks
console.log("Q76a:", typeof undefined);
console.log("Q76b:", typeof null);
console.log("Q76c:", typeof NaN);
console.log("Q76d:", typeof function() {});
console.log("Q76e:", typeof []);
console.log("Q76f:", typeof {});

// Question 77: instanceof
console.log("Q77a:", [] instanceof Array);
console.log("Q77b:", [] instanceof Object);
console.log("Q77c:", {} instanceof Array);
console.log("Q77d:", (() => {}) instanceof Function);
console.log("Q77e:", new Date() instanceof Object);

// Question 78: Increment/Decrement
let x = 5;
console.log("Q78a:", x++);
console.log("Q78b:", x);
console.log("Q78c:", ++x);
console.log("Q78d:", x);

let y = 5;
console.log("Q78e:", y-- + --y);

// Question 79: Comma operator
let a = (1, 2, 3);
console.log("Q79a:", a);

let b = 1;
let c = (b++, b++, b);
console.log("Q79b:", c);

console.log("Q79c:", (console.log("Q79d: First"), "Q79e: Second"));

// Question 80: Bitwise operators
console.log("Q80a:", 5 & 3);
console.log("Q80b:", 5 | 3);
console.log("Q80c:", 5 ^ 3);
console.log("Q80d:", ~5);
console.log("Q80e:", 5 << 1);
console.log("Q80f:", 5 >> 1);
console.log("Q80g:", ~~3.7);
