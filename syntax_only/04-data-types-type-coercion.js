// ============================================
// TOPIC 4: Data Types & Type Coercion
// ============================================

console.log("=== PART 1: Primitive Data Types ===");

// JavaScript has 7 primitive types:
const str = "Hello";           // String
const num = 42;                // Number
const bool = true;             // Boolean
const nothing = null;          // Null
const notDefined = undefined;  // Undefined
const sym = Symbol("id");      // Symbol (ES6)
const big = 123n;              // BigInt (ES2020)

console.log("String:", typeof str);
console.log("Number:", typeof num);
console.log("Boolean:", typeof bool);
console.log("Null:", typeof nothing);        // "object" (bug!)
console.log("Undefined:", typeof notDefined);
console.log("Symbol:", typeof sym);
console.log("BigInt:", typeof big);

console.log("\n=== PART 2: The typeof null Bug ===");

// ❌ Famous JavaScript bug (since 1995!)
console.log("typeof null:", typeof null); // "object" 😱

// ✅ Correct way to check for null:
console.log("null === null:", null === null);
console.log("!value && typeof value === 'object':",
  !nothing && typeof nothing === "object");

console.log("\n=== PART 3: Arrays and Objects ===");

const arr = [1, 2, 3];
const obj = { name: "John" };

// ❌ WRONG: typeof can't distinguish
console.log("typeof []:", typeof arr);  // "object"
console.log("typeof {}:", typeof obj);  // "object"

// ✅ CORRECT: Use proper checks
console.log("Array.isArray([]):", Array.isArray(arr));
console.log("Array.isArray({}):", Array.isArray(obj));

console.log("\n=== PART 4: The + Operator Trap ===");

// ❌ + is confusing (addition OR concatenation?)
console.log("1 + 2:", 1 + 2);           // 3 (both numbers)
console.log("1 + '2':", 1 + "2");       // "12" (string wins!)
console.log("'1' + 2:", "1" + 2);       // "12"
console.log("'1' + '2':", "1" + "2");   // "12"
console.log("true + true:", true + true); // 2 (true = 1)
console.log("[] + []:", [] + []);       // "" (empty string)
console.log("{} + []:", {} + []);       // "[object Object]"

// ✅ CORRECT: Explicit conversion
console.log("Number('5') + 2:", Number("5") + 2);   // 7
console.log("String(1) + '2':", String(1) + "2");   // "12"

console.log("\n=== PART 5: Other Operators Convert to Number ===");

// ✅ -, *, /, % always convert to number
console.log("'5' - 2:", "5" - 2);       // 3
console.log("'10' * 2:", "10" * 2);     // 20
console.log("'20' / 4:", "20" / 4);     // 5
console.log("'10' % 3:", "10" % 3);     // 1

// ❌ But watch out for NaN:
console.log("'hello' - 2:", "hello" - 2);  // NaN
console.log("'5abc' * 2:", "5abc" * 2);    // NaN

console.log("\n=== PART 6: NaN - The Weird Number ===");

// ❌ NaN is a number!
console.log("typeof NaN:", typeof NaN); // "number" 🤯

// ❌ NaN is not equal to itself!
console.log("NaN === NaN:", NaN === NaN);   // false 😱
console.log("NaN == NaN:", NaN == NaN);     // false

// ✅ CORRECT: Use Number.isNaN()
console.log("Number.isNaN(NaN):", Number.isNaN(NaN));         // true
console.log("Number.isNaN('hello'):", Number.isNaN("hello")); // false

// ❌ WRONG: Old isNaN() converts to number first
console.log("isNaN('hello'):", isNaN("hello"));     // true (wrong!)
console.log("isNaN(undefined):", isNaN(undefined)); // true (wrong!)

console.log("\n=== PART 7: Truthy and Falsy Values ===");

