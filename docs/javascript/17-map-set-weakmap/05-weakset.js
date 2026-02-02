/**
 * MAP, SET, WEAKMAP, WEAKSET: 05 - WeakSet
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ WeakSet holds WEAK references to OBJECTS only. When an object has no       ║
 * ║ other references, it's automatically removed from the WeakSet.             ║
 * ║                                                                            ║
 * ║   • Can ONLY store objects (not primitives)                                ║
 * ║   • No memory leaks                                                        ║
 * ║   • NOT iterable (can't list elements)                                     ║
 * ║   • Used for tagging/marking objects                                       ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WEAKSET - Real World Justification                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. TRACKING "SEEN" OBJECTS                                                  │
 * │    → Detect circular references                                             │
 * │    → Visited nodes in traversal                                             │
 * │    → Without preventing garbage collection                                  │
 * │                                                                             │
 * │ 2. BRANDING/TAGGING OBJECTS                                                 │
 * │    → Mark objects as validated, processed, or safe                          │
 * │    → Type checking at runtime                                               │
 * │                                                                             │
 * │ 3. TRACKING INSTANCES                                                       │
 * │    → Has this instance been registered?                                     │
 * │    → Singleton pattern enforcement                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKSET BASICS
// ═══════════════════════════════════════════════════════════════════════════════

const weakSet = new WeakSet();

// Can add objects
const obj1 = { id: 1 };
const obj2 = { id: 2 };
const arr = [1, 2, 3];

weakSet.add(obj1);
weakSet.add(obj2);
weakSet.add(arr);

console.log('A: has obj1:', weakSet.has(obj1));  // true
console.log('B: has obj2:', weakSet.has(obj2));  // true
console.log('C: has arr:', weakSet.has(arr));    // true

// Cannot add primitives
try {
  weakSet.add('string');
} catch (e) {
  console.log('D: Error:', e.message);
  // Invalid value used in weak set
}

try {
  weakSet.add(123);
} catch (e) {
  console.log('E: Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKSET METHODS (Very Limited!)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WEAKSET HAS ONLY 3 METHODS                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • add(object)    - Add object to the set                                    │
 * │ • has(object)    - Check if object is in the set                            │
 * │ • delete(object) - Remove object from the set                               │
 * │                                                                             │
 * │ NO iteration methods                                                        │
 * │ NO .size property                                                           │
 * │ NO .clear() method                                                          │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const ws = new WeakSet();
const testObj = { test: true };

ws.add(testObj);
console.log('F: has:', ws.has(testObj));     // true

ws.delete(testObj);
console.log('G: after delete:', ws.has(testObj));  // false


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 1: DETECTING CIRCULAR REFERENCES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Safe deep clone/serialize with circular reference detection        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function deepClone(obj, seen = new WeakSet()) {
  // Handle primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Detect circular reference
  if (seen.has(obj)) {
    throw new Error('Circular reference detected!');
  }

  seen.add(obj);

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item, seen));
  }

  // Handle objects
  const clone = {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key], seen);
  }

  return clone;
}

// Test without circular reference
const simple = { a: 1, b: { c: 2 } };
console.log('\nH: Clone simple:', deepClone(simple));

// Test with circular reference
const circular = { name: 'parent' };
circular.self = circular;  // Circular!

try {
  deepClone(circular);
} catch (e) {
  console.log('I: Circular detected:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 2: BRANDING/TAGGING OBJECTS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Mark objects as validated/processed without modifying them         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const validated = new WeakSet();

function validate(user) {
  if (!user.name || !user.email) {
    throw new Error('Invalid user');
  }

  // Mark as validated
  validated.add(user);
  return user;
}

function isValidated(user) {
  return validated.has(user);
}

function processUser(user) {
  if (!isValidated(user)) {
    throw new Error('User must be validated first!');
  }
  console.log(`  Processing: ${user.name}`);
}

console.log('\nJ: Branding example:');
const user1 = { name: 'Alice', email: 'alice@example.com' };
const user2 = { name: 'Bob', email: 'bob@example.com' };

validate(user1);

processUser(user1);  // Works - validated

try {
  processUser(user2);  // Fails - not validated
} catch (e) {
  console.log('K: Error:', e.message);
}


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 3: TRACKING VISITED NODES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Track visited nodes in graph/tree traversal                        │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function findAllConnected(graph, startNode) {
  const visited = new WeakSet();
  const result = [];

  function dfs(node) {
    if (visited.has(node)) return;
    visited.add(node);
    result.push(node.value);

    for (const neighbor of node.neighbors || []) {
      dfs(neighbor);
    }
  }

  dfs(startNode);
  return result;
}

// Create graph with object nodes
const nodeA = { value: 'A', neighbors: [] };
const nodeB = { value: 'B', neighbors: [] };
const nodeC = { value: 'C', neighbors: [] };
const nodeD = { value: 'D', neighbors: [] };

nodeA.neighbors = [nodeB, nodeC];
nodeB.neighbors = [nodeA, nodeD];  // A-B are connected both ways
nodeC.neighbors = [nodeA, nodeD];
nodeD.neighbors = [nodeB, nodeC];

console.log('\nL: Graph traversal:', findAllConnected({}, nodeA));
// ['A', 'B', 'D', 'C']


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 4: INSTANCE TRACKING
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Track all instances of a class                                     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const instances = new WeakSet();

class TrackedComponent {
  constructor(name) {
    this.name = name;
    instances.add(this);
    console.log(`  Created: ${name}`);
  }

  static isInstance(obj) {
    return instances.has(obj);
  }

  destroy() {
    instances.delete(this);
    console.log(`  Destroyed: ${this.name}`);
  }
}

console.log('\nM: Instance tracking:');

const comp1 = new TrackedComponent('Header');
const comp2 = new TrackedComponent('Footer');

console.log('N: comp1 is instance:', TrackedComponent.isInstance(comp1));  // true
console.log('O: {} is instance:', TrackedComponent.isInstance({}));        // false

comp1.destroy();
console.log('P: comp1 is instance after destroy:', TrackedComponent.isInstance(comp1));  // false


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 5: SAFE JSON STRINGIFY
// ═══════════════════════════════════════════════════════════════════════════════

function safeStringify(obj, indent = 2) {
  const seen = new WeakSet();

  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular Reference]';
      }
      seen.add(value);
    }
    return value;
  }, indent);
}

const data = { name: 'test', items: [1, 2, 3] };
data.self = data;  // Circular!
data.items.push(data);  // Another circular!

console.log('\nQ: Safe stringify:');
console.log(safeStringify(data));


// ═══════════════════════════════════════════════════════════════════════════════
// SET vs WEAKSET COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ SET vs WEAKSET                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌──────────────────┬─────────────────────┬───────────────────────────────┐  │
 * │ │ Feature          │ Set                 │ WeakSet                       │  │
 * │ ├──────────────────┼─────────────────────┼───────────────────────────────┤  │
 * │ │ Value types      │ Any                 │ Objects only                  │  │
 * │ │ References       │ Strong              │ Weak                          │  │
 * │ │ GC behavior      │ Prevents GC         │ Allows GC                     │  │
 * │ │ Iterable         │ Yes                 │ No                            │  │
 * │ │ .size            │ Yes                 │ No                            │  │
 * │ │ .clear()         │ Yes                 │ No                            │  │
 * │ │ Memory leaks     │ Possible            │ Not possible                  │  │
 * │ │ Use case         │ Unique collections  │ Object tagging/tracking       │  │
 * │ └──────────────────┴─────────────────────┴───────────────────────────────┘  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "WeakSet is a Set where values must be objects and references are weak.     │
 * │ When an object has no other references, it's automatically removed.         │
 * │                                                                             │
 * │ Key characteristics:                                                        │
 * │ • Can only store objects (not primitives)                                   │
 * │ • NOT iterable (no .keys(), .values(), .forEach())                          │
 * │ • No .size property                                                         │
 * │ • Only 3 methods: add(), has(), delete()                                    │
 * │ • Prevents memory leaks                                                     │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │                                                                             │
 * │ 1. CIRCULAR REFERENCE DETECTION                                             │
 * │    Track seen objects during deep clone/serialize                           │
 * │                                                                             │
 * │ 2. OBJECT BRANDING/TAGGING                                                  │
 * │    Mark objects as validated, processed, or trusted                         │
 * │                                                                             │
 * │ 3. TRACKING VISITED NODES                                                   │
 * │    In graph/tree traversal without memory leaks                             │
 * │                                                                             │
 * │ 4. INSTANCE CHECKING                                                        │
 * │    Track if object was created by specific class                            │
 * │                                                                             │
 * │ WeakSet is more specialized than WeakMap - use when you only need           │
 * │ to track if an object 'is in the set', not store data about it."            │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/05-weakset.js
 */
