/**
 * GENERATORS & ITERATORS: 04 - yield* (Delegation)
 *
 * ╔════════════════════════════════════════════════════════════════════════════╗
 * ║ THE GOLDEN RULE                                                            ║
 * ╠════════════════════════════════════════════════════════════════════════════╣
 * ║                                                                            ║
 * ║ yield* delegates to another iterable or generator.                         ║
 * ║ It yields all values FROM that iterable, one by one.                       ║
 * ║                                                                            ║
 * ║   yield* [1, 2, 3];     // Same as: yield 1; yield 2; yield 3;             ║
 * ║   yield* otherGen();    // Delegate to another generator                   ║
 * ║                                                                            ║
 * ╚════════════════════════════════════════════════════════════════════════════╝
 *
 *
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ WHEN TO USE yield* - Real World Justification                               │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ 1. COMPOSE GENERATORS                                                       │
 * │    → Combine multiple generators into one                                   │
 * │    → Reuse generator logic                                                  │
 * │                                                                             │
 * │ 2. FLATTEN NESTED STRUCTURES                                                │
 * │    → Iterate trees, graphs recursively                                      │
 * │    → Flatten nested arrays lazily                                           │
 * │                                                                             │
 * │ 3. ITERATE ANY ITERABLE                                                     │
 * │    → Arrays, strings, maps, sets                                            │
 * │    → Anything with Symbol.iterator                                          │
 * │                                                                             │
 * │ 4. CAPTURE RETURN VALUE                                                     │
 * │    → yield* returns the return value of delegated generator                 │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */


// ═══════════════════════════════════════════════════════════════════════════════
// BASIC yield* WITH ARRAYS
// ═══════════════════════════════════════════════════════════════════════════════

// Without yield* (manual)
function* withoutYieldStar() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}

// With yield* (cleaner!)
function* withYieldStar() {
  yield* [1, 2, 3];
}

// Both produce same result
console.log('A:', [...withoutYieldStar()]);  // [1, 2, 3]
console.log('B:', [...withYieldStar()]);     // [1, 2, 3]


// ═══════════════════════════════════════════════════════════════════════════════
// yield* WITH STRINGS
// ═══════════════════════════════════════════════════════════════════════════════

function* letters() {
  yield* 'ABC';
  yield* 'DEF';
}

console.log('C:', [...letters()]);  // ['A', 'B', 'C', 'D', 'E', 'F']


// ═══════════════════════════════════════════════════════════════════════════════
// COMPOSING GENERATORS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ VISUAL: Generator Delegation                                                │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │   function* main() {                                                        │
 * │     yield 'start';                                                          │
 * │     yield* sub1();  ──────────────────► function* sub1() {                  │
 * │                                           yield 'a';                        │
 * │                     ◄─ 'a' ──────────────                                   │
 * │                                           yield 'b';                        │
 * │                     ◄─ 'b' ──────────────                                   │
 * │                                         }                                   │
 * │     yield* sub2();  ──────────────────► function* sub2() {                  │
 * │                                           yield 'c';                        │
 * │                     ◄─ 'c' ──────────────                                   │
 * │                                         }                                   │
 * │     yield 'end';                                                            │
 * │   }                                                                         │
 * │                                                                             │
 * │   Result: ['start', 'a', 'b', 'c', 'end']                                   │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

function* sub1() {
  yield 'a';
  yield 'b';
}

function* sub2() {
  yield 'c';
  yield 'd';
}

function* main() {
  yield 'start';
  yield* sub1();
  yield* sub2();
  yield 'end';
}

console.log('D:', [...main()]);
// ['start', 'a', 'b', 'c', 'd', 'end']


// ═══════════════════════════════════════════════════════════════════════════════
// CAPTURING RETURN VALUE
// ═══════════════════════════════════════════════════════════════════════════════

function* inner() {
  yield 1;
  yield 2;
  return 'inner done';  // This is returned BY yield*
}

function* outer() {
  yield 'start';
  const result = yield* inner();  // Captures inner's return value!
  yield `Inner returned: ${result}`;
  yield 'end';
}

console.log('E:', [...outer()]);
// ['start', 1, 2, 'Inner returned: inner done', 'end']

// Note: 'inner done' was NOT yielded (return values aren't)
// but outer captured it via yield*


// ═══════════════════════════════════════════════════════════════════════════════
// RECURSIVE GENERATORS (Tree Traversal)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ USE CASE: Iterating Tree Structures                                         │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ yield* enables elegant recursive iteration without callbacks or stacks      │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

const tree = {
  value: 1,
  children: [
    {
      value: 2,
      children: [
        { value: 4, children: [] },
        { value: 5, children: [] }
      ]
    },
    {
      value: 3,
      children: [
        { value: 6, children: [] }
      ]
    }
  ]
};

// Pre-order traversal (parent before children)
function* preOrder(node) {
  yield node.value;
  for (const child of node.children) {
    yield* preOrder(child);  // Recursive delegation!
  }
}

// Post-order traversal (children before parent)
function* postOrder(node) {
  for (const child of node.children) {
    yield* postOrder(child);
  }
  yield node.value;
}

console.log('F: Pre-order:', [...preOrder(tree)]);   // [1, 2, 4, 5, 3, 6]
console.log('G: Post-order:', [...postOrder(tree)]); // [4, 5, 2, 6, 3, 1]


// ═══════════════════════════════════════════════════════════════════════════════
// FLATTENING NESTED ARRAYS
// ═══════════════════════════════════════════════════════════════════════════════

