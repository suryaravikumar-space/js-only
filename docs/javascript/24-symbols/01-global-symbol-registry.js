/**
 * SYMBOLS: 01 - Global Symbol Registry
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ Symbol.for() & Symbol.keyFor()                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ The global symbol registry allows creating SHARED symbols across your      ║
 * ║ application. Unlike regular symbols, registry symbols can be reused.       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.FOR() - GLOBAL REGISTRY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Symbol.for() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.for(key) - Global Registry                                           │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Symbol.for('key') does the following:                                     │
 * │                                                                             │
 * │   1. Looks for symbol with 'key' in the global registry                     │
 * │   2. If found → returns existing symbol                                     │
 * │   3. If not found → creates NEW symbol, stores in registry, returns it      │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   Symbol('id')   Symbol('id')      Different symbols!             │    │
 * │   │        │              │                                            │    │
 * │   │        ▼              ▼                                            │    │
 * │   │   Symbol#123     Symbol#456                                        │    │
 * │   │                                                                    │    │
 * │   │                                                                    │    │
 * │   │   Symbol.for('id')   Symbol.for('id')   SAME symbol!              │    │
 * │   │        │                  │                                        │    │
 * │   │        └──────┬───────────┘                                        │    │
 * │   │               ▼                                                    │    │
 * │   │          Symbol#789                                                │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Regular Symbol - always creates new
const sym1 = Symbol('id');
const sym2 = Symbol('id');
console.log('A: Regular Symbol("id") === Symbol("id"):', sym1 === sym2);  // false

// Symbol.for - uses global registry
const regSym1 = Symbol.for('id');
const regSym2 = Symbol.for('id');
console.log('B: Symbol.for("id") === Symbol.for("id"):', regSym1 === regSym2);  // true

// First call creates, subsequent calls return existing
const first = Symbol.for('unique-key');
const second = Symbol.for('unique-key');
console.log('C: Same reference:', first === second);  // true


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL.KEYFOR() - LOOKUP KEY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol.keyFor() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Symbol.keyFor(sym) - Get Registry Key                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Returns the key used to register a symbol in the global registry.         │
 * │   Returns undefined if symbol is not in registry (regular symbol).          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const globalSym = Symbol.for('app.userId');
const localSym = Symbol('app.userId');

console.log('D: Symbol.keyFor with registry symbol:');
console.log('  Symbol.keyFor(globalSym):', Symbol.keyFor(globalSym));  // 'app.userId'

console.log('\nE: Symbol.keyFor with regular symbol:');
console.log('  Symbol.keyFor(localSym):', Symbol.keyFor(localSym));    // undefined


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN TO USE SYMBOL.FOR()
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== When to Use Symbol.for() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASES FOR GLOBAL SYMBOL REGISTRY                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   1. SHARED SYMBOLS ACROSS MODULES:                                         │
 * │      When different parts of your app need the same symbol key              │
 * │                                                                             │
 * │   2. CROSS-REALM SYMBOLS:                                                   │
 * │      Symbols that work across iframes, workers, or different JS contexts    │
 * │                                                                             │
 * │   3. PLUGIN/LIBRARY COMMUNICATION:                                          │
 * │      When libraries need to agree on symbol keys                            │
 * │                                                                             │
 * │                                                                             │
 * │   NAMING CONVENTION:                                                        │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   Use namespaced keys to avoid collisions:                                  │
 * │   Symbol.for('myapp.internal.userId')                                       │
 * │   Symbol.for('mylib.iterator')                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Simulating module communication with global symbols

// Module A
const MODULE_A_METADATA = Symbol.for('app.metadata');
function moduleA_setData(obj) {
  obj[MODULE_A_METADATA] = { source: 'Module A', timestamp: Date.now() };
}

// Module B (separate file in real app)
const MODULE_B_METADATA = Symbol.for('app.metadata');  // Same symbol!
function moduleB_readData(obj) {
  return obj[MODULE_B_METADATA];  // Can access Module A's data
}

const sharedObj = {};
moduleA_setData(sharedObj);

console.log('F: Cross-module symbol access:');
console.log('  Module B reads Module A data:', moduleB_readData(sharedObj));


// ═══════════════════════════════════════════════════════════════════════════════
// SYMBOL() vs SYMBOL.FOR() COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Symbol() vs Symbol.for() ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON                                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────┬────────────────────┬────────────────────┐         │
 * │   │ Feature             │ Symbol()           │ Symbol.for()       │         │
 * │   ├─────────────────────┼────────────────────┼────────────────────┤         │
 * │   │ Uniqueness          │ Always unique      │ Shared (by key)    │         │
 * │   │ Registry            │ Not registered     │ In global registry │         │
 * │   │ Symbol.keyFor()     │ Returns undefined  │ Returns the key    │         │
 * │   │ Cross-realm         │ Different symbols  │ Same symbol        │         │
 * │   │ Use case            │ Private/local      │ Shared/global      │         │
 * │   └─────────────────────┴────────────────────┴────────────────────┘         │
 * │                                                                             │
 * │                                                                             │
 * │   RULE OF THUMB:                                                            │
 * │   • Use Symbol() for local, private symbol keys                             │
 * │   • Use Symbol.for() when symbols need to be shared                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating the difference
const localPrivate = Symbol('private');
const globalShared = Symbol.for('shared');

const obj1 = { [localPrivate]: 'local1', [globalShared]: 'shared1' };

// In another context...
const differentLocal = Symbol('private');      // Different symbol!
const sameGlobal = Symbol.for('shared');       // Same symbol!

console.log('G: Local symbol comparison:');
console.log('  localPrivate === differentLocal:', localPrivate === differentLocal);  // false
console.log('  obj1[differentLocal]:', obj1[differentLocal]);  // undefined

console.log('\nH: Global symbol comparison:');
console.log('  globalShared === sameGlobal:', globalShared === sameGlobal);  // true
console.log('  obj1[sameGlobal]:', obj1[sameGlobal]);  // 'shared1'


// ═══════════════════════════════════════════════════════════════════════════════
// GLOBAL REGISTRY IS TRULY GLOBAL
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== Global Registry Scope ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ TRULY GLOBAL                                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   The symbol registry is shared across:                                     │
 * │   • All modules in your application                                         │
 * │   • Different realms (iframes, Web Workers, etc.)                           │
 * │   • Even across different JavaScript contexts                               │
 * │                                                                             │
 * │   This can be both powerful and dangerous!                                  │
 * │   Always use namespaced keys to avoid collisions.                           │
 * │                                                                             │
 * │   BAD:  Symbol.for('id')                                                    │
 * │   GOOD: Symbol.for('mycompany.myapp.id')                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Good: Namespaced symbols
const userIdSym = Symbol.for('com.example.app.userId');
const configSym = Symbol.for('com.example.app.config');

console.log('I: Namespaced symbol keys:');
console.log('  Symbol.keyFor(userIdSym):', Symbol.keyFor(userIdSym));
console.log('  Symbol.keyFor(configSym):', Symbol.keyFor(configSym));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Symbol.for() and Symbol.keyFor() work with the global symbol registry.     │
 * │                                                                             │
 * │ Symbol.for(key):                                                            │
 * │ • Searches registry for symbol with given key                               │
 * │ • Returns existing symbol if found                                          │
 * │ • Creates and registers new symbol if not found                             │
 * │ • Symbol.for('x') === Symbol.for('x') is true!                              │
 * │                                                                             │
 * │ Symbol.keyFor(symbol):                                                      │
 * │ • Returns the registry key for a global symbol                              │
 * │ • Returns undefined for non-registered symbols                              │
 * │                                                                             │
 * │ Use cases for global symbols:                                               │
 * │ • Shared symbols across modules                                             │
 * │ • Cross-realm symbol communication                                          │
 * │ • Library/plugin interoperability                                           │
 * │                                                                             │
 * │ Always namespace global symbols to avoid collisions:                        │
 * │ Symbol.for('myapp.userId') not Symbol.for('userId')"                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/24-symbols/01-global-symbol-registry.js
 */
