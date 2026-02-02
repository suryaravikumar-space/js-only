/**
 * TYPE COERCION: 04 - Equality Operators (== vs ===)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ == (loose equality): Compares values AFTER coercion                        ║
 * ║ === (strict equality): Compares values AND types (no coercion)             ║
 * ║                                                                            ║
 * ║   5 == "5"    → true   (string coerced to number)                          ║
 * ║   5 === "5"   → false  (different types!)                                  ║
 * ║                                                                            ║
 * ║   RULE: Always use === unless you specifically need coercion.              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// STRICT EQUALITY (===)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Strict Equality (===) ===\n');

// Same type, same value = true
console.log('A: 5 === 5:', 5 === 5);           // true
console.log('B: "hello" === "hello":', 'hello' === 'hello');  // true
console.log('C: true === true:', true === true);  // true

// Different types = false (no coercion!)
console.log('\nD: 5 === "5":', 5 === '5');     // false
console.log('E: 0 === false:', 0 === false);  // false
console.log('F: "" === false:', '' === false);  // false
console.log('G: null === undefined:', null === undefined);  // false

// Special cases
console.log('\nH: NaN === NaN:', NaN === NaN);  // false! (NaN is never equal to itself)
console.log('I: Object.is(NaN, NaN):', Object.is(NaN, NaN));  // true (use this instead)


// ═══════════════════════════════════════════════════════════════════════════════
// LOOSE EQUALITY (==)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n\n=== Loose Equality (==) ===\n');

// String and Number: String becomes Number
console.log('J: 5 == "5":', 5 == '5');         // true (string → number)
console.log('K: 0 == "":', 0 == '');           // true (both become 0)
console.log('L: 42 == "42":', 42 == '42');     // true

// Boolean and anything: Boolean becomes Number first!
console.log('\nM: true == 1:', true == 1);       // true (true → 1)
console.log('N: false == 0:', false == 0);     // true (false → 0)
console.log('O: true == "1":', true == '1');   // true (true → 1, "1" → 1)
console.log('P: false == "":', false == '');   // true (false → 0, "" → 0)

// null and undefined
console.log('\nQ: null == undefined:', null == undefined);  // true (special case!)
console.log('R: null == 0:', null == 0);       // false (null only equals undefined)
console.log('S: undefined == 0:', undefined == 0);  // false


// ═══════════════════════════════════════════════════════════════════════════════
// ABSTRACT EQUALITY ALGORITHM (How == Works)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ HOW x == y WORKS (Simplified)                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Same type? → Compare directly (like ===)                                 │
 * │                                                                             │
 * │ 2. null == undefined? → true                                                │
 * │                                                                             │
 * │ 3. Number == String? → Convert string to number                             │
 * │                                                                             │
 * │ 4. Boolean == anything? → Convert boolean to number FIRST                   │
 * │    true → 1, false → 0, then compare again                                  │
 * │                                                                             │
 * │ 5. Object == primitive? → Convert object to primitive                       │
 * │    using valueOf/toString                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// TRICKY EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n\n=== Tricky Examples ===\n');

// The famous "wat" examples
console.log('T: [] == false:', [] == false);   // true!
// [] → "" → 0, false → 0, 0 == 0 → true

console.log('U: [] == ![]:', [] == ![]);       // true!
// [] == ![] → [] == false → "" == false → 0 == 0 → true

console.log('V: [1] == true:', [1] == true);   // true!
// [1] → "1" → 1, true → 1, 1 == 1 → true

console.log('W: [2] == true:', [2] == true);   // false!
// [2] → "2" → 2, true → 1, 2 == 1 → false

console.log('\nX: "0" == false:', '0' == false);  // true!
// "0" → 0, false → 0, 0 == 0 → true

console.log('Y: "0" == []:', '0' == []);       // false
// "0" == "" → false

console.log('Z: [] == "":', [] == '');         // true
// [] → "", "" == "" → true


// ═══════════════════════════════════════════════════════════════════════════════
// OBJECT COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n\n=== Object Comparison ===\n');

// Objects compare by REFERENCE, not content
const obj1 = { a: 1 };
const obj2 = { a: 1 };
const obj3 = obj1;

console.log('AA: {} == {}:', {} == {});        // false (different references)
console.log('AB: obj1 == obj2:', obj1 == obj2);  // false (different references)
console.log('AC: obj1 == obj3:', obj1 == obj3);  // true (same reference)

console.log('\nAD: [] == []:', [] == []);        // false
console.log('AE: [1,2] == [1,2]:', [1,2] == [1,2]);  // false

// Object compared to primitive: Object converts
console.log('\nAF: [1] == 1:', [1] == 1);       // true ([1] → "1" → 1)
console.log('AG: ["1"] == 1:', ['1'] == 1);   // true


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN TO USE == (RARE!)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LEGITIMATE USES OF ==                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Check for null OR undefined in one go:                                   │
 * │    if (value == null) { ... }  // true for null AND undefined               │
 * │                                                                             │
 * │ That's basically it! Always use === otherwise.                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function process(value) {
  // Check for null or undefined
  if (value == null) {
    return 'No value provided';
  }
  return `Processing: ${value}`;
}

console.log('\n\n=== Legitimate == Use ===\n');
console.log('AH:', process(null));       // "No value provided"
console.log('AI:', process(undefined));  // "No value provided"
console.log('AJ:', process(0));          // "Processing: 0"
console.log('AK:', process(''));         // "Processing: "


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON RESULTS                                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Expression            ==      ===                                         │
 * │   ───────────────────────────────────                                       │
 * │   5 vs "5"              true    false                                       │
 * │   0 vs ""               true    false                                       │
 * │   0 vs "0"              true    false                                       │
 * │   false vs "0"          true    false                                       │
 * │   false vs ""           true    false                                       │
 * │   null vs undefined     true    false                                       │
 * │   [] vs false           true    false                                       │
 * │   [] vs ""              true    false                                       │
 * │   [1] vs 1              true    false                                       │
 * │   NaN vs NaN            false   false    (use Object.is!)                   │
 * │   {} vs {}              false   false    (reference check)                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "== performs type coercion before comparison, === does not.                 │
 * │                                                                             │
 * │ With ==:                                                                    │
 * │ • String vs Number: String becomes Number                                   │
 * │ • Boolean vs anything: Boolean becomes Number FIRST (true→1, false→0)       │
 * │ • null == undefined is true (special case)                                  │
 * │ • Object vs primitive: Object converts using valueOf/toString               │
 * │                                                                             │
 * │ With ===:                                                                   │
 * │ • Different types? Always false                                             │
 * │ • Same types? Compare values directly                                       │
 * │                                                                             │
 * │ Gotchas:                                                                    │
 * │ • [] == false is true ([] → "" → 0, false → 0)                              │
 * │ • NaN === NaN is false (use Object.is or Number.isNaN)                      │
 * │ • Objects compare by reference, not content                                 │
 * │                                                                             │
 * │ Rule: Always use === unless checking for null/undefined together."          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/04-equality-operators.js
 */
