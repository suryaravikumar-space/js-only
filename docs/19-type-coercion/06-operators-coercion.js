/**
 * TYPE COERCION: 06 - Operators and Coercion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Different operators trigger different coercion rules:                      ║
 * ║                                                                            ║
 * ║   +  → If either is string, concatenate. Otherwise add numbers.            ║
 * ║   -, *, /, % → Always convert to numbers                                   ║
 * ║   &&, ||, ! → Convert to boolean for logic, return original value          ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE + OPERATOR (Most Confusing!)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== The + Operator ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ + OPERATOR RULES                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. If either operand is a string → STRING CONCATENATION                     │
 * │    "5" + 3 → "53"                                                           │
 * │    5 + "3" → "53"                                                           │
 * │                                                                             │
 * │ 2. Otherwise → NUMERIC ADDITION                                             │
 * │    5 + 3 → 8                                                                │
 * │    true + true → 2                                                          │
 * │                                                                             │
 * │ 3. Objects convert via ToPrimitive (valueOf then toString)                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// String + anything = concatenation
console.log('A: "5" + 3:', "5" + 3);             // "53"
console.log('B: 5 + "3":', 5 + "3");             // "53"
console.log('C: "5" + "3":', "5" + "3");         // "53"
console.log('D: "hello" + true:', "hello" + true); // "hellotrue"
console.log('E: "value: " + null:', "value: " + null); // "value: null"

// Number + number = addition
console.log('F: 5 + 3:', 5 + 3);                 // 8
console.log('G: true + true:', true + true);     // 2
console.log('H: true + false:', true + false);   // 1
console.log('I: null + 5:', null + 5);           // 5 (null → 0)
console.log('J: undefined + 5:', undefined + 5); // NaN

// Order matters!
console.log('K: 1 + 2 + "3":', 1 + 2 + "3");     // "33" (3 + "3")
console.log('L: "1" + 2 + 3:', "1" + 2 + 3);     // "123" (string from start)
console.log('M: 1 + "2" + 3:', 1 + "2" + 3);     // "123"


// ═══════════════════════════════════════════════════════════════════════════════
// + WITH OBJECTS AND ARRAYS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== + with Objects and Arrays ===\n');

// Arrays
console.log('N: [] + []:', [] + []);               // "" (both → "")
console.log('O: [] + {}:', [] + {});               // "[object Object]"
console.log('P: {} + []:', {} + []);               // "[object Object]" or 0
console.log('Q: [1,2] + [3,4]:', [1,2] + [3,4]);   // "1,23,4"
console.log('R: [1] + 1:', [1] + 1);               // "11"

// Objects
console.log('S: {} + 1:', {} + 1);                 // "[object Object]1"
console.log('T: {a:1} + 1:', {a:1} + 1);           // "[object Object]1"

// Custom valueOf
const numObj = {
  value: 10,
  valueOf() { return this.value; }
};
console.log('U: numObj + 5:', numObj + 5);         // 15

// Custom toString (used when valueOf returns object)
const strObj = {
  valueOf() { return this; },  // Returns object, so toString is used
  toString() { return "hello"; }
};
console.log('V: strObj + "!":', strObj + "!");     // "hello!"


// ═══════════════════════════════════════════════════════════════════════════════
// UNARY + (Convert to Number)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Unary + ===\n');

console.log('W: +"5":', +"5");           // 5
console.log('X: +"5.5":', +"5.5");       // 5.5
console.log('Y: +"":', +"");             // 0
console.log('Z: +"hello":', +"hello");   // NaN
console.log('AA: +true:', +true);        // 1
console.log('AB: +false:', +false);      // 0
console.log('AC: +null:', +null);        // 0
console.log('AD: +undefined:', +undefined); // NaN
console.log('AE: +[]:', +[]);            // 0
console.log('AF: +[5]:', +[5]);          // 5
console.log('AG: +{}:', +{});            // NaN


// ═══════════════════════════════════════════════════════════════════════════════
// MATH OPERATORS (-, *, /, %)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Math Operators (Always Numeric) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MATH OPERATORS ALWAYS CONVERT TO NUMBERS                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Subtraction
console.log('AH: "10" - 5:', "10" - 5);       // 5
console.log('AI: "10" - "3":', "10" - "3");   // 7
console.log('AJ: "hello" - 5:', "hello" - 5); // NaN

// Multiplication
console.log('AK: "10" * 2:', "10" * 2);       // 20
console.log('AL: "5" * "4":', "5" * "4");     // 20
console.log('AM: true * 10:', true * 10);     // 10

// Division
console.log('AN: "20" / 4:', "20" / 4);       // 5
console.log('AO: "20" / "4":', "20" / "4");   // 5
console.log('AP: 10 / 0:', 10 / 0);           // Infinity
console.log('AQ: -10 / 0:', -10 / 0);         // -Infinity

// Modulo
console.log('AR: "17" % 5:', "17" % 5);       // 2
console.log('AS: "17" % "5":', "17" % "5");   // 2


// ═══════════════════════════════════════════════════════════════════════════════
// LOGICAL OPERATORS (&&, ||, !)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Logical Operators ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LOGICAL OPERATORS RETURN VALUES, NOT BOOLEANS                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ && - Returns first falsy, or last value if all truthy                       │
 * │ || - Returns first truthy, or last value if all falsy                       │
 * │ ! - Always returns boolean                                                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// OR returns values
console.log('AT: 0 || "default":', 0 || "default");     // "default"
console.log('AU: "value" || "default":', "value" || "default"); // "value"
console.log('AV: null || undefined:', null || undefined); // undefined
console.log('AW: 0 || false || null:', 0 || false || null); // null

// AND returns values
console.log('AX: "hello" && "world":', "hello" && "world"); // "world"
console.log('AY: 0 && "world":', 0 && "world");         // 0
console.log('AZ: "hello" && 0 && "world":', "hello" && 0 && "world"); // 0

// NOT always returns boolean
console.log('BA: !0:', !0);             // true
console.log('BB: !"hello":', !"hello"); // false
console.log('BC: !null:', !null);       // true
console.log('BD: !!0:', !!0);           // false
console.log('BE: !!"hello":', !!"hello"); // true


// ═══════════════════════════════════════════════════════════════════════════════
// BITWISE OPERATORS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Bitwise Operators ===\n');

// Bitwise operators convert to 32-bit integers
console.log('BF: "5" | 0:', "5" | 0);     // 5 (quick integer conversion)
console.log('BG: 3.9 | 0:', 3.9 | 0);    // 3 (truncates decimal)
console.log('BH: -3.9 | 0:', -3.9 | 0);  // -3

console.log('BI: "5" & 3:', "5" & 3);     // 1
console.log('BJ: ~5:', ~5);               // -6 (bitwise NOT)
console.log('BK: ~~3.9:', ~~3.9);         // 3 (double NOT = truncate)


// ═══════════════════════════════════════════════════════════════════════════════
// INCREMENT/DECREMENT
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Increment/Decrement ===\n');

let x = "5";
x++;
console.log('BL: "5"++ →', x);  // 6 (converted to number)

let y = "5";
y--;
console.log('BM: "5"-- →', y);  // 4


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript operators trigger different coercion rules:                     │
 * │                                                                             │
 * │ + (binary):                                                                 │
 * │ • If either operand is string → concatenation                               │
 * │ • Otherwise → numeric addition                                              │
 * │ • '5' + 3 = '53', but 5 + 3 = 8                                             │
 * │ • Order matters: 1 + 2 + '3' = '33', '1' + 2 + 3 = '123'                    │
 * │                                                                             │
 * │ + (unary): Always converts to number                                        │
 * │ • +'5' = 5, +[] = 0, +{} = NaN                                              │
 * │                                                                             │
 * │ -, *, /, %: Always convert to numbers                                       │
 * │ • '10' - 5 = 5, '10' * 2 = 20                                               │
 * │                                                                             │
 * │ &&, ||: Convert to boolean for logic, return original value                 │
 * │ • 'hello' && 'world' = 'world'                                              │
 * │ • 0 || 'default' = 'default'                                                │
 * │                                                                             │
 * │ !: Always returns boolean                                                   │
 * │ • !'hello' = false, !!value = Boolean(value)"                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/06-operators-coercion.js
 */
