/**
 * TYPE COERCION: 03 - To Boolean Conversion (Truthy/Falsy)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ There are exactly 8 FALSY values. Everything else is TRUTHY.               ║
 * ║                                                                            ║
 * ║ FALSY: false, 0, -0, 0n, "", null, undefined, NaN                          ║
 * ║                                                                            ║
 * ║ TRUTHY: Everything else (including [], {}, "0", "false")                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN BOOLEAN CONVERSION HAPPENS - Real World Justification                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. CONDITIONALS                                                             │
 * │    → if (value) { }                                                         │
 * │    → while (value) { }                                                      │
 * │    → value ? a : b                                                          │
 * │                                                                             │
 * │ 2. LOGICAL OPERATORS                                                        │
 * │    → value && doSomething()                                                 │
 * │    → value || defaultValue                                                  │
 * │    → !value                                                                 │
 * │                                                                             │
 * │ 3. EXPLICIT CONVERSION                                                      │
 * │    → Boolean(value)                                                         │
 * │    → !!value                                                                │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE 8 FALSY VALUES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== The 8 Falsy Values ===\n');

console.log('A: Boolean(false):', Boolean(false));         // false
console.log('B: Boolean(0):', Boolean(0));                 // false
console.log('C: Boolean(-0):', Boolean(-0));               // false
console.log('D: Boolean(0n):', Boolean(0n));               // false (BigInt)
console.log('E: Boolean(""):', Boolean(""));               // false
console.log('F: Boolean(null):', Boolean(null));           // false
console.log('G: Boolean(undefined):', Boolean(undefined)); // false
console.log('H: Boolean(NaN):', Boolean(NaN));             // false


// ═══════════════════════════════════════════════════════════════════════════════
// TRUTHY SURPRISES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Truthy Surprises ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THESE ARE ALL TRUTHY!                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • "0"      (string zero)                                                    │
 * │ • "false"  (string false)                                                   │
 * │ • " "      (whitespace string)                                              │
 * │ • []       (empty array)                                                    │
 * │ • {}       (empty object)                                                   │
 * │ • function() {} (any function)                                              │
 * │ • new Boolean(false) (Boolean object!)                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('I: Boolean("0"):', Boolean("0"));             // true!
console.log('J: Boolean("false"):', Boolean("false"));     // true!
console.log('K: Boolean(" "):', Boolean(" "));             // true!
console.log('L: Boolean([]):', Boolean([]));               // true!
console.log('M: Boolean({}):', Boolean({}));               // true!
console.log('N: Boolean(function(){}):', Boolean(function(){})); // true!
console.log('O: Boolean(new Boolean(false)):', Boolean(new Boolean(false))); // true!

// Why [] is truthy but [] == false is true (confusing!)
console.log('\nP: [] is truthy:', !![]); // true
console.log('Q: [] == false:', [] == false); // true! ([] → "" → 0, false → 0)


// ═══════════════════════════════════════════════════════════════════════════════
// EXPLICIT CONVERSION METHODS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Explicit Conversion ===\n');

// Boolean()
console.log('R: Boolean("hello"):', Boolean("hello"));  // true
console.log('S: Boolean(42):', Boolean(42));            // true

// Double NOT (!!)
console.log('T: !!"hello":', !!"hello");  // true
console.log('U: !!42:', !!42);            // true
console.log('V: !!0:', !!0);              // false
console.log('W: !!"":', !!"");            // false

// How !! works:
// !value converts to boolean and inverts
// !!value inverts again, giving true boolean
console.log('X: !"hello":', !"hello");    // false
console.log('Y: !!"hello":', !!"hello");  // true


// ═══════════════════════════════════════════════════════════════════════════════
// CONDITIONALS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Conditionals ===\n');

// These are all falsy checks
const values = [false, 0, -0, 0n, "", null, undefined, NaN];

values.forEach((val, i) => {
  if (val) {
    console.log(`Z${i}: ${String(val)} is truthy`);
  } else {
    console.log(`Z${i}: ${String(val)} is falsy`);
  }
});

// Common pattern: checking for existence
function greet(name) {
  if (name) {
    return `Hello, ${name}!`;
  }
  return 'Hello, stranger!';
}

console.log('\nAA:', greet("Alice"));     // Hello, Alice!
console.log('AB:', greet(""));           // Hello, stranger! (empty is falsy)
console.log('AC:', greet(null));         // Hello, stranger!
console.log('AD:', greet(undefined));    // Hello, stranger!


// ═══════════════════════════════════════════════════════════════════════════════
// LOGICAL OPERATORS AND SHORT-CIRCUITING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Logical Operators ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ LOGICAL OPERATORS RETURN VALUES, NOT BOOLEANS!                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ && Returns: First falsy value, or last value if all truthy                  │
 * │ || Returns: First truthy value, or last value if all falsy                  │
 * │ ?? Returns: First defined value (not null/undefined)                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// OR (||) - First truthy or last value
console.log('AE: null || "default":', null || "default");       // "default"
console.log('AF: "hello" || "default":', "hello" || "default"); // "hello"
console.log('AG: 0 || 42:', 0 || 42);                           // 42
console.log('AH: "" || "fallback":', "" || "fallback");         // "fallback"

// AND (&&) - First falsy or last value
console.log('AI: "hello" && "world":', "hello" && "world");     // "world"
console.log('AJ: null && "world":', null && "world");           // null
console.log('AK: "hello" && 0:', "hello" && 0);                 // 0

// Nullish Coalescing (??) - Only null/undefined
console.log('AL: null ?? "default":', null ?? "default");       // "default"
console.log('AM: undefined ?? "default":', undefined ?? "default"); // "default"
console.log('AN: 0 ?? "default":', 0 ?? "default");             // 0 (not falsy check!)
console.log('AO: "" ?? "default":', "" ?? "default");           // "" (not falsy check!)


// ═══════════════════════════════════════════════════════════════════════════════
// || vs ?? COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== || vs ?? ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE || vs ??                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ || (OR): Use when 0 and "" should be replaced                               │
 * │    count || 10  →  If count is 0, use 10                                    │
 * │                                                                             │
 * │ ?? (Nullish): Use when 0 and "" are valid values                            │
 * │    count ?? 10  →  If count is 0, keep 0                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function getConfig(options) {
  // Using || (treats 0 as "missing")
  const timeoutOr = options.timeout || 3000;

  // Using ?? (0 is valid)
  const timeoutNullish = options.timeout ?? 3000;

  return { timeoutOr, timeoutNullish };
}

console.log('AP:', getConfig({ timeout: 5000 }));  // { 5000, 5000 }
console.log('AQ:', getConfig({ timeout: 0 }));    // { 3000, 0 } ← || treats 0 as falsy!
console.log('AR:', getConfig({}));                // { 3000, 3000 }


// ═══════════════════════════════════════════════════════════════════════════════
// COMMON PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Common Patterns ===\n');

// Default values
function createUser(name, age) {
  return {
    name: name || 'Anonymous',
    age: age ?? 0  // Use ?? because age 0 might be valid
  };
}

console.log('AS:', createUser('Alice', 30));  // { name: 'Alice', age: 30 }
console.log('AT:', createUser('', 0));        // { name: 'Anonymous', age: 0 }

// Conditional execution
const isLoggedIn = true;
isLoggedIn && console.log('AU: User is logged in');

// Guard clauses
function processData(data) {
  if (!data) return 'No data';
  if (!data.items) return 'No items';
  return `Processing ${data.items.length} items`;
}

console.log('AV:', processData(null));              // No data
console.log('AW:', processData({}));               // No items
console.log('AX:', processData({ items: [1, 2] })); // Processing 2 items


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "JavaScript has exactly 8 falsy values:                                     │
 * │  false, 0, -0, 0n, '', null, undefined, NaN                                 │
 * │                                                                             │
 * │ Everything else is truthy, including some surprises:                        │
 * │  '0', 'false', [], {}, functions                                            │
 * │                                                                             │
 * │ Boolean conversion happens in:                                              │
 * │  • Conditionals (if, while, ternary)                                        │
 * │  • Logical operators (&&, ||, !)                                            │
 * │  • Explicit: Boolean(value) or !!value                                      │
 * │                                                                             │
 * │ Important distinction:                                                      │
 * │  || returns first truthy (or last value)                                    │
 * │  ?? returns first non-null/undefined                                        │
 * │                                                                             │
 * │  Use || when 0 and '' should be replaced                                    │
 * │  Use ?? when 0 and '' are valid values                                      │
 * │                                                                             │
 * │ Gotcha: [] is truthy, but [] == false is true!                              │
 * │ This is because [] coerces to '' then to 0 in comparison."                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/19-type-coercion/03-to-boolean.js
 */
