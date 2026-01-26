/**
 * ═══════════════════════════════════════════════════════════════════════════
 * JAVASCRIPT META-PROGRAMMING - Symbols
 * ═══════════════════════════════════════════════════════════════════════════
 *
 * Symbols are unique, immutable primitive values used as property keys
 * and to customize object behavior through well-known symbols.
 */

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    SYMBOL OVERVIEW                                       │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   WHAT IS A SYMBOL?                                                     │
 * │   ═════════════════                                                      │
 * │                                                                          │
 * │   • Primitive data type (like string, number)                           │
 * │   • Guaranteed unique value                                             │
 * │   • Cannot be accidentally overwritten                                  │
 * │   • Used as object property keys                                        │
 * │                                                                          │
 * │   const sym = Symbol('description');                                    │
 * │   typeof sym === 'symbol'                                               │
 * │                                                                          │
 * │   Symbol('foo') !== Symbol('foo')  // Always unique!                    │
 * │                                                                          │
 * │   ┌─────────────────────────────────────────────────────────────────┐   │
 * │   │                  SYMBOL TYPES                                   │   │
 * │   └─────────────────────────────────────────────────────────────────┘   │
 * │                                                                          │
 * │   1. UNIQUE SYMBOLS                                                     │
 * │      const sym = Symbol('desc');  // Unique every time                 │
 * │                                                                          │
 * │   2. GLOBAL SYMBOLS                                                     │
 * │      const sym = Symbol.for('key');  // Shared globally               │
 * │                                                                          │
 * │   3. WELL-KNOWN SYMBOLS                                                 │
 * │      Symbol.iterator, Symbol.toStringTag, etc.                         │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           SYMBOLS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Creating Symbols
// ============================================================================
console.log("─── Creating Symbols ───\n");

// Basic symbol
const sym1 = Symbol();
const sym2 = Symbol('description');
const sym3 = Symbol('description');

console.log("Symbol():", sym1);
console.log("Symbol('description'):", sym2);
console.log("sym2 === sym3:", sym2 === sym3);  // false! Always unique
console.log("typeof sym1:", typeof sym1);
console.log("");

// ============================================================================
// Symbol as Property Keys
// ============================================================================
console.log("─── Symbol as Property Keys ───\n");

const id = Symbol('id');
const user = {
    name: 'John',
    [id]: 12345
};

console.log("user:", user);
console.log("user.name:", user.name);
console.log("user[id]:", user[id]);
console.log("user.id:", user.id);  // undefined! Symbol keys need bracket notation
console.log("");

// Symbols are not enumerable by default
console.log("Object.keys(user):", Object.keys(user));           // ['name']
console.log("Object.getOwnPropertySymbols(user):", Object.getOwnPropertySymbols(user));
console.log("Reflect.ownKeys(user):", Reflect.ownKeys(user));   // All keys
console.log("");

// ============================================================================
// Global Symbol Registry
// ============================================================================
console.log("─── Global Symbol Registry ───\n");

// Symbol.for creates/retrieves global symbol
const globalSym1 = Symbol.for('shared');
const globalSym2 = Symbol.for('shared');

console.log("globalSym1 === globalSym2:", globalSym1 === globalSym2);  // true!

// Get key from global symbol
console.log("Symbol.keyFor(globalSym1):", Symbol.keyFor(globalSym1));  // 'shared'

// Local symbols don't have keys
const localSym = Symbol('local');
console.log("Symbol.keyFor(localSym):", Symbol.keyFor(localSym));  // undefined
console.log("");

/**
 * ┌──────────────────────────────────────────────────────────────────────────┐
 * │                    WELL-KNOWN SYMBOLS                                    │
 * ├──────────────────────────────────────────────────────────────────────────┤
 * │                                                                          │
 * │   Well-known symbols allow customizing JavaScript behavior               │
 * │                                                                          │
 * │   ITERATION:                                                             │
 * │   • Symbol.iterator - Make object iterable                              │
 * │   • Symbol.asyncIterator - Async iteration                              │
 * │                                                                          │
 * │   TYPE CONVERSION:                                                       │
 * │   • Symbol.toPrimitive - Custom type conversion                         │
 * │   • Symbol.toStringTag - Custom [object X] tag                          │
 * │                                                                          │
 * │   PATTERN MATCHING:                                                      │
 * │   • Symbol.match - String.match behavior                                │
 * │   • Symbol.replace - String.replace behavior                            │
 * │   • Symbol.search - String.search behavior                              │
 * │   • Symbol.split - String.split behavior                                │
 * │                                                                          │
 * │   OTHER:                                                                 │
 * │   • Symbol.hasInstance - instanceof behavior                            │
 * │   • Symbol.isConcatSpreadable - Array.concat spreading                 │
 * │   • Symbol.species - Constructor for derived objects                    │
 * │   • Symbol.unscopables - with statement exclusions                      │
 * │                                                                          │
 * └──────────────────────────────────────────────────────────────────────────┘
 */

