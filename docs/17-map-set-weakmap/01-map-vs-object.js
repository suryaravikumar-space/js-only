/**
 * MAP, SET, WEAKMAP, WEAKSET: 01 - Map vs Object
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Use OBJECT for structured data with known string keys.                     ║
 * ║ Use MAP for dictionaries/caches with dynamic or non-string keys.           ║
 * ║                                                                            ║
 * ║   Object: { name: 'Alice', age: 30 }  // Known structure, JSON-like        ║
 * ║   Map: userPermissions.set(user, ['read', 'write'])  // Dynamic, any key   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// COMPARISON TABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MAP vs OBJECT - Feature Comparison                                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌────────────────────┬─────────────────────┬─────────────────────────────┐  │
 * │ │ Feature            │ Map                 │ Object                      │  │
 * │ ├────────────────────┼─────────────────────┼─────────────────────────────┤  │
 * │ │ Key types          │ Any (obj, func, etc)│ String or Symbol only       │  │
 * │ │ Size               │ map.size (O(1))     │ Object.keys().length (O(n)) │  │
 * │ │ Iteration order    │ Insertion order     │ Complex rules*              │  │
 * │ │ Default keys       │ None                │ Has prototype properties    │  │
 * │ │ Iteration          │ Directly iterable   │ Need Object.keys/entries    │  │
 * │ │ Performance        │ Better for add/del  │ Better for known structure  │  │
 * │ │ JSON serialization │ Manual conversion   │ Native support              │  │
 * │ │ Accidental override│ Not possible        │ toString, constructor...    │  │
 * │ └────────────────────┴─────────────────────┴─────────────────────────────┘  │
 * │                                                                             │
 * │ * Object key order: integer keys (sorted) → string keys → symbol keys       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. KEY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

// Object: Keys are converted to strings
const obj = {};
obj[1] = 'one';
obj['1'] = 'one string';  // Same key! Overwrites!
console.log('A: Object keys:', Object.keys(obj));  // ['1']

// Map: Different types are different keys
const map = new Map();
map.set(1, 'number one');
map.set('1', 'string one');
console.log('B: Map size:', map.size);  // 2 (different keys!)
console.log('C:', map.get(1));   // 'number one'
console.log('D:', map.get('1')); // 'string one'


// ═══════════════════════════════════════════════════════════════════════════════
// 2. SIZE / LENGTH
// ═══════════════════════════════════════════════════════════════════════════════

const bigObj = {};
const bigMap = new Map();

for (let i = 0; i < 1000; i++) {
  bigObj[`key${i}`] = i;
  bigMap.set(`key${i}`, i);
}

// Map: O(1) - instant
console.log('E: Map size:', bigMap.size);

// Object: O(n) - must count all keys
console.log('F: Object keys length:', Object.keys(bigObj).length);


// ═══════════════════════════════════════════════════════════════════════════════
// 3. ITERATION ORDER
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ OBJECT KEY ORDER RULES (ES2015+)                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Integer keys (sorted numerically ascending)                              │
 * │ 2. String keys (insertion order)                                            │
 * │ 3. Symbol keys (insertion order)                                            │
 * │                                                                             │
 * │ Map always uses insertion order for ALL keys.                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Object: Integer keys come first (sorted!)
const orderObj = {
  c: 3,
  1: 'one',
  b: 2,
  2: 'two',
  a: 1
};
console.log('G: Object key order:', Object.keys(orderObj));
// ['1', '2', 'c', 'b', 'a'] - integers first, sorted!

// Map: Always insertion order
const orderMap = new Map([
  ['c', 3],
  [1, 'one'],
  ['b', 2],
  [2, 'two'],
  ['a', 1]
]);
console.log('H: Map key order:', [...orderMap.keys()]);
// ['c', 1, 'b', 2, 'a'] - insertion order preserved


// ═══════════════════════════════════════════════════════════════════════════════
// 4. DEFAULT KEYS / PROTOTYPE POLLUTION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DANGER: Objects inherit from Object.prototype                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ This means keys like 'toString', 'constructor', '__proto__'                 │
 * │ already "exist" and can cause bugs!                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const dangerObj = {};

// These keys are "inherited"
console.log('I: dangerObj.toString:', typeof dangerObj.toString);  // 'function'
console.log('J: dangerObj.constructor:', typeof dangerObj.constructor);  // 'function'

// Can accidentally override built-ins
dangerObj.toString = 'custom';
// Now dangerObj.toString() would fail!

// Map has NO default keys
const safeMap = new Map();
console.log('K: safeMap has toString?:', safeMap.has('toString'));  // false

// Safe to use any key
safeMap.set('toString', 'my value');
safeMap.set('constructor', 'my value');
safeMap.set('__proto__', 'my value');  // Completely safe!
console.log('L:', safeMap.get('__proto__'));  // 'my value'


// ═══════════════════════════════════════════════════════════════════════════════
// 5. ITERATION
// ═══════════════════════════════════════════════════════════════════════════════

const iterObj = { a: 1, b: 2, c: 3 };
const iterMap = new Map([['a', 1], ['b', 2], ['c', 3]]);

// Object: Need helper functions
console.log('M: Object iteration:');
for (const key of Object.keys(iterObj)) {
  console.log(`  ${key}: ${iterObj[key]}`);
}

// Map: Directly iterable
console.log('N: Map iteration:');
for (const [key, value] of iterMap) {
  console.log(`  ${key}: ${value}`);
}


// ═══════════════════════════════════════════════════════════════════════════════
// 6. JSON SERIALIZATION
// ═══════════════════════════════════════════════════════════════════════════════

const jsonObj = { name: 'Alice', age: 30 };
const jsonMap = new Map([['name', 'Alice'], ['age', 30]]);

// Object: Native JSON support
console.log('O: JSON.stringify object:', JSON.stringify(jsonObj));
// '{"name":"Alice","age":30}'

// Map: Requires conversion
console.log('P: JSON.stringify map:', JSON.stringify(jsonMap));
// '{}' - Empty! JSON doesn't understand Map

// Map to JSON (manual)
const mapToJson = JSON.stringify(Object.fromEntries(jsonMap));
console.log('Q: Map to JSON (converted):', mapToJson);

// JSON to Map
const jsonBackToMap = new Map(Object.entries(JSON.parse(mapToJson)));
console.log('R: JSON to Map:', jsonBackToMap);


// ═══════════════════════════════════════════════════════════════════════════════
// 7. PERFORMANCE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PERFORMANCE CHARACTERISTICS                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Map is generally faster for:                                                │
 * │ • Frequent additions and deletions                                          │
 * │ • Large numbers of entries                                                  │
 * │ • When you need .size frequently                                            │
 * │                                                                             │
 * │ Object is generally faster for:                                             │
 * │ • Known structure at compile time                                           │
 * │ • Small number of string keys                                               │
 * │ • When you need JSON serialization                                          │
 * │                                                                             │
 * │ V8 optimizes objects heavily when structure is predictable.                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WHEN TO USE EACH - DECISION GUIDE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ DECISION GUIDE                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE OBJECT when:                                                            │
 * │ ✓ Data has a known structure (user: { name, age, email })                   │
 * │ ✓ Keys are strings known at code-write time                                 │
 * │ ✓ You need JSON serialization                                               │
 * │ ✓ You're creating a record/entity                                           │
 * │ ✓ You need methods on the data (class instance)                             │
 * │                                                                             │
 * │ USE MAP when:                                                               │
 * │ ✓ Keys are determined at runtime                                            │
 * │ ✓ Keys are not strings (objects, DOM elements, functions)                   │
 * │ ✓ You need to preserve insertion order                                      │
 * │ ✓ You frequently add/delete entries                                         │
 * │ ✓ You need .size frequently                                                 │
 * │ ✓ Keys might conflict with Object prototype (toString, etc.)                │
 * │ ✓ You're building a dictionary/lookup table/cache                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// GOOD: Object for structured data
const user = {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  getDisplayName() {
    return this.name;
  }
};

// GOOD: Map for dynamic key-value storage
const userPermissions = new Map();
userPermissions.set(user, ['read', 'write', 'delete']);

// GOOD: Map for caching with object keys
const computationCache = new Map();
function expensiveComputation(input) {
  if (computationCache.has(input)) {
    return computationCache.get(input);
  }
  const result = /* expensive */ input;
  computationCache.set(input, result);
  return result;
}


