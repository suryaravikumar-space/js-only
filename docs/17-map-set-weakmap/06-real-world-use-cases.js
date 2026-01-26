/**
 * MAP, SET, WEAKMAP, WEAKSET: 06 - Real World Use Cases
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ PRACTICAL PATTERNS WITH MAP, SET, WEAKMAP, WEAKSET                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ This file shows when and why to use each collection in real projects.      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 1: LRU CACHE WITH MAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY MAP FOR LRU CACHE                                                       │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Map maintains insertion order AND allows reordering via delete + set.       │
 * │ This makes it perfect for LRU (Least Recently Used) cache.                  │
 * │                                                                             │
 * │ Pattern: Delete then re-set to move item to end (most recent)               │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // Move to end (most recently used)
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    // If exists, delete first (to update position)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }

    this.cache.set(key, value);

    // Evict oldest if over capacity
    if (this.cache.size > this.capacity) {
      // First key is the oldest (least recently used)
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }
  }
}

console.log('A: LRU Cache example:');
const cache = new LRUCache(3);
cache.put('a', 1);
cache.put('b', 2);
cache.put('c', 3);
console.log('  Get a:', cache.get('a'));  // 1 (moves 'a' to most recent)
cache.put('d', 4);  // Evicts 'b' (oldest)
console.log('  Get b:', cache.get('b'));  // -1 (evicted)
console.log('  Get c:', cache.get('c'));  // 3


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 2: EVENT LISTENERS WITH WEAKMAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY WEAKMAP FOR EVENT LISTENERS                                             │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Store listeners by element without preventing garbage collection.           │
 * │ When element is removed from DOM, listener data is auto-cleaned.            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const elementListeners = new WeakMap();

function addEventListener(element, event, handler) {
  if (!elementListeners.has(element)) {
    elementListeners.set(element, new Map());
  }

  const listeners = elementListeners.get(element);
  if (!listeners.has(event)) {
    listeners.set(event, []);
  }

  listeners.get(event).push(handler);
}

function removeEventListener(element, event, handler) {
  const listeners = elementListeners.get(element);
  if (!listeners) return;

  const handlers = listeners.get(event);
  if (!handlers) return;

  const index = handlers.indexOf(handler);
  if (index > -1) handlers.splice(index, 1);
}

console.log('\nB: Event Listener pattern with WeakMap');
const mockElement = { id: 'button1' };
addEventListener(mockElement, 'click', () => console.log('clicked'));
console.log('  Listener added for element');
// When mockElement is no longer referenced, its listener data is auto-cleaned


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 3: DEDUPLICATION WITH SET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY SET FOR DEDUPLICATION                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Set automatically ignores duplicates. Combined with spread/Array.from,      │
 * │ it's the cleanest way to get unique values.                                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Deduplicate array
const withDupes = ['apple', 'banana', 'apple', 'cherry', 'banana'];
const unique = [...new Set(withDupes)];
console.log('\nC: Deduplicated array:', unique);

// Deduplicate while filtering
function getUniqueEmails(users) {
  return [...new Set(
    users
      .map(u => u.email?.toLowerCase())
      .filter(Boolean)
  )];
}

const users = [
  { name: 'Alice', email: 'ALICE@example.com' },
  { name: 'Bob', email: 'bob@example.com' },
  { name: 'Alice 2', email: 'alice@example.com' },  // Duplicate (case-insensitive)
  { name: 'No Email' }
];

console.log('D: Unique emails:', getUniqueEmails(users));


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 4: COUNTING/FREQUENCY WITH MAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY MAP FOR COUNTING                                                        │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Map handles any key type and has convenient get/set.                        │
 * │ Object works for string keys, but Map is cleaner.                           │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function countFrequency(items) {
  const counts = new Map();
  for (const item of items) {
    counts.set(item, (counts.get(item) || 0) + 1);
  }
  return counts;
}

const words = ['apple', 'banana', 'apple', 'cherry', 'banana', 'apple'];
const freq = countFrequency(words);

console.log('\nE: Word frequency:');
for (const [word, count] of freq) {
  console.log(`  ${word}: ${count}`);
}

// Find most common
const mostCommon = [...freq.entries()].sort((a, b) => b[1] - a[1])[0];
console.log('F: Most common:', mostCommon);


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 5: MEMOIZATION WITH WEAKMAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY WEAKMAP FOR MEMOIZATION                                                 │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Cache computed results by object key. When object is garbage collected,     │
 * │ its cached result is automatically cleaned up.                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const computeCache = new WeakMap();

function expensiveComputation(obj) {
  if (computeCache.has(obj)) {
    console.log('  (cached)');
    return computeCache.get(obj);
  }

  console.log('  (computing...)');
  // Simulate expensive work
  const result = Object.keys(obj).length * 100;
  computeCache.set(obj, result);
  return result;
}

console.log('\nG: Memoization with WeakMap:');
const data = { a: 1, b: 2, c: 3 };
console.log('First call:', expensiveComputation(data));
console.log('Second call:', expensiveComputation(data));  // Cached!


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 6: GRAPH/TREE WITH MAP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY MAP FOR GRAPH ADJACENCY LIST                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Nodes can be any type (objects, strings, numbers).                          │
 * │ Easy iteration over all edges.                                              │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Graph {
  constructor() {
    this.adjacencyList = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, new Set());
    }
  }

  addEdge(v1, v2) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjacencyList.get(v1).add(v2);
    this.adjacencyList.get(v2).add(v1);  // Undirected
  }

  getNeighbors(vertex) {
    return [...(this.adjacencyList.get(vertex) || [])];
  }
}

console.log('\nH: Graph with Map:');
const graph = new Graph();
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
console.log('  Neighbors of A:', graph.getNeighbors('A'));
console.log('  Neighbors of B:', graph.getNeighbors('B'));


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 7: FEATURE FLAGS WITH SET
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHY SET FOR FEATURE FLAGS                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ O(1) lookup for enabled features.                                           │
 * │ Easy set operations for combining feature sets.                             │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const enabledFeatures = new Set(['darkMode', 'newDashboard', 'betaAPI']);

function isFeatureEnabled(feature) {
  return enabledFeatures.has(feature);
}

function enableFeature(feature) {
  enabledFeatures.add(feature);
}

function disableFeature(feature) {
  enabledFeatures.delete(feature);
}

console.log('\nI: Feature flags:');
console.log('  darkMode enabled:', isFeatureEnabled('darkMode'));
console.log('  oldUI enabled:', isFeatureEnabled('oldUI'));


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 8: BIDIRECTIONAL MAPPING WITH TWO MAPS
// ═══════════════════════════════════════════════════════════════════════════════

class BiMap {
  constructor() {
    this.forward = new Map();
    this.reverse = new Map();
  }

  set(key, value) {
    // Remove old mappings
    if (this.forward.has(key)) {
      this.reverse.delete(this.forward.get(key));
    }
    if (this.reverse.has(value)) {
      this.forward.delete(this.reverse.get(value));
    }

    this.forward.set(key, value);
    this.reverse.set(value, key);
  }

  getByKey(key) {
    return this.forward.get(key);
  }

  getByValue(value) {
    return this.reverse.get(value);
  }
}

console.log('\nJ: Bidirectional Map:');
const statusCodes = new BiMap();
statusCodes.set(200, 'OK');
statusCodes.set(404, 'Not Found');
statusCodes.set(500, 'Internal Server Error');

console.log('  Code 200:', statusCodes.getByKey(200));
console.log('  "Not Found" code:', statusCodes.getByValue('Not Found'));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ QUICK REFERENCE: WHICH COLLECTION TO USE                                    │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ MAP:                                                                        │
 * │ • Key-value with non-string keys                                            │
 * │ • Counting/frequency                                                        │
 * │ • LRU cache                                                                 │
 * │ • Graph adjacency list                                                      │
 * │ • Need .size or iteration order                                             │
 * │                                                                             │
 * │ SET:                                                                        │
 * │ • Unique values                                                             │
 * │ • Fast O(1) membership testing                                              │
 * │ • Feature flags                                                             │
 * │ • Tags/categories                                                           │
 * │ • Set operations (union, intersection)                                      │
 * │                                                                             │
 * │ WEAKMAP:                                                                    │
 * │ • Private data for objects                                                  │
 * │ • Memoization/caching by object                                             │
 * │ • DOM element data                                                          │
 * │ • Avoid memory leaks                                                        │
 * │                                                                             │
 * │ WEAKSET:                                                                    │
 * │ • Tracking seen objects                                                     │
 * │ • Circular reference detection                                              │
 * │ • Object branding/tagging                                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/06-real-world-use-cases.js
 */