function* flatten(arr) {
  for (const item of arr) {
    if (Array.isArray(item)) {
      yield* flatten(item);  // Recursively flatten
    } else {
      yield item;
    }
  }
}

const nested = [1, [2, [3, 4]], 5, [6]];
console.log('H:', [...flatten(nested)]);  // [1, 2, 3, 4, 5, 6]

// Compare to arr.flat(Infinity)
console.log('I:', nested.flat(Infinity));  // [1, 2, 3, 4, 5, 6]

// Generator is lazy - can handle infinite nested structures!


// ═══════════════════════════════════════════════════════════════════════════════
// yield* vs yield COMPARISON
// ═══════════════════════════════════════════════════════════════════════════════

function* yieldArray() {
  yield [1, 2, 3];  // Yields the array AS IS
}

function* yieldStarArray() {
  yield* [1, 2, 3];  // Yields each element
}

console.log('J:', [...yieldArray()]);      // [[1, 2, 3]] - array inside array!
console.log('K:', [...yieldStarArray()]);  // [1, 2, 3] - flat!


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL: Paginated API Calls
// ═══════════════════════════════════════════════════════════════════════════════

// Simulated API
function fetchPage(page) {
  const data = {
    1: ['item1', 'item2', 'item3'],
    2: ['item4', 'item5', 'item6'],
    3: ['item7', 'item8']
  };
  return {
    items: data[page] || [],
    hasMore: page < 3
  };
}

function* fetchAllItems() {
  let page = 1;
  while (true) {
    const response = fetchPage(page);
    yield* response.items;  // Yield each item from page

    if (!response.hasMore) break;
    page++;
  }
}

console.log('L: All items:', [...fetchAllItems()]);
// ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8']


// ═══════════════════════════════════════════════════════════════════════════════
// PRACTICAL: Directory Traversal Pattern
// ═══════════════════════════════════════════════════════════════════════════════

// Simulated file system
const fileSystem = {
  name: 'root',
  type: 'dir',
  children: [
    {
      name: 'src',
      type: 'dir',
      children: [
        { name: 'index.js', type: 'file' },
        { name: 'utils.js', type: 'file' }
      ]
    },
    {
      name: 'package.json',
      type: 'file'
    },
    {
      name: 'docs',
      type: 'dir',
      children: [
        { name: 'README.md', type: 'file' }
      ]
    }
  ]
};

function* walkFiles(node, path = '') {
  const currentPath = path ? `${path}/${node.name}` : node.name;

  if (node.type === 'file') {
    yield currentPath;
  } else if (node.children) {
    for (const child of node.children) {
      yield* walkFiles(child, currentPath);
    }
  }
}

console.log('M: All files:');
for (const file of walkFiles(fileSystem)) {
  console.log(`   ${file}`);
}

/**
 * OUTPUT:
 *   M: All files:
 *      root/src/index.js
 *      root/src/utils.js
 *      root/package.json
 *      root/docs/README.md
 */


// ═══════════════════════════════════════════════════════════════════════════════
// yield* WITH next() PASSING VALUES
// ═══════════════════════════════════════════════════════════════════════════════

function* innerWithInput() {
  const a = yield 'first';
  const b = yield 'second';
  return a + b;
}

function* outerWithInput() {
  yield 'start';
  const sum = yield* innerWithInput();  // Values pass through!
  yield `sum: ${sum}`;
}

const gen = outerWithInput();
console.log('N:', gen.next());        // { value: 'start', done: false }
console.log('O:', gen.next());        // { value: 'first', done: false }
console.log('P:', gen.next(10));      // { value: 'second', done: false } - 10 goes to inner
console.log('Q:', gen.next(20));      // { value: 'sum: 30', done: false } - 20 goes to inner

/**
 * OUTPUT:
 *   N: { value: 'start', done: false }
 *   O: { value: 'first', done: false }
 *   P: { value: 'second', done: false }
 *   Q: { value: 'sum: 30', done: false }
 */


/**
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │ INTERVIEW ANSWER                                                            │
 * ├─────────────────────────────────────────────────────────────────────────────┤
 * │                                                                             │
 * │ "yield* is the delegation operator for generators. It delegates to          │
 * │ another iterable or generator, yielding all its values one by one.          │
 * │                                                                             │
 * │ Key differences from yield:                                                 │
 * │   yield [1, 2, 3]   // Yields the array as single value                     │
 * │   yield* [1, 2, 3]  // Yields 1, then 2, then 3 separately                  │
 * │                                                                             │
 * │ Use cases:                                                                  │
 * │                                                                             │
 * │ 1. Compose generators - Combine multiple generators into one                │
 * │    function* main() {                                                       │
 * │      yield* header();                                                       │
 * │      yield* content();                                                      │
 * │      yield* footer();                                                       │
 * │    }                                                                        │
 * │                                                                             │
 * │ 2. Recursive structures - Tree/graph traversal                              │
 * │    function* traverse(node) {                                               │
 * │      yield node.value;                                                      │
 * │      for (const child of node.children) {                                   │
 * │        yield* traverse(child);  // Recursive!                               │
 * │      }                                                                      │
 * │    }                                                                        │
 * │                                                                             │
 * │ 3. Flatten nested data                                                      │
 * │                                                                             │
 * │ Special feature: yield* returns the return value of the delegated           │
 * │ generator, so you can capture it:                                           │
 * │   const result = yield* otherGenerator();                                   │
 * │                                                                             │
 * │ Values passed via next(value) flow through to the delegated generator."     │
 * │                                                                             │
 * └─────────────────────────────────────────────────────────────────────────────┘
 *
 *
 * RUN: node docs/16-generators-iterators/04-yield-star.js
 */
