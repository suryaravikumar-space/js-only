/**
 * SYMBOLS: 05 - Interview Questions & Answers
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ COMPLETE INTERVIEW GUIDE - Symbols                                        ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Everything you need to know about Symbols for interviews                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q1: What is a Symbol in JavaScript?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q1: What is a Symbol in JavaScript?                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Symbol is a primitive type introduced in ES6 (ES2015).                      │
 * │ Every Symbol value is UNIQUE and IMMUTABLE.                                 │
 * │                                                                             │
 * │ Key characteristics:                                                        │
 * │ • Created with Symbol() or Symbol('description')                            │
 * │ • No 'new' keyword (not a constructor)                                      │
 * │ • Symbol('x') !== Symbol('x') - always unique!                              │
 * │ • Cannot be implicitly converted to string/number                           │
 * │ • typeof returns 'symbol'                                                   │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │   const s1 = Symbol('id');                                                  │
 * │   const s2 = Symbol('id');                                                  │
 * │   s1 === s2  // false - each Symbol is unique                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('=== Q1: Symbol Basics ===\n');

const sym1 = Symbol('test');
const sym2 = Symbol('test');

console.log('A: Symbol uniqueness:');
console.log('  sym1 === sym2:', sym1 === sym2);  // false
console.log('  typeof sym1:', typeof sym1);       // 'symbol'


// ═══════════════════════════════════════════════════════════════════════════════
// Q2: Why use Symbols as object keys?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q2: Why use Symbols as object keys?                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ 1. COLLISION PREVENTION:                                                    │
 * │    Different code can add properties without overwriting each other         │
 * │                                                                             │
 * │ 2. HIDDEN FROM ENUMERATION:                                                 │
 * │    Symbol keys don't appear in:                                             │
 * │    • Object.keys()                                                          │
 * │    • Object.values()                                                        │
 * │    • for...in loops                                                         │
 * │    • JSON.stringify()                                                       │
 * │                                                                             │
 * │ 3. UNFORGEABLE:                                                             │
 * │    External code can't create the same key without the symbol               │
 * │                                                                             │
 * │ ACCESS SYMBOL KEYS:                                                         │
 * │    Object.getOwnPropertySymbols(obj)                                        │
 * │    Reflect.ownKeys(obj)                                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q2: Symbol Keys ===\n');

const secretKey = Symbol('secret');
const obj = {
  visible: 'shown',
  [secretKey]: 'hidden from enumeration'
};

console.log('B: Hidden from normal enumeration:');
console.log('  Object.keys:', Object.keys(obj));
console.log('  JSON.stringify:', JSON.stringify(obj));
console.log('  Symbol keys:', Object.getOwnPropertySymbols(obj));


// ═══════════════════════════════════════════════════════════════════════════════
// Q3: What's the difference between Symbol() and Symbol.for()?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q3: What's the difference between Symbol() and Symbol.for()?                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Symbol():                                                                   │
 * │ • Creates a NEW unique symbol every time                                    │
 * │ • Symbol('x') !== Symbol('x')                                               │
 * │ • Not in global registry                                                    │
 * │ • Use for: local/private symbols                                            │
 * │                                                                             │
 * │ Symbol.for(key):                                                            │
 * │ • Creates or retrieves from GLOBAL registry                                 │
 * │ • Symbol.for('x') === Symbol.for('x')                                       │
 * │ • Shared across realms (iframes, workers)                                   │
 * │ • Use for: shared symbols across modules                                    │
 * │                                                                             │
 * │ Symbol.keyFor(symbol):                                                      │
 * │ • Returns registry key for global symbols                                   │
 * │ • Returns undefined for local symbols                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q3: Symbol() vs Symbol.for() ===\n');

const local1 = Symbol('id');
const local2 = Symbol('id');
const global1 = Symbol.for('id');
const global2 = Symbol.for('id');

console.log('C: Comparison:');
console.log('  Symbol("id") === Symbol("id"):', local1 === local2);     // false
console.log('  Symbol.for("id") === Symbol.for("id"):', global1 === global2);  // true
console.log('  Symbol.keyFor(global1):', Symbol.keyFor(global1));  // 'id'
console.log('  Symbol.keyFor(local1):', Symbol.keyFor(local1));    // undefined


// ═══════════════════════════════════════════════════════════════════════════════
// Q4: What are well-known Symbols?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q4: What are well-known Symbols?                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Built-in symbols that customize JavaScript's internal behavior:             │
 * │                                                                             │
 * │ Symbol.iterator:                                                            │
 * │ • Makes objects work with for...of, spread, Array.from                      │
 * │                                                                             │
 * │ Symbol.toStringTag:                                                         │
 * │ • Customizes Object.prototype.toString() output                             │
 * │                                                                             │
 * │ Symbol.toPrimitive:                                                         │
 * │ • Controls type coercion (hint: 'number', 'string', 'default')              │
 * │                                                                             │
 * │ Symbol.hasInstance:                                                         │
 * │ • Customizes instanceof behavior                                            │
 * │                                                                             │
 * │ Others: Symbol.species, Symbol.isConcatSpreadable, Symbol.match...          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q4: Well-known Symbols ===\n');

// Symbol.iterator example
const iterable = {
  data: [1, 2, 3],
  [Symbol.iterator]() {
    let i = 0;
    const data = this.data;
    return {
      next() {
        return i < data.length
          ? { value: data[i++], done: false }
          : { done: true };
      }
    };
  }
};

console.log('D: Custom iterable with Symbol.iterator:');
console.log('  [...iterable]:', [...iterable]);


// ═══════════════════════════════════════════════════════════════════════════════
// Q5: How do you make an object iterable?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q5: How do you make an object iterable?                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ Implement [Symbol.iterator]() method that returns an iterator object        │
 * │ with a next() method.                                                       │
 * │                                                                             │
 * │ EXAMPLE:                                                                    │
 * │                                                                             │
 * │   const obj = {                                                             │
 * │     [Symbol.iterator]() {                                                   │
 * │       let i = 0;                                                            │
 * │       return {                                                              │
 * │         next() {                                                            │
 * │           if (i < 3) {                                                      │
 * │             return { value: i++, done: false };                             │
 * │           }                                                                 │
 * │           return { done: true };                                            │
 * │         }                                                                   │
 * │       };                                                                    │
 * │     }                                                                       │
 * │   };                                                                        │
 * │                                                                             │
 * │   for (const x of obj) { ... }  // Works!                                   │
 * │   [...obj]                      // Works!                                   │
 * │   Array.from(obj)               // Works!                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// Q6: Can Symbols be used with JSON?
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Q6: Can Symbols be used with JSON?                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ANSWER:                                                                     │
 * │                                                                             │
 * │ NO - Symbols are completely ignored by JSON.stringify().                    │
 * │                                                                             │
 * │ This makes them perfect for:                                                │
 * │ • Metadata that shouldn't be serialized                                     │
 * │ • Internal properties                                                       │
 * │ • Framework/library private data                                            │
 * │                                                                             │
 * │ If you NEED to serialize symbol data:                                       │
 * │ • Convert to string manually                                                │
 * │ • Use a custom toJSON() method                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

console.log('\n=== Q6: Symbols and JSON ===\n');

const sym = Symbol('secret');
const data = {
  visible: 'shown',
  [sym]: 'hidden'
};

console.log('E: JSON ignores symbols:');
console.log('  JSON.stringify:', JSON.stringify(data));  // {"visible":"shown"}


// ═══════════════════════════════════════════════════════════════════════════════
// CHEAT SHEET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║                      SYMBOL INTERVIEW CHEAT SHEET                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║  BASICS:                                                                   ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  const sym = Symbol('desc');      // Create unique symbol                  ║
 * ║  typeof sym === 'symbol'          // true                                  ║
 * ║  Symbol('x') !== Symbol('x')      // Always unique!                        ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  GLOBAL REGISTRY:                                                          ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Symbol.for('key')                // Create/get from registry              ║
 * ║  Symbol.for('x') === Symbol.for('x')  // Same symbol!                      ║
 * ║  Symbol.keyFor(sym)               // Get registry key (or undefined)       ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  AS OBJECT KEYS:                                                           ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  obj[symbol] = value;             // Set symbol property                   ║
 * ║  Object.keys(obj)                 // Doesn't include symbols               ║
 * ║  Object.getOwnPropertySymbols(obj)// Gets symbol keys                      ║
 * ║  Reflect.ownKeys(obj)             // Gets ALL keys (including symbols)     ║
 * ║  JSON.stringify(obj)              // Ignores symbol properties             ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  WELL-KNOWN SYMBOLS:                                                       ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  Symbol.iterator     → for...of, spread, Array.from                        ║
 * ║  Symbol.toStringTag  → Object.prototype.toString()                         ║
 * ║  Symbol.toPrimitive  → Type coercion (hint: number/string/default)         ║
 * ║  Symbol.hasInstance  → instanceof operator                                 ║
 * ║  Symbol.species      → Constructor for derived objects                     ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  USE CASES:                                                                ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • Private/hidden properties                                               ║
 * ║  • Unique enum values                                                      ║
 * ║  • Prevent property collisions                                             ║
 * ║  • Metadata on objects                                                     ║
 * ║  • Plugin hooks                                                            ║
 * ║  • Customize JS built-in behavior                                          ║
 * ║                                                                            ║
 * ║                                                                            ║
 * ║  CANNOT:                                                                   ║
 * ║  ──────────────────────────────────────────────────────────────────        ║
 * ║  • new Symbol()         // Error! Not a constructor                        ║
 * ║  • '' + Symbol()        // TypeError! No implicit conversion               ║
 * ║  • JSON.stringify()     // Symbols are ignored                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * RUN: node docs/24-symbols/05-interview-qa.js
 */

console.log('\n=== Symbol Interview Q&A ===');
console.log('Review the detailed answers in the comments above');
