/**
 * MAP, SET, WEAKMAP, WEAKSET: 00 - Map Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Map is a collection of key-value pairs where KEYS CAN BE ANY TYPE.         ║
 * ║ Unlike objects, keys can be objects, functions, or any primitive.          ║
 * ║                                                                            ║
 * ║   const map = new Map();                                                   ║
 * ║   map.set({id: 1}, 'user data');  // Object as key!                        ║
 * ║   map.set(document.body, 'body data');  // DOM element as key!             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE MAP - Real World Justification                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ USE MAP WHEN:                                                               │
 * │                                                                             │
 * │ 1. Keys are NOT strings                                                     │
 * │    → Objects as keys (storing metadata about objects)                       │
 * │    → DOM elements as keys (tracking element state)                          │
 * │    → Functions as keys (memoization)                                        │
 * │                                                                             │
 * │ 2. You need to preserve insertion order                                     │
 * │    → Guaranteed iteration order                                             │
 * │    → Object key order has complex rules                                     │
 * │                                                                             │
 * │ 3. Frequent additions/deletions                                             │
 * │    → Map is optimized for this                                              │
 * │    → Object property deletion can be slow                                   │
 * │                                                                             │
 * │ 4. You need the size                                                        │
 * │    → map.size is O(1)                                                       │
 * │    → Object.keys(obj).length is O(n)                                        │
 * │                                                                             │
 * │ 5. Keys could conflict with Object properties                               │
 * │    → 'constructor', 'toString', '__proto__' are safe in Map                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CREATING A MAP
// ═══════════════════════════════════════════════════════════════════════════════

// Empty Map
const map1 = new Map();

// Initialize with array of [key, value] pairs
const map2 = new Map([
  ['name', 'Alice'],
  ['age', 30],
  ['city', 'NYC']
]);

// Initialize from Object.entries
const obj = { a: 1, b: 2, c: 3 };
const map3 = new Map(Object.entries(obj));

console.log('A: map2:', map2);
console.log('B: map3 from object:', map3);


// ═══════════════════════════════════════════════════════════════════════════════
// MAP METHODS
// ═══════════════════════════════════════════════════════════════════════════════

const users = new Map();

// set(key, value) - Add/update entry (returns the map for chaining)
users.set('user1', { name: 'Alice', age: 30 });
users.set('user2', { name: 'Bob', age: 25 });
users.set('user3', { name: 'Charlie', age: 35 });

// Chaining
users
  .set('user4', { name: 'Diana', age: 28 })
  .set('user5', { name: 'Eve', age: 32 });

// get(key) - Retrieve value
console.log('C:', users.get('user1'));  // { name: 'Alice', age: 30 }
console.log('D:', users.get('unknown')); // undefined

// has(key) - Check if key exists
console.log('E:', users.has('user1'));   // true
console.log('F:', users.has('user99'));  // false

// size - Number of entries
console.log('G:', users.size);  // 5

// delete(key) - Remove entry (returns true if existed)
console.log('H:', users.delete('user5')); // true
console.log('I:', users.delete('user99')); // false (didn't exist)

// clear() - Remove all entries
// users.clear();


// ═══════════════════════════════════════════════════════════════════════════════
// ITERATING MAPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MAP ITERATION METHODS                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ map.keys()     → Iterator of keys                                           │
 * │ map.values()   → Iterator of values                                         │
 * │ map.entries()  → Iterator of [key, value] pairs (default for for...of)      │
 * │ map.forEach()  → Callback for each entry                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const colors = new Map([
  ['red', '#FF0000'],
  ['green', '#00FF00'],
  ['blue', '#0000FF']
]);

// for...of with destructuring (most common)
console.log('J: for...of with entries:');
for (const [color, hex] of colors) {
  console.log(`  ${color}: ${hex}`);
}

// keys only
console.log('K: keys:', [...colors.keys()]);

// values only
console.log('L: values:', [...colors.values()]);

// entries (explicit)
console.log('M: entries:', [...colors.entries()]);

// forEach
console.log('N: forEach:');
colors.forEach((value, key) => {
  console.log(`  ${key} = ${value}`);
});

/**
 * OUTPUT:
 *   J: for...of with entries:
 *     red: #FF0000
 *     green: #00FF00
 *     blue: #0000FF
 *   K: keys: [ 'red', 'green', 'blue' ]
 *   L: values: [ '#FF0000', '#00FF00', '#0000FF' ]
 *   M: entries: [ [ 'red', '#FF0000' ], ... ]
 */