console.log("═══════════════════════════════════════════════════════════════");
console.log("           WELL-KNOWN SYMBOLS");
console.log("═══════════════════════════════════════════════════════════════\n");

// ============================================================================
// Symbol.iterator - Make Objects Iterable
// ============================================================================
console.log("─── Symbol.iterator ───\n");

const range = {
    start: 1,
    end: 5,

    [Symbol.iterator]() {
        let current = this.start;
        const end = this.end;

        return {
            next() {
                if (current <= end) {
                    return { value: current++, done: false };
                }
                return { done: true };
            }
        };
    }
};

console.log("Custom iterable:");
console.log("for...of range:", [...range]);

// Generator-based iterator
const rangeGenerator = {
    start: 1,
    end: 5,
    *[Symbol.iterator]() {
        for (let i = this.start; i <= this.end; i++) {
            yield i;
        }
    }
};

console.log("Generator-based:", [...rangeGenerator]);
console.log("");

// ============================================================================
// Symbol.toStringTag - Custom [object X] Tag
// ============================================================================
console.log("─── Symbol.toStringTag ───\n");

class MyClass {
    get [Symbol.toStringTag]() {
        return 'MyCustomClass';
    }
}

const obj = new MyClass();
console.log("Object.prototype.toString.call(obj):", Object.prototype.toString.call(obj));
console.log("Object.prototype.toString.call([]):", Object.prototype.toString.call([]));
console.log("Object.prototype.toString.call({}):", Object.prototype.toString.call({}));
console.log("");

// ============================================================================
// Symbol.toPrimitive - Custom Type Conversion
// ============================================================================
console.log("─── Symbol.toPrimitive ───\n");

const money = {
    amount: 100,
    currency: 'USD',

    [Symbol.toPrimitive](hint) {
        console.log(`  hint: ${hint}`);
        switch (hint) {
            case 'number':
                return this.amount;
            case 'string':
                return `${this.currency} ${this.amount}`;
            default:  // 'default' hint
                return this.amount;
        }
    }
};

console.log("+money:", +money);                    // number hint
console.log("String(money):", String(money));      // string hint
console.log("money + '':", money + '');            // default hint
console.log("");

// ============================================================================
// Symbol.hasInstance - Custom instanceof
// ============================================================================
console.log("─── Symbol.hasInstance ───\n");

class ArrayLike {
    static [Symbol.hasInstance](instance) {
        return Array.isArray(instance) || instance?.length !== undefined;
    }
}

console.log("[] instanceof ArrayLike:", [] instanceof ArrayLike);
console.log("{length: 3} instanceof ArrayLike:", { length: 3 } instanceof ArrayLike);
console.log("{} instanceof ArrayLike:", {} instanceof ArrayLike);
console.log("");

// ============================================================================
// Symbol.isConcatSpreadable
// ============================================================================
console.log("─── Symbol.isConcatSpreadable ───\n");

const arr = [1, 2];
const arrayLike = {
    0: 3,
    1: 4,
    length: 2,
    [Symbol.isConcatSpreadable]: true
};

console.log("arr.concat(arrayLike):", arr.concat(arrayLike));

// Prevent array from spreading
const noSpread = [5, 6];
noSpread[Symbol.isConcatSpreadable] = false;
console.log("arr.concat(noSpread):", arr.concat(noSpread));
console.log("");

// ============================================================================
// Symbol.match, Symbol.replace, Symbol.search, Symbol.split
// ============================================================================
console.log("─── String Pattern Symbols ───\n");

class CaseInsensitiveMatch {
    constructor(value) {
        this.value = value.toLowerCase();
    }

    [Symbol.match](string) {
        const index = string.toLowerCase().indexOf(this.value);
        if (index === -1) return null;
        return [string.substr(index, this.value.length)];
    }