// ═══════════════════════════════════════════════════════════════════════════════
// REAL WORLD EXAMPLES
// ═══════════════════════════════════════════════════════════════════════════════

// Example 1: Tracking DOM element state (Map is perfect)
const elementStates = new Map();
// elementStates.set(document.getElementById('btn1'), { clicked: 0, visible: true });
// elementStates.set(document.getElementById('btn2'), { clicked: 5, visible: false });

// Example 2: User session storage (Object works fine)
const session = {
  userId: 123,
  token: 'abc123',
  expiresAt: new Date()
};

// Example 3: Word frequency counter (Map is better for unknown keys)
function countWords(text) {
  const counts = new Map();
  for (const word of text.toLowerCase().split(/\s+/)) {
    counts.set(word, (counts.get(word) || 0) + 1);
  }
  return counts;
}

console.log('\nS: Word counts:', countWords('the quick brown fox jumps over the lazy dog'));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Objects and Maps both store key-value pairs, but have key differences:     │
 * │                                                                             │
 * │ Object:                                                                     │
 * │ • Keys must be strings or symbols                                           │
 * │ • Has prototype (inherited properties like toString)                        │
 * │ • Native JSON support                                                       │
 * │ • Better for structured data with known shape                               │
 * │ • Can have methods                                                          │
 * │                                                                             │
 * │ Map:                                                                        │
 * │ • Keys can be ANY type (objects, functions, etc.)                           │
 * │ • No prototype pollution (no inherited keys)                                │
 * │ • Guaranteed insertion order                                                │
 * │ • O(1) .size property                                                       │
 * │ • Directly iterable with for...of                                           │
 * │ • Better for dictionaries with dynamic/unknown keys                         │
 * │                                                                             │
 * │ Rule of thumb:                                                              │
 * │ • Use Object for entities/records (user, product, config)                   │
 * │ • Use Map for dictionaries/caches/lookups with dynamic keys                 │
 * │ • Use Map when keys aren't strings or could conflict with prototype"        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/01-map-vs-object.js
 */
