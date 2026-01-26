/**
 * RECURSION: 04 - Tree Recursion
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ Trees are NATURALLY recursive: each node's children are also trees!        ║
 * ║                                                                            ║
 * ║   function traverse(node) {                                                ║
 * ║     if (!node) return;           // BASE: null node                        ║
 * ║     process(node);               // Do something with current              ║
 * ║     for (child of node.children) // RECURSE on each child                  ║
 * ║       traverse(child);                                                     ║
 * ║   }                                                                        ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 */


// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE TREE STRUCTURE
// ═══════════════════════════════════════════════════════════════════════════════

/**
 *            1
 *          / | \
 *         2  3  4
 *        / \    |
 *       5   6   7
 *               |
 *               8
 */

const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [
        { value: 5, children: [] },
        { value: 6, children: [] }
      ]
    },
    { value: 3, children: [] },
    {
      value: 4,
      children: [
        {
          value: 7,
          children: [
            { value: 8, children: [] }
          ]
        }
      ]
    }
  ]
};


// ═══════════════════════════════════════════════════════════════════════════════
// DEPTH-FIRST TRAVERSAL
// ═══════════════════════════════════════════════════════════════════════════════

function dfs(node) {
  if (!node) return;

  console.log(node.value);  // Process BEFORE children (pre-order)

  for (const child of node.children) {
    dfs(child);
  }
}

console.log('A: DFS Pre-order:');
dfs(tree);  // 1, 2, 5, 6, 3, 4, 7, 8


// ═══════════════════════════════════════════════════════════════════════════════
// COLLECT ALL VALUES
// ═══════════════════════════════════════════════════════════════════════════════

function collectValues(node) {
  if (!node) return [];

  let values = [node.value];

  for (const child of node.children) {
    values = [...values, ...collectValues(child)];
  }

  return values;
}

console.log('\nB: All values:', collectValues(tree));
// [1, 2, 5, 6, 3, 4, 7, 8]


// ═══════════════════════════════════════════════════════════════════════════════
// FIND NODE BY VALUE
// ═══════════════════════════════════════════════════════════════════════════════

function findNode(node, target) {
  if (!node) return null;
  if (node.value === target) return node;

  for (const child of node.children) {
    const found = findNode(child, target);
    if (found) return found;  // Short-circuit on find
  }

  return null;
}

console.log('\nC: Find 7:', findNode(tree, 7)?.value);  // 7
console.log('D: Find 99:', findNode(tree, 99));        // null


// ═══════════════════════════════════════════════════════════════════════════════
// COUNT NODES
// ═══════════════════════════════════════════════════════════════════════════════

function countNodes(node) {
  if (!node) return 0;

  let count = 1;  // Count self

  for (const child of node.children) {
    count += countNodes(child);
  }

  return count;
}

console.log('\nE: Total nodes:', countNodes(tree));  // 8


// ═══════════════════════════════════════════════════════════════════════════════
// TREE DEPTH
// ═══════════════════════════════════════════════════════════════════════════════

function maxDepth(node) {
  if (!node) return 0;
  if (node.children.length === 0) return 1;

  let max = 0;
  for (const child of node.children) {
    max = Math.max(max, maxDepth(child));
  }

  return 1 + max;
}

console.log('F: Max depth:', maxDepth(tree));  // 4 (1 → 4 → 7 → 8)


// ═══════════════════════════════════════════════════════════════════════════════
// SUM ALL VALUES
// ═══════════════════════════════════════════════════════════════════════════════

function sumTree(node) {
  if (!node) return 0;

  let sum = node.value;

  for (const child of node.children) {
    sum += sumTree(child);
  }

  return sum;
}

console.log('G: Sum of tree:', sumTree(tree));  // 1+2+3+4+5+6+7+8 = 36


// ═══════════════════════════════════════════════════════════════════════════════
// BINARY TREE TRAVERSALS
// ═══════════════════════════════════════════════════════════════════════════════

const binaryTree = {
  value: 1,
  left: {
    value: 2,
    left: { value: 4, left: null, right: null },
    right: { value: 5, left: null, right: null }
  },
  right: {
    value: 3,
    left: { value: 6, left: null, right: null },
    right: { value: 7, left: null, right: null }
  }
};

/**
 *        1
 *       / \
 *      2   3
 *     / \ / \
 *    4  5 6  7
 */

// Pre-order: Root, Left, Right
function preOrder(node, result = []) {
  if (!node) return result;
  result.push(node.value);
  preOrder(node.left, result);
  preOrder(node.right, result);
  return result;
}

// In-order: Left, Root, Right
function inOrder(node, result = []) {
  if (!node) return result;
  inOrder(node.left, result);
  result.push(node.value);
  inOrder(node.right, result);
  return result;
}

// Post-order: Left, Right, Root
function postOrder(node, result = []) {
  if (!node) return result;
  postOrder(node.left, result);
  postOrder(node.right, result);
  result.push(node.value);
  return result;
}

console.log('\nH: Binary tree traversals:');
console.log('   Pre-order:', preOrder(binaryTree));   // [1,2,4,5,3,6,7]
console.log('   In-order:', inOrder(binaryTree));     // [4,2,5,1,6,3,7]
console.log('   Post-order:', postOrder(binaryTree)); // [4,5,2,6,7,3,1]


// ═══════════════════════════════════════════════════════════════════════════════
// DEEP CLONE OBJECT (Tree-like structure)
// ═══════════════════════════════════════════════════════════════════════════════

function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  const clone = {};
  for (const key of Object.keys(obj)) {
    clone[key] = deepClone(obj[key]);
  }
  return clone;
}

const original = { a: { b: { c: 1 } }, d: [1, 2, { e: 3 }] };
const cloned = deepClone(original);
cloned.a.b.c = 999;

console.log('\nI: Original:', JSON.stringify(original));
console.log('J: Cloned:', JSON.stringify(cloned));


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW TIP                                                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ Common tree problems:                                                       │
 * │ • Find value                                                                │
 * │ • Count nodes                                                               │
 * │ • Max/min depth                                                             │
 * │ • Sum values                                                                │
 * │ • Serialize/deserialize                                                     │
 * │ • Mirror/invert                                                             │
 * │ • Path finding                                                              │
 * │                                                                             │
 * │ All follow the same pattern:                                                │
 * │   1. Base case: null node                                                   │
 * │   2. Process current node                                                   │
 * │   3. Recurse on children                                                    │
 * │   4. Combine results                                                        │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/18-recursion/04-tree-recursion.js
 */
