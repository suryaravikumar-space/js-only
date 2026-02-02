/**
 * TYPE COERCION: 00 - Coercion Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Type coercion = JavaScript automatically converts one type to another.     ║
 * ║                                                                            ║
 * ║   "5" + 3    → "53"   (number coerced to string)                           ║
 * ║   "5" - 3    → 2      (string coerced to number)                           ║
 * ║   !!"hello"  → true   (string coerced to boolean)                          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN COERCION HAPPENS - Understanding Context                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. OPERATORS (+, -, *, /, ==, <, etc.)                                      │
 * │    → JavaScript needs compatible types for operations                       │
 * │                                                                             │
 * │ 2. CONDITIONALS (if, while, ternary)                                        │
 * │    → JavaScript needs a boolean                                             │
 * │                                                                             │
 * │ 3. BUILT-IN FUNCTIONS (parseInt, alert, console.log)                        │
 * │    → Functions expect specific types                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXPLICIT vs IMPLICIT COERCION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ EXPLICIT COERCION (You do it intentionally)                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   String(123)      → "123"                                                  │
 * │   Number("456")    → 456                                                    │
 * │   Boolean(1)       → true                                                   │
 * │   parseInt("10px") → 10                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ IMPLICIT COERCION (JavaScript does it automatically)                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   "5" + 3          → "53"      (+ with string = concatenation)              │
 * │   "5" - 3          → 2         (- always numeric)                           │
 * │   if ("hello")     → true      (string → boolean in condition)              │
 * │   5 == "5"         → true      (coercion before comparison)                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('=== Explicit Coercion ===');
console.log('A: String(123):', String(123));        // "123"
console.log('B: Number("456"):', Number('456'));    // 456
console.log('C: Boolean(1):', Boolean(1));          // true
console.log('D: parseInt("10px"):', parseInt('10px')); // 10

console.log('\n=== Implicit Coercion ===');
console.log('E: "5" + 3:', '5' + 3);                // "53"
console.log('F: "5" - 3:', '5' - 3);                // 2
console.log('G: "5" * 2:', '5' * 2);                // 10
console.log('H: "hello" && 123:', 'hello' && 123);  // 123


// ═══════════════════════════════════════════════════════════════════════════════
// THE THREE CONVERSION TYPES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ JavaScript converts to THREE primitive types                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. TO STRING                                                                │
 * │    • String(value)                                                          │
 * │    • value.toString()                                                       │
 * │    • "" + value                                                             │
 * │    • Template literals `${value}`                                           │
 * │                                                                             │
 * │ 2. TO NUMBER                                                                │
 * │    • Number(value)                                                          │
 * │    • +value (unary plus)                                                    │
 * │    • parseInt(value), parseFloat(value)                                     │
 * │    • Math operations (-, *, /, %)                                           │
 * │                                                                             │
 * │ 3. TO BOOLEAN                                                               │
 * │    • Boolean(value)                                                         │
 * │    • !!value                                                                │
 * │    • Conditions (if, while, &&, ||, ?)                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== To String ===');
console.log('I:', String(123));       // "123"
console.log('J:', String(true));      // "true"
console.log('K:', String(null));      // "null"
console.log('L:', String(undefined)); // "undefined"
console.log('M:', String([1,2,3]));   // "1,2,3"
console.log('N:', String({a:1}));     // "[object Object]"

console.log('\n=== To Number ===');
console.log('O:', Number("123"));     // 123
console.log('P:', Number("123.45")); // 123.45
console.log('Q:', Number(""));        // 0
console.log('R:', Number("hello"));   // NaN
console.log('S:', Number(true));      // 1
console.log('T:', Number(false));     // 0
console.log('U:', Number(null));      // 0
console.log('V:', Number(undefined)); // NaN

console.log('\n=== To Boolean ===');
console.log('W:', Boolean(1));        // true
console.log('X:', Boolean(0));        // false
console.log('Y:', Boolean("hello"));  // true
console.log('Z:', Boolean(""));       // false


// ═══════════════════════════════════════════════════════════════════════════════
// TRUTHY AND FALSY VALUES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ FALSY VALUES (Only 8!)                                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   false                                                                     │
 * │   0, -0, 0n (BigInt zero)                                                   │
 * │   "" (empty string)                                                         │
 * │   null                                                                      │
 * │   undefined                                                                 │
 * │   NaN                                                                       │
 * │                                                                             │
 * │ EVERYTHING ELSE IS TRUTHY!                                                  │
 * │   Including: "0", "false", [], {}, functions                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Falsy Values ===');
const falsyValues = [false, 0, -0, 0n, '', null, undefined, NaN];
falsyValues.forEach((val, i) => {
  console.log(`  ${i}: Boolean(${JSON.stringify(val)}) →`, Boolean(val));
});

console.log('\n=== Truthy Surprises ===');
console.log('AA: Boolean("0"):', Boolean('0'));         // true!
console.log('AB: Boolean("false"):', Boolean('false')); // true!
console.log('AC: Boolean([]):', Boolean([]));           // true!
console.log('AD: Boolean({}):', Boolean({}));           // true!


// ═══════════════════════════════════════════════════════════════════════════════
// OBJECT TO PRIMITIVE CONVERSION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW OBJECTS CONVERT TO PRIMITIVES                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ JavaScript calls these methods in order:                                    │
 * │                                                                             │
 * │ For "string" hint (like alert):                                             │
 * │   1. toString()                                                             │
 * │   2. valueOf()                                                              │
 * │                                                                             │
 * │ For "number" hint (like math operations):                                   │
 * │   1. valueOf()                                                              │
 * │   2. toString()                                                             │
 * │                                                                             │
 * │ For "default" hint (like + operator):                                       │
 * │   Usually same as "number"                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const customObj = {
  valueOf() {
    console.log('  valueOf called');
    return 42;
  },
  toString() {
    console.log('  toString called');
    return 'custom string';
  }
};

console.log('\n=== Object to Primitive ===');
console.log('AE: customObj + 0:', customObj + 0);  // valueOf → 42
console.log('AF: String(customObj):', String(customObj));  // toString


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Type coercion is when JavaScript automatically converts one type to        │
 * │ another. There are two kinds:                                               │
 * │                                                                             │
 * │ EXPLICIT: You deliberately convert using String(), Number(), Boolean()      │
 * │ IMPLICIT: JavaScript converts automatically during operations               │
 * │                                                                             │
 * │ Key rules:                                                                  │
 * │ • + with string = concatenation (other values become strings)               │
 * │ • -, *, /, % = numeric operations (strings become numbers)                  │
 * │ • == uses coercion, === does not                                            │
 * │ • Conditions convert to boolean (8 falsy values, rest truthy)               │
 * │                                                                             │
 * │ Falsy values: false, 0, '', null, undefined, NaN, -0, 0n                    │
 * │ Truthy surprises: '0', 'false', [], {} are all truthy!                      │
 * │                                                                             │
 * │ Best practice: Use explicit conversion for clarity, === to avoid bugs."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/00-coercion-basics.js
 */
