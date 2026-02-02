/**
 * MAP, SET, WEAKMAP, WEAKSET: 04 - WeakMap
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ WeakMap holds WEAK references to OBJECT keys. When the key object has      ║
 * ║ no other references, both the key and value are garbage collected.         ║
 * ║                                                                            ║
 * ║   • Keys MUST be objects (not primitives)                                  ║
 * ║   • Values can be anything                                                 ║
 * ║   • No memory leaks - GC cleans up automatically                           ║
 * ║   • NOT iterable (can't list keys/values)                                  ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE WEAKMAP - Real World Justification                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. PRIVATE DATA FOR OBJECTS                                                 │
 * │    → Store private properties without modifying the object                  │
 * │    → Classic pattern before ES2022 #private fields                          │
 * │                                                                             │
 * │ 2. CACHING WITH AUTOMATIC CLEANUP                                           │
 * │    → Cache computed values for objects                                      │
 * │    → When object is GC'd, cache entry is removed                            │
 * │                                                                             │
 * │ 3. DOM ELEMENT METADATA                                                     │
 * │    → Store data associated with DOM elements                                │
 * │    → No memory leaks when element is removed                                │
 * │                                                                             │
 * │ 4. OBJECT TAGGING                                                           │
 * │    → Mark objects without modifying them                                    │
 * │    → "Have I seen this object before?"                                      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKMAP BASICS
// ═══════════════════════════════════════════════════════════════════════════════

const weakMap = new WeakMap();

// Keys must be objects
const objKey = { id: 1 };
const arrayKey = [1, 2, 3];
const funcKey = function() {};

weakMap.set(objKey, 'object value');
weakMap.set(arrayKey, 'array value');
weakMap.set(funcKey, 'function value');

// Works
console.log('A:', weakMap.get(objKey));     // 'object value'
console.log('B:', weakMap.has(objKey));     // true

// Primitives as keys - NOT ALLOWED
try {
  weakMap.set('string', 'value');
} catch (e) {
  console.log('C: Error:', e.message);
  // Invalid value used as weak map key
}


// ═══════════════════════════════════════════════════════════════════════════════
// WEAKMAP METHODS (Limited!)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WEAKMAP HAS ONLY 4 METHODS                                                  │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ • get(key)     - Get value for key                                          │
 * │ • set(key, val) - Set value for key                                         │
 * │ • has(key)     - Check if key exists                                        │
 * │ • delete(key)  - Remove key-value pair                                      │
 * │                                                                             │
 * │ NO iteration methods (keys, values, entries, forEach)                       │
 * │ NO .size property                                                           │
 * │ NO .clear() method                                                          │
 * │                                                                             │
 * │ WHY? Because entries may be garbage collected at any time!                  │
 * │ The contents are non-deterministic.                                         │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const wm = new WeakMap();
const key = { name: 'test' };

wm.set(key, 'data');

console.log('D:', wm.get(key));     // 'data'
console.log('E:', wm.has(key));     // true
console.log('F:', wm.delete(key));  // true
console.log('G:', wm.has(key));     // false


// ═══════════════════════════════════════════════════════════════════════════════
// VISUAL: Weak vs Strong References
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WEAK vs STRONG REFERENCES                                                   │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ REGULAR MAP (Strong References):                                            │
 * │                                                                             │
 * │   let obj = { id: 1 };                                                      │
 * │   const map = new Map();                                                    │
 * │   map.set(obj, 'data');                                                     │
 * │                                                                             │
 * │   ┌───────────┐      ┌─────────────────────────┐                            │
 * │   │   obj ────┼──────►  { id: 1 }              │                            │
 * │   └───────────┘      │                         │                            │
 * │                      │  ▲                      │                            │
 * │   ┌───────────┐      │  │ Strong reference     │                            │
 * │   │   map ────┼──────┼──┘                      │                            │
 * │   └───────────┘      └─────────────────────────┘                            │
 * │                                                                             │
 * │   obj = null;  // Object STILL exists! Map keeps it alive.                  │
 * │                                                                             │
 * │                                                                             │
 * │ WEAKMAP (Weak References):                                                  │
 * │                                                                             │
 * │   let obj = { id: 1 };                                                      │
 * │   const weakMap = new WeakMap();                                            │
 * │   weakMap.set(obj, 'data');                                                 │
 * │                                                                             │
 * │   ┌───────────┐      ┌─────────────────────────┐                            │
 * │   │   obj ────┼──────►  { id: 1 }              │                            │
 * │   └───────────┘      │                         │                            │
 * │                      │  ▲                      │                            │
 * │   ┌───────────┐      │  │ Weak reference       │                            │
 * │   │ weakMap ──┼╌╌╌╌╌╌┼╌╌┘ (dotted = weak)      │                            │
 * │   └───────────┘      └─────────────────────────┘                            │
 * │                                                                             │
 * │   obj = null;  // Object CAN be garbage collected!                          │
 * │                // WeakMap entry is automatically removed.                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 1: PRIVATE DATA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Private instance data without modifying the object                 │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const privateData = new WeakMap();

class User {
  constructor(name, password) {
    this.name = name;

    // Store password privately - not on the object!
    privateData.set(this, { password });
  }

  checkPassword(input) {
    const data = privateData.get(this);
    return data.password === input;
  }

  // Can't access password directly from outside!
}

const user = new User('Alice', 'secret123');

console.log('\nH: User name:', user.name);           // 'Alice'
console.log('I: User password:', user.password);     // undefined (not on object)
console.log('J: Check correct:', user.checkPassword('secret123'));  // true
console.log('K: Check wrong:', user.checkPassword('wrong'));        // false

// Password is truly private - not enumerable, not accessible
console.log('L: Object keys:', Object.keys(user));   // ['name']


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 2: CACHING WITH AUTOMATIC CLEANUP
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Cache computed values, auto-cleanup when object is gone            │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const computationCache = new WeakMap();

function expensiveComputation(obj) {
  // Check cache first
  if (computationCache.has(obj)) {
    console.log('  Cache hit!');
    return computationCache.get(obj);
  }

  // Compute result
  console.log('  Computing...');
  const result = Object.keys(obj).length * 100 + obj.value;

  // Store in cache
  computationCache.set(obj, result);
  return result;
}

console.log('\nM: Caching example:');
let data = { value: 42, name: 'test', extra: 'stuff' };
console.log('  Result:', expensiveComputation(data));  // Computing... 342
console.log('  Result:', expensiveComputation(data));  // Cache hit! 342
console.log('  Result:', expensiveComputation(data));  // Cache hit! 342

// When data is no longer referenced, cache entry is automatically cleaned up
// data = null;  // Cache entry becomes eligible for GC


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 3: DOM ELEMENT METADATA
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ PATTERN: Store metadata for DOM elements without memory leaks               │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const elementData = new WeakMap();

function trackElement(element, metadata) {
  elementData.set(element, {
    ...metadata,
    trackedAt: Date.now()
  });
}

function getElementData(element) {
  return elementData.get(element);
}

// Simulated DOM element
let button = { tagName: 'BUTTON', id: 'submit-btn' };

trackElement(button, { clicks: 0, hovered: false });
console.log('\nN: Element data:', getElementData(button));

// When element is removed from DOM and dereferenced,
// the metadata is automatically garbage collected!
// button = null;  // Metadata becomes eligible for GC


// ═══════════════════════════════════════════════════════════════════════════════
// USE CASE 4: MEMOIZATION FOR OBJECT ARGUMENTS
// ═══════════════════════════════════════════════════════════════════════════════

function memoizeWeakMap(fn) {
  const cache = new WeakMap();

  return function(obj) {
    if (cache.has(obj)) {
      return cache.get(obj);
    }

    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

const processObject = memoizeWeakMap((obj) => {
  console.log('  Processing:', obj.id);
  return { processed: true, original: obj.id };
});

console.log('\nO: Memoization:');
const obj1 = { id: 'A' };
const obj2 = { id: 'B' };

console.log(processObject(obj1));  // Processing: A
console.log(processObject(obj1));  // (cached, no log)
console.log(processObject(obj2));  // Processing: B


// ═══════════════════════════════════════════════════════════════════════════════
// MAP vs WEAKMAP COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ MAP vs WEAKMAP                                                              │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ ┌──────────────────┬─────────────────────┬───────────────────────────────┐  │
 * │ │ Feature          │ Map                 │ WeakMap                       │  │
 * │ ├──────────────────┼─────────────────────┼───────────────────────────────┤  │
 * │ │ Key types        │ Any                 │ Objects only                  │  │
 * │ │ References       │ Strong              │ Weak                          │  │
 * │ │ GC behavior      │ Prevents GC         │ Allows GC                     │  │
 * │ │ Iterable         │ Yes                 │ No                            │  │
 * │ │ .size            │ Yes                 │ No                            │  │
 * │ │ .clear()         │ Yes                 │ No                            │  │
 * │ │ Memory leaks     │ Possible            │ Not possible                  │  │
 * │ │ Use case         │ General key-value   │ Object metadata/caching       │  │
 * │ └──────────────────┴─────────────────────┴───────────────────────────────┘  │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "WeakMap is a Map where keys must be objects and references are weak.       │
 * │ When the key object has no other references, both the key-value pair        │
 * │ are automatically garbage collected.                                        │
 * │                                                                             │
 * │ Key characteristics:                                                        │
 * │ • Keys must be objects (not primitives)                                     │
 * │ • NOT iterable (no .keys(), .values(), .forEach())                          │
 * │ • No .size property                                                         │
 * │ • Prevents memory leaks                                                     │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │                                                                             │
 * │ 1. PRIVATE DATA                                                             │
 * │    Store private properties without modifying objects                       │
 * │    (before ES2022 #private fields)                                          │
 * │                                                                             │
 * │ 2. CACHING                                                                  │
 * │    Cache computed values for objects with automatic cleanup                 │
 * │                                                                             │
 * │ 3. DOM METADATA                                                             │
 * │    Store data for elements without memory leaks                             │
 * │                                                                             │
 * │ Why no iteration? Because entries can be GC'd at any time,                  │
 * │ making the contents non-deterministic."                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/17-map-set-weakmap/04-weakmap.js
 */