    [Symbol.search](string) {
        return string.toLowerCase().indexOf(this.value);
    }

    [Symbol.replace](string, replacement) {
        const regex = new RegExp(this.value, 'gi');
        return string.replace(regex, replacement);
    }
}

const matcher = new CaseInsensitiveMatch('hello');
console.log("'Hello World'.match(matcher):", 'Hello World'.match(matcher));
console.log("'Hello World'.search(matcher):", 'Hello World'.search(matcher));
console.log("'Hello World'.replace(matcher, 'Hi'):", 'Hello World'.replace(matcher, 'Hi'));
console.log("");

// ============================================================================
// Symbol.species - Constructor for Derived Objects
// ============================================================================
console.log("─── Symbol.species ───\n");

class MyArray extends Array {
    static get [Symbol.species]() {
        return Array;  // Use Array for derived objects
    }
}

const myArr = new MyArray(1, 2, 3);
const mapped = myArr.map(x => x * 2);

console.log("myArr instanceof MyArray:", myArr instanceof MyArray);
console.log("mapped instanceof MyArray:", mapped instanceof MyArray);  // false!
console.log("mapped instanceof Array:", mapped instanceof Array);      // true
console.log("");

// ============================================================================
// Practical Use Cases
// ============================================================================
console.log("═══════════════════════════════════════════════════════════════");
console.log("           PRACTICAL USE CASES");
console.log("═══════════════════════════════════════════════════════════════\n");

// Use Case 1: Private-like Properties
console.log("─── Private-like Properties ───\n");

const _private = Symbol('private');

class SecretHolder {
    constructor(secret) {
        this[_private] = secret;
    }

    getSecret() {
        return this[_private];
    }
}

const holder = new SecretHolder('my secret');
console.log("holder.getSecret():", holder.getSecret());
console.log("Object.keys(holder):", Object.keys(holder));
console.log("JSON.stringify(holder):", JSON.stringify(holder));
console.log("");

// Use Case 2: Collision-Free Properties
console.log("─── Collision-Free Properties ───\n");

const library1Marker = Symbol('library1');
const library2Marker = Symbol('library2');

function extendByLibrary1(obj) {
    obj[library1Marker] = true;
    return obj;
}

function extendByLibrary2(obj) {
    obj[library2Marker] = true;
    return obj;
}

const sharedObj = {};
extendByLibrary1(sharedObj);
extendByLibrary2(sharedObj);

console.log("No collision between libraries");
console.log("library1Marker:", sharedObj[library1Marker]);
console.log("library2Marker:", sharedObj[library2Marker]);
console.log("");

// ============================================================================
// Symbols Cheat Sheet
// ============================================================================
console.log("╔══════════════════════════════════════════════════════════════════╗");
console.log("║           SYMBOLS CHEAT SHEET                                   ║");
console.log("╠══════════════════════════════════════════════════════════════════╣");
console.log("║                                                                  ║");
console.log("║  CREATING:                                                       ║");
console.log("║  const sym = Symbol('desc');        // Unique symbol            ║");
console.log("║  const sym = Symbol.for('key');     // Global registry          ║");
console.log("║                                                                  ║");
console.log("║  AS PROPERTY KEYS:                                               ║");
console.log("║  const obj = { [sym]: value };                                  ║");
console.log("║  obj[sym] = value;                                              ║");
console.log("║                                                                  ║");
console.log("║  WELL-KNOWN SYMBOLS:                                             ║");
console.log("║  Symbol.iterator        - Make iterable                         ║");
console.log("║  Symbol.toStringTag     - Custom [object X]                     ║");
console.log("║  Symbol.toPrimitive     - Type conversion                       ║");
console.log("║  Symbol.hasInstance     - instanceof behavior                   ║");
console.log("║  Symbol.isConcatSpreadable - Array spreading                    ║");
console.log("║                                                                  ║");
console.log("║  FINDING:                                                        ║");
console.log("║  Object.getOwnPropertySymbols(obj)                              ║");
console.log("║  Reflect.ownKeys(obj)                                           ║");
console.log("║                                                                  ║");
console.log("╚══════════════════════════════════════════════════════════════════╝\n");

module.exports = {
    range,
    rangeGenerator,
    MyClass,
    money,
    ArrayLike,
    SecretHolder
};

console.log("═══ Next: Decorators ═══");
console.log("Run: node deep-dive/javaScript-meta-programming/04-decorators.js");
