/**
 * MAP, SET, WEAKMAP, WEAKSET: 08 - Tricky Examples
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PREDICT THE OUTPUT - INTERVIEW GOTCHAS                                     ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ These examples test deep understanding of Map, Set, WeakMap behavior.      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 1: OBJECT KEY REFERENCE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== GOTCHA 1: Object Key Reference ===\n');

const map = new Map();

const key1 = { id: 1 };
const key2 = { id: 1 };  // Same content, different reference!

map.set(key1, 'value1');
map.set(key2, 'value2');

console.log('A:', map.size);
// YOUR ANSWER: ___
// ACTUAL: 2 (different references = different keys)

console.log('B:', map.get({ id: 1 }));
// YOUR ANSWER: ___
// ACTUAL: undefined (new object, new reference)

console.log('C:', map.get(key1));
// YOUR ANSWER: ___
// ACTUAL: 'value1' (same reference)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 2: NaN EQUALITY
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 2: NaN Equality ===\n');

const set = new Set();
set.add(NaN);
set.add(NaN);

console.log('D:', set.size);
// YOUR ANSWER: ___
// ACTUAL: 1 (NaN === NaN in Set, unlike regular ===)

console.log('E:', NaN === NaN);
// YOUR ANSWER: ___
// ACTUAL: false (regular comparison)

console.log('F:', set.has(NaN));
// YOUR ANSWER: ___
// ACTUAL: true


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 3: SET WITH OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 3: Set With Objects ===\n');

const objSet = new Set();

objSet.add({ name: 'Alice' });
objSet.add({ name: 'Alice' });

console.log('G:', objSet.size);
// YOUR ANSWER: ___
// ACTUAL: 2 (different references!)

const alice = { name: 'Alice' };
objSet.add(alice);
objSet.add(alice);

console.log('H:', objSet.size);
// YOUR ANSWER: ___
// ACTUAL: 3 (alice added once, two { name: 'Alice' } literals)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 4: MAP KEY TYPES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 4: Map Key Types ===\n');

const typeMap = new Map();

typeMap.set('1', 'string');
typeMap.set(1, 'number');
typeMap.set(true, 'boolean');

console.log('I:', typeMap.size);
// YOUR ANSWER: ___
// ACTUAL: 3 (all different types, all different keys)

console.log('J:', typeMap.get('1'));
// YOUR ANSWER: ___
// ACTUAL: 'string'

console.log('K:', typeMap.get(1));
// YOUR ANSWER: ___
// ACTUAL: 'number'

// Compare with Object!
const obj = {};
obj['1'] = 'string';
obj[1] = 'number';  // Overwrites!

console.log('L:', Object.keys(obj).length);
// YOUR ANSWER: ___
// ACTUAL: 1 (object converts all keys to strings)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 5: MAP vs OBJECT ITERATION ORDER
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 5: Iteration Order ===\n');

// Map: Always insertion order
const orderedMap = new Map();
orderedMap.set('b', 2);
orderedMap.set('a', 1);
orderedMap.set('c', 3);

console.log('M:', [...orderedMap.keys()]);
// YOUR ANSWER: ___
// ACTUAL: ['b', 'a', 'c'] (insertion order)

// Object with numeric-like keys
const numObj = {};
numObj['2'] = 'two';
numObj['1'] = 'one';
numObj['3'] = 'three';

console.log('N:', Object.keys(numObj));
// YOUR ANSWER: ___
// ACTUAL: ['1', '2', '3'] (numeric keys are sorted!)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 6: SET SPREAD AND SIZE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 6: Set Spread ===\n');

const original = [1, 2, 2, 3, 3, 3];
const unique = [...new Set(original)];

console.log('O:', unique.length);
// YOUR ANSWER: ___
// ACTUAL: 3

console.log('P:', new Set(original).size);
// YOUR ANSWER: ___
// ACTUAL: 3

const str = 'hello';
const uniqueChars = [...new Set(str)];
console.log('Q:', uniqueChars);
// YOUR ANSWER: ___
// ACTUAL: ['h', 'e', 'l', 'o'] (string is iterable by characters)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 7: WEAKMAP RESTRICTIONS
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 7: WeakMap Restrictions ===\n');

const wm = new WeakMap();

try {
  wm.set('string', 'value');
  console.log('R: set string key succeeded');
} catch (e) {
  console.log('R: Error -', e.message);
}
// ACTUAL: Error - Invalid value used as weak map key

try {
  wm.set(123, 'value');
  console.log('S: set number key succeeded');
} catch (e) {
  console.log('S: Error -', e.message);
}
// ACTUAL: Error - Invalid value used as weak map key

const validKey = {};
wm.set(validKey, 'value');
console.log('T:', wm.get(validKey));
// ACTUAL: 'value'


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 8: MAP CHAINING
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 8: Map Chaining ===\n');

const chain = new Map()
  .set('a', 1)
  .set('b', 2)
  .set('c', 3);

console.log('U:', chain.size);
// YOUR ANSWER: ___
// ACTUAL: 3 (set returns the map, enabling chaining)

// But get returns the value, not the map!
const result = new Map().set('x', 10).get('x');
console.log('V:', result);
// YOUR ANSWER: ___
// ACTUAL: 10 (get returns value, breaks chain)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 9: SET ENTRIES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 9: Set Entries ===\n');

const s = new Set([1, 2, 3]);

console.log('W:', [...s.entries()]);
// YOUR ANSWER: ___
// ACTUAL: [[1, 1], [2, 2], [3, 3]] (value, value pairs for Map compatibility)

console.log('X:', [...s.keys()]);
// YOUR ANSWER: ___
// ACTUAL: [1, 2, 3]

console.log('Y:', [...s.values()]);
// YOUR ANSWER: ___
// ACTUAL: [1, 2, 3] (same as keys for Set)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 10: MAP FROM OBJECT GOTCHA
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 10: Map From Object ===\n');

// WRONG way
const wrongMap = new Map({ a: 1, b: 2 });
console.log('Z1:', wrongMap.size);
// YOUR ANSWER: ___
// ACTUAL: 0 (objects aren't iterable in the right way!)

// RIGHT way
const rightMap = new Map(Object.entries({ a: 1, b: 2 }));
console.log('Z2:', rightMap.size);
// YOUR ANSWER: ___
// ACTUAL: 2


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 11: DELETE RETURN VALUE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 11: Delete Return Value ===\n');

const delMap = new Map([['a', 1]]);

console.log('Z3:', delMap.delete('a'));
// YOUR ANSWER: ___
// ACTUAL: true (was present and deleted)

console.log('Z4:', delMap.delete('a'));
// YOUR ANSWER: ___
// ACTUAL: false (wasn't present)


// ═══════════════════════════════════════════════════════════════════════════════
// GOTCHA 12: SET ADD RETURN VALUE
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== GOTCHA 12: Set Add Return ===\n');

const addSet = new Set();
const returnVal = addSet.add(1);

console.log('Z5:', returnVal === addSet);
// YOUR ANSWER: ___
// ACTUAL: true (add returns the Set for chaining)

console.log('Z6:', addSet.add(2).add(3).add(2).size);
// YOUR ANSWER: ___
// ACTUAL: 3 (chained adds, 2 is duplicate so ignored)


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ KEY GOTCHAS SUMMARY                                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. Object keys in Map/Set use REFERENCE equality, not content               │
 * │ 2. NaN === NaN is true in Set/Map (unlike regular ===)                      │
 * │ 3. Map preserves key types (1 !== '1'), Object converts to string           │
 * │ 4. Object numeric keys are sorted, Map preserves insertion order            │
 * │ 5. WeakMap/WeakSet only accept objects as keys                              │
 * │ 6. new Map(object) doesn't work - use Object.entries()                      │
 * │ 7. Set.entries() returns [value, value] pairs                               │
 * │ 8. .set() returns Map (chainable), .get() returns value                     │
 * │ 9. .delete() returns boolean (was it present?)                              │
 * │ 10. String iteration in Set: each character is an element                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/08-tricky-examples.js
 */
