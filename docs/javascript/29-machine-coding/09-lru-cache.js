/**
 * MACHINE CODING 09: LRU Cache — O(1) get & put
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                          ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ LRU = Least Recently Used. Fixed capacity cache.                         ║
 * ║ get(key)        — return value or -1. Marks key as recently used.        ║
 * ║ put(key, value) — insert/update. If over capacity, evict LRU item.      ║
 * ║                                                                          ║
 * ║ Both operations must be O(1).                                            ║
 * ║ Use: Map (preserves insertion order) OR DoublyLinkedList + HashMap.      ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ STORY TO REMEMBER                                                         │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │ Think of a bookshelf with limited space. When you read a book, put it on  │
 * │ top. When the shelf is full and you buy a new book, throw out the book    │
 * │ at the very bottom (least recently touched).                              │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * ┌────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL DIAGRAM                                                            │
 * ├────────────────────────────────────────────────────────────────────────────┤
 * │                                                                           │
 * │  capacity = 3                                                             │
 * │                                                                           │
 * │  put(1,A)  →  [1:A]                                                      │
 * │  put(2,B)  →  [1:A, 2:B]                                                 │
 * │  put(3,C)  →  [1:A, 2:B, 3:C]                                            │
 * │  get(1)    →  [2:B, 3:C, 1:A]    ← 1 moved to end (most recent)         │
 * │  put(4,D)  →  [3:C, 1:A, 4:D]    ← 2:B evicted (was LRU)               │
 * │                ^^^                                                        │
 * │               LRU = first item in order                                   │
 * │                                                                           │
 * └────────────────────────────────────────────────────────────────────────────┘
 *
 * RUN: node docs/javascript/29-machine-coding/09-lru-cache.js
 */

// ─────────────────────────────────────────────
// APPROACH 1: Using Map (insertion order)
// ─────────────────────────────────────────────

class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;
    // Move to end (most recent): delete + re-insert
    var value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  put(key, value) {
    // If key exists, delete first (to re-insert at end)
    if (this.cache.has(key)) {
      this.cache.delete(key);
    }
    this.cache.set(key, value);

    // If over capacity, evict LRU (first key in Map)
    if (this.cache.size > this.capacity) {
      var lruKey = this.cache.keys().next().value;
      this.cache.delete(lruKey);
    }
  }

  toString() {
    var entries = [];
    this.cache.forEach(function(v, k) { entries.push(k + ':' + v); });
    return '[' + entries.join(', ') + ']';
  }
}

// ─────────────────────────────────────────────
// APPROACH 2: Doubly Linked List + HashMap
// ─────────────────────────────────────────────

class DLLNode {
  constructor(key, value) {
    this.key = key;
    this.value = value;
    this.prev = null;
    this.next = null;
  }
}