// Falsy values (only 8):
console.log("Boolean(false):", Boolean(false));       // false
console.log("Boolean(0):", Boolean(0));               // false
console.log("Boolean(-0):", Boolean(-0));             // false
console.log("Boolean(0n):", Boolean(0n));             // false (BigInt)
console.log("Boolean(''):", Boolean(""));             // false
console.log("Boolean(null):", Boolean(null));         // false
console.log("Boolean(undefined):", Boolean(undefined)); // false
console.log("Boolean(NaN):", Boolean(NaN));           // false

// Everything else is truthy:
console.log("Boolean('0'):", Boolean("0"));           // true (string!)
console.log("Boolean('false'):", Boolean("false"));   // true (string!)
console.log("Boolean([]):", Boolean([]));             // true (empty array!)
console.log("Boolean({}):", Boolean({}));             // true (empty object!)
console.log("Boolean(function(){}):", Boolean(function(){})); // true

console.log("\n=== PART 8: == vs === (Equality) ===");

// ❌ == (loose equality) does type coercion
console.log("1 == '1':", 1 == "1");           // true (coercion!)
console.log("0 == false:", 0 == false);       // true
console.log("null == undefined:", null == undefined); // true
console.log("[] == ![]:", [] == ![]);         // true 🤬

// ✅ === (strict equality) no coercion
console.log("1 === '1':", 1 === "1");         // false
console.log("0 === false:", 0 === false);     // false
console.log("null === undefined:", null === undefined); // false
console.log("[] === ![]:", [] === ![]);       // false

console.log("\n=== PART 9: Type Conversion Methods ===");

// String conversion
console.log("String(123):", String(123));           // "123"
console.log("String(true):", String(true));         // "true"
console.log("String(null):", String(null));         // "null"
console.log("String(undefined):", String(undefined)); // "undefined"
console.log("(123).toString():", (123).toString()); // "123"

// Number conversion
console.log("Number('123'):", Number("123"));       // 123
console.log("Number('12.34'):", Number("12.34"));   // 12.34
console.log("Number(''):", Number(""));             // 0 (!)
console.log("Number(' '):", Number(" "));           // 0 (!)
console.log("Number('hello'):", Number("hello"));   // NaN
console.log("Number(true):", Number(true));         // 1
console.log("Number(false):", Number(false));       // 0
console.log("Number(null):", Number(null));         // 0 (!)
console.log("Number(undefined):", Number(undefined)); // NaN

// parseInt / parseFloat
console.log("parseInt('123px'):", parseInt("123px"));     // 123
console.log("parseInt('12.34'):", parseInt("12.34"));     // 12
console.log("parseFloat('12.34px'):", parseFloat("12.34px")); // 12.34

// Boolean conversion
console.log("Boolean(1):", Boolean(1));             // true
console.log("Boolean(0):", Boolean(0));             // false
console.log("Boolean('hi'):", Boolean("hi"));       // true
console.log("Boolean(''):", Boolean(""));           // false

console.log("\n=== PART 10: 0.1 + 0.2 Problem ===");

// ❌ Floating point precision issue
console.log("0.1 + 0.2:", 0.1 + 0.2);               // 0.30000000000000004
console.log("0.1 + 0.2 === 0.3:", 0.1 + 0.2 === 0.3); // false!

// ✅ Solutions:
console.log("(0.1 + 0.2).toFixed(2):", (0.1 + 0.2).toFixed(2)); // "0.30"
console.log("Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON:",
  Math.abs(0.1 + 0.2 - 0.3) < Number.EPSILON); // true

console.log("\n=== PART 11: Special Numbers ===");

console.log("Infinity:", 1 / 0);              // Infinity
console.log("-Infinity:", -1 / 0);            // -Infinity
console.log("typeof Infinity:", typeof Infinity); // "number"

console.log("Number.MAX_VALUE:", Number.MAX_VALUE);
console.log("Number.MIN_VALUE:", Number.MIN_VALUE);
console.log("Number.MAX_SAFE_INTEGER:", Number.MAX_SAFE_INTEGER);
console.log("Number.MIN_SAFE_INTEGER:", Number.MIN_SAFE_INTEGER);

