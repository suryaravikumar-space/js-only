/**
 * TYPE COERCION: 01 - To String Conversion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ JavaScript converts values to strings in predictable ways:                 ║
 * ║                                                                            ║
 * ║   String(value)    - Explicit conversion (preferred)                       ║
 * ║   value.toString() - Method call (fails on null/undefined)                 ║
 * ║   value + ''       - Implicit via concatenation                            ║
 * ║   `${value}`       - Template literal (same as String())                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE STRING CONVERSION - Real World Justification                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. DISPLAYING VALUES                                                        │
 * │    → User IDs, prices, counts in UI                                         │
 * │    → Logging and debugging                                                  │
 * │                                                                             │
 * │ 2. STRING CONCATENATION                                                     │
 * │    → Building URLs, messages, file paths                                    │
 * │                                                                             │
 * │ 3. LOCAL STORAGE / COOKIES                                                  │
 * │    → Only store strings, need to convert                                    │
 * │                                                                             │
 * │ 4. FORM VALUES                                                              │
 * │    → Input fields always return strings                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// STRING CONVERSION TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ STRING CONVERSION RESULTS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   VALUE                 │  String(value)                                    │
 * │   ──────────────────────┼────────────────────────────                       │
 * │   123                   │  "123"                                            │
 * │   -0                    │  "0"  (not "-0"!)                                 │
 * │   Infinity              │  "Infinity"                                       │
 * │   NaN                   │  "NaN"                                            │
 * │   true                  │  "true"                                           │
 * │   false                 │  "false"                                          │
 * │   null                  │  "null"                                           │
 * │   undefined             │  "undefined"                                      │
 * │   Symbol('x')           │  "Symbol(x)"                                      │
 * │   123n                  │  "123"                                            │
 * │   []                    │  ""  (empty string!)                              │
 * │   [1, 2, 3]             │  "1,2,3"                                          │
 * │   [[1], [2]]            │  "1,2"  (nested flattened)                        │
 * │   {}                    │  "[object Object]"                                │
 * │   {a: 1}                │  "[object Object]"                                │
 * │   function(){}          │  "function(){}"                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXPLICIT CONVERSION: String()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== String() Conversion ===\n');

// Primitives
console.log('A:', String(123));        // "123"
console.log('B:', String(-0));         // "0" (loses negative!)
console.log('C:', String(Infinity));   // "Infinity"
console.log('D:', String(NaN));        // "NaN"
console.log('E:', String(true));       // "true"
console.log('F:', String(false));      // "false"
console.log('G:', String(null));       // "null"
console.log('H:', String(undefined));  // "undefined"

// Arrays
console.log('I:', String([]));           // "" (empty!)
console.log('J:', String([1, 2, 3]));    // "1,2,3"
console.log('K:', String([[1], [2]]));   // "1,2" (flattened)
console.log('L:', String([null, undefined])); // ","

// Objects
console.log('M:', String({}));           // "[object Object]"
console.log('N:', String({a: 1}));       // "[object Object]"


// ═══════════════════════════════════════════════════════════════════════════════
// METHOD: .toString()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== .toString() Method ===\n');

console.log('O:', (123).toString());     // "123"
console.log('P:', true.toString());      // "true"
console.log('Q:', [1, 2].toString());    // "1,2"

// GOTCHA: Fails on null and undefined!
try {
  null.toString();
} catch (e) {
  console.log('R: null.toString() throws:', e.name);
}

try {
  undefined.toString();
} catch (e) {
  console.log('S: undefined.toString() throws:', e.name);
}

// Number toString with radix (base)
console.log('T:', (255).toString(16));   // "ff" (hex)
console.log('U:', (255).toString(2));    // "11111111" (binary)
console.log('V:', (255).toString(8));    // "377" (octal)


// ═══════════════════════════════════════════════════════════════════════════════
// IMPLICIT CONVERSION: + ''
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Implicit + "" Conversion ===\n');

console.log('W:', 123 + '');         // "123"
console.log('X:', true + '');        // "true"
console.log('Y:', null + '');        // "null"
console.log('Z:', undefined + '');   // "undefined"
console.log('AA:', [] + '');         // ""
console.log('AB:', {} + '');         // "[object Object]"


// ═══════════════════════════════════════════════════════════════════════════════
// TEMPLATE LITERALS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Template Literals ===\n');

const num = 42;
const bool = true;
const arr = [1, 2, 3];
const obj = { name: 'test' };

console.log('AC:', `${num}`);   // "42"
console.log('AD:', `${bool}`);  // "true"
console.log('AE:', `${arr}`);   // "1,2,3"
console.log('AF:', `${obj}`);   // "[object Object]"
console.log('AG:', `${null}`);  // "null"


// ═══════════════════════════════════════════════════════════════════════════════
// CUSTOM toString() METHOD
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Custom toString() ===\n');

const user = {
  name: 'Alice',
  age: 30,
  toString() {
    return `User(${this.name}, ${this.age})`;
  }
};

console.log('AH:', String(user));     // "User(Alice, 30)"
console.log('AI:', user + '');        // "User(Alice, 30)"
console.log('AJ:', `${user}`);        // "User(Alice, 30)"

// Array with custom toString
const specialArray = [1, 2, 3];
specialArray.toString = function() {
  return this.join(' | ');
};

console.log('AK:', String(specialArray));  // "1 | 2 | 3"


// ═══════════════════════════════════════════════════════════════════════════════
// TRICKY CASES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Tricky Cases ===\n');

// -0 loses its sign
console.log('AL:', String(-0));              // "0"
console.log('AM:', (-0).toString());         // "0"
console.log('AN:', JSON.stringify(-0));      // "0"

// Very large/small numbers
console.log('AO:', String(1e21));            // "1e+21" (scientific)
console.log('AP:', String(0.0000001));       // "1e-7" (scientific)

// Arrays with holes
const sparse = [1, , 3];  // Hole at index 1
console.log('AQ:', String(sparse));          // "1,,3"

// Nested arrays flatten
console.log('AR:', String([1, [2, [3]]]));   // "1,2,3"


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript converts values to strings in several ways:                     │
 * │                                                                             │
 * │ 1. String(value) - Safest, works with null/undefined                        │
 * │ 2. value.toString() - Throws on null/undefined                              │
 * │ 3. value + '' - Implicit, same as String()                                  │
 * │ 4. `${value}` - Template literal, same as String()                          │
 * │                                                                             │
 * │ Key conversions to memorize:                                                │
 * │ • null → 'null', undefined → 'undefined'                                    │
 * │ • [] → '' (empty string, common gotcha!)                                    │
 * │ • {} → '[object Object]'                                                    │
 * │ • [1,2,3] → '1,2,3' (joined with comma)                                     │
 * │ • -0 → '0' (loses the negative sign)                                        │
 * │                                                                             │
 * │ Objects can customize conversion with toString() method.                    │
 * │ For JSON, use JSON.stringify() instead."                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/01-to-string.js
 */