class LRUCacheDLL {
  constructor(capacity) {
    this.capacity = capacity;
    this.map = {};
    this.size = 0;
    // Sentinel nodes
    this.head = new DLLNode(0, 0); // dummy head (LRU side)
    this.tail = new DLLNode(0, 0); // dummy tail (MRU side)
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  _removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  _addToTail(node) {
    node.prev = this.tail.prev;
    node.next = this.tail;
    this.tail.prev.next = node;
    this.tail.prev = node;
  }

  get(key) {
    if (!this.map[key]) return -1;
    var node = this.map[key];
    this._removeNode(node);
    this._addToTail(node);
    return node.value;
  }

  put(key, value) {
    if (this.map[key]) {
      var existing = this.map[key];
      existing.value = value;
      this._removeNode(existing);
      this._addToTail(existing);
    } else {
      var node = new DLLNode(key, value);
      this.map[key] = node;
      this._addToTail(node);
      this.size++;

      if (this.size > this.capacity) {
        var lru = this.head.next;
        this._removeNode(lru);
        delete this.map[lru.key];
        this.size--;
      }
    }
  }

  toString() {
    var entries = [];
    var curr = this.head.next;
    while (curr !== this.tail) {
      entries.push(curr.key + ':' + curr.value);
      curr = curr.next;
    }
    return '[' + entries.join(', ') + ']';
  }
}

// ─────────────────────────────────────────────
// TEST CASES — Map-based LRU
// ─────────────────────────────────────────────

console.log('=== LRU Cache (Map-based) ===');

var lru = new LRUCache(3);
lru.put(1, 'A');
lru.put(2, 'B');
lru.put(3, 'C');
console.log('A:', lru.toString());        // [1:A, 2:B, 3:C]

console.log('B:', lru.get(1));            // A
console.log('C:', lru.toString());        // [2:B, 3:C, 1:A]  — 1 moved to end

lru.put(4, 'D');                          // evicts key 2 (LRU)
console.log('D:', lru.toString());        // [3:C, 1:A, 4:D]
console.log('E:', lru.get(2));            // -1 (evicted)

lru.put(3, 'C2');                         // update existing
console.log('F:', lru.toString());        // [1:A, 4:D, 3:C2]

lru.put(5, 'E');                          // evicts key 1
console.log('G:', lru.toString());        // [4:D, 3:C2, 5:E]
console.log('H:', lru.get(1));            // -1 (evicted)

// ─────────────────────────────────────────────
// TEST CASES — DLL-based LRU
// ─────────────────────────────────────────────

console.log('\n=== LRU Cache (DLL-based) ===');

var lru2 = new LRUCacheDLL(2);
lru2.put(1, 10);
lru2.put(2, 20);
console.log('I:', lru2.toString());       // [1:10, 2:20]
console.log('J:', lru2.get(1));           // 10
console.log('K:', lru2.toString());       // [2:20, 1:10]  — 1 accessed, moved

lru2.put(3, 30);                          // evicts key 2
console.log('L:', lru2.toString());       // [1:10, 3:30]
console.log('M:', lru2.get(2));           // -1 (evicted)

lru2.put(4, 40);                          // evicts key 1
console.log('N:', lru2.toString());       // [3:30, 4:40]

// ─────────────────────────────────────────────
// TEST: capacity 1 edge case
// ─────────────────────────────────────────────

console.log('\n=== Edge Case: capacity 1 ===');

var lru3 = new LRUCache(1);
lru3.put(1, 'X');
console.log('O:', lru3.get(1));           // X
lru3.put(2, 'Y');
console.log('P:', lru3.get(1));           // -1 (evicted)
console.log('Q:', lru3.get(2));           // Y

/**
 * FOLLOW-UP QUESTIONS:
 *
 * 1. Why is Map preferred over plain object for the simple approach?
 *    - Map preserves insertion order and has O(1) delete.
 * 2. When would you use DLL+HashMap over Map?
 *    - In languages without ordered maps, or when you need O(1) node removal.
 * 3. How would you add a TTL (time-to-live) for each entry?
 *    - Store timestamp with each entry. On get, check if expired.
 * 4. How would you make this thread-safe?
 *    - In JS (single-threaded) not needed. In other langs, use locks/mutex.
 * 5. What is the difference between LRU and LFU cache?
 *    - LRU evicts least recently used. LFU evicts least frequently used.
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ INTERVIEW ANSWER                                                         ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                          ║
 * ║ Map approach: JS Map maintains insertion order. On get/put, delete the   ║
 * ║ key and re-insert to move it to the "end" (most recent). Evict by        ║
 * ║ deleting map.keys().next().value (the oldest/first key).                 ║
 * ║                                                                          ║
 * ║ DLL approach: HashMap for O(1) lookup. Doubly linked list for O(1)      ║
 * ║ removal and insertion. Head = LRU, Tail = MRU. Sentinel nodes simplify  ║
 * ║ edge cases. On access, move node to tail. On eviction, remove head.next.║
 * ║                                                                          ║
 * ║ Both: O(1) get, O(1) put, O(capacity) space.                            ║
 * ║                                                                          ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */
