/**
 * SYMBOLS: 04 - Symbols vs Alternatives
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WHEN TO USE SYMBOLS vs OTHER APPROACHES                                   ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Comparing Symbols with other ways to achieve similar goals.                ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOLS vs PRIVATE FIELDS (#)
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Symbols vs Private Fields (#) ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: Symbol vs #privateField                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────┬────────────────────┬────────────────────┐         │
 * │   │ Feature             │ Symbol             │ # Private Field    │         │
 * │   ├─────────────────────┼────────────────────┼────────────────────┤         │
 * │   │ Truly private       │ No (discoverable)  │ Yes                │         │
 * │   │ Object.keys         │ Hidden             │ Hidden             │         │
 * │   │ JSON.stringify      │ Hidden             │ Hidden             │         │
 * │   │ Shareable access    │ Yes (share symbol) │ No                 │         │
 * │   │ Works outside class │ Yes                │ No                 │         │
 * │   │ Subclass access     │ Yes (with symbol)  │ No                 │         │
 * │   │ Browser support     │ ES6+               │ ES2022+            │         │
 * │   └─────────────────────┴────────────────────┴────────────────────┘         │
 * │                                                                             │
 * │   USE SYMBOL when:                                                          │
 * │   • Need to share access with trusted code                                  │
 * │   • Working outside class context                                           │
 * │   • Supporting older environments                                           │
 * │                                                                             │
 * │   USE # when:                                                               │
 * │   • Need truly private data (no exceptions)                                 │
 * │   • ES2022+ environments only                                               │
 * │   • Standard OOP encapsulation                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Symbol approach - shareable privacy
const _secret = Symbol('secret');

class SymbolClass {
  constructor() {
    this[_secret] = 'symbol secret';
  }
}

// # approach - true privacy
class PrivateClass {
  #secret = 'private secret';

  getSecret() {
    return this.#secret;
  }
}

const sym = new SymbolClass();
const priv = new PrivateClass();

console.log('A: Accessibility comparison:');
console.log('  Symbol (with key):', sym[_secret]);        // Accessible with symbol
console.log('  Private field:', priv.getSecret());        // Only via method

// Symbol is discoverable
console.log('\nB: Discoverability:');
console.log('  Symbols on object:', Object.getOwnPropertySymbols(sym));
// Private fields are NOT discoverable


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOLS vs WEAKMAP FOR PRIVACY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbols vs WeakMap for Privacy ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: Symbol vs WeakMap                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────┬────────────────────┬────────────────────┐         │
 * │   │ Feature             │ Symbol             │ WeakMap            │         │
 * │   ├─────────────────────┼────────────────────┼────────────────────┤         │
 * │   │ Truly private       │ No                 │ Yes                │         │
 * │   │ Memory overhead     │ On object          │ External           │         │
 * │   │ GC friendly         │ Yes                │ Yes                │         │
 * │   │ Discoverable        │ Yes (symbols)      │ No                 │         │
 * │   │ Serialization       │ Hidden             │ External           │         │
 * │   │ Property check      │ In object          │ In WeakMap         │         │
 * │   └─────────────────────┴────────────────────┴────────────────────┘         │
 * │                                                                             │
 * │   USE SYMBOL when:                                                          │
 * │   • Data belongs ON the object                                              │
 * │   • Need property-like access                                               │
 * │   • "Soft" privacy is enough                                                │
 * │                                                                             │
 * │   USE WEAKMAP when:                                                         │
 * │   • Need truly private data                                                 │
 * │   • Data should be completely hidden                                        │
 * │   • External association pattern                                            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Symbol approach
const _data1 = Symbol('data');

class SymbolPrivacy {
  constructor(data) {
    this[_data1] = data;
  }
}

// WeakMap approach
const privateData = new WeakMap();

class WeakMapPrivacy {
  constructor(data) {
    privateData.set(this, data);
  }

  getData() {
    return privateData.get(this);
  }
}

const symObj = new SymbolPrivacy('secret1');
const weakObj = new WeakMapPrivacy('secret2');

console.log('C: Privacy comparison:');
console.log('  Symbol data discoverable:', Object.getOwnPropertySymbols(symObj).length > 0);
console.log('  WeakMap data discoverable:', Object.getOwnPropertySymbols(weakObj).length > 0);


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOLS vs STRING CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbols vs String Constants ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: Symbol vs String Constants                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────┬────────────────────┬────────────────────┐         │
 * │   │ Feature             │ Symbol             │ String             │         │
 * │   ├─────────────────────┼────────────────────┼────────────────────┤         │
 * │   │ Uniqueness          │ Guaranteed         │ Not guaranteed     │         │
 * │   │ Collision risk      │ None               │ High               │         │
 * │   │ Forgeable           │ No                 │ Yes                │         │
 * │   │ Serializable        │ No                 │ Yes                │         │
 * │   │ Human readable      │ Partially          │ Yes                │         │
 * │   │ Cross-realm safe    │ Symbol.for()       │ Yes                │         │
 * │   └─────────────────────┴────────────────────┴────────────────────┘         │
 * │                                                                             │
 * │   USE SYMBOL when:                                                          │
 * │   • Uniqueness is critical                                                  │
 * │   • Values shouldn't be forgeable                                           │
 * │   • Not serializing (API response, etc.)                                    │
 * │                                                                             │
 * │   USE STRING when:                                                          │
 * │   • Need to serialize (JSON, localStorage)                                  │
 * │   • Cross-system communication                                              │
 * │   • Human readability important                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// String constants - can be forged
const STRING_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED'
};

// Symbol constants - cannot be forged
const SYMBOL_STATUS = {
  PENDING: Symbol('PENDING'),
  APPROVED: Symbol('APPROVED')
};

function checkStringStatus(status) {
  return status === STRING_STATUS.PENDING;
}

function checkSymbolStatus(status) {
  return status === SYMBOL_STATUS.PENDING;
}

console.log('D: String can be forged:');
console.log('  checkStringStatus("PENDING"):', checkStringStatus('PENDING'));  // true (forged!)
console.log('  checkStringStatus(STRING_STATUS.PENDING):', checkStringStatus(STRING_STATUS.PENDING));

console.log('\nE: Symbol cannot be forged:');
console.log('  checkSymbolStatus(Symbol("PENDING")):', checkSymbolStatus(Symbol('PENDING')));  // false!
console.log('  checkSymbolStatus(SYMBOL_STATUS.PENDING):', checkSymbolStatus(SYMBOL_STATUS.PENDING));


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOLS vs UNDERSCORE CONVENTION
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbols vs Underscore Convention ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: Symbol vs _underscore                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   The _underscore convention is just a naming pattern:                      │
 * │   this._privateData = 'value';                                              │
 * │                                                                             │
 * │   ┌─────────────────────┬────────────────────┬────────────────────┐         │
 * │   │ Feature             │ Symbol             │ _underscore        │         │
 * │   ├─────────────────────┼────────────────────┼────────────────────┤         │
 * │   │ Hidden from keys()  │ Yes                │ No                 │         │
 * │   │ Hidden from for...in│ Yes                │ No                 │         │
 * │   │ JSON.stringify      │ Hidden             │ Included           │         │
 * │   │ Collision risk      │ None               │ Possible           │         │
 * │   │ Enforcement         │ Technical          │ Convention only    │         │
 * │   └─────────────────────┴────────────────────┴────────────────────┘         │
 * │                                                                             │
 * │   _underscore is just a hint to developers "don't use this"                 │
 * │   Symbol actually hides properties from normal enumeration                  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const _symbolProp = Symbol('private');

const obj = {
  publicProp: 'visible',
  _underscoreProp: 'also visible',
  [_symbolProp]: 'hidden from enumeration'
};

console.log('F: Enumeration difference:');
console.log('  Object.keys:', Object.keys(obj));
console.log('  JSON.stringify:', JSON.stringify(obj));


// ═══════════════════════════════════════════════════════════════════════════════
// DECISION FLOWCHART
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Decision Flowchart ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE SYMBOLS - DECISION TREE                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Need unique property key?                                                 │
 * │         │                                                                   │
 * │         ├── No → Use string                                                 │
 * │         │                                                                   │
 * │         └── Yes                                                             │
 * │               │                                                             │
 * │               ├── Needs serialization? → Use string (with prefix)           │
 * │               │                                                             │
 * │               └── No serialization needed                                   │
 * │                     │                                                       │
 * │                     ├── Need to share across modules/realms?                │
 * │                     │     │                                                 │
 * │                     │     ├── Yes → Use Symbol.for('namespaced.key')        │
 * │                     │     └── No → Use Symbol('description')                │
 * │                     │                                                       │
 * │                     └── Customizing JS behavior?                            │
 * │                           │                                                 │
 * │                           └── Yes → Use well-known Symbol                   │
 * │                                    (Symbol.iterator, Symbol.toStringTag)    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "When to use Symbols vs alternatives:                                       │
 * │                                                                             │
 * │ SYMBOL vs # PRIVATE FIELDS:                                                 │
 * │ • Use # for truly private (ES2022+, no exceptions)                          │
 * │ • Use Symbol for 'soft' privacy with shareable access                       │
 * │                                                                             │
 * │ SYMBOL vs WEAKMAP:                                                          │
 * │ • Use WeakMap for completely hidden external data                           │
 * │ • Use Symbol when data belongs ON the object                                │
 * │                                                                             │
 * │ SYMBOL vs STRING:                                                           │
 * │ • Use String when you need serialization (JSON, storage)                    │
 * │ • Use Symbol when uniqueness/unforgeability matters                         │
 * │                                                                             │
 * │ SYMBOL vs _UNDERSCORE:                                                      │
 * │ • _underscore is just convention, still enumerable                          │
 * │ • Symbol actually hides from Object.keys/for...in                           │
 * │                                                                             │
 * │ SYMBOL.FOR vs SYMBOL:                                                       │
 * │ • Use Symbol() for local/module-scoped symbols                              │
 * │ • Use Symbol.for() for cross-module/cross-realm sharing"                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/24-symbols/04-symbols-vs-alternatives.js
 */
