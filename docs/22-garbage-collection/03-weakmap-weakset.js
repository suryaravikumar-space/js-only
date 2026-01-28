/**
 * GARBAGE COLLECTION: 03 - WeakMap & WeakSet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ WEAK COLLECTIONS - GC-Friendly Data Structures                             ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ WeakMap and WeakSet hold "weak" references that DON'T prevent GC.          ║
 * ║ If the key object has no other references, it gets garbage collected       ║
 * ║ and automatically removed from the collection!                             ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// THE PROBLEM WITH REGULAR MAP
// ═══════════════════════════════════════════════════════════════════════════════

console.log('=== Problem with Regular Map ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ REGULAR MAP PREVENTS GARBAGE COLLECTION                                     │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const cache = new Map();                                                  │
 * │                                                                             │
 * │   let user = { name: 'Alice' };                                             │
 * │   cache.set(user, 'some data');                                             │
 * │                                                                             │
 * │   user = null;  // We're done with user                                     │
 * │                                                                             │
 * │   // BUT the object is STILL in memory!                                     │
 * │   // Map holds a STRONG reference to it as a key                            │
 * │   // cache still has: { {name:'Alice'} => 'some data' }                     │
 * │                                                                             │
 * │                                                                             │
 * │   ┌────────────────────────────────────────────────────────────────────┐    │
 * │   │                                                                    │    │
 * │   │   user ────────► null                                              │    │
 * │   │                                                                    │    │
 * │   │   Map.keys() ──► { name: 'Alice' }  ← STILL IN MEMORY!             │    │
 * │   │                                                                    │    │
 * │   └────────────────────────────────────────────────────────────────────┘    │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Regular Map holds strong references
const regularMap = new Map();

let obj1 = { id: 1 };
regularMap.set(obj1, 'data for obj1');

console.log('A: Map size before nulling:', regularMap.size);  // 1

obj1 = null;  // Remove our reference

// Object is STILL in the Map!
console.log('B: Map size after nulling:', regularMap.size);   // 1 (still there!)
console.log('C: Map keys:', [...regularMap.keys()]);          // [{ id: 1 }]


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKMAP - WEAK KEY REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== WeakMap ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WEAKMAP - Keys Don't Prevent GC                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   const cache = new WeakMap();                                              │
 * │                                                                             │
 * │   let user = { name: 'Alice' };                                             │
 * │   cache.set(user, 'some data');                                             │
 * │                                                                             │
 * │   user = null;  // Only reference to object                                 │
 * │                                                                             │
 * │   // Object becomes unreachable → Gets garbage collected                    │
 * │   // Entry is AUTOMATICALLY removed from WeakMap!                           │
 * │                                                                             │
 * │                                                                             │
 * │   KEY RESTRICTIONS:                                                         │
 * │   ──────────────────────────────────────────────────────────────────        │
 * │   • Keys MUST be objects (not primitives)                                   │
 * │   • NOT iterable (no .keys(), .values(), .entries())                        │
 * │   • No .size property                                                       │
 * │   • No .clear() method                                                      │
 * │                                                                             │
 * │   WHY? Because we can't know when GC will run or what will be collected.    │
 * │                                                                             │
 * │                                                                             │
 * │   AVAILABLE METHODS:                                                        │
 * │   • get(key)                                                                │
 * │   • set(key, value)                                                         │
 * │   • has(key)                                                                │
 * │   • delete(key)                                                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const weakMap = new WeakMap();

let user = { name: 'Alice' };
weakMap.set(user, { visits: 10 });

console.log('D: WeakMap has user:', weakMap.has(user));     // true
console.log('E: WeakMap get:', weakMap.get(user));          // { visits: 10 }

// When we remove our reference...
user = null;
// ...the entry will be removed from WeakMap when GC runs
// We can't check because WeakMap has no .size or iteration

console.log('F: After nulling user, WeakMap entry will be GC\'d');


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKMAP USE CASES
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== WeakMap Use Cases ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE 1: PRIVATE DATA                                                    │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const privateData = new WeakMap();

class Person {
  constructor(name, age) {
    // Store private data keyed by instance
    privateData.set(this, { name, age });
  }

  getName() {
    return privateData.get(this).name;
  }

  getAge() {
    return privateData.get(this).age;
  }
}

const alice = new Person('Alice', 30);
console.log('G: Private data -', alice.getName(), alice.getAge());

// When alice is GC'd, private data is automatically cleaned up!


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE 2: CACHING COMPUTED VALUES                                         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const computeCache = new WeakMap();

function expensiveComputation(obj) {
  if (computeCache.has(obj)) {
    console.log('  (cache hit)');
    return computeCache.get(obj);
  }

  console.log('  (computing...)');
  const result = obj.value * 2;  // Expensive operation
  computeCache.set(obj, result);
  return result;
}

let data = { value: 21 };
console.log('H: First call:', expensiveComputation(data));   // computing... 42
console.log('I: Second call:', expensiveComputation(data));  // cache hit, 42

// When data is GC'd, cached result is automatically removed


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE 3: DOM ELEMENT METADATA                                            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// In browser: store data associated with DOM elements
// const elementData = new WeakMap();
//
// const button = document.getElementById('myButton');
// elementData.set(button, { clicks: 0 });
//
// When button is removed from DOM and GC'd, metadata is cleaned up too!

console.log('J: WeakMap is perfect for DOM element metadata');


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKSET
// ═══════════════════════════════════════════════════════════════════════════════

console.log('\n=== WeakSet ===\n');

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WEAKSET - Set of Objects with Weak References                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   Like Set, but:                                                            │
 * │   • Only holds objects (not primitives)                                     │
 * │   • Objects can be garbage collected                                        │
 * │   • Not iterable, no .size                                                  │
 * │                                                                             │
 * │   AVAILABLE METHODS:                                                        │
 * │   • add(value)                                                              │
 * │   • has(value)                                                              │
 * │   • delete(value)                                                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const weakSet = new WeakSet();

let obj = { id: 1 };
weakSet.add(obj);

console.log('K: WeakSet has obj:', weakSet.has(obj));  // true

obj = null;
// Object will be removed from WeakSet when GC runs


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WEAKSET USE CASE: TRACKING/MARKING OBJECTS                                  │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Track which objects have been processed
const processedItems = new WeakSet();

function processOnce(item) {
  if (processedItems.has(item)) {
    console.log('  Already processed');
    return;
  }

  // Process item
  console.log('  Processing:', item.name);
  processedItems.add(item);
}

let item1 = { name: 'Item 1' };
let item2 = { name: 'Item 2' };

console.log('L: Processing items:');
processOnce(item1);  // Processing: Item 1
processOnce(item1);  // Already processed
processOnce(item2);  // Processing: Item 2

// When item1/item2 are GC'd, they're automatically removed from processedItems


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ COMPARISON: Map/Set vs WeakMap/WeakSet                                      │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   ┌─────────────────────┬────────────────────┬────────────────────┐         │
 * │   │ Feature             │ Map/Set            │ WeakMap/WeakSet    │         │
 * │   ├─────────────────────┼────────────────────┼────────────────────┤         │
 * │   │ Keys/Values         │ Any type           │ Objects only       │         │
 * │   │ Prevents GC         │ Yes                │ No                 │         │
 * │   │ Iterable            │ Yes                │ No                 │         │
 * │   │ .size               │ Yes                │ No                 │         │
 * │   │ .clear()            │ Yes                │ No                 │         │
 * │   │ Auto-cleanup        │ No                 │ Yes (on GC)        │         │
 * │   │ Use case            │ General storage    │ Object metadata    │         │
 * │   └─────────────────────┴────────────────────┴────────────────────┘         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "WeakMap and WeakSet are special collections that hold 'weak' references    │
 * │ to objects - meaning they don't prevent garbage collection.                 │
 * │                                                                             │
 * │ WeakMap:                                                                    │
 * │ • Keys must be objects                                                      │
 * │ • When key object has no other references, it's GC'd along with the entry   │
 * │ • Not iterable, no .size (can't know when GC runs)                          │
 * │ • Use cases: private data, caching, DOM metadata                            │
 * │                                                                             │
 * │ WeakSet:                                                                    │
 * │ • Only stores objects                                                       │
 * │ • Objects are removed when GC'd                                             │
 * │ • Use cases: tracking/marking objects                                       │
 * │                                                                             │
 * │ Regular Map/Set hold strong references - entries persist until explicitly   │
 * │ deleted, which can cause memory leaks. Weak collections solve this by       │
 * │ automatically cleaning up when objects become unreachable."                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/22-garbage-collection/03-weakmap-weakset.js
 */
