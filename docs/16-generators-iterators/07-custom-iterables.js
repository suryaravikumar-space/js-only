/**
 * GENERATORS & ITERATORS: 07 - Custom Iterables
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ To make ANY object iterable, add a [Symbol.iterator] method that           ║
 * ║ returns an iterator. Use generators for the cleanest syntax!               ║
 * ║                                                                            ║
 * ║   const obj = {                                                            ║
 * ║     *[Symbol.iterator]() { yield 1; yield 2; }                             ║
 * ║   };                                                                       ║
 * ║   [...obj]  // [1, 2]                                                      ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// 1. SIMPLE CUSTOM ITERABLE (Object Literal)
// ═══════════════════════════════════════════════════════════════════════════════

const countdown = {
  start: 5,
  end: 1,

  // Using generator method (cleanest!)
  *[Symbol.iterator]() {
    for (let i = this.start; i >= this.end; i--) {
      yield i;
    }
  }
};

console.log('A: Countdown iterable:');
console.log('  ', [...countdown]);  // [5, 4, 3, 2, 1]

for (const n of countdown) {
  console.log(`  ${n}...`);
}


// ═══════════════════════════════════════════════════════════════════════════════
// 2. CLASS-BASED ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE: Custom data structures that should work with for...of         │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

class Range {
  constructor(start, end, step = 1) {
    this.start = start;
    this.end = end;
    this.step = step;
  }

  // Method 1: Generator method
  *[Symbol.iterator]() {
    const { start, end, step } = this;

    if (step > 0) {
      for (let i = start; i <= end; i += step) yield i;
    } else {
      for (let i = start; i >= end; i += step) yield i;
    }
  }

  // Bonus: Make it a fluent API
  map(fn) {
    const self = this;
    return {
      *[Symbol.iterator]() {
        for (const item of self) {
          yield fn(item);
        }
      }
    };
  }

  filter(predicate) {
    const self = this;
    return {
      *[Symbol.iterator]() {
        for (const item of self) {
          if (predicate(item)) yield item;
        }
      }
    };
  }
}

console.log('\nB: Range class:');
console.log('  Range(1, 5):', [...new Range(1, 5)]);
console.log('  Range(0, 10, 2):', [...new Range(0, 10, 2)]);
console.log('  Range(5, 1, -1):', [...new Range(5, 1, -1)]);

// Chaining
const range = new Range(1, 10);
const result = [...range.filter(x => x % 2 === 0).map(x => x * 2)];
console.log('  Filtered & mapped:', result);  // [4, 8, 12, 16, 20]


// ═══════════════════════════════════════════════════════════════════════════════
// 3. LINKED LIST
// ═══════════════════════════════════════════════════════════════════════════════

class ListNode {
  constructor(value, next = null) {
    this.value = value;
    this.next = next;
  }
}

class LinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  append(value) {
    const node = new ListNode(value);
    if (!this.head) {
      this.head = this.tail = node;
    } else {
      this.tail.next = node;
      this.tail = node;
    }
    this.size++;
    return this;
  }

  // Make it iterable!
  *[Symbol.iterator]() {
    let current = this.head;
    while (current) {
      yield current.value;
      current = current.next;
    }
  }

  // Bonus: Reverse iterator
  *reverse() {
    // Convert to array first (since singly linked)
    const values = [...this];
    for (let i = values.length - 1; i >= 0; i--) {
      yield values[i];
    }
  }
}

console.log('\nC: LinkedList:');
const list = new LinkedList();
list.append(1).append(2).append(3).append(4);

console.log('  Forward:', [...list]);           // [1, 2, 3, 4]
console.log('  Reverse:', [...list.reverse()]); // [4, 3, 2, 1]

// Works with for...of!
for (const item of list) {
  console.log(`  Item: ${item}`);
}


// ═══════════════════════════════════════════════════════════════════════════════
// 4. BINARY TREE
// ═══════════════════════════════════════════════════════════════════════════════

class TreeNode {
  constructor(value, left = null, right = null) {
    this.value = value;
    this.left = left;
    this.right = right;
  }
}

class BinaryTree {
  constructor(root = null) {
    this.root = root;
  }

  // Default: in-order traversal
  *[Symbol.iterator]() {
    yield* this.inOrder();
  }

  // In-order: left, root, right
  *inOrder(node = this.root) {
    if (!node) return;
    yield* this.inOrder(node.left);
    yield node.value;
    yield* this.inOrder(node.right);
  }

  // Pre-order: root, left, right
  *preOrder(node = this.root) {
    if (!node) return;
    yield node.value;
    yield* this.preOrder(node.left);
    yield* this.preOrder(node.right);
  }

  // Post-order: left, right, root
  *postOrder(node = this.root) {
    if (!node) return;
    yield* this.postOrder(node.left);
    yield* this.postOrder(node.right);
    yield node.value;
  }

  // Level-order (BFS)
  *levelOrder() {
    if (!this.root) return;
    const queue = [this.root];

    while (queue.length > 0) {
      const node = queue.shift();
      yield node.value;
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }
}

//        4
//       / \
//      2   6
//     / \ / \
//    1  3 5  7

const tree = new BinaryTree(
  new TreeNode(4,
    new TreeNode(2,
      new TreeNode(1),
      new TreeNode(3)
    ),
    new TreeNode(6,
      new TreeNode(5),
      new TreeNode(7)
    )
  )
);

console.log('\nD: BinaryTree traversals:');
console.log('  In-order:', [...tree]);                    // [1, 2, 3, 4, 5, 6, 7]
console.log('  Pre-order:', [...tree.preOrder()]);        // [4, 2, 1, 3, 6, 5, 7]
console.log('  Post-order:', [...tree.postOrder()]);      // [1, 3, 2, 5, 7, 6, 4]
console.log('  Level-order:', [...tree.levelOrder()]);    // [4, 2, 6, 1, 3, 5, 7]


// ═══════════════════════════════════════════════════════════════════════════════
// 5. GRAPH (Adjacency List)
// ═══════════════════════════════════════════════════════════════════════════════

class Graph {
  constructor() {
    this.adjacency = new Map();
  }

  addVertex(vertex) {
    if (!this.adjacency.has(vertex)) {
      this.adjacency.set(vertex, []);
    }
    return this;
  }

  addEdge(v1, v2) {
    this.addVertex(v1).addVertex(v2);
    this.adjacency.get(v1).push(v2);
    this.adjacency.get(v2).push(v1);  // Undirected
    return this;
  }

  // DFS traversal
  *dfs(start, visited = new Set()) {
    if (visited.has(start)) return;
    visited.add(start);
    yield start;

    for (const neighbor of this.adjacency.get(start) || []) {
      yield* this.dfs(neighbor, visited);
    }
  }

  // BFS traversal
  *bfs(start) {
    const visited = new Set();
    const queue = [start];
    visited.add(start);

    while (queue.length > 0) {
      const vertex = queue.shift();
      yield vertex;

      for (const neighbor of this.adjacency.get(vertex) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }
  }

  // Default iterator: all vertices
  *[Symbol.iterator]() {
    yield* this.adjacency.keys();
  }
}

//    A --- B
//    |     |
//    C --- D --- E

const graph = new Graph();
graph.addEdge('A', 'B')
     .addEdge('A', 'C')
     .addEdge('B', 'D')
     .addEdge('C', 'D')
     .addEdge('D', 'E');

console.log('\nE: Graph traversals:');
console.log('  Vertices:', [...graph]);           // [A, B, C, D, E]
console.log('  DFS from A:', [...graph.dfs('A')]); // [A, B, D, C, E]
console.log('  BFS from A:', [...graph.bfs('A')]); // [A, B, C, D, E]


// ═══════════════════════════════════════════════════════════════════════════════
// 6. MAKING PLAIN OBJECTS ITERABLE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ Plain objects {} are NOT iterable by default. Here's how to make them work │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

// Option 1: Add iterator to specific object
const user = {
  name: 'Alice',
  age: 30,
  city: 'NYC',

  *[Symbol.iterator]() {
    for (const key of Object.keys(this)) {
      if (key !== Symbol.iterator.toString()) {
        yield [key, this[key]];
      }
    }
  }
};

console.log('\nF: Iterable plain object:');
for (const [key, value] of user) {
  console.log(`  ${key}: ${value}`);
}

// Option 2: Helper function
function makeIterable(obj) {
  return {
    ...obj,
    *[Symbol.iterator]() {
      for (const [key, value] of Object.entries(obj)) {
        yield { key, value };
      }
    }
  };
}

const config = makeIterable({ host: 'localhost', port: 3000 });
console.log('  Config entries:', [...config]);


// ═══════════════════════════════════════════════════════════════════════════════
// 7. LAZY FILE READER (Simulated)
// ═══════════════════════════════════════════════════════════════════════════════

class LazyFileReader {
  constructor(content) {
    // In real life, this would read from actual file
    this.lines = content.split('\n');
    this.currentLine = 0;
  }

  *[Symbol.iterator]() {
    for (const line of this.lines) {
      // Could add processing, filtering, etc.
      yield line.trim();
    }
  }

  // Read in chunks
  *chunks(size) {
    let chunk = [];
    for (const line of this) {
      chunk.push(line);
      if (chunk.length >= size) {
        yield chunk;
        chunk = [];
      }
    }
    if (chunk.length > 0) yield chunk;
  }
}

const fileContent = `Line 1
Line 2
Line 3
Line 4
Line 5`;

const reader = new LazyFileReader(fileContent);

console.log('\nG: LazyFileReader:');
console.log('  Lines:', [...reader]);
console.log('  Chunks of 2:', [...reader.chunks(2)]);


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "To make any object iterable, implement [Symbol.iterator] that returns an   │
 * │ object with a next() method. The easiest way is using generator methods:    │
 * │                                                                             │
 * │   class MyCollection {                                                      │
 * │     *[Symbol.iterator]() {                                                  │
 * │       yield* this.items;                                                    │
 * │     }                                                                       │
 * │   }                                                                         │
 * │                                                                             │
 * │ This enables:                                                               │
 * │ - for...of loops                                                            │
 * │ - Spread operator [...collection]                                           │
 * │ - Array.from(collection)                                                    │
 * │ - Destructuring                                                             │
 * │                                                                             │
 * │ Common examples:                                                            │
 * │ - LinkedList: iterate through nodes                                         │
 * │ - BinaryTree: in-order, pre-order, post-order traversals                    │
 * │ - Graph: DFS, BFS traversals                                                │
 * │ - Range: generate numbers in a range lazily                                 │
 * │                                                                             │
 * │ yield* is powerful for recursive structures - it delegates iteration        │
 * │ to child nodes, making tree/graph traversal elegant and readable.           │
 * │                                                                             │
 * │ Plain objects {} aren't iterable by default - use Object.entries() or       │
 * │ add a custom [Symbol.iterator] method."                                     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/07-custom-iterables.js
 */
