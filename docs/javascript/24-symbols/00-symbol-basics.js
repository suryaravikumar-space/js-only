/**
 * SYMBOLS: 00 - Symbol Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHAT IS A SYMBOL?                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Symbol is the 7th primitive type in JavaScript (ES6).                      ║
 * ║ Every Symbol is UNIQUE and IMMUTABLE - perfect for creating unique keys.   ║
 * ║                                                                            ║
 * ║ Primitive types: number, string, boolean, null, undefined, bigint, symbol  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CREATING SYMBOLS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Creating Symbols ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYMBOL CREATION                                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const sym = Symbol();           // Create symbol                          │
 * │   const sym = Symbol('desc');     // Create with description               │
 * │                                                                             │
 * │   NOTE: NO "new" keyword! Symbol is not a constructor.                      │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   Symbol('id') !== Symbol('id')                                    │    │
 * │   │        ▲               ▲                                           │    │
 * │   │        │               │                                           │    │
 * │   │    unique #1       unique #2                                       │    │
 * │   │                                                                    │    │
 * │   │   Even with the same description, symbols are ALWAYS unique!       │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Basic creation
const sym1 = Symbol();
const sym2 = Symbol();

console.log('A: Symbols without description:');
console.log('  sym1:', sym1);                    // Symbol()
console.log('  sym2:', sym2);                    // Symbol()
console.log('  sym1 === sym2:', sym1 === sym2);  // false (always unique!)

// With description (for debugging)
const id = Symbol('id');
const name = Symbol('name');

console.log('\nB: Symbols with description:');
console.log('  id:', id);              // Symbol(id)
console.log('  name:', name);          // Symbol(name)
console.log('  id.description:', id.description);  // 'id'

// Same description ≠ same symbol!
const sym3 = Symbol('same');
const sym4 = Symbol('same');

console.log('\nC: Same description, different symbols:');
console.log('  Symbol("same") === Symbol("same"):', sym3 === sym4);  // false!


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOLS AS OBJECT KEYS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbols as Object Keys ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYMBOL KEYS ARE "HIDDEN"                                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Symbol keys are NOT visible in:                                           │
 * │   • for...in loops                                                          │
 * │   • Object.keys()                                                           │
 * │   • Object.values()                                                         │
 * │   • Object.entries()                                                        │
 * │   • JSON.stringify()                                                        │
 * │                                                                             │
 * │   To access symbol keys:                                                    │
 * │   • Object.getOwnPropertySymbols()                                          │
 * │   • Reflect.ownKeys()                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const secretKey = Symbol('secret');
const visibleKey = 'visible';

const user = {
  [secretKey]: 'hidden data',
  [visibleKey]: 'visible data',
  name: 'Alice'
};

console.log('D: Object with symbol key:');
console.log('  user[secretKey]:', user[secretKey]);  // hidden data
console.log('  user.visible:', user.visible);        // visible data

console.log('\nE: Symbol keys are hidden from iteration:');
console.log('  Object.keys:', Object.keys(user));           // ['visible', 'name']
console.log('  for...in:', Object.keys(user).join(', '));   // visible, name

console.log('\nF: To get symbol keys:');
console.log('  getOwnPropertySymbols:', Object.getOwnPropertySymbols(user));
console.log('  Reflect.ownKeys:', Reflect.ownKeys(user));


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOLS PREVENT PROPERTY COLLISION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Preventing Property Collision ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ THE COLLISION PROBLEM                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   // Library A adds a property                                              │
 * │   user.id = 'lib-a-123';                                                    │
 * │                                                                             │
 * │   // Library B overwrites it!                                               │
 * │   user.id = 'lib-b-456';  // Collision!                                     │
 * │                                                                             │
 * │                                                                             │
 * │   SOLUTION with Symbols:                                                    │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │                                                                             │
 * │   // Library A                                                              │
 * │   const idA = Symbol('id');                                                 │
 * │   user[idA] = 'lib-a-123';                                                  │
 * │                                                                             │
 * │   // Library B                                                              │
 * │   const idB = Symbol('id');                                                 │
 * │   user[idB] = 'lib-b-456';  // No collision! Different keys                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating two libraries
const libraryAId = Symbol('id');
const libraryBId = Symbol('id');

const sharedObject = {
  name: 'shared',
  [libraryAId]: 'Library A data',
  [libraryBId]: 'Library B data'
};

console.log('G: No collision with symbols:');
console.log('  Library A id:', sharedObject[libraryAId]);  // Library A data
console.log('  Library B id:', sharedObject[libraryBId]);  // Library B data


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL TYPE CHECKING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol Type Checking ===\n');

const testSym = Symbol('test');

console.log('H: Type checking:');
console.log('  typeof testSym:', typeof testSym);           // 'symbol'
console.log('  testSym instanceof Symbol:', testSym instanceof Symbol);  // false!

// Note: Symbols are primitives, not objects
// So instanceof doesn't work (same as numbers, strings)


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL CONVERSION RULES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol Conversion ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SYMBOL CONVERSION RULES                                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Symbols CANNOT be implicitly converted to strings or numbers!             │
 * │   This prevents accidental misuse.                                          │
 * │                                                                             │
 * │   const sym = Symbol('id');                                                 │
 * │                                                                             │
 * │   String(sym);     // OK: "Symbol(id)"                                      │
 * │   sym.toString();  // OK: "Symbol(id)"                                      │
 * │   '' + sym;        // TypeError! No implicit conversion                     │
 * │   +sym;            // TypeError! No implicit conversion                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const sym = Symbol('example');

console.log('I: Explicit conversion works:');
console.log('  String(sym):', String(sym));          // Symbol(example)
console.log('  sym.toString():', sym.toString());    // Symbol(example)

console.log('\nJ: Implicit conversion throws:');
try {
  console.log('' + sym);
} catch (e) {
  console.log('  "" + sym:', e.message);
}

try {
  console.log(+sym);
} catch (e) {
  console.log('  +sym:', e.message);
}


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Symbol is a primitive type introduced in ES6.                              │
 * │ Every Symbol is guaranteed to be unique.                                    │
 * │                                                                             │
 * │ Key characteristics:                                                        │
 * │ • Created with Symbol() or Symbol('description')                            │
 * │ • No 'new' keyword (not a constructor)                                      │
 * │ • Symbol('x') !== Symbol('x') - always unique                               │
 * │ • Cannot be implicitly converted to string/number                           │
 * │                                                                             │
 * │ As object keys, symbols are:                                                │
 * │ • Hidden from for...in, Object.keys(), JSON.stringify()                     │
 * │ • Accessible via Object.getOwnPropertySymbols()                             │
 * │                                                                             │
 * │ Main use cases:                                                             │
 * │ • Create 'hidden' object properties                                         │
 * │ • Prevent property name collisions                                          │
 * │ • Define unique constants                                                   │
 * │ • Implement well-known behaviors (Symbol.iterator, etc.)"                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/24-symbols/00-symbol-basics.js
 */
