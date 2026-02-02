/**
 * MAP, SET, WEAKMAP, WEAKSET: 02 - Set Basics
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Set is a collection of UNIQUE values. Adding duplicates has no effect.     ║
 * ║                                                                            ║
 * ║   const set = new Set([1, 2, 2, 3, 3, 3]);                                 ║
 * ║   console.log(set);  // Set { 1, 2, 3 } - duplicates removed!              ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE SET - Real World Justification                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. REMOVE DUPLICATES                                                        │
 * │    → [...new Set(array)] is the cleanest way                                │
 * │    → O(n) vs O(n²) for filter with indexOf                                  │
 * │                                                                             │
 * │ 2. FAST MEMBERSHIP TESTING                                                  │
 * │    → set.has(value) is O(1)                                                 │
 * │    → array.includes(value) is O(n)                                          │
 * │                                                                             │
 * │ 3. TRACK UNIQUE ITEMS                                                       │
 * │    → Visited nodes in graph traversal                                       │
 * │    → Seen IDs to prevent duplicates                                         │
 * │                                                                             │
 * │ 4. SET OPERATIONS                                                           │
 * │    → Union, intersection, difference                                        │
 * │    → Compare lists for common/unique elements                               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// CREATING A SET
// ═══════════════════════════════════════════════════════════════════════════════

// Empty Set
const set1 = new Set();

// From array (duplicates removed)
const set2 = new Set([1, 2, 2, 3, 3, 3]);
console.log('A:', set2);  // Set { 1, 2, 3 }
console.log('B: size:', set2.size);  // 3

// From string (unique characters)
const set3 = new Set('hello');
console.log('C:', set3);  // Set { 'h', 'e', 'l', 'o' }

// From any iterable
const set4 = new Set(new Map([['a', 1], ['b', 2]]).keys());
console.log('D:', set4);  // Set { 'a', 'b' }


// ═══════════════════════════════════════════════════════════════════════════════
// SET METHODS
// ═══════════════════════════════════════════════════════════════════════════════

const colors = new Set();

// add(value) - Add element (returns the set for chaining)
colors.add('red');
colors.add('green');
colors.add('blue');
colors.add('red');  // Duplicate - ignored!

console.log('E:', colors);  // Set { 'red', 'green', 'blue' }

// Chaining
colors
  .add('yellow')
  .add('purple')
  .add('orange');

// has(value) - Check if element exists (O(1)!)
console.log('F:', colors.has('red'));    // true
console.log('G:', colors.has('pink'));   // false

// size - Number of elements
console.log('H:', colors.size);  // 6

// delete(value) - Remove element (returns true if existed)
console.log('I:', colors.delete('orange'));  // true
console.log('J:', colors.delete('pink'));    // false

// clear() - Remove all elements
// colors.clear();


// ═══════════════════════════════════════════════════════════════════════════════
// ITERATING SETS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SET ITERATION METHODS                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ set.keys()     → Iterator of values (same as values for Set!)               │
 * │ set.values()   → Iterator of values                                         │
 * │ set.entries()  → Iterator of [value, value] pairs (for Map compatibility)   │
 * │ set.forEach()  → Callback for each value                                    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const fruits = new Set(['apple', 'banana', 'cherry']);

// for...of (most common)
console.log('K: for...of:');
for (const fruit of fruits) {
  console.log(`  ${fruit}`);
}

// values()
console.log('L: values():', [...fruits.values()]);

// keys() is same as values() for Set
console.log('M: keys():', [...fruits.keys()]);

// entries() returns [value, value] pairs
console.log('N: entries():', [...fruits.entries()]);
// [['apple', 'apple'], ['banana', 'banana'], ...]

// forEach
console.log('O: forEach:');
fruits.forEach((value, valueAgain, set) => {
  console.log(`  ${value}`);
});


// ═══════════════════════════════════════════════════════════════════════════════
// VALUE EQUALITY IN SETS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SET VALUE EQUALITY (SameValueZero - same as Map)                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • Objects: Reference equality (different objects are different values)      │
 * │ • Primitives: Value equality                                                │
 * │ • NaN === NaN (works correctly, unlike regular ===)                         │
 * │ • -0 and +0 are the same value                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const equalitySet = new Set();

// Primitives - value equality
equalitySet.add(1);
equalitySet.add(1);  // Same value, not added
equalitySet.add('1'); // Different type, added
console.log('P: primitives:', equalitySet.size);  // 2

// Objects - reference equality
const obj1 = { a: 1 };
const obj2 = { a: 1 };
equalitySet.add(obj1);
equalitySet.add(obj2);  // Different reference, added!
equalitySet.add(obj1);  // Same reference, not added
console.log('Q: after objects:', equalitySet.size);  // 4

// NaN works correctly
const nanSet = new Set();
nanSet.add(NaN);
nanSet.add(NaN);  // Same value
console.log('R: NaN set size:', nanSet.size);  // 1
console.log('S: has NaN:', nanSet.has(NaN));   // true


// ═══════════════════════════════════════════════════════════════════════════════
// COMMON PATTERNS
// ═══════════════════════════════════════════════════════════════════════════════

// 1. Remove duplicates from array
const numbers = [1, 2, 2, 3, 3, 3, 4, 4, 4, 4];
const unique = [...new Set(numbers)];
console.log('T: unique numbers:', unique);  // [1, 2, 3, 4]

// 2. Count unique values
function countUnique(arr) {
  return new Set(arr).size;
}
console.log('U: unique count:', countUnique([1, 1, 2, 2, 3]));  // 3

// 3. Fast membership testing
const allowedUsers = new Set(['alice', 'bob', 'charlie']);

function isAllowed(username) {
  return allowedUsers.has(username);  // O(1)
}

console.log('V: alice allowed:', isAllowed('alice'));  // true
console.log('W: david allowed:', isAllowed('david'));  // false

// 4. Track visited nodes
function* bfs(graph, start) {
  const visited = new Set();
  const queue = [start];

  while (queue.length > 0) {
    const node = queue.shift();
    if (visited.has(node)) continue;

    visited.add(node);
    yield node;

    for (const neighbor of graph[node] || []) {
      queue.push(neighbor);
    }
  }
}

const graph = {
  A: ['B', 'C'],
  B: ['D'],
  C: ['D'],
  D: ['E'],
  E: []
};

console.log('X: BFS traversal:', [...bfs(graph, 'A')]);  // ['A', 'B', 'C', 'D', 'E']


// ═══════════════════════════════════════════════════════════════════════════════
// CONVERTING SET TO/FROM OTHER TYPES
// ═══════════════════════════════════════════════════════════════════════════════

const mySet = new Set([1, 2, 3, 4, 5]);

// Set to Array
const setArray = [...mySet];  // or Array.from(mySet)
console.log('Y: Set to Array:', setArray);

// Array to Set
const arraySet = new Set([1, 2, 3, 1, 2]);
console.log('Z: Array to Set:', arraySet);

// String to unique characters
const str = 'mississippi';
const uniqueChars = [...new Set(str)].join('');
console.log('AA: Unique chars:', uniqueChars);  // 'misp'


// ═══════════════════════════════════════════════════════════════════════════════
// SET vs ARRAY for Membership Testing
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PERFORMANCE: Set vs Array for .has() / .includes()                          │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Array.includes()  → O(n) - searches linearly                              │
 * │   Set.has()         → O(1) - hash lookup                                    │
 * │                                                                             │
 * │ For small arrays (< 100 elements), difference is negligible.                │
 * │ For large collections with frequent lookups, Set is MUCH faster.            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Demonstrating the concept
const largeArray = Array.from({ length: 10000 }, (_, i) => i);
const largeSet = new Set(largeArray);

// Array: O(n) - must scan to find
console.log('AB: Array includes 9999:', largeArray.includes(9999));

// Set: O(1) - direct hash lookup
console.log('AC: Set has 9999:', largeSet.has(9999));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "Set is a collection of unique values. Duplicates are automatically         │
 * │ ignored when added.                                                         │
 * │                                                                             │
 * │ Key features:                                                               │
 * │ • Values must be unique                                                     │
 * │ • Any type can be stored                                                    │
 * │ • O(1) .has() lookup (vs O(n) for array.includes())                         │
 * │ • Preserved insertion order                                                 │
 * │ • Directly iterable with for...of                                           │
 * │                                                                             │
 * │ Common use cases:                                                           │
 * │ 1. Remove duplicates: [...new Set(array)]                                   │
 * │ 2. Fast membership testing: allowedIds.has(id)                              │
 * │ 3. Track visited/seen items in algorithms                                   │
 * │ 4. Set operations (union, intersection, difference)                         │
 * │                                                                             │
 * │ Value equality uses SameValueZero:                                          │
 * │ • NaN === NaN (works correctly)                                             │
 * │ • Objects compared by reference (different objects are unique)"             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/02-set-basics.js
 */