// ═══════════════════════════════════════════════════════════════════════════════
// NON-STRING KEYS (Map's Superpower!)
// ═══════════════════════════════════════════════════════════════════════════════

const objKey1 = { id: 1 };
const objKey2 = { id: 2 };
const funcKey = function() { return 'hello'; };

const metaMap = new Map();

// Objects as keys
metaMap.set(objKey1, 'Data for object 1');
metaMap.set(objKey2, 'Data for object 2');

// Function as key
metaMap.set(funcKey, 'Data for function');

// Retrieve
console.log('O:', metaMap.get(objKey1));  // 'Data for object 1'
console.log('P:', metaMap.get(objKey2));  // 'Data for object 2'
console.log('Q:', metaMap.get(funcKey));  // 'Data for function'

// Different object with same shape is DIFFERENT key!
console.log('R:', metaMap.get({ id: 1 }));  // undefined! Not the same object


// ═══════════════════════════════════════════════════════════════════════════════
// KEY EQUALITY IN MAPS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MAP KEY EQUALITY (SameValueZero algorithm)                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • Objects/Functions: Reference equality (===)                               │
 * │ • Primitives: Value equality                                                │
 * │ • Special: NaN === NaN (unlike regular JS!)                                 │
 * │ • -0 and +0 are equal                                                       │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const equalityMap = new Map();

// NaN works as a key (unlike with objects)
equalityMap.set(NaN, 'NaN value');
console.log('S:', equalityMap.get(NaN));  // 'NaN value'

// -0 and +0 are the same key
equalityMap.set(-0, 'zero');
console.log('T:', equalityMap.get(0));   // 'zero'
console.log('U:', equalityMap.get(-0));  // 'zero'

// Primitives
equalityMap.set(1, 'one');
equalityMap.set('1', 'one string');
console.log('V:', equalityMap.get(1));   // 'one'
console.log('W:', equalityMap.get('1')); // 'one string' (different keys!)


// ═══════════════════════════════════════════════════════════════════════════════
// CONVERTING MAP TO/FROM OTHER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

const myMap = new Map([
  ['a', 1],
  ['b', 2],
  ['c', 3]
]);

// Map to Array
const mapArray = [...myMap];  // or Array.from(myMap)
console.log('X: Map to Array:', mapArray);

// Map to Object (only works with string keys!)
const mapObject = Object.fromEntries(myMap);
console.log('Y: Map to Object:', mapObject);

// Object to Map
const backToMap = new Map(Object.entries(mapObject));
console.log('Z: Object to Map:', backToMap);

/**
 * OUTPUT:
 *   X: Map to Array: [ [ 'a', 1 ], [ 'b', 2 ], [ 'c', 3 ] ]
 *   Y: Map to Object: { a: 1, b: 2, c: 3 }
 *   Z: Object to Map: Map { 'a' => 1, 'b' => 2, 'c' => 3 }
 */


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL EXAMPLE: Memoization with Map
// ═══════════════════════════════════════════════════════════════════════════════

function memoize(fn) {
  const cache = new Map();

  return function(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log('  Cache hit!');
      return cache.get(key);
    }

    console.log('  Computing...');
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

const expensiveCalc = memoize((x, y) => {
  // Simulate expensive operation
  return x * y + x + y;
});

console.log('\nAA: Memoization:');
console.log('  Result:', expensiveCalc(5, 3));  // Computing...
console.log('  Result:', expensiveCalc(5, 3));  // Cache hit!
console.log('  Result:', expensiveCalc(5, 4));  // Computing...


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Map is a key-value collection where keys can be ANY type, not just         │
 * │ strings like with objects.                                                  │
 * │                                                                             │
 * │ Key features:                                                               │
 * │ • Any type as key (objects, functions, primitives)                          │
 * │ • Preserved insertion order                                                 │
 * │ • O(1) .size property                                                       │
 * │ • Iterable with for...of                                                    │
 * │ • No key conflicts with prototype                                           │
 * │                                                                             │
 * │ Main methods:                                                               │
 * │ • set(key, value) - add/update                                              │
 * │ • get(key) - retrieve value                                                 │
 * │ • has(key) - check existence                                                │
 * │ • delete(key) - remove entry                                                │
 * │ • clear() - remove all                                                      │
 * │ • keys(), values(), entries() - iterators                                   │
 * │                                                                             │
 * │ Key equality uses SameValueZero:                                            │
 * │ • NaN === NaN (unlike regular JS)                                           │
 * │ • Objects compared by reference                                             │
 * │                                                                             │
 * │ Use Map when keys aren't strings or you need guaranteed iteration order."   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/00-map-basics.js
 */