console.log("\n=== PART 12: Interview Traps ===");

// Trap 1: Empty string to number
console.log("Trap 1 - Number(''):", Number(""));   // 0 (not NaN!)

// Trap 2: Array coercion
console.log("Trap 2 - [1,2,3] + [4,5,6]:", [1,2,3] + [4,5,6]); // "1,2,34,5,6"

// Trap 3: Object to primitive
console.log("Trap 3 - {} + {}:", {} + {});         // "[object Object][object Object]"

// Trap 4: Unary +
console.log("Trap 4 - +'123':", +"123");           // 123 (converts to number)
console.log("Trap 4 - +true:", +true);             // 1
console.log("Trap 4 - +false:", +false);           // 0

// Trap 5: Double negation
console.log("Trap 5 - !!'hello':", !!"hello");     // true (converts to boolean)
console.log("Trap 5 - !!0:", !!0);                 // false

console.log("\n=== PART 13: Real-World Type Checking ===");

function isString(value) {
  return typeof value === 'string';
}

function isNumber(value) {
  return typeof value === 'number' && !isNaN(value);
}

function isArray(value) {
  return Array.isArray(value);
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function isNull(value) {
  return value === null;
}

function isUndefined(value) {
  return value === undefined;
}

console.log("isString('hello'):", isString("hello"));
console.log("isNumber(123):", isNumber(123));
console.log("isArray([]):", isArray([]));
console.log("isObject({}):", isObject({}));
console.log("isNull(null):", isNull(null));
console.log("isUndefined(undefined):", isUndefined(undefined));

console.log("\n=== PART 14: Common Coercion Mistakes ===");

// Mistake 1: Truthy/Falsy in conditions
const count = 0;
if (count) { // ❌ 0 is falsy!
  console.log("This won't run");
}
if (count !== undefined && count !== null) { // ✅ Better
  console.log("This will run:", count);
}

// Mistake 2: String concatenation
const age = 25;
console.log("I am " + age + " years old"); // ✅ Works but...
console.log(`I am ${age} years old`);      // ✅ Better (template literals)

// Mistake 3: Comparing different types
console.log("5 == 5:", "5" == 5);    // true (coercion!)
console.log("5 === 5:", "5" === 5);  // false (correct!)

console.log("\n=== SUMMARY ===");
/*
┌──────────────────────────────────────────────────────────────┐
│  PRIMITIVES: String, Number, Boolean, Null, Undefined,      │
│              Symbol, BigInt                                  │
│                                                              │
│  typeof TRAPS:                                               │
│  • typeof null === "object" (bug!)                          │
│  • typeof [] === "object" (use Array.isArray)               │
│  • typeof NaN === "number"                                  │
│                                                              │
│  COERCION RULES:                                             │
│  • + → string if any operand is string                      │
│  • -, *, /, % → always convert to number                   │
│  • == → loose equality (coercion)                           │
│  • === → strict equality (no coercion)                      │
│                                                              │
│  FALSY VALUES (only 8):                                      │
│  false, 0, -0, 0n, "", null, undefined, NaN                 │
│                                                              │
│  NaN FACTS:                                                  │
│  • typeof NaN === "number"                                  │
│  • NaN !== NaN (only value not equal to itself)            │
│  • Use Number.isNaN() to check                              │
│                                                              │
│  BEST PRACTICES:                                             │
│  • Always use === (not ==)                                  │
│  • Explicitly convert types                                 │
│  • Use Array.isArray() for arrays                           │
│  • Use Number.isNaN() for NaN                               │
│  • Check null with === null                                 │
└──────────────────────────────────────────────────────────────┘
*/

// 📌 GOLDEN RULES:
// 1. "+ is weird (string wins), everything else converts to number"
// 2. "typeof null is object (bug!)"
// 3. "Always use === (never ==)"
// 4. "NaN !== NaN (use Number.isNaN)"
// 5. "Only 8 falsy values, everything else is truthy"